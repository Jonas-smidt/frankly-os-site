#!/usr/bin/env python3
"""
Frankly Lab — Drive -> site sync (+ kodelås).

Kører i GitHub Actions. Henter alle sider og billeder fra Drive-mappen
"frankly-lab 5", bruger den repo-committede hub (lab-hub.html) som forside,
og injicerer en simpel kode-lås (JS) på hver side. Resultatet lægges i ./site
og udgives på GitHub Pages.

Miljøvariabler:
  GCP_SA_KEY        JSON-tekst med Google service-account-nøglen (GitHub secret)
  DRIVE_FOLDER_ID   Drive-mappe-ID der skal synkroniseres (default = frankly-lab 5)
  SITE_DOMAIN       valgfrit domæne; ellers bruges en committet CNAME-fil
  SITE_CODE         valgfri adgangskode til kode-låsen (default nedenfor)
"""

import os
import io
import re
import json
import base64
import pathlib

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

FOLDER_ID = os.environ.get("DRIVE_FOLDER_ID", "1MhCxVzXJDJc_sHT5fXZjaxiqLTaWe8vW")
SITE_DIR = pathlib.Path("site")
HUB_FILE = pathlib.Path("lab-hub.html")  # hub'ens forside (committet i repoet)
SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]
IMAGE_EXTS = (".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico")

# ---- Kode-lås (simpelt "gardin", ikke rigtig sikkerhed) ----
GATE_CODE = os.environ.get("SITE_CODE", "frankly").strip()
GATE_CODE_B64 = base64.b64encode(GATE_CODE.encode("utf-8")).decode("ascii")

GATE_TEMPLATE = """<script>(function(){
  try{ if(sessionStorage.getItem('flab_ok')==='1') return; }catch(e){}
  var OK="__OKB64__";
  var de=document.documentElement; de.style.visibility='hidden';
  function mount(){
    de.style.visibility='';
    var o=document.createElement('div'); o.id='__flab_gate';
    o.setAttribute('style','position:fixed;inset:0;z-index:2147483647;background:radial-gradient(1200px 600px at 75% -10%,#FFE4EF,#F5F4F1 45%);display:flex;align-items:center;justify-content:center;font-family:Inter,-apple-system,Segoe UI,sans-serif');
    o.innerHTML='<div style="background:#fff;padding:36px 32px;border-radius:20px;box-shadow:0 20px 60px rgba(45,0,17,.12);max-width:340px;width:88%;text-align:center"><div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#b06">Frankly Lab</div><h1 style="font-size:23px;margin:8px 0 4px;color:#2D0011;letter-spacing:-.3px">Adgangskode</h1><p style="color:#7a5563;font-size:14px;margin:0 0 18px">Indtast koden for at fortsætte.</p><input id="__flab_in" type="password" style="width:100%;padding:12px 14px;border:1px solid #f0d6e0;border-radius:12px;font-size:16px;box-sizing:border-box" /><div id="__flab_err" style="color:#d8607a;font-size:13px;height:18px;margin-top:6px"></div><button id="__flab_b" style="margin-top:6px;width:100%;padding:12px;border:0;border-radius:12px;background:#2D0011;color:#fff;font-weight:700;font-size:15px;cursor:pointer">Lås op</button></div>';
    document.body.appendChild(o);
    var i=o.querySelector('#__flab_in'), b=o.querySelector('#__flab_b'), e=o.querySelector('#__flab_err');
    function go(){ var v=''; try{ v=btoa(i.value); }catch(x){ v=''; } if(v===OK){ try{ sessionStorage.setItem('flab_ok','1'); }catch(x){} o.remove(); } else { e.textContent='Forkert kode'; i.value=''; i.focus(); } }
    b.onclick=go; i.addEventListener('keydown',function(ev){ if(ev.key==='Enter') go(); }); i.focus();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount); else mount();
})();</script>"""

GATE_SNIPPET = GATE_TEMPLATE.replace("__OKB64__", GATE_CODE_B64)


def drive_client():
    raw = os.environ.get("GCP_SA_KEY")
    if not raw:
        raise SystemExit("GCP_SA_KEY mangler. Tilføj service-account-JSON'en som GitHub secret.")
    info = json.loads(raw)
    creds = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
    return build("drive", "v3", credentials=creds, cache_discovery=False)


def list_children(svc, folder_id):
    q = "'%s' in parents and trashed = false" % folder_id
    files, token = [], None
    while True:
        resp = (
            svc.files()
            .list(
                q=q,
                fields="nextPageToken, files(id, name, mimeType)",
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
    name = name.replace(" ", "-")
    return re.sub(r"[^A-Za-z0-9._-]+", "-", name).strip("-") or "page"


def inject_gate(html_bytes):
    """Læg kode-låsen ind på en HTML-side (lige før </head>, ellers efter <body>)."""
    html = html_bytes.decode("utf-8", "ignore")
    low = html.lower()
    idx = low.find("</head>")
    if idx != -1:
        return (html[:idx] + GATE_SNIPPET + html[idx:]).encode("utf-8")
    m = re.search(r"<body[^>]*>", html, re.I)
    if m:
        return (html[: m.end()] + GATE_SNIPPET + html[m.end():]).encode("utf-8")
    return (GATE_SNIPPET + html).encode("utf-8")


def main():
    if not HUB_FILE.exists():
        raise SystemExit("lab-hub.html mangler i repoet (forsiden/hub'en).")

    svc = drive_client()
    SITE_DIR.mkdir(parents=True, exist_ok=True)

    pages, images = 0, 0
    for f in list_children(svc, FOLDER_ID):
        mime = f.get("mimeType", "")
        name = f["name"]
        if mime == "application/vnd.google-apps.folder":
            continue
        if mime == "text/html" or name.lower().endswith((".html", ".htm")):
            if name.strip().lower() == "index.html":
                continue  # forsiden kommer fra repoets lab-hub.html
            out = safe_name(name)
            if not out.lower().endswith((".html", ".htm")):
                out += ".html"
            (SITE_DIR / out).write_bytes(inject_gate(download(svc, f["id"])))
            pages += 1
            print("side: %s -> site/%s" % (name, out))
        elif mime.startswith("image/") or name.lower().endswith(IMAGE_EXTS):
            (SITE_DIR / safe_name(name)).write_bytes(download(svc, f["id"]))
            images += 1
            print("billede: %s" % name)

    # Forside = repoets hub (også med kode-lås)
    (SITE_DIR / "index.html").write_bytes(inject_gate(HUB_FILE.read_bytes()))

    # Drift-filer
    (SITE_DIR / ".nojekyll").write_text("")
    domain = os.environ.get("SITE_DOMAIN", "").strip()
    if not domain and pathlib.Path("CNAME").exists():
        domain = pathlib.Path("CNAME").read_text().strip()
    if domain:
        (SITE_DIR / "CNAME").write_text(domain + "\n")

    print("Færdig. Forside + %d side(r) + %d billede(r) publiceret. Kode-lås: aktiv." % (pages, images))


if __name__ == "__main__":
    main()
