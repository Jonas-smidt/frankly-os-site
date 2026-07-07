#!/usr/bin/env python3
"""
Build the uploadable Frankly test site bundle.

The public website bundle is intentionally small: a test-lab landing page,
allowlisted HTML/tool experiments, the approved Start here preview, the approved
online coverage overview and gated/noindex blog draft previews. Internal
operating surfaces and all other product/legal drafts stay local and are not
copied into ./site.

Environment variables:
  SITE_DOMAIN  Optional domain; otherwise the committed CNAME is copied.
  SITE_CODE    Optional access code for the lightweight preview gate.
"""

import base64
import os
import pathlib
import re
import shutil

SITE_DIR = pathlib.Path("site")
ENTRY_FILE = pathlib.Path("index.html")
UPLOADABLE_HTML = (
    pathlib.Path("frankly-signature-generator.html"),
    pathlib.Path("frankly-brand-reference.html"),
    pathlib.Path("frankly-brand-assistant.html"),
    pathlib.Path("frankly-business-card.html"),
    pathlib.Path("frankly-dictionary.html"),
    pathlib.Path("frankly-qr-link.html"),
    pathlib.Path("frankly-image-resizer.html"),
    pathlib.Path("frankly-drop-protection.html"),
    pathlib.Path("franklys-bmw.html"),
    pathlib.Path("the-decision-chicken.html"),
    pathlib.Path("frankly-quiz.html"),
    pathlib.Path("onboarding.html"),
    pathlib.Path("frankly-daekningsoverblik.html"),
    pathlib.Path("blog/index.html"),
    pathlib.Path("blog/cykelforsikring.html"),
)
STATIC_FILES = (
    pathlib.Path("robots.txt"),
    pathlib.Path("sitemap.xml"),
    pathlib.Path("frankly-surfaces.css"),
    pathlib.Path("frankly-lab-tools.css"),
    pathlib.Path("frankly-lab-tools.js"),
    pathlib.Path("assets/frankly-logo-small.png"),
    pathlib.Path("assets/frankly-wordmark.png"),
)

# Simple preview curtain. This is not security; it only prevents casual browsing.
GATE_CODE = (os.environ.get("SITE_CODE") or "frankly").strip()
GATE_CODE_B64 = base64.b64encode(GATE_CODE.encode("utf-8")).decode("ascii")

GATE_TEMPLATE = """<script>(function(){
  if(window.top!==window.self) return;
  try{ if(sessionStorage.getItem('flab_ok')==='1') return; }catch(e){}
  var OK="__OKB64__";
  var de=document.documentElement; de.style.visibility='hidden';
  function mount(){
    de.style.visibility='';
    var s=document.createElement('style');
    s.textContent='@media (max-width:540px){#__flab_gate{justify-content:flex-start!important}#__flab_card{margin-left:20px!important;margin-right:20px!important}}';
    document.head.appendChild(s);
    var o=document.createElement('div'); o.id='__flab_gate';
    o.setAttribute('style','position:fixed;inset:0;z-index:2147483647;background:radial-gradient(1200px 600px at 75% -10%,#FFE4EF,#F5F4F1 45%);display:flex;align-items:center;justify-content:center;font-family:Inter,-apple-system,Segoe UI,sans-serif');
    o.innerHTML='<div id="__flab_card" style="background:#fff;padding:36px 32px;border-radius:20px;box-shadow:0 20px 60px rgba(45,0,17,.12);width:min(340px,calc(100vw - 40px));box-sizing:border-box;text-align:center"><div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#b06">Frankly Test Lab</div><h1 style="font-size:23px;margin:8px 0 4px;color:#2D0011;letter-spacing:-.3px">Access code</h1><p style="color:#7a5563;font-size:14px;margin:0 0 18px">Enter the code to continue.</p><input id="__flab_in" type="password" style="width:100%;padding:12px 14px;border:1px solid #f0d6e0;border-radius:12px;font-size:16px;box-sizing:border-box" /><div id="__flab_err" style="color:#d8607a;font-size:13px;height:18px;margin-top:6px"></div><button id="__flab_b" style="margin-top:6px;width:100%;padding:12px;border:0;border-radius:12px;background:#2D0011;color:#fff;font-weight:700;font-size:15px;cursor:pointer">Unlock</button></div>';
    document.body.appendChild(o);
    var i=o.querySelector('#__flab_in'), b=o.querySelector('#__flab_b'), e=o.querySelector('#__flab_err');
    function go(){ var v=''; try{ v=btoa(i.value); }catch(x){ v=''; } if(v===OK){ try{ sessionStorage.setItem('flab_ok','1'); }catch(x){} o.remove(); } else { e.textContent='Wrong code'; i.value=''; i.focus(); } }
    b.onclick=go; i.addEventListener('keydown',function(ev){ if(ev.key==='Enter') go(); }); i.focus();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount); else mount();
})();</script>"""

GATE_SNIPPET = GATE_TEMPLATE.replace("__OKB64__", GATE_CODE_B64)


def inject_gate(html_bytes):
    html = html_bytes.decode("utf-8", "ignore")
    low = html.lower()
    if "__flab_gate" in html:
        html = re.sub(
            r"<script>\(function\(\)\{.*?__flab_gate.*?\}\)\(\);</script>",
            "",
            html,
            flags=re.S,
        )
        low = html.lower()

    idx = low.find("</head>")
    if idx != -1:
        return (html[:idx] + GATE_SNIPPET + html[idx:]).encode("utf-8")

    m = re.search(r"<body[^>]*>", html, re.I)
    if m:
        return (html[: m.end()] + GATE_SNIPPET + html[m.end():]).encode("utf-8")

    return (GATE_SNIPPET + html).encode("utf-8")


def copy_file(src, dst, gated=False):
    if not src.exists():
        raise SystemExit(f"Required upload source missing: {src}")

    dst.parent.mkdir(parents=True, exist_ok=True)
    if gated and src.suffix.lower() in {".html", ".htm"}:
        dst.write_bytes(inject_gate(src.read_bytes()))
    else:
        shutil.copy2(src, dst)
    print(f"{src} -> {dst}")


def main():
    if not ENTRY_FILE.exists():
        raise SystemExit("index.html is required as the uploadable test-site entry.")

    if SITE_DIR.exists():
        shutil.rmtree(SITE_DIR)
    SITE_DIR.mkdir(parents=True, exist_ok=True)

    copy_file(ENTRY_FILE, SITE_DIR / "index.html", gated=True)

    for page in UPLOADABLE_HTML:
        copy_file(page, SITE_DIR / page, gated=True)

    for static_file in STATIC_FILES:
        if static_file.exists():
            copy_file(static_file, SITE_DIR / static_file)

    (SITE_DIR / ".nojekyll").write_text("", encoding="utf-8")
    domain = os.environ.get("SITE_DOMAIN", "").strip()
    if not domain and pathlib.Path("CNAME").exists():
        domain = pathlib.Path("CNAME").read_text(encoding="utf-8").strip()
    if domain:
        (SITE_DIR / "CNAME").write_text(domain + "\n", encoding="utf-8")

    print(
        "Built uploadable test bundle with 1 entry page, "
        f"{len(UPLOADABLE_HTML)} allowlisted HTML page(s), no internal operating surfaces "
        "and only Jonas-approved preview scopes beyond Lab tools."
    )


if __name__ == "__main__":
    main()
