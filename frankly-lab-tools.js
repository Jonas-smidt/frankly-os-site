const app = document.getElementById("app");
const activeTool = document.body.dataset.tool;

const TOOL_META = {
  signature: {
    title: "Email signature",
    kicker: "Brand tool",
    description: "A local signature builder for a consistent Frankly email footer.",
    mark: "ES"
  },
  "brand-reference": {
    title: "Brand Reference",
    kicker: "Brand tool",
    description: "Core colors, words, tone rules and reusable tokens for Frankly work.",
    mark: "BR"
  },
  "brand-assistant": {
    title: "Brand Assistant",
    kicker: "Brand tool",
    description: "A local answer surface for recurring Frankly brand questions.",
    mark: "BA"
  },
  "business-card": {
    title: "Business card",
    kicker: "Daily tool",
    description: "A personal meeting card with contact details and a local QR code.",
    mark: "BC"
  },
  dictionary: {
    title: "Dictionary",
    kicker: "Daily tool",
    description: "Plain-language wording for recurring insurance, retail and OS terms.",
    mark: "DI"
  },
  "qr-link": {
    title: "QR link",
    kicker: "Daily tool",
    description: "Turn a URL into a local SVG QR code for decks, signs and tests.",
    mark: "QR"
  },
  linkedin: {
    title: "LinkedIn checker",
    kicker: "Daily tool",
    description: "Preview the first lines, length and rhythm of a LinkedIn post.",
    mark: "LI"
  },
  "image-resizer": {
    title: "Image resizer",
    kicker: "Daily tool",
    description: "Resize local images to social and presentation formats in the browser.",
    mark: "IR"
  },
  "drop-protection": {
    title: "Drop Protection",
    kicker: "Game",
    description: "A small coverage game for the Lab shelf.",
    mark: "DP"
  },
  "decision-chicken": {
    title: "Decision Chicken",
    kicker: "Decision toy",
    description: "A tiny chooser for low-stakes decisions that need momentum.",
    mark: "DC"
  },
  quiz: {
    title: "Do you know Frankly?",
    kicker: "Quiz",
    description: "A short local quiz for brand basics, tone and internal gates.",
    mark: "QZ"
  }
};

const BRAND_COLORS = [
  {name: "Pink", value: "#FFD3E3", note: "Primary Frankly warmth"},
  {name: "Deep pink", value: "#FFACCA", note: "Accent and emphasis"},
  {name: "Grounded", value: "#2D0011", note: "Primary dark text"},
  {name: "Limestone", value: "#F5F4F1", note: "Base background"},
  {name: "Soft limestone", value: "#F0EEE9", note: "Quiet panels"},
  {name: "Signal green", value: "#CFE8BF", note: "Passed or ready state"}
];

const BRAND_ANSWERS = [
  {
    topic: "Tone",
    tags: "voice writing copy brand",
    answer: "Write like a calm expert who likes people. Short sentences, concrete nouns and no inflated promises."
  },
  {
    topic: "Public claims",
    tags: "claims legal product coverage source",
    answer: "Product, legal and claims copy is gated. Keep drafts local and ask Jonas before anything public-facing moves."
  },
  {
    topic: "Visuals",
    tags: "colors design ui layout",
    answer: "Use pink as warmth, grounded as authority and limestone as air. Keep cards tight, edges modest and pages useful first."
  },
  {
    topic: "OS surfaces",
    tags: "mission control studio observatory machine local",
    answer: "Studio, Mission Control, Observatory, run memory and machine feeds are local operating surfaces, not public website content."
  },
  {
    topic: "Lab tools",
    tags: "tools games qr signature image linkedin quiz",
    answer: "Lab tools can be playful or practical, but each one should produce a useful output without setup or paid runtime."
  }
];

const DICTIONARY = [
  {
    term: "Deductible",
    plain: "The amount someone may need to pay before a coverage or insurance agreement pays the rest.",
    context: "Use as a neutral explanation. Do not turn it into a customer promise."
  },
  {
    term: "Warranty",
    plain: "A seller or maker promise about faults, repairs or replacement for a product.",
    context: "Separate it from insurance and protection language."
  },
  {
    term: "Home contents insurance",
    plain: "Insurance for belongings in the home. It may include some accidental damage, depending on the policy.",
    context: "Avoid saying what it covers unless a verified source has been approved."
  },
  {
    term: "Source record",
    plain: "A traceable note that links a claim or decision to evidence.",
    context: "Source-record work is locked while the claims lock is active."
  },
  {
    term: "Run registry",
    plain: "The local memory of meaningful machine runs, validations, evidence and follow-ups.",
    context: "Used by Frankly OS surfaces and handoffs."
  },
  {
    term: "Approval gate",
    plain: "A stop point where a person must approve the next move before work becomes public, live or externally visible.",
    context: "Applies to deploys, Drive writes, Slack automation, paid API and claims work."
  },
  {
    term: "Noindex",
    plain: "A signal asking search engines not to index a page.",
    context: "Useful for drafts, but not a security control."
  },
  {
    term: "Lab shelf",
    plain: "The visible collection of practical tools, games and experiments in Frankly Lab.",
    context: "The shelf can list local work without putting it into the upload bundle."
  }
];

