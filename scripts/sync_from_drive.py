#!/usr/bin/env python3
"""
Frankly OS — Drive -> site sync.

Kører i GitHub Actions. Logger ind på Google Drive med en service-account,
henter alle HTML-sider (samt evt. filer i en `assets`-undermappe) fra
"Frankly OS"-mappen i Drive, og skriver et færdigt statisk website til ./site
inklusive en genereret index.html der linker til alle siderne.

Miljøvariabler:
  GCP_SA_KEY        JSON-tekst med Google service-account-nøglen (GitHub secret)
  DRIVE_FOLDER_ID   Drive-mappe-ID der skal synkroniseres (default = Frankly OS-mappen)
  SITE_DOMAIN       valgfrit domæne; hvis sat skrives det til site/CNAME
"""

import os
import io
import re
import json
import html
import pathlib
import datetime

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

FOLDER_ID = os.environ.get("DRIVE_FOLDER_ID", "1SbreMcr9vbHbGlLXZL7NNDoEUUKOsCdB")
SITE_DIR = pathlib.Path("site")
ASSETS_SUBFOLDER_NAME = "assets"
SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]


def drive_client():
    raw = os.environ.get("GCP_SA_KEY")
    if not raw:
        raise SystemExit(
            "GCP_SA_KEY mangler. Tilføj service-account-JSON'en som GitHub secret "
            "(Settings -> Secrets and variables -> Actions -> New repository secret)."
        )
    info = json.loads(raw)
    creds = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
    return build("drive", "v3", credentials=creds, cache_discovery=False)


def list_children(svc, folder_id, mime_filter=None):
    """Returnér alle filer/mapper direkte i en mappe (med paginering)."""
    q = "'%s' in parents and trashed = false" % folder_id
    if mime_filter:
        q += " and mimeType = '%s'" % mime_filter
    files, token = [], None
    while True:
        resp = (
            svc.files()
            .list(
                q=q,
                fields="nextPageToken, files(id, name, mimeType, modifiedTime)",
                pageSize=200,
                pageToken=token,
                orderBy="name_natural",
            )
            .execute()
        )
        files.extend(resp.get("files", []))
        token = resp.get("nextPageToken")
        if not token:
            break
    return files


def download(svc, file_id):
    buf = io.BytesIO()
    dl = MediaIoBaseDownload(buf, svc.files().get_media(fileId=file_id))
    done = False
    while not done:
        _, done = dl.next_chunk()
    return buf.getvalue()


def safe_name(name):
    """Gør et filnavn URL-sikkert uden at ødelægge endelsen."""
    name = name.replace(" ", "-")
    return re.sub(r"[^A-Za-z0-9._-]+", "-", name).strip("-") or "page"


def title_from_html(data, fallback):
    text = data.decode("utf-8", "ignore")
    m = re.search(r"<title[^>]*>(.*?)</title>", text, re.I | re.S)
    return html.unescape(m.group(1).strip()) if m and m.group(1).strip() else fallback


def fmt_when(modified_iso):
    if not modified_iso:
        return ""
    try:
        dt = datetime.datetime.fromisoformat(modified_iso.replace("Z", "+00:00"))
        return "Opdateret " + dt.strftime("%d.%m.%Y %H:%M")
    except ValueError:
        return ""


