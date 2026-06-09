#!/usr/bin/env python3
"""Generate a pilot carnet image and upload it to GitHub.

The script is intended to run from GitHub Actions. It receives pilot data as a
JSON string in PILOT_DATA, downloads a template image from Google Drive using a
service account, renders a QR code and pilot fields over the template, uploads
the resulting JPEG to the repository's carnets branch, and prints the raw URL.
"""

from __future__ import annotations

import base64
import io
import json
import os
import re
import tempfile
from pathlib import Path
from typing import Any

import qrcode
import requests
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from PIL import Image, ImageDraw, ImageFont

QR_ZONA = {"x1": 320, "y1": 420, "x2": 1078, "y2": 1020}
ALIAS_ZONA = {"x1": 340, "y1": 1085, "x2": 502, "y2": 1128}
SANGRE_ZONA = {"x1": 750, "y1": 1085, "x2": 855, "y2": 1128}
ALERGIAS_ZONA = {"x1": 430, "y1": 1170, "x2": 930, "y2": 1213}

CANVAS_SIZE = (1254, 1254)
SCOPES = ["https://www.googleapis.com/auth/drive"]
TEXT_FILL = (0, 0, 0)


def require_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def load_pilot_data() -> dict[str, Any]:
    raw_data = require_env("PILOT_DATA")
    try:
        data = json.loads(raw_data)
    except json.JSONDecodeError as exc:
        raise RuntimeError("PILOT_DATA must contain valid JSON") from exc

    if not isinstance(data, dict):
        raise RuntimeError("PILOT_DATA must decode to a JSON object")
    return data


def get_first(data: dict[str, Any], keys: tuple[str, ...], default: str = "") -> str:
    for key in keys:
        value = data.get(key)
        if value is not None and str(value).strip():
            return str(value).strip()
    return default


def build_qr_payload(data: dict[str, Any]) -> str:
    """Return the QR payload.

    If the dispatch payload includes an explicit QR value or URL, preserve it.
    Otherwise, encode the complete pilot object so the QR remains useful even as
    the payload schema evolves.
    """

    explicit_qr = get_first(data, ("qr", "qr_data", "qrData", "url", "profile_url", "profileUrl"))
    if explicit_qr:
        return explicit_qr
    return json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def load_drive_service():
    credentials_raw = require_env("GDRIVE_CREDENTIALS")
    try:
        credentials_info = json.loads(credentials_raw)
    except json.JSONDecodeError as exc:
        raise RuntimeError("GDRIVE_CREDENTIALS must contain valid service account JSON") from exc

    credentials = service_account.Credentials.from_service_account_info(
        credentials_info,
        scopes=SCOPES,
    )
    return build("drive", "v3", credentials=credentials, cache_discovery=False)


def download_template(service, template_id: str) -> Image.Image:
    request = service.files().get_media(fileId=template_id)
    buffer = io.BytesIO()
    downloader = MediaIoBaseDownload(buffer, request)
    done = False
    while not done:
        _, done = downloader.next_chunk()

    buffer.seek(0)
    template = Image.open(buffer).convert("RGB")
    if template.size != CANVAS_SIZE:
        template = template.resize(CANVAS_SIZE, Image.Resampling.LANCZOS)
    return template


def fit_font(draw: ImageDraw.ImageDraw, text: str, zone: dict[str, int], *, max_size: int = 48) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    width = zone["x2"] - zone["x1"]
    height = zone["y2"] - zone["y1"]

    for font_size in range(max_size, 9, -1):
        font = load_font(font_size)
        bbox = draw.textbbox((0, 0), text, font=font)
        if bbox[2] - bbox[0] <= width and bbox[3] - bbox[1] <= height:
            return font
    return load_font(10)


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    font_candidates = (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    )
    for font_path in font_candidates:
        if Path(font_path).exists():
            return ImageFont.truetype(font_path, size=size)
    return ImageFont.load_default()