const RESIZE_PRESETS = [
  {label: "LinkedIn square", width: 1080, height: 1080},
  {label: "LinkedIn landscape", width: 1200, height: 627},
  {label: "Story", width: 1080, height: 1920},
  {label: "Website hero", width: 1600, height: 900},
  {label: "Small preview", width: 800, height: 600}
];

function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function text(value) {
  return String(value == null ? "" : value).trim();
}

function $(selector, root = document) {
  return root.querySelector(selector);
}

function $all(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function renderShell(meta, mainHtml, sideHtml = "") {
  app.innerHTML = `
    <main class="shell">
      <header class="topbar">
        <a class="brand" href="index.html#registry" aria-label="Frankly Lab registry">
          <span class="brand-mark" aria-hidden="true"></span>
          <span>Frankly Lab</span>
        </a>
        <nav class="nav" aria-label="Lab navigation">
          <a href="index.html#registry">Registry</a>
          <a href="index.html#live">All tools</a>
        </nav>
      </header>
      <section class="hero">
        <div>
          <p class="kicker">${esc(meta.kicker)}</p>
          <h1>${esc(meta.title)}</h1>
          <p>${esc(meta.description)}</p>
        </div>
        <aside class="panel dark">
          <span class="pill">${esc(meta.mark)}</span>
          <h2>Local only</h2>
          <p>Noindex page. Not copied into the upload bundle unless Jonas explicitly approves that scope.</p>
        </aside>
      </section>
      <section class="tool-layout">
        <div>${mainHtml}</div>
        <aside>${sideHtml}</aside>
      </section>
    </main>
  `;
}

async function copyText(value, targetSelector) {
  const output = $(targetSelector);
  try {
    await navigator.clipboard.writeText(value);
    if (output) output.textContent = "Copied.";
  } catch (error) {
    if (output) output.textContent = "Copy failed. Select the text manually.";
  }
}

function downloadText(filename, value, type = "text/plain") {
  const blob = new Blob([value], {type});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function fieldValue(id) {
  return text($(`#${id}`)?.value);
}

function renderSignature() {
  renderShell(TOOL_META.signature, `
    <div class="panel">
      <div class="grid">
        <div class="field"><label for="sigName">Name</label><input id="sigName" value="Jonas"></div>
        <div class="field"><label for="sigTitle">Title</label><input id="sigTitle" value="Founder"></div>
        <div class="field"><label for="sigEmail">Email</label><input id="sigEmail" value="hello@franklydesign.dk"></div>
        <div class="field"><label for="sigPhone">Phone</label><input id="sigPhone" value="+45"></div>
        <div class="field"><label for="sigUrl">Website</label><input id="sigUrl" value="https://franklydesign.dk"></div>
        <div class="field"><label for="sigNote">Footer</label><input id="sigNote" value="Empowering everyday life."></div>
      </div>
      <div class="actions">
        <button class="button" type="button" id="copySigHtml">Copy HTML</button>
        <button class="button secondary" type="button" id="copySigText">Copy text</button>
        <button class="button secondary" type="button" id="downloadSig">Download HTML</button>
      </div>
      <div class="copy-toast" id="sigToast"></div>
    </div>
  `, `
    <div class="preview-card signature-preview" id="signaturePreview"></div>
  `);

  const update = () => {
    const name = fieldValue("sigName") || "Name";
    const title = fieldValue("sigTitle") || "Title";
    const email = fieldValue("sigEmail") || "email";
    const phone = fieldValue("sigPhone");
    const url = fieldValue("sigUrl") || "https://franklydesign.dk";
    const note = fieldValue("sigNote") || "Empowering everyday life.";
    $("#signaturePreview").innerHTML = signatureHtml({name, title, email, phone, url, note});
  };
  $all("input").forEach((input) => input.addEventListener("input", update));
  $("#copySigHtml").addEventListener("click", () => copyText($("#signaturePreview").innerHTML, "#sigToast"));
  $("#copySigText").addEventListener("click", () => copyText($("#signaturePreview").innerText, "#sigToast"));
  $("#downloadSig").addEventListener("click", () => downloadText("frankly-signature.html", $("#signaturePreview").innerHTML, "text/html"));
  update();
}

function signatureHtml(data) {
  const phoneLine = data.phone ? `<br><span>${esc(data.phone)}</span>` : "";
  return `
    <div style="font-family:Inter,Arial,sans-serif;color:#2D0011;line-height:1.35">
      <strong style="font-size:16px">${esc(data.name)}</strong><br>
      <span>${esc(data.title)} · Frankly</span><br>
      <a href="mailto:${esc(data.email)}" style="color:#2D0011">${esc(data.email)}</a>${phoneLine}<br>
      <a href="${esc(data.url)}" style="color:#2D0011">${esc(data.url.replace(/^https?:\/\//, ""))}</a>
      <div style="margin-top:10px;padding-top:10px;border-top:4px solid #FFD3E3;font-weight:700">${esc(data.note)}</div>
    </div>
  `;
}

function renderBrandReference() {
  const tokenText = `:root {
  --frankly-pink: #FFD3E3;
  --frankly-pink-deep: #FFACCA;
  --frankly-grounded: #2D0011;
  --frankly-limestone: #F5F4F1;
  --frankly-limestone-soft: #F0EEE9;
}`;
  renderShell(TOOL_META["brand-reference"], `
    <div class="grid three">
      ${BRAND_COLORS.map((color) => `
        <article class="swatch${color.value === "#2D0011" ? " is-dark" : ""}" style="background:${esc(color.value)}">
          <span>${esc(color.value)}</span>
          <strong>${esc(color.name)}</strong>
          <small>${esc(color.note)}</small>
        </article>
      `).join("")}
    </div>
    <div class="panel" style="margin-top:14px">
      <h2>Tone rules</h2>
      <div class="list">
        <div class="list-item"><strong>Concrete over clever.</strong><p>Use words that can be pictured, clicked or checked.</p></div>
        <div class="list-item"><strong>Warm, not soft.</strong><p>Friendly language can still be precise and direct.</p></div>
        <div class="list-item"><strong>Claims stay gated.</strong><p>Do not publish product/legal promises from Lab drafts.</p></div>
      </div>
    </div>
  `, `
    <div class="panel">
      <h2>CSS tokens</h2>
      <pre class="result" id="brandTokens">${esc(tokenText)}</pre>
      <button class="button" type="button" id="copyTokens">Copy tokens</button>
      <div class="copy-toast" id="brandToast"></div>
    </div>
  `);
  $("#copyTokens").addEventListener("click", () => copyText(tokenText, "#brandToast"));
}

function renderBrandAssistant() {
  renderShell(TOOL_META["brand-assistant"], `
    <div class="panel">
      <div class="field"><label for="brandQuestion">Question or keyword</label><input id="brandQuestion" placeholder="tone, claims, visual, lab, OS"></div>
      <div class="actions">
        ${BRAND_ANSWERS.map((item) => `<button class="button secondary topic-button" type="button" data-topic="${esc(item.topic)}">${esc(item.topic)}</button>`).join("")}
      </div>
    </div>
    <div class="panel" style="margin-top:14px">
      <div id="brandAnswerList" class="list"></div>
    </div>
  `, `
    <div class="panel dark">
      <h2>Gate reminder</h2>
      <p>Brand help is local guidance. Public deploys, paid API use, Slack automation, connector writes and claims work still need approval.</p>
    </div>
  `);

  const render = () => {
    const q = fieldValue("brandQuestion").toLowerCase();
    const results = BRAND_ANSWERS.filter((item) => !q || `${item.topic} ${item.tags} ${item.answer}`.toLowerCase().includes(q));
    $("#brandAnswerList").innerHTML = (results.length ? results : BRAND_ANSWERS).map((item) => `
      <article class="list-item">
        <h3>${esc(item.topic)}</h3>
        <p>${esc(item.answer)}</p>
      </article>
    `).join("");
  };
  $("#brandQuestion").addEventListener("input", render);
  $all(".topic-button").forEach((button) => {
    button.addEventListener("click", () => {
      $("#brandQuestion").value = button.dataset.topic;
      render();
    });
  });
  render();
}

function renderBusinessCard() {
  renderShell(TOOL_META["business-card"], `
    <div class="panel">
      <div class="grid">
        <div class="field"><label for="cardName">Name</label><input id="cardName" value="Jonas"></div>
        <div class="field"><label for="cardTitle">Title</label><input id="cardTitle" value="Founder"></div>
        <div class="field"><label for="cardEmail">Email</label><input id="cardEmail" value="hello@franklydesign.dk"></div>
        <div class="field"><label for="cardPhone">Phone</label><input id="cardPhone" value="+45"></div>
        <div class="field"><label for="cardUrl">Link</label><input id="cardUrl" value="https://franklydesign.dk"></div>
        <div class="field"><label for="cardNote">Line</label><input id="cardNote" value="Empowering everyday life."></div>
      </div>
      <div class="actions">
        <button class="button" type="button" id="copyVcard">Copy vCard</button>
        <button class="button secondary" type="button" id="downloadVcard">Download vCard</button>
      </div>
      <div class="copy-toast" id="cardToast"></div>
    </div>
  `, `
    <div class="preview-card business-card" id="businessCard"></div>
  `);

  const update = () => {
    const data = cardData();
    $("#businessCard").innerHTML = `
      <div>
        <p class="kicker">Frankly</p>
        <h2>${esc(data.name || "Name")}</h2>
        <p>${esc(data.title || "Title")}</p>
        <p><strong>${esc(data.email)}</strong><br>${esc(data.phone)}</p>
        <p>${esc(data.note)}</p>
      </div>
      <div class="qr-box">${qrSvg(data.url || "https://franklydesign.dk", 4)}</div>
    `;
  };
  $all("input").forEach((input) => input.addEventListener("input", update));
  $("#copyVcard").addEventListener("click", () => copyText(vcard(cardData()), "#cardToast"));
  $("#downloadVcard").addEventListener("click", () => downloadText("frankly-contact.vcf", vcard(cardData()), "text/vcard"));
  update();
}

function cardData() {
  return {
    name: fieldValue("cardName"),
    title: fieldValue("cardTitle"),
    email: fieldValue("cardEmail"),
    phone: fieldValue("cardPhone"),
    url: fieldValue("cardUrl"),
    note: fieldValue("cardNote")
  };
}

function vcard(data) {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${data.name}`,
    `ORG:Frankly`,
    `TITLE:${data.title}`,
    `EMAIL:${data.email}`,
    `TEL:${data.phone}`,
    `URL:${data.url}`,
    `NOTE:${data.note}`,
    "END:VCARD"
  ].join("\n");
}

function renderDictionary() {
  renderShell(TOOL_META.dictionary, `
    <div class="panel">
      <div class="field"><label for="dictionarySearch">Search term</label><input id="dictionarySearch" placeholder="warranty, gate, noindex"></div>
    </div>
    <div class="panel" style="margin-top:14px">
      <div id="dictionaryList" class="list"></div>
    </div>
  `, `
    <div class="panel dark">
      <h2>Plain language</h2>
      <p>These are neutral working definitions. They are not product promises, legal advice or claim support copy.</p>
    </div>
  `);
  const render = () => {
    const q = fieldValue("dictionarySearch").toLowerCase();
    const matches = DICTIONARY.filter((entry) => !q || `${entry.term} ${entry.plain} ${entry.context}`.toLowerCase().includes(q));
    $("#dictionaryList").innerHTML = matches.map((entry) => `
      <article class="list-item">
        <h3>${esc(entry.term)}</h3>
        <p>${esc(entry.plain)}</p>
        <small>${esc(entry.context)}</small>
      </article>
    `).join("") || `<p class="muted">No matching term.</p>`;
  };
  $("#dictionarySearch").addEventListener("input", render);
  render();
}

function renderQrLink() {
  renderShell(TOOL_META["qr-link"], `
    <div class="panel">
      <div class="field"><label for="qrTitle">Label</label><input id="qrTitle" value="Frankly"></div>
      <div class="field"><label for="qrUrl">URL</label><input id="qrUrl" value="https://franklydesign.dk"></div>
      <div class="actions">
        <button class="button" type="button" id="copyQrLink">Copy link</button>
        <button class="button secondary" type="button" id="downloadQrSvg">Download SVG</button>
      </div>
      <div class="copy-toast" id="qrToast"></div>
    </div>
  `, `
    <div class="preview-card">
      <p class="kicker" id="qrPreviewTitle">Frankly</p>
      <div class="qr-box" id="qrPreview"></div>
      <p class="muted" id="qrPreviewUrl"></p>
    </div>
  `);
  let currentSvg = "";
  const update = () => {
    const url = fieldValue("qrUrl") || "https://franklydesign.dk";
    currentSvg = qrSvg(url, 7);
    $("#qrPreviewTitle").textContent = fieldValue("qrTitle") || "Frankly";
    $("#qrPreview").innerHTML = currentSvg;
    $("#qrPreviewUrl").textContent = url;
  };
  $all("input").forEach((input) => input.addEventListener("input", update));
  $("#copyQrLink").addEventListener("click", () => copyText(fieldValue("qrUrl"), "#qrToast"));
  $("#downloadQrSvg").addEventListener("click", () => downloadText("frankly-qr-link.svg", currentSvg, "image/svg+xml"));
  update();
}

function renderLinkedIn() {
  renderShell(TOOL_META.linkedin, `
    <div class="panel">
      <div class="field"><label for="linkedText">Post text</label><textarea id="linkedText">Frankly Lab is back as a practical shelf: small tools, local games and a visible registry of what exists, what is gated and what should not be published by accident.</textarea></div>
      <div class="actions">
        <button class="button" type="button" id="copyLinkedPreview">Copy preview</button>
        <button class="button secondary" type="button" id="clearLinked">Clear</button>
      </div>
      <div class="copy-toast" id="linkedToast"></div>
    </div>
  `, `
    <div class="panel">
      <h2>Preview</h2>
      <div class="meter"><span id="linkedMeter"></span></div>
      <p class="muted" id="linkedStats"></p>
      <pre class="result" id="linkedPreview"></pre>
    </div>
  `);
  const update = () => {
    const value = $("#linkedText").value;
    const firstBreak = value.split(/\n+/).find(Boolean) || "";
    const preview = value.length > 280 ? `${value.slice(0, 280).trim()}... see more` : value;
    $("#linkedPreview").textContent = preview;
    $("#linkedStats").textContent = `${value.length} characters. First line: ${firstBreak.length} characters.`;
    $("#linkedMeter").style.width = `${Math.min(100, Math.round((value.length / 1300) * 100))}%`;
  };
  $("#linkedText").addEventListener("input", update);
  $("#copyLinkedPreview").addEventListener("click", () => copyText($("#linkedPreview").textContent, "#linkedToast"));
  $("#clearLinked").addEventListener("click", () => {
    $("#linkedText").value = "";
    update();
  });
  update();
}

function renderImageResizer() {
  renderShell(TOOL_META["image-resizer"], `
    <div class="panel">
      <div class="field"><label for="imageInput">Image</label><input id="imageInput" type="file" accept="image/*"></div>
      <div class="grid">
        <div class="field">
          <label for="presetSelect">Preset</label>
          <select id="presetSelect">${RESIZE_PRESETS.map((preset, index) => `<option value="${index}">${esc(preset.label)} · ${preset.width}x${preset.height}</option>`).join("")}</select>
        </div>
        <div class="field">
          <label for="fitMode">Fit</label>
          <select id="fitMode"><option value="contain">Contain</option><option value="cover">Cover</option></select>
        </div>
      </div>
      <div class="actions">
        <button class="button" type="button" id="downloadImage" disabled>Download PNG</button>
      </div>
      <div class="copy-toast" id="imageStatus">Choose an image.</div>
    </div>
  `, `
    <canvas id="resizeCanvas" width="1080" height="1080" aria-label="Resized image preview"></canvas>
  `);

  let image = null;
  const canvas = $("#resizeCanvas");
  const context = canvas.getContext("2d");

  const draw = () => {
    const preset = RESIZE_PRESETS[Number($("#presetSelect").value)];
    canvas.width = preset.width;
    canvas.height = preset.height;
    context.fillStyle = "#F5F4F1";
    context.fillRect(0, 0, canvas.width, canvas.height);
    if (!image) return;
    const fit = $("#fitMode").value;
    const scale = fit === "cover"
      ? Math.max(canvas.width / image.width, canvas.height / image.height)
      : Math.min(canvas.width / image.width, canvas.height / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2;
    context.drawImage(image, x, y, width, height);
    $("#imageStatus").textContent = `${preset.label}: ${preset.width}x${preset.height}`;
    $("#downloadImage").disabled = false;
  };

  $("#imageInput").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      image = img;
      draw();
    };
    img.src = URL.createObjectURL(file);
  });
  $("#presetSelect").addEventListener("change", draw);
  $("#fitMode").addEventListener("change", draw);
  $("#downloadImage").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "frankly-resized-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
  draw();
}

function renderDropProtection() {
  renderShell(TOOL_META["drop-protection"], `
    <div class="panel game-wrap">
      <canvas id="dropGame" width="720" height="460" aria-label="Drop Protection game"></canvas>
      <div class="game-hud">
        <span id="gameScore">Score 0</span>
        <span id="gameLives">Lives 3</span>
        <span id="gameState">Ready</span>
      </div>
      <div class="actions">
        <button class="button" type="button" id="startGame">Start</button>
        <button class="button secondary" type="button" id="leftGame">Left</button>
        <button class="button secondary" type="button" id="rightGame">Right</button>
      </div>
    </div>
  `, `
    <div class="panel dark">
      <h2>Catch the drops</h2>
      <p>Move the coverage bar with pointer, arrow keys or the buttons. Miss three and the run is over.</p>
    </div>
  `);
  setupDropGame();
}

function setupDropGame() {
  const canvas = $("#dropGame");
  const ctx = canvas.getContext("2d");
  const state = {
    running: false,
    score: 0,
    lives: 3,
    playerX: canvas.width / 2,
    drops: [],
    last: 0,
    spawn: 0
  };

  function reset() {
    state.running = true;
    state.score = 0;
    state.lives = 3;
    state.drops = [];
    state.last = 0;
    state.spawn = 0;
    $("#gameState").textContent = "Running";
    requestAnimationFrame(loop);
  }

  function drawBackground() {
    ctx.fillStyle = "#F5F4F1";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFD3E3";
    ctx.fillRect(0, canvas.height - 34, canvas.width, 34);
    ctx.fillStyle = "#2D0011";
    ctx.font = "800 18px Inter, sans-serif";
    ctx.fillText("DROP PROTECTION", 22, 36);
  }

  function draw() {
    drawBackground();
    ctx.fillStyle = "#2D0011";
    ctx.fillRect(state.playerX - 58, canvas.height - 62, 116, 14);
    state.drops.forEach((drop) => {
      ctx.fillStyle = drop.color;
      ctx.beginPath();
      ctx.roundRect(drop.x - 16, drop.y - 16, 32, 32, 7);
      ctx.fill();
    });
    $("#gameScore").textContent = `Score ${state.score}`;
    $("#gameLives").textContent = `Lives ${state.lives}`;
  }

  function loop(timestamp) {
    if (!state.running) {
      draw();
      return;
    }
    const delta = state.last ? Math.min(36, timestamp - state.last) : 16;
    state.last = timestamp;
    state.spawn += delta;
    if (state.spawn > Math.max(360, 850 - state.score * 18)) {
      state.spawn = 0;
      state.drops.push({
        x: 34 + Math.random() * (canvas.width - 68),
        y: 56,
        speed: 1.7 + Math.random() * 1.9 + state.score * 0.025,
        color: Math.random() > 0.5 ? "#FFACCA" : "#CCD8F0"
      });
    }
    state.drops.forEach((drop) => {
      drop.y += drop.speed * (delta / 16);
    });
    state.drops = state.drops.filter((drop) => {
      if (drop.y > canvas.height - 62 && Math.abs(drop.x - state.playerX) < 70) {
        state.score += 1;
        return false;
      }
      if (drop.y > canvas.height - 18) {
        state.lives -= 1;
        return false;
      }
      return true;
    });
    if (state.lives <= 0) {
      state.running = false;
      $("#gameState").textContent = "Finished";
    }
    draw();
    if (state.running) requestAnimationFrame(loop);
  }

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    state.playerX = Math.max(58, Math.min(canvas.width - 58, ((event.clientX - rect.left) / rect.width) * canvas.width));
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") state.playerX = Math.max(58, state.playerX - 38);
    if (event.key === "ArrowRight") state.playerX = Math.min(canvas.width - 58, state.playerX + 38);
  });
  $("#leftGame").addEventListener("click", () => {
    state.playerX = Math.max(58, state.playerX - 48);
    draw();
  });
  $("#rightGame").addEventListener("click", () => {
    state.playerX = Math.min(canvas.width - 58, state.playerX + 48);
    draw();
  });
  $("#startGame").addEventListener("click", reset);
  draw();
}

function renderDecisionChicken() {
  renderShell(TOOL_META["decision-chicken"], `
    <div class="panel">
      <div class="field"><label for="decisionOptions">Options</label><textarea id="decisionOptions">Ship the local tool shelf
Run another QA pass
Make coffee</textarea></div>
      <div class="actions">
        <button class="button" type="button" id="pickDecision">Pick</button>
        <button class="button secondary" type="button" id="clearDecisionHistory">Clear history</button>
      </div>
    </div>
  `, `
    <div class="panel">
      <p class="kicker">Decision</p>
      <h2 id="decisionResult">Ready.</h2>
      <div class="list" id="decisionHistory"></div>
    </div>
  `);
  const storageKey = "franklyDecisionHistory";
  const renderHistory = () => {
    const history = JSON.parse(localStorage.getItem(storageKey) || "[]");
    $("#decisionHistory").innerHTML = history.map((item) => `<div class="list-item"><strong>${esc(item)}</strong></div>`).join("");
  };
  $("#pickDecision").addEventListener("click", () => {
    const options = $("#decisionOptions").value.split(/\n|,/).map(text).filter(Boolean);
    const pick = options[Math.floor(Math.random() * options.length)] || "Add an option first.";
    $("#decisionResult").textContent = pick;
    const history = JSON.parse(localStorage.getItem(storageKey) || "[]");
    history.unshift(pick);
    localStorage.setItem(storageKey, JSON.stringify(history.slice(0, 8)));
    renderHistory();
  });
  $("#clearDecisionHistory").addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    renderHistory();
  });
  renderHistory();
}

function renderQuiz() {
  const questions = [
    {
      q: "Which surfaces stay local-only by default?",
      options: ["Studio, Mission Control and Observatory", "Only the BMW game", "Everything in the upload bundle"],
      answer: 0
    },
    {
      q: "What should happen before public claims or product/legal copy moves?",
      options: ["Jonas explicitly reopens and approves the scope", "A Lab page links to it", "The text feels finished"],
      answer: 0
    },
    {
      q: "Which color is the grounded Frankly dark?",
      options: ["#2D0011", "#FFD3E3", "#F5F4F1"],
      answer: 0
    },
    {
      q: "What is Lab best at?",
      options: ["Small useful tools, tests and safe experiments", "Replacing the OS machine", "Publishing locked drafts"],
      answer: 0
    }
  ];
  renderShell(TOOL_META.quiz, `
    <div class="panel" id="quizPanel"></div>
  `, `
    <div class="panel">
      <h2 id="quizScore">Score 0/${questions.length}</h2>
      <div class="meter"><span id="quizMeter"></span></div>
      <p class="muted" id="quizNote">Answer each card.</p>
    </div>
  `);
  const answers = Array(questions.length).fill(null);
  const updateScore = () => {
    const score = answers.reduce((total, value, index) => total + (value === questions[index].answer ? 1 : 0), 0);
    $("#quizScore").textContent = `Score ${score}/${questions.length}`;
    $("#quizMeter").style.width = `${(score / questions.length) * 100}%`;
    $("#quizNote").textContent = answers.every((value) => value !== null) ? (score === questions.length ? "Clean pass." : "Review the misses.") : "Answer each card.";
  };
  $("#quizPanel").innerHTML = questions.map((question, index) => `
    <article class="list-item quiz-card" data-question="${index}">
      <h3>${esc(question.q)}</h3>
      ${question.options.map((option, optionIndex) => `<button class="button secondary quiz-option" type="button" data-option="${optionIndex}">${esc(option)}</button>`).join("")}
    </article>
  `).join("");
  $all(".quiz-option").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest("[data-question]");
      const questionIndex = Number(card.dataset.question);
      const optionIndex = Number(button.dataset.option);
      answers[questionIndex] = optionIndex;
      $all(".quiz-option", card).forEach((item) => item.classList.remove("selected", "correct", "wrong"));
      button.classList.add(optionIndex === questions[questionIndex].answer ? "correct" : "wrong");
      updateScore();
    });
  });
  updateScore();
}

function qrSvg(value, scale = 6) {
  const modules = createQrMatrix(value);
  if (!modules) {
    return `<p class="muted">The link is too long for this local QR generator. Shorten it and try again.</p>`;
  }
  const quiet = 4;
  const size = modules.length + quiet * 2;
  const rects = [];
  modules.forEach((row, y) => {
    row.forEach((dark, x) => {
      if (dark) rects.push(`<rect x="${x + quiet}" y="${y + quiet}" width="1" height="1"/>`);
    });
  });
  return `<svg class="qr-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size * scale}" height="${size * scale}" role="img" aria-label="QR code"><rect width="100%" height="100%" fill="#fff"/><g fill="#2D0011">${rects.join("")}</g></svg>`;
}

const QR_VERSIONS = [
  {version: 1, dataCodewords: 19, eccCodewords: 7, byteCapacity: 17, align: []},
  {version: 2, dataCodewords: 34, eccCodewords: 10, byteCapacity: 32, align: [6, 18]},
  {version: 3, dataCodewords: 55, eccCodewords: 15, byteCapacity: 53, align: [6, 22]},
  {version: 4, dataCodewords: 80, eccCodewords: 20, byteCapacity: 78, align: [6, 26]},
  {version: 5, dataCodewords: 108, eccCodewords: 26, byteCapacity: 106, align: [6, 30]}
];

function createQrMatrix(value) {
  const bytes = Array.from(new TextEncoder().encode(value || "https://franklydesign.dk"));
  const spec = QR_VERSIONS.find((item) => bytes.length <= item.byteCapacity);
  if (!spec) return null;
  const size = 21 + (spec.version - 1) * 4;
  const modules = Array.from({length: size}, () => Array(size).fill(false));
  const reserved = Array.from({length: size}, () => Array(size).fill(false));

  const setFunction = (x, y, dark) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    modules[y][x] = Boolean(dark);
    reserved[y][x] = true;
  };

  drawFinder(0, 0, setFunction, size);
  drawFinder(size - 7, 0, setFunction, size);
  drawFinder(0, size - 7, setFunction, size);
  for (let i = 8; i < size - 8; i += 1) {
    setFunction(i, 6, i % 2 === 0);
    setFunction(6, i, i % 2 === 0);
  }
  spec.align.forEach((x) => {
    spec.align.forEach((y) => {
      if (reserved[y]?.[x]) return;
      drawAlignment(x, y, setFunction);
    });
  });
  setFunction(8, size - 8, true);
  reserveFormat(size, setFunction);

  const data = encodeQrData(bytes, spec.dataCodewords);
  const ecc = reedSolomonRemainder(data, reedSolomonDivisor(spec.eccCodewords));
  const codewords = data.concat(ecc);
  placeQrBits(modules, reserved, codewords);
  applyQrMask(modules, reserved, 0);
  drawFormatBits(0, size, setFunction);
  return modules;
}

function drawFinder(x, y, setFunction, size) {
  for (let dy = -1; dy <= 7; dy += 1) {
    for (let dx = -1; dx <= 7; dx += 1) {
      const xx = x + dx;
      const yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= size || yy >= size) continue;
      const inSquare = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6;
      const dark = inSquare && (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
      setFunction(xx, yy, dark);
    }
  }
}

function drawAlignment(cx, cy, setFunction) {
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      const distance = Math.max(Math.abs(dx), Math.abs(dy));
      setFunction(cx + dx, cy + dy, distance !== 1);
    }
  }
}

function reserveFormat(size, setFunction) {
  for (let i = 0; i <= 8; i += 1) {
    if (i !== 6) {
      setFunction(8, i, false);
      setFunction(i, 8, false);
    }
  }
  for (let i = 0; i < 8; i += 1) setFunction(size - 1 - i, 8, false);
  for (let i = 8; i < 15; i += 1) setFunction(8, size - 15 + i, false);
}

function encodeQrData(bytes, dataCodewords) {
  const bits = [];
  appendBits(bits, 0b0100, 4);
  appendBits(bits, bytes.length, 8);
  bytes.forEach((byte) => appendBits(bits, byte, 8));
  const maxBits = dataCodewords * 8;
  appendBits(bits, 0, Math.min(4, maxBits - bits.length));
  while (bits.length % 8) bits.push(0);
  const data = [];
  for (let i = 0; i < bits.length; i += 8) {
    data.push(bits.slice(i, i + 8).reduce((byte, bit) => (byte << 1) | bit, 0));
  }
  let pad = 0;
  while (data.length < dataCodewords) {
    data.push(pad % 2 === 0 ? 0xec : 0x11);
    pad += 1;
  }
  return data;
}

function appendBits(bits, value, length) {
  for (let i = length - 1; i >= 0; i -= 1) bits.push((value >>> i) & 1);
}

function placeQrBits(modules, reserved, codewords) {
  const size = modules.length;
  const bits = [];
  codewords.forEach((byte) => appendBits(bits, byte, 8));
  let bitIndex = 0;
  let upward = true;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right -= 1;
    for (let row = 0; row < size; row += 1) {
      const y = upward ? size - 1 - row : row;
      for (let x = right; x >= right - 1; x -= 1) {
        if (!reserved[y][x]) {
          modules[y][x] = Boolean(bits[bitIndex] || 0);
          bitIndex += 1;
        }
      }
    }
    upward = !upward;
  }
}

function applyQrMask(modules, reserved, mask) {
  modules.forEach((row, y) => {
    row.forEach((_, x) => {
      if (!reserved[y][x] && qrMask(mask, x, y)) modules[y][x] = !modules[y][x];
    });
  });
}

function qrMask(mask, x, y) {
  if (mask === 0) return (x + y) % 2 === 0;
  return false;
}

function drawFormatBits(mask, size, setFunction) {
  const ecLevelBits = 1;
  let data = (ecLevelBits << 3) | mask;
  let rem = data;
  for (let i = 0; i < 10; i += 1) {
    rem = (rem << 1) ^ (((rem >>> 9) & 1) ? 0x537 : 0);
  }
  const bits = ((data << 10) | rem) ^ 0x5412;
  const bit = (index) => ((bits >>> index) & 1) !== 0;
  for (let i = 0; i <= 5; i += 1) setFunction(8, i, bit(i));
  setFunction(8, 7, bit(6));
  setFunction(8, 8, bit(7));
  setFunction(7, 8, bit(8));
  for (let i = 9; i < 15; i += 1) setFunction(14 - i, 8, bit(i));
  for (let i = 0; i < 8; i += 1) setFunction(size - 1 - i, 8, bit(i));
  for (let i = 8; i < 15; i += 1) setFunction(8, size - 15 + i, bit(i));
  setFunction(8, size - 8, true);
}

const GF_EXP = [];
const GF_LOG = [];
let gfValue = 1;
for (let i = 0; i < 255; i += 1) {
  GF_EXP[i] = gfValue;
  GF_LOG[gfValue] = i;
  gfValue <<= 1;
  if (gfValue & 0x100) gfValue ^= 0x11d;
}
for (let i = 255; i < 512; i += 1) GF_EXP[i] = GF_EXP[i - 255];

function gfMultiply(a, b) {
  return a && b ? GF_EXP[GF_LOG[a] + GF_LOG[b]] : 0;
}

function reedSolomonDivisor(degree) {
  const result = Array(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i += 1) {
    for (let j = 0; j < result.length; j += 1) {
      result[j] = gfMultiply(result[j], root);
      if (j + 1 < result.length) result[j] ^= result[j + 1];
    }
    root = gfMultiply(root, 0x02);
  }
  return result;
}

function reedSolomonRemainder(data, divisor) {
  const result = Array(divisor.length).fill(0);
  data.forEach((byte) => {
    const factor = byte ^ result.shift();
    result.push(0);
    divisor.forEach((coefficient, index) => {
      result[index] ^= gfMultiply(coefficient, factor);
    });
  });
  return result;
}

const RENDERERS = {
  signature: renderSignature,
  "brand-reference": renderBrandReference,
  "brand-assistant": renderBrandAssistant,
  "business-card": renderBusinessCard,
  dictionary: renderDictionary,
  "qr-link": renderQrLink,
  linkedin: renderLinkedIn,
  "linkedin-checker": renderLinkedIn,
  "image-resizer": renderImageResizer,
  "drop-protection": renderDropProtection,
  "decision-chicken": renderDecisionChicken,
  quiz: renderQuiz
};

if (RENDERERS[activeTool]) {
  RENDERERS[activeTool]();
} else {
  renderShell({title: "Frankly Lab tool", kicker: "Local tool", description: "Tool not registered.", mark: "LAB"}, `<div class="panel"><p>Unknown tool id.</p></div>`);
}