INDEX_TEMPLATE = """<!doctype html>
<html lang="da">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Frankly OS</title>
<style>
*{box-sizing:border-box}
body{margin:0;color:#2D0011;font-family:'Inter',-apple-system,'Segoe UI',sans-serif;
 background:radial-gradient(1200px 600px at 75% -10%, #FFE4EF, #F5F4F1 45%);min-height:100vh}
.wrap{max-width:920px;margin:0 auto;padding:64px 24px 80px}
.kicker{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#b06}
h1{font-size:40px;margin:6px 0 0;letter-spacing:-.8px}
.lede{color:#7a5563;margin:10px 0 32px;font-size:16px;max-width:60ch}
.grid{display:flex;flex-direction:column;gap:14px}
.card{display:flex;align-items:center;gap:16px;text-decoration:none;color:inherit;
 background:#fff;border-radius:18px;padding:20px 22px;
 box-shadow:0 8px 26px rgba(45,0,17,.06);transition:transform .12s ease, box-shadow .12s ease}
.card:hover{transform:translateY(-2px);box-shadow:0 14px 34px rgba(45,0,17,.10)}
.card-title{font-weight:800;font-size:19px}
.card-meta{margin-left:auto;font-size:12px;color:#b3a7ac;white-space:nowrap}
.card-go{font-weight:700;color:#d8607a;font-size:14px;white-space:nowrap}
.foot{margin-top:40px;font-size:12px;color:#b3a7ac;text-align:center}
.empty{background:#fff;border-radius:18px;padding:28px;color:#7a5563}
</style>
</head>
<body>
<div class="wrap">
  <div class="kicker">Frankly</div>
  <h1>Frankly OS</h1>
  <p class="lede">Live-status for systemet. Siderne her synkroniseres automatisk fra Drive-mappen "Frankly OS" — det du ser er altid den nyeste version.</p>
  <div class="grid">
    {{CARDS}}
  </div>
  <div class="foot">Synkroniseret {{UPDATED}} · opdateres automatisk hver time</div>
</div>
</body>
</html>
"""


def write_index(pages):
    if pages:
        cards = []
        for p in sorted(pages, key=lambda x: x["title"].lower()):
            cards.append(
                '<a class="card" href="%s">'
                '<span class="card-title">%s</span>'
                '<span class="card-meta">%s</span>'
                '<span class="card-go">Åbn &rarr;</span></a>'
                % (
                    html.escape(p["file"]),
                    html.escape(p["title"]),
                    html.escape(p["modified_human"]),
                )
            )
        cards_html = "\n    ".join(cards)
    else:
        cards_html = (
            '<div class="empty">Ingen sider fundet endnu. Tjek at "Frankly OS"-mappen '
            "er delt med service-account'ens e-mail.</div>"
        )

    updated = datetime.datetime.now(datetime.timezone.utc).strftime("%d.%m.%Y %H:%M UTC")
    doc = INDEX_TEMPLATE.replace("{{CARDS}}", cards_html).replace("{{UPDATED}}", updated)
    (SITE_DIR / "index.html").write_text(doc, encoding="utf-8")


def main():
    svc = drive_client()
    SITE_DIR.mkdir(parents=True, exist_ok=True)

    # 1) HTML-sider i toppen af mappen
    pages = []
    for f in list_children(svc, FOLDER_ID, mime_filter="text/html"):
        data = download(svc, f["id"])
        out = safe_name(f["name"])
        if not out.lower().endswith((".html", ".htm")):
            out += ".html"
        (SITE_DIR / out).write_bytes(data)
        pages.append(
            {
                "file": out,
                "title": title_from_html(data, f["name"]),
                "modified_human": fmt_when(f.get("modifiedTime", "")),
            }
        )
        print("side: %s -> site/%s" % (f["name"], out))

    # 2) valgfri assets-undermappe (billeder mm.) spejles som-den-er
    for f in list_children(svc, FOLDER_ID):
        is_folder = f["mimeType"] == "application/vnd.google-apps.folder"
        if is_folder and f["name"].lower() == ASSETS_SUBFOLDER_NAME:
            adir = SITE_DIR / "assets"
            adir.mkdir(exist_ok=True)
            for a in list_children(svc, f["id"]):
                if a["mimeType"] == "application/vnd.google-apps.folder":
                    continue
                (adir / safe_name(a["name"])).write_bytes(download(svc, a["id"]))
                print("asset: %s" % a["name"])

    # 3) index + drift-filer
    write_index(pages)
    (SITE_DIR / ".nojekyll").write_text("")  # serve filerne råt, ingen Jekyll
    domain = os.environ.get("SITE_DOMAIN", "").strip()
    if not domain and pathlib.Path("CNAME").exists():
        domain = pathlib.Path("CNAME").read_text().strip()
    if domain:
        (SITE_DIR / "CNAME").write_text(domain + "\n")

    if not pages:
        raise SystemExit(
            "Ingen HTML-sider fundet i Drive-mappen. Er mappen delt med "
            "service-account'ens e-mail, og er Drive API slået til?"
        )
    print("Færdig. %d side(r) publiceret." % len(pages))


if __name__ == "__main__":
    main()