def draw_centered_text(image: Image.Image, text: str, zone: dict[str, int], *, max_size: int = 48) -> None:
    if not text:
        return

    draw = ImageDraw.Draw(image)
    font = fit_font(draw, text, zone, max_size=max_size)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = zone["x1"] + ((zone["x2"] - zone["x1"] - text_width) / 2) - bbox[0]
    y = zone["y1"] + ((zone["y2"] - zone["y1"] - text_height) / 2) - bbox[1]
    draw.text((x, y), text, fill=TEXT_FILL, font=font)


def make_qr_image(payload: str, zone: dict[str, int]) -> Image.Image:
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=2,
    )
    qr.add_data(payload)
    qr.make(fit=True)
    qr_image = qr.make_image(fill_color="black", back_color="white").convert("RGB")

    zone_width = zone["x2"] - zone["x1"]
    zone_height = zone["y2"] - zone["y1"]
    size = min(zone_width, zone_height)
    return qr_image.resize((size, size), Image.Resampling.NEAREST)


def render_carnet(template: Image.Image, data: dict[str, Any]) -> Image.Image:
    image = template.copy()

    qr_image = make_qr_image(build_qr_payload(data), QR_ZONA)
    qr_x = QR_ZONA["x1"] + ((QR_ZONA["x2"] - QR_ZONA["x1"] - qr_image.width) // 2)
    qr_y = QR_ZONA["y1"] + ((QR_ZONA["y2"] - QR_ZONA["y1"] - qr_image.height) // 2)
    image.paste(qr_image, (qr_x, qr_y))

    alias = get_first(data, ("alias", "apodo", "nickname", "pilot_alias", "pilotAlias"))
    sangre = get_first(data, ("sangre", "tipo_sangre", "tipoSangre", "blood_type", "bloodType"))
    alergias = get_first(data, ("alergias", "allergies", "alergia", "allergy"), "Ninguna")

    draw_centered_text(image, alias, ALIAS_ZONA, max_size=42)
    draw_centered_text(image, sangre, SANGRE_ZONA, max_size=42)
    draw_centered_text(image, alergias, ALERGIAS_ZONA, max_size=40)

    return image


def safe_filename(data: dict[str, Any]) -> str:
    alias = get_first(data, ("alias", "apodo", "nickname", "pilot_alias", "pilotAlias"), "piloto")
    slug = re.sub(r"[^a-zA-Z0-9_-]+", "-", alias).strip("-").lower() or "piloto"
    return f"carnet-{slug}.jpg"


def upload_to_github_release(image_path: str, filename: str) -> str:
    """Upload file to GitHub repo via Contents API and return raw URL."""
    token = require_env("GITHUB_TOKEN")
    repo = require_env("GITHUB_REPOSITORY")
    branch = "carnets"

    with open(image_path, "rb") as file:
        content = base64.b64encode(file.read()).decode()

    api_url = f"https://api.github.com/repos/{repo}/contents/carnets/{filename}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json",
    }

    get_resp = requests.get(api_url, headers=headers, params={"ref": branch}, timeout=30)
    if get_resp.status_code == 200:
        sha = get_resp.json().get("sha")
    elif get_resp.status_code == 404:
        sha = None
    else:
        get_resp.raise_for_status()
        sha = None

    payload = {
        "message": f"carnet: {filename}",
        "content": content,
        "branch": branch,
    }
    if sha:
        payload["sha"] = sha

    put_resp = requests.put(api_url, headers=headers, json=payload, timeout=30)
    put_resp.raise_for_status()

    raw_url = f"https://raw.githubusercontent.com/{repo}/{branch}/carnets/{filename}"
    print(f"Carnet URL: {raw_url}")
    return raw_url


def main() -> None:
    data = load_pilot_data()
    template_id = require_env("TEMPLATE_ID")
    service = load_drive_service()
    template = download_template(service, template_id)
    carnet = render_carnet(template, data)

    with tempfile.TemporaryDirectory() as temp_dir:
        output_path = Path(temp_dir) / safe_filename(data)
        carnet.save(output_path, format="JPEG", quality=95, optimize=True)
        file_url = upload_to_github_release(str(output_path), output_path.name)

    print(file_url)


if __name__ == "__main__":
    main()
