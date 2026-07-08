let THREE;

const canvas = document.getElementById("ribbon-canvas");
const shapeCanvas = document.getElementById("shape-canvas");
const shapeCtx = shapeCanvas.getContext("2d");
const placeholderImage = document.getElementById("placeholder-image");
const fallback = document.getElementById("fallback");
const renderStatus = document.getElementById("render-status");
const shapeLabel = document.getElementById("shape-label");
const meshReadout = document.getElementById("mesh-readout");
const presetControls = document.getElementById("preset-controls");
const controlRoot = document.querySelector(".controls");
const advancedToggleButton = document.getElementById("advanced-toggle");
const controlTabs = document.getElementById("control-tabs");
const controlPanels = Array.from(document.querySelectorAll("[data-control-panel]"));
const sliderContainers = {
  form: document.getElementById("slider-form-controls"),
  motion: document.getElementById("slider-motion-controls"),
  draw: document.getElementById("slider-draw-controls"),
  farve: document.getElementById("slider-farve-controls")
};
const materialControls = document.getElementById("material-controls");
const specOutput = document.getElementById("spec-output");
const toast = document.getElementById("toast");
const brief = document.getElementById("brief");
const drawShapeButton = document.getElementById("draw-shape");
const editShapeButton = document.getElementById("edit-shape");
const useShapeButton = document.getElementById("use-shape");
const clearShapeButton = document.getElementById("clear-shape");
const shapeStageActions = document.getElementById("shape-stage-actions");
const stageUseShapeButton = document.getElementById("stage-use-shape");
const stageEditShapeButton = document.getElementById("stage-edit-shape");
const stagePolishShapeButton = document.getElementById("stage-polish-shape");
const stageClearShapeButton = document.getElementById("stage-clear-shape");
const polishShapeButton = document.getElementById("polish-shape");
const shapeAnchorModeButton = document.getElementById("shape-anchor-mode");
const shapeSmoothButton = document.getElementById("shape-smooth");
const shapeSeparateButton = document.getElementById("shape-separate");
const shapeAirButton = document.getElementById("shape-air");
const shapeTightenButton = document.getElementById("shape-tighten");
const motionToggleButton = document.getElementById("motion-toggle");
const motionCalmButton = document.getElementById("motion-calm");
const motionStudioButton = document.getElementById("motion-studio");
const motionCinematicButton = document.getElementById("motion-cinematic");
const placeholderFile = document.getElementById("placeholder-file");
const placeholderOpacity = document.getElementById("placeholder-opacity");
const placeholderOpacityOut = document.getElementById("placeholder-opacity-out");
const placeholderFit = document.getElementById("placeholder-fit");
const clearPlaceholder = document.getElementById("clear-placeholder");
const copyPromptButton = document.getElementById("copy-prompt");
const copyLinkButton = document.getElementById("copy-link");
const snapshotCaptureButton = document.getElementById("snapshot-capture");
const snapshotSlotButtons = Array.from(document.querySelectorAll("[data-snapshot-slot]"));
const snapshotClearButton = document.getElementById("snapshot-clear");
const snapshotReadout = document.getElementById("snapshot-readout");

const SNAPSHOT_STORAGE_KEY = "frankly-ribbon-lab-snapshots-v1";
const SHARE_HASH_KEY = "ribbon";
const SNAPSHOT_LIMIT = 3;
const SNAPSHOT_STATE_KEYS = [
  "preset",
  "material",
  "width",
  "thickness",
  "curl",
  "depth",
  "twist",
  "lift",
  "glassArea",
  "blendWidth",
  "pinkMix",
  "gloss",
  "drawSmoothing",
  "drawGrip",
  "drawAnchorCount",
  "drawBend",
  "drawSpacing",
  "motionSpeed",
  "motionDrift",
  "autoRotate",
  "placeholderOpacity",
  "placeholderFit"
];

const PRESETS = {
  signal: {label: "Signal S", curl: 1.46, width: 0.36, thickness: 0.038, depth: 0.82, twist: 1.08, lift: 0.12, viewX: -0.11, viewY: 0.32, viewZ: 0.035},
  loop: {label: "Open loop", curl: 1.15, width: 0.34, thickness: 0.038, depth: 0.96, twist: 0.72, lift: 0.38, viewX: -0.1, viewY: 0.26, viewZ: -0.1},
  twist: {label: "Tall twist", curl: 0.72, width: 0.28, thickness: 0.038, depth: 0.46, twist: 2.45, lift: 0.58, viewX: -0.05, viewY: 0.02, viewZ: 0},
  sweep: {label: "Low sweep", curl: 0.58, width: 0.32, thickness: 0.04, depth: 0.42, twist: 0.62, lift: -0.24, viewX: -0.26, viewY: -0.05, viewZ: -0.08},
  ripple: {label: "Soft wave", curl: 0.82, width: 0.33, thickness: 0.036, depth: 0.52, twist: 0.78, lift: 0.02, viewX: -0.16, viewY: 0.13, viewZ: -0.06},
  arc: {label: "Grand arc", curl: 0.46, width: 0.34, thickness: 0.036, depth: 0.34, twist: 0.42, lift: -0.18, viewX: -0.22, viewY: -0.03, viewZ: -0.02},
  coil: {label: "Ribbon coil", curl: 1.08, width: 0.31, thickness: 0.038, depth: 0.92, twist: 1.18, lift: 0.28, viewX: -0.08, viewY: 0.28, viewZ: -0.08},
  cascade: {label: "Glass fall", curl: 0.7, width: 0.3, thickness: 0.034, depth: 0.78, twist: 1.42, lift: 0.24, viewX: -0.08, viewY: 0.14, viewZ: 0.04},
  halo: {label: "Halo loop", curl: 1.12, width: 0.3, thickness: 0.036, depth: 0.64, twist: 0.92, lift: 0.08, viewX: -0.18, viewY: 0.25, viewZ: -0.16},
  fold: {label: "Folded S", curl: 1.28, width: 0.33, thickness: 0.038, depth: 0.7, twist: 1.38, lift: 0.16, viewX: -0.1, viewY: 0.24, viewZ: 0.02},
  custom: {label: "Drawn shape", curl: 1.02, width: 0.34, thickness: 0.038, depth: 0.62, twist: 0.84, lift: 0, viewX: -0.1, viewY: 0.2, viewZ: 0.02}
};
const RANDOM_PRESET_KEYS = ["signal", "loop", "twist", "sweep", "ripple", "arc", "coil", "cascade", "halo", "fold"];

const MATERIALS = {
  frankly: {label: "Frankly", pink: "#FFACCA", pale: "#FFD3E3", edge: "#F2B4C8", shade: "#5A1126"},
  glass: {label: "Glass", pink: "#FFC6DA", pale: "#FFF6F9", edge: "#E7AABD", shade: "#B66F84"},
  dusk: {label: "Dusk", pink: "#D77992", pale: "#F8E7E8", edge: "#E3A3B4", shade: "#451024"}
};

const SLIDERS = [
  {key: "width", label: "Width", min: 0.18, max: 0.62, step: 0.01},
  {key: "thickness", label: "Edge", min: 0.015, max: 0.09, step: 0.005, tier: "advanced"},
  {key: "curl", label: "Curl", min: 0.35, max: 2.25, step: 0.01},
  {key: "depth", label: "Depth", min: 0.04, max: 1.35, step: 0.01},
  {key: "twist", label: "Twist", min: 0, max: 3.2, step: 0.01, tier: "advanced"},
  {key: "lift", label: "Lift", min: -0.8, max: 0.8, step: 0.01, tier: "advanced"},
  {key: "motionSpeed", label: "Speed", min: 0.1, max: 2.2, step: 0.01},
  {key: "motionDrift", label: "Drift", min: 0, max: 1, step: 0.01, tier: "advanced"},
  {key: "drawSmoothing", label: "Smooth", min: 0.9, max: 1, step: 0.01},
  {key: "drawGrip", label: "Grip", min: 0, max: 1, step: 0.01},
  {key: "drawAnchorCount", label: "Anchors", min: 5, max: 14, step: 1},
  {key: "drawBend", label: "Flow", min: 0.84, max: 1, step: 0.01, tier: "advanced"},
  {key: "drawSpacing", label: "Space", min: 0.82, max: 1, step: 0.01, tier: "advanced"},
  {key: "glassArea", label: "Glass area", min: 0.12, max: 0.74, step: 0.01},
  {key: "blendWidth", label: "Blend", min: 0.04, max: 0.34, step: 0.01},
  {key: "pinkMix", label: "Pink", min: 0.08, max: 1, step: 0.01, tier: "advanced"},
  {key: "gloss", label: "Gloss", min: 0.05, max: 1, step: 0.01, tier: "advanced"}
];

const SLIDER_GROUPS = [
  {panel: "form", label: "Form", keys: ["width", "curl", "depth", "twist", "lift", "thickness"]},
  {panel: "motion", label: "Motion", keys: ["motionSpeed", "motionDrift"]},
  {panel: "draw", label: "Draw", keys: ["drawSmoothing", "drawGrip", "drawAnchorCount", "drawBend", "drawSpacing"]},
  {panel: "farve", label: "Farve", keys: ["glassArea", "blendWidth", "pinkMix", "gloss"]}
];

const BRAND_MIN_DRAW_SMOOTHING = 0.9;
const BRAND_MIN_DRAW_BEND = 0.84;
const BRAND_MIN_DRAW_SPACING = 0.82;
const BRAND_CENTERLINE_CLEARANCE = 1.42;

const state = {
  preset: "signal",
  material: "frankly",
  width: PRESETS.signal.width,
  thickness: PRESETS.signal.thickness,
  curl: PRESETS.signal.curl,
  depth: PRESETS.signal.depth,
  twist: PRESETS.signal.twist,
  lift: PRESETS.signal.lift,
  glassArea: 0.46,
  blendWidth: 0.2,
  pinkMix: 0.94,
  gloss: 0.64,
  drawSmoothing: 0.9,
  drawGrip: 0.58,
  drawAnchorCount: 9,
  drawBend: 0.86,
  drawSpacing: 0.84,
  motionSpeed: 0.82,
  motionDrift: 0.54,
  segments: 520,
  profileSteps: 22,
  autoRotate: true,
  drawnPath: null,
  drawSourcePoints: null,
  shapeAnchors: null,
  placeholderVisible: false,
  placeholderOpacity: 0.38,
  placeholderFit: "cover"
};

let renderer;
let scene;
let camera;
let ribbonGroup;
let ribbonMesh;
let glassBackMesh;
let rimMesh;
let glassMesh;
let edgeLines = [];
let glassGlints = [];
let endCapMeshes = [];
let floorMesh;
let causticMesh;
let satinTexture;
let bodyAlphaTexture;
let glassAlphaTexture;
let frameId = 0;
let drag = null;
let shapeDrawActive = false;
let shapePointerActive = false;
let shapeEditActive = false;
let shapeAnchorMode = false;
let editDrag = null;
let shapeHoverIndex = null;
let drawnShapePoints = [];
let placeholderUrl = "";
let viewRotation = null;
let autoPhase = 0;
let panelTabsBound = false;
let advancedToggleBound = false;
let advancedControls = false;
let savedSnapshots = [];
let diagnostics = {vertices: 0, frames: 0, nonBackgroundPixels: 0, shapeCorrections: 0};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function mixColor(a, b, amount) {
  return new THREE.Color(a).lerp(new THREE.Color(b), amount);
}

function showToast(message) {
  toast.textContent = message;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    if (toast.textContent === message) toast.textContent = "";
  }, 2600);
}

function buildControls() {
  presetControls.innerHTML = Object.entries(PRESETS).map(([key, preset]) => (
    `<button type="button" data-preset="${key}" aria-pressed="${key === state.preset}">${preset.label}</button>`
  )).join("");

  const sliderByKey = new Map(SLIDERS.map((slider) => [slider.key, slider]));
  Object.values(sliderContainers).forEach((container) => {
    if (container) container.innerHTML = "";
  });
  for (const group of SLIDER_GROUPS) {
    const container = sliderContainers[group.panel];
    if (!container) continue;
    container.innerHTML = `<section class="slider-group" aria-label="${group.label}">
      <h2 class="slider-group-title">${group.label}</h2>
      <div class="slider-group-fields">
        ${group.keys.map((key) => sliderByKey.get(key)).filter(Boolean).map(renderSlider).join("")}
      </div>
    </section>`;
  }

  materialControls.innerHTML = Object.entries(MATERIALS).map(([key, material]) => {
    const swatch = `linear-gradient(90deg,${material.pink},${material.pale})`;
    return `<button type="button" data-material="${key}" aria-pressed="${key === state.material}" style="--swatch:${swatch}">${material.label}</button>`;
  }).join("");
}

function renderSlider(slider) {
  const tier = slider.tier || "core";
  return `<div class="slider${tier === "advanced" ? " is-advanced" : ""}" data-slider-tier="${tier}">
    <label for="range-${slider.key}">${slider.label}</label>
    <input id="range-${slider.key}" type="range" min="${slider.min}" max="${slider.max}" step="${slider.step}" value="${state[slider.key]}" data-slider="${slider.key}">
    <output id="out-${slider.key}">${formatNumber(state[slider.key])}</output>
  </div>`;
}

function setAdvancedControls(active) {
  advancedControls = Boolean(active);
  controlRoot?.classList.toggle("show-advanced", advancedControls);
  if (advancedToggleButton) {
    advancedToggleButton.setAttribute("aria-pressed", String(advancedControls));
    advancedToggleButton.textContent = advancedControls ? "Simple" : "Advanced";
  }
  updateSpec();
}

function bindAdvancedToggle() {
  if (advancedToggleBound || !advancedToggleButton) return;
  advancedToggleBound = true;
  advancedToggleButton.addEventListener("click", () => {
    setAdvancedControls(!advancedControls);
  });
}

function setControlPanel(panelKey = "design") {
  if (!controlTabs || !controlPanels.length) return;
  const activeKey = controlPanels.some((panel) => panel.dataset.controlPanel === panelKey) ? panelKey : "design";
  controlTabs.querySelectorAll("[data-control-tab]").forEach((button) => {
    const isActive = button.dataset.controlTab === activeKey;
    button.setAttribute("aria-selected", String(isActive));
  });
  controlPanels.forEach((panel) => {
    const isActive = panel.dataset.controlPanel === activeKey;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
}

function bindPanelTabs() {
  if (panelTabsBound || !controlTabs) return;
  panelTabsBound = true;
  controlTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-control-tab]");
    if (!button) return;
    setControlPanel(button.dataset.controlTab);
  });
}

function bindControls() {
  bindPanelTabs();
  bindAdvancedToggle();

  presetControls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-preset]");
    if (!button) return;
    applyPreset(button.dataset.preset);
  });

  controlRoot.addEventListener("input", (event) => {
    const input = event.target.closest("[data-slider]");
    if (!input) return;
    const key = input.dataset.slider;
    state[key] = Number(input.value);
    if (key === "drawSmoothing") state.drawSmoothing = clamp(Math.max(state.drawSmoothing, BRAND_MIN_DRAW_SMOOTHING), 0, 1);
    if (key === "drawBend") state.drawBend = clamp(Math.max(state.drawBend, BRAND_MIN_DRAW_BEND), 0, 1);
    if (key === "drawSpacing") state.drawSpacing = clamp(Math.max(state.drawSpacing, BRAND_MIN_DRAW_SPACING), 0, 1);
    input.value = state[key];
    document.getElementById(`out-${key}`).textContent = formatNumber(state[key]);
    if (["motionSpeed", "motionDrift"].includes(key)) {
      updateSpec();
      return;
    }
    if (key === "drawAnchorCount" && state.preset === "custom" && state.drawSourcePoints?.length) {
      state.drawSourcePoints = sanitizeEditableSource(state.drawSourcePoints);
      state.shapeAnchors = createShapeAnchors(state.drawSourcePoints, state.drawAnchorCount);
      if (shapeAnchorMode) {
        state.drawSourcePoints = sourcePointsFromAnchors(state.shapeAnchors);
      }
    }
    if (["drawSmoothing", "drawBend", "drawSpacing", "drawAnchorCount"].includes(key) && state.preset === "custom" && state.drawSourcePoints?.length) {
      state.drawSourcePoints = sanitizeEditableSource(state.drawSourcePoints);
      state.shapeAnchors = createShapeAnchors(state.drawSourcePoints, state.drawAnchorCount);
      state.drawnPath = fitDrawnPath(state.drawSourcePoints);
      renderShapeGuide();
    }
    refreshRibbon();
  });

  materialControls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-material]");
    if (!button) return;
    applyMaterial(button.dataset.material);
    syncControls();
    refreshRibbon();
  });

  document.getElementById("apply-brief").addEventListener("click", () => {
    applyBrief(brief.value);
  });
  document.getElementById("randomize").addEventListener("click", randomize);
  document.getElementById("reset").addEventListener("click", () => applyPreset("signal", true));
  document.getElementById("copy-spec").addEventListener("click", copySpec);
  copyPromptButton.addEventListener("click", copyPrompt);
  copyLinkButton.addEventListener("click", copyShareLink);
  document.getElementById("export-png").addEventListener("click", exportPng);
  snapshotCaptureButton.addEventListener("click", captureSnapshot);
  snapshotClearButton.addEventListener("click", clearSnapshots);
  snapshotSlotButtons.forEach((button) => {
    button.addEventListener("click", () => loadSnapshot(Number(button.dataset.snapshotSlot)));
  });

  drawShapeButton.addEventListener("click", toggleShapeDrawing);
  editShapeButton.addEventListener("click", toggleShapeEditing);
  polishShapeButton.addEventListener("click", polishDrawnShape);
  shapeAnchorModeButton.addEventListener("click", toggleShapeAnchorMode);
  shapeSmoothButton.addEventListener("click", () => applyShapeTool("smooth"));
  shapeSeparateButton.addEventListener("click", () => applyShapeTool("separate"));
  shapeAirButton.addEventListener("click", () => applyShapeTool("air"));
  shapeTightenButton.addEventListener("click", () => applyShapeTool("tighten"));
  useShapeButton.addEventListener("click", () => useDrawnShape(false));
  clearShapeButton.addEventListener("click", clearDrawnShape);
  stageUseShapeButton.addEventListener("click", () => useDrawnShape(false));
  stageEditShapeButton.addEventListener("click", toggleShapeEditing);
  stagePolishShapeButton.addEventListener("click", polishDrawnShape);
  stageClearShapeButton.addEventListener("click", clearDrawnShape);
  motionToggleButton.addEventListener("click", toggleMotion);
  motionCalmButton.addEventListener("click", () => applyMotionPreset("calm"));
  motionStudioButton.addEventListener("click", () => applyMotionPreset("studio"));
  motionCinematicButton.addEventListener("click", () => applyMotionPreset("cinematic"));
  shapeCanvas.addEventListener("pointerdown", startShapeStroke);
  shapeCanvas.addEventListener("pointermove", moveShapeStroke);
  shapeCanvas.addEventListener("pointerup", endShapeStroke);
  shapeCanvas.addEventListener("pointercancel", endShapeStroke);
  shapeCanvas.addEventListener("lostpointercapture", endShapeStroke);

  placeholderFile.addEventListener("change", loadPlaceholderImage);
  placeholderOpacity.addEventListener("input", updatePlaceholderOpacity);
  placeholderFit.addEventListener("click", togglePlaceholderFit);
  clearPlaceholder.addEventListener("click", clearPlaceholderImage);

  canvas.addEventListener("pointerdown", startDrag);
  window.addEventListener("pointermove", moveDrag);
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("resize", resize);
  window.addEventListener("hashchange", () => {
    if (applySnapshotFromHash()) showToast("Shared state loaded.");
  });
}

function formatNumber(value) {
  return Number(value).toFixed(2).replace(/\.?0+$/, "");
}

function applyPreset(key, resetMaterial = false) {
  if (key === "custom" && (!state.drawnPath || state.drawnPath.length < 2)) {
    showToast("Draw a shape first.");
    syncPressed();
    return;
  }
  const preset = PRESETS[key] || PRESETS.signal;
  state.preset = key;
  Object.assign(state, {
    width: preset.width,
    thickness: preset.thickness,
    curl: preset.curl,
    depth: preset.depth,
    twist: preset.twist,
    lift: preset.lift,
    glassArea: resetMaterial ? 0.46 : state.glassArea,
    blendWidth: resetMaterial ? 0.2 : state.blendWidth,
    pinkMix: resetMaterial ? 0.94 : state.pinkMix,
    gloss: resetMaterial ? 0.64 : state.gloss,
    motionSpeed: resetMaterial ? 0.82 : state.motionSpeed,
    motionDrift: resetMaterial ? 0.54 : state.motionDrift
  });
  if (resetMaterial) state.material = "frankly";
  if (resetMaterial) state.autoRotate = true;
  if (key !== "custom") {
    shapeAnchorMode = false;
    state.drawnPath = null;
    state.drawSourcePoints = null;
    state.shapeAnchors = null;
    drawnShapePoints = [];
  }
  viewRotation = new THREE.Euler(preset.viewX, preset.viewY, preset.viewZ, "XYZ");
  syncControls();
  refreshRibbon();
}

function applyMaterial(key) {
  state.material = key;
  if (key === "glass") {
    state.glassArea = clamp(Math.max(state.glassArea, 0.5), 0.46, 0.66);
    state.blendWidth = clamp(Math.max(state.blendWidth, 0.2), 0.14, 0.32);
    state.pinkMix = clamp(Math.max(state.pinkMix, 0.9), 0.82, 1);
    state.gloss = clamp(Math.max(state.gloss, 0.58), 0.46, 0.78);
  }
}

function syncControls() {
  for (const slider of SLIDERS) {
    const input = document.getElementById(`range-${slider.key}`);
    const output = document.getElementById(`out-${slider.key}`);
    if (input) input.value = state[slider.key];
    if (output) output.textContent = formatNumber(state[slider.key]);
  }
  placeholderOpacity.value = state.placeholderOpacity;
  placeholderOpacityOut.textContent = formatNumber(state.placeholderOpacity);
  placeholderFit.textContent = state.placeholderFit === "cover" ? "Cover" : "Contain";
  placeholderFit.setAttribute("aria-pressed", String(state.placeholderFit === "contain"));
  syncPressed();
  syncSnapshotControls();
}

function syncPressed() {
  presetControls.querySelectorAll("[data-preset]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.preset === state.preset));
  });
  materialControls.querySelectorAll("[data-material]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.material === state.material));
  });
  if (motionToggleButton) {
    motionToggleButton.setAttribute("aria-pressed", String(state.autoRotate));
    motionToggleButton.textContent = state.autoRotate ? "Pause" : "Play";
  }
  if (shapeAnchorModeButton) {
    shapeAnchorModeButton.setAttribute("aria-pressed", String(shapeAnchorMode));
  }
}

function applyBrief(value) {
  const text = value.toLowerCase();
  const wantsNoOverlap = /(uden overlap|ikke indover|ikke ind over|ikke over hinanden|no overlap|separate|luft|space|afstand|åben|open)/.test(text);
  const promptShape = createPromptSourcePath(text);
  if (promptShape) {
    applyPromptShape(promptShape);
  } else if (/(fall|cascade|drop|fald|drip)/.test(text)) applyPreset("cascade");
  else if (/(coil|spiral|snurre|snurret|helix)/.test(text)) applyPreset("coil");
  else if (/(halo|circle|rund|ring)/.test(text)) applyPreset("halo");
  else if (/(loop|åben|open)/.test(text)) applyPreset("loop");
  else if (/(wave|bølge|ripple|flow|flydende)/.test(text)) applyPreset("ripple");
  else if (/(grand arc|arc|bue|smile|sweep|lav)/.test(text)) applyPreset("arc");
  else if (/(fold|folded|foldet)/.test(text)) applyPreset("fold");
  else if (/(tall|twist|lodret|snoet)/.test(text)) applyPreset("twist");
  else applyPreset("signal");

  if (/(glass|glas|transparent|light|hvid)/.test(text)) applyMaterial("glass");
  if (/(deep|mørk|dusk|contrast|kontrast)/.test(text)) state.material = "dusk";
  if (/(wide|bred|bold|stor)/.test(text)) state.width = clamp(state.width + 0.12, 0.18, 0.62);
  if (/(thin|tynd|fin|let)/.test(text)) state.thickness = clamp(state.thickness - 0.018, 0.015, 0.09);
  if (/(deep|dyb|3d|rum)/.test(text)) state.depth = clamp(state.depth + 0.24, 0.04, 1.35);
  if (/(flat|flad|rolig|calm)/.test(text)) state.depth = clamp(state.depth - 0.18, 0.04, 1.35);
  if (/(white|hvid|pale|lys)/.test(text)) state.pinkMix = clamp(state.pinkMix - 0.18, 0.08, 1);
  if (/(pink|rosa|lyserød|rose)/.test(text)) state.pinkMix = clamp(state.pinkMix + 0.14, 0.08, 1);
  if (/(transparent|glass|glas|frosted|matte)/.test(text)) state.glassArea = clamp(state.glassArea + 0.16, 0.12, 0.74);
  if (/(solid|opaque)/.test(text)) state.glassArea = clamp(state.glassArea - 0.14, 0.12, 0.74);
  if (/(smooth|soft|blend|flydende|blød)/.test(text)) state.blendWidth = clamp(state.blendWidth + 0.06, 0.04, 0.34);
  if (/(sharp|hard|hak|kant)/.test(text)) state.blendWidth = clamp(state.blendWidth - 0.06, 0.04, 0.34);
  if (/(smooth|soft|flydende|blød|rolig|calm|elegant|uden knæk|ingen knæk|no kink|no elbow|continuous|kontinuerlig)/.test(text)) {
    state.drawSmoothing = clamp(Math.max(state.drawSmoothing, 0.92), 0, 1);
    state.drawBend = clamp(Math.max(state.drawBend, 0.88), 0, 1);
  }
  if (/(flow|organisk|silke|silky|elastic|elastisk)/.test(text)) state.drawBend = clamp(Math.max(state.drawBend, 0.9), 0, 1);
  if (/(animate|animation|motion|bevæg|bevæge|svæv|float|flydende)/.test(text)) {
    state.autoRotate = true;
    state.motionSpeed = clamp(Math.max(state.motionSpeed, 0.82), 0.1, 2.2);
    state.motionDrift = clamp(Math.max(state.motionDrift, 0.6), 0, 1);
  }
  if (/(slow|rolig|calm|subtle|stille|langsom)/.test(text)) {
    state.motionSpeed = clamp(Math.min(state.motionSpeed, 0.58), 0.1, 2.2);
    state.motionDrift = clamp(Math.min(state.motionDrift, 0.42), 0, 1);
  }
  if (/(cinematic|hero|dramatisk|showcase)/.test(text)) {
    state.autoRotate = true;
    state.motionSpeed = clamp(Math.max(state.motionSpeed, 1.12), 0.1, 2.2);
    state.motionDrift = clamp(Math.max(state.motionDrift, 0.82), 0, 1);
  }
  if (wantsNoOverlap) {
    state.drawSpacing = clamp(Math.max(state.drawSpacing, 0.88), 0, 1);
    state.drawSmoothing = clamp(Math.max(state.drawSmoothing, 0.84), 0, 1);
    state.curl = clamp(Math.min(state.curl, 0.78), 0.35, 2.25);
    state.depth = clamp(Math.min(state.depth, 0.36), 0.04, 1.35);
    state.twist = clamp(Math.min(state.twist, 0.42), 0, 3.2);
    state.lift = clamp(state.lift * 0.35, -0.8, 0.8);
    if (THREE && promptShape) viewRotation = new THREE.Euler(-0.04, 0.08, 0, "XYZ");
  }
  if (state.material === "glass") {
    state.pinkMix = clamp(Math.max(state.pinkMix, 0.9), 0.82, 1);
    state.gloss = clamp(Math.max(state.gloss, 0.58), 0.46, 0.78);
  }
  if (promptShape && state.drawSourcePoints?.length) state.drawnPath = fitDrawnPath(state.drawSourcePoints);
  syncControls();
  refreshRibbon();
  showToast(promptShape ? "Brief generated shape." : "Brief applied.");
}

function toggleMotion() {
  state.autoRotate = !state.autoRotate;
  syncControls();
  updateSpec();
  showToast(state.autoRotate ? "Motion on." : "Motion paused.");
}

function applyMotionPreset(key) {
  const motionPresets = {
    calm: {speed: 0.42, drift: 0.28, rotate: true},
    studio: {speed: 0.82, drift: 0.54, rotate: true},
    cinematic: {speed: 1.18, drift: 0.86, rotate: true}
  };
  const preset = motionPresets[key] || motionPresets.studio;
  state.autoRotate = preset.rotate;
  state.motionSpeed = preset.speed;
  state.motionDrift = preset.drift;
  syncControls();
  updateSpec();
  showToast(`${key.charAt(0).toUpperCase() + key.slice(1)} motion.`);
}

function createPromptSourcePath(text) {
  if (!/(shape|form|ribbon|kurve|curve|bølge|wave|s-form|s form|signal|flow|loop|ring|bue|arc|sweep|smile|åben|open|coil|spiral|halo|fold|cascade|fall|fald)/.test(text)) {
    return null;
  }
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, rect.width || canvas.clientWidth || 900);
  const height = Math.max(300, rect.height || canvas.clientHeight || 640);
  const points = [];
  const count = 96;
  const openLoop = /(loop|ring|circle|cirkel)/.test(text);
  const coil = /(coil|spiral|helix|snurre|snurret)/.test(text);
  const halo = /(halo)/.test(text);
  const cascade = /(cascade|fall|fald|drop|drip)/.test(text);
  const fold = /(fold|folded|foldet|knæk|zig)/.test(text);
  const wave = /(wave|bølge|ripple|flow|flydende)/.test(text);
  const tall = /(tall|twist|lodret|snoet)/.test(text);
  const sweep = /(arc|sweep|bue|lav|smile)/.test(text);
  const separatedIntent = /(uden overlap|ikke indover|ikke ind over|ikke over hinanden|no overlap|separate|luft|space|afstand|åben|open)/.test(text);

  for (let i = 0; i < count; i += 1) {
    const t = i / (count - 1);
    let x;
    let y;
    if (coil) {
      const angle = -0.82 * Math.PI + t * Math.PI * 2.22;
      const radiusX = width * (0.19 + Math.sin(t * Math.PI) * 0.07);
      const radiusY = height * (0.2 + Math.sin(t * Math.PI) * 0.05);
      x = width * 0.5 + Math.sin(angle) * radiusX;
      y = height * (0.19 + t * 0.62) + Math.cos(angle) * radiusY * 0.26;
    } else if (halo || openLoop) {
      const angle = -0.72 * Math.PI + t * 1.52 * Math.PI;
      const radiusX = width * 0.28;
      const radiusY = height * 0.23;
      x = width * 0.5 + Math.cos(angle) * radiusX + (t - 0.5) * width * 0.16;
      y = height * 0.5 + Math.sin(angle) * radiusY + Math.sin(t * Math.PI) * height * 0.08;
    } else if (cascade) {
      x = width * 0.5 + Math.sin(t * Math.PI * 2.3 + 0.4) * width * (0.1 + Math.sin(t * Math.PI) * 0.05);
      y = height * (0.16 + t * 0.68) + Math.sin(t * Math.PI * 4) * height * 0.025;
    } else if (fold) {
      x = width * (0.26 + t * 0.48) + Math.sin(t * Math.PI * 2.35 + 0.2) * width * 0.18;
      y = height * (0.22 + t * 0.58) + Math.sin(t * Math.PI * 4.1) * height * 0.05;
    } else if (tall) {
      x = width * 0.5 + Math.sin(t * Math.PI * 2.2 - 0.5) * width * 0.11;
      y = height * (0.18 + t * 0.64);
    } else if (wave) {
      x = width * (0.16 + t * 0.68);
      y = height * (0.5 + Math.sin(t * Math.PI * 2.25 - 0.4) * 0.16);
    } else if (sweep) {
      x = width * (0.2 + t * 0.6);
      y = height * (0.49 + Math.sin((t - 0.08) * Math.PI) * 0.18);
    } else if (separatedIntent) {
      x = width * (0.16 + t * 0.68);
      y = height * (0.49 + Math.sin(t * Math.PI * 2 - 0.85) * 0.105 + (t - 0.5) * 0.08);
    } else {
      x = width * (0.2 + t * 0.6);
      y = height * (0.33 + t * 0.34 + Math.sin(t * Math.PI * 2.06 - 0.35) * 0.13);
    }
    points.push({x, y});
  }
  return points;
}

function applyPromptShape(points) {
  enforceBrandShapeDefaults();
  const flow = createFlowSourceFromSketch(points, {anchorCount: 7, progressive: false});
  state.drawSourcePoints = flow.source;
  state.shapeAnchors = flow.anchors;
  state.drawnPath = fitDrawnPath(state.drawSourcePoints);
  state.preset = "custom";
  calmCustomGeometry(0.75);
  state.autoRotate = false;
  if (THREE) viewRotation = new THREE.Euler(PRESETS.custom.viewX, PRESETS.custom.viewY, PRESETS.custom.viewZ, "XYZ");
  setShapeDrawing(false);
  setShapeEditing(false);
}

function randomize() {
  const keys = RANDOM_PRESET_KEYS;
  applyPreset(keys[Math.floor(Math.random() * keys.length)]);
  state.width = randomBetween(0.25, 0.48);
  state.thickness = randomBetween(0.025, 0.065);
  state.curl = randomBetween(0.75, 1.9);
  state.depth = randomBetween(0.3, 1.18);
  state.twist = randomBetween(0.45, 2.65);
  state.lift = randomBetween(-0.25, 0.55);
  state.glassArea = randomBetween(0.2, 0.58);
  state.blendWidth = randomBetween(0.1, 0.28);
  state.pinkMix = randomBetween(0.42, 0.94);
  state.gloss = randomBetween(0.28, 0.88);
  state.drawSmoothing = randomBetween(0.9, 0.98);
  state.drawBend = randomBetween(0.84, 0.96);
  state.drawSpacing = randomBetween(0.82, 0.92);
  applyMaterial(Object.keys(MATERIALS)[Math.floor(Math.random() * Object.keys(MATERIALS).length)]);
  syncControls();
  refreshRibbon();
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function enforceBrandShapeDefaults(strong = false) {
  state.drawSmoothing = clamp(Math.max(state.drawSmoothing, strong ? 0.94 : BRAND_MIN_DRAW_SMOOTHING), 0, 1);
  state.drawBend = clamp(Math.max(state.drawBend, strong ? 0.9 : BRAND_MIN_DRAW_BEND), 0, 1);
  state.drawSpacing = clamp(Math.max(state.drawSpacing, strong ? 0.9 : BRAND_MIN_DRAW_SPACING), 0, 1);
}

function ensureEditableShapeFromPreset(options = {}) {
  if (state.drawSourcePoints?.length) return true;
  if (state.preset === "custom") return false;
  const source = presetToEditableSourcePoints();
  if (!source.length) return false;
  enforceBrandShapeDefaults(true);
  const cleaned = sanitizeEditableSource(source, {strong: true});
  if (cleaned.length < 2) return false;
  state.drawSourcePoints = cleaned;
  state.shapeAnchors = createShapeAnchors(cleaned, state.drawAnchorCount);
  state.drawnPath = fitDrawnPath(cleaned);
  state.preset = "custom";
  drawnShapePoints = [];
  shapePointerActive = false;
  shapeAnchorMode = false;
  if (THREE) viewRotation = new THREE.Euler(PRESETS.custom.viewX, PRESETS.custom.viewY, PRESETS.custom.viewZ, "XYZ");
  syncControls();
  renderShapeGuide();
  refreshRibbon();
  if (!options.silent) showToast(options.message || "Preset ready to edit.");
  return true;
}

function presetToEditableSourcePoints() {
  resizeShapeCanvas();
  const rect = shapeCanvas.getBoundingClientRect();
  const width = Math.max(320, rect.width || canvas.clientWidth || 900);
  const height = Math.max(300, rect.height || canvas.clientHeight || 640);
  if (!THREE) {
    return createPromptSourcePath(PRESETS[state.preset]?.label?.toLowerCase() || "signal") || [];
  }
  const samples = [];
  const count = 112;
  for (let index = 0; index < count; index += 1) {
    samples.push(centerAt(index / (count - 1)));
  }
  const bounds = samples.reduce((box, point) => ({
    minX: Math.min(box.minX, point.x),
    maxX: Math.max(box.maxX, point.x),
    minY: Math.min(box.minY, point.y),
    maxY: Math.max(box.maxY, point.y)
  }), {minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity});
  const rangeX = Math.max(0.1, bounds.maxX - bounds.minX);
  const rangeY = Math.max(0.1, bounds.maxY - bounds.minY);
  const margin = Math.max(42, Math.min(width, height) * 0.12);
  const scale = Math.min((width - margin * 2) / rangeX, (height - margin * 2) / rangeY) * 0.82;
  const centerX = (bounds.minX + bounds.maxX) * 0.5;
  const centerY = (bounds.minY + bounds.maxY) * 0.5;
  return clampSourcePoints(samples.map((point) => ({
    x: width * 0.5 + (point.x - centerX) * scale,
    y: height * 0.5 - (point.y - centerY) * scale
  })));
}

function sanitizeEditableSource(points, options = {}) {
  const source = resampleDrawPoints(clampSourcePoints(points), options.samples || 168);
  if (source.length < 2) return source;
  const strong = Boolean(options.strong);
  const smooth = clamp(Math.max(state.drawSmoothing, strong ? 0.9 : BRAND_MIN_DRAW_SMOOTHING), 0, 1);
  const flow = clamp(Math.max(state.drawBend, strong ? 0.9 : BRAND_MIN_DRAW_BEND), 0, 1);
  const spacing = clamp(Math.max(state.drawSpacing, strong ? 0.9 : BRAND_MIN_DRAW_SPACING), 0, 1);
  const beforeIntersections = countPathIntersections(source);
  let next = softenSharpTurns(source, Math.round(5 + smooth * 7 + flow * 4), 0.24 + smooth * 0.12 + flow * 0.08);
  next = relaxDrawPoints(next, Math.round(9 + smooth * 14 + flow * 8), 0.22 + smooth * 0.18);
  next = separateDrawSelfOverlaps(
    next,
    options.minDistance || sourceSeparationDistance(spacing),
    Math.round(5 + spacing * 7)
  );
  next = roundDrawCorners(resampleDrawPoints(clampSourcePoints(next), 150), Math.round(3 + smooth * 4 + flow * 3), 0.32);
  next = relaxDrawPoints(next, Math.round(6 + smooth * 8 + flow * 5), 0.12 + smooth * 0.08);
  next = softenSharpTurns(next, Math.round(4 + smooth * 4), 0.16 + flow * 0.05);
  next = resampleDrawPoints(clampSourcePoints(next), 132);
  next = relaxDrawPoints(next, Math.round(10 + smooth * 10 + flow * 6), 0.18 + smooth * 0.1);
  next = softenSharpTurns(next, Math.round(6 + smooth * 5 + flow * 4), 0.22 + flow * 0.08);
  next = resampleDrawPoints(clampSourcePoints(next), 132);
  const afterIntersections = countPathIntersections(next);
  if (beforeIntersections || afterIntersections < beforeIntersections) {
    diagnostics.shapeCorrections += Math.max(1, beforeIntersections - afterIntersections);
  }
  return next;
}

function createFlowSourceFromSketch(points, options = {}) {
  const sketchPoints = options.progressive === false ? points : makeProgressiveSketchPoints(points);
  const initial = sanitizeEditableSource(sketchPoints, {strong: true, samples: options.samples || 184});
  if (initial.length < 2) return {source: initial, anchors: []};
  const anchorCount = Math.min(options.anchorCount || state.drawAnchorCount || 7, 7);
  let anchors = createShapeAnchors(initial, anchorCount);
  anchors = relaxDrawPoints(anchors, 3, 0.16);
  let source = sourcePointsFromAnchors(anchors);
  source = sanitizeEditableSource(source, {strong: true, samples: 184});
  anchors = createShapeAnchors(source, anchorCount);
  return {source, anchors};
}

function makeProgressiveSketchPoints(points) {
  const source = clampSourcePoints(points || []);
  if (source.length < 4) return source;
  const first = source[0];
  const last = source[source.length - 1];
  let axisX = last.x - first.x;
  let axisY = last.y - first.y;
  let axisLength = Math.hypot(axisX, axisY);
  if (axisLength < 80) {
    const bounds = sourceBounds(source);
    if ((bounds.maxX - bounds.minX) >= (bounds.maxY - bounds.minY)) {
      axisX = 1;
      axisY = 0;
    } else {
      axisX = 0;
      axisY = bounds.maxY >= bounds.minY ? 1 : -1;
    }
    axisLength = 1;
  }
  axisX /= axisLength;
  axisY /= axisLength;

  const projected = source.map((point) => ({
    point,
    progress: (point.x - first.x) * axisX + (point.y - first.y) * axisY
  }));
  const tolerance = Math.max(18, axisLength * 0.045);
  const filtered = [projected[0].point];
  let furthest = projected[0].progress;
  for (let index = 1; index < projected.length - 1; index += 1) {
    const item = projected[index];
    if (item.progress + tolerance < furthest) continue;
    furthest = Math.max(furthest, item.progress);
    filtered.push(item.point);
  }
  filtered.push(projected[projected.length - 1].point);
  const coarseTrimmed = trimSketchTerminals(filtered.length >= 4 ? filtered : source, 0.14, 0.06);
  const trimmed = trimHookedSketchEnds(coarseTrimmed);
  return trimmed.length >= 4 ? trimmed : (filtered.length >= 4 ? filtered : source);
}

function trimSketchTerminals(points, startFraction, endFraction) {
  if (points.length < 10) return points;
  const start = Math.min(points.length - 5, Math.max(0, Math.round(points.length * startFraction)));
  const end = Math.max(start + 4, points.length - Math.max(0, Math.round(points.length * endFraction)));
  const trimmed = points.slice(start, end);
  return trimmed.length >= 4 ? trimmed : points;
}

function trimHookedSketchEnds(points) {
  if (points.length < 6) return points;
  const next = points.map((point) => ({...point}));
  for (let pass = 0; pass < 3; pass += 1) {
    if (next.length <= 5) break;
    if (segmentTurnDelta(next[0], next[1], next[2]) > 0.48) next.shift();
    else break;
  }
  for (let pass = 0; pass < 3; pass += 1) {
    if (next.length <= 5) break;
    const last = next.length - 1;
    if (segmentTurnDelta(next[last], next[last - 1], next[last - 2]) > 0.48) next.pop();
    else break;
  }
  return next;
}

function segmentTurnDelta(a, b, c) {
  const ax = b.x - a.x;
  const ay = b.y - a.y;
  const bx = c.x - b.x;
  const by = c.y - b.y;
  const al = Math.hypot(ax, ay);
  const bl = Math.hypot(bx, by);
  if (al < 0.001 || bl < 0.001) return 0;
  return Math.acos(clamp((ax * bx + ay * by) / (al * bl), -1, 1));
}

function calmCustomGeometry(strength = 1) {
  state.width = clamp(Math.min(state.width, 0.34 - strength * 0.05), 0.18, 0.62);
  state.curl = clamp(Math.min(state.curl, 0.86 - strength * 0.1), 0.42, 1.08);
  state.depth = clamp(Math.min(state.depth, 0.52 - strength * 0.22), 0.08, 0.72);
  state.twist = clamp(Math.min(state.twist, 0.64 - strength * 0.3), 0.02, 0.9);
  state.lift = clamp(state.lift, -0.22, 0.28);
}

function sourceSeparationDistance(spacing = state.drawSpacing) {
  const rect = shapeCanvas.getBoundingClientRect();
  const stageMin = Math.max(320, Math.min(rect.width || canvas.clientWidth || 900, rect.height || canvas.clientHeight || 640));
  return clamp(stageMin * (0.068 + spacing * 0.058) + state.width * 84, 58, 142);
}

function softenSharpTurns(points, iterations, amount) {
  if (points.length < 3) return points;
  let softened = points.map((point) => ({...point}));
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    softened = softened.map((point, index) => {
      if (index === 0 || index === softened.length - 1) return point;
      const previous = softened[index - 1];
      const next = softened[index + 1];
      const angle = turnAngle(previous, point, next);
      const kink = clamp((2.76 - angle) / 1.12, 0, 1);
      if (kink <= 0.001) return point;
      const average = {
        x: (previous.x + next.x) * 0.5,
        y: (previous.y + next.y) * 0.5
      };
      const pull = amount * kink;
      return {
        x: point.x + (average.x - point.x) * pull,
        y: point.y + (average.y - point.y) * pull
      };
    });
  }
  return softened;
}

function countPathIntersections(points) {
  if (points.length < 8) return 0;
  const skip = Math.max(8, Math.round(points.length * 0.08));
  let count = 0;
  for (let i = 0; i < points.length - 2; i += 1) {
    for (let j = i + skip; j < points.length - 2; j += 1) {
      if (segmentIntersection(points[i], points[i + 1], points[j], points[j + 1])) count += 1;
    }
  }
  return count;
}

function toggleShapeDrawing() {
  setShapeDrawing(!shapeDrawActive);
  if (shapeDrawActive) {
    drawnShapePoints = [];
    resizeShapeCanvas();
    renderShapeGuide();
    state.autoRotate = false;
    document.querySelector(".stage").scrollIntoView({block: "start", behavior: "smooth"});
    showToast("Draw mode.");
  } else {
    renderShapeGuide();
  }
}

function setShapeDrawing(active) {
  if (active) setShapeEditing(false);
  shapeDrawActive = active;
  shapeHoverIndex = null;
  if (active) {
    shapeAnchorMode = false;
    state.shapeAnchors = null;
  }
  shapeCanvas.setAttribute("aria-hidden", String(!(active || shapeEditActive)));
  drawShapeButton.setAttribute("aria-pressed", String(active));
  shapeStageActions.hidden = !(active || shapeEditActive);
  document.querySelector(".stage")?.classList.toggle("is-drawing", active);
  if (active) {
    meshReadout.textContent = `${drawnShapePoints.length} draw points`;
  } else if (renderer && !shapeEditActive) {
    meshReadout.textContent = `${diagnostics.vertices} vertices`;
  }
}

function toggleShapeEditing() {
  if (!state.drawSourcePoints?.length) {
    const converted = ensureEditableShapeFromPreset({silent: true});
    if (!converted) {
      showToast("Draw, brief or pick a preset first.");
      return;
    }
  }
  setShapeEditing(!shapeEditActive);
  if (shapeEditActive) {
    resizeShapeCanvas();
    renderShapeGuide();
    state.autoRotate = false;
    document.querySelector(".stage").scrollIntoView({block: "start", behavior: "smooth"});
    showToast("Edit line.");
  } else {
    renderShapeGuide();
  }
}

function setShapeEditing(active) {
  shapeEditActive = Boolean(active && state.drawSourcePoints?.length);
  if (shapeEditActive) {
    shapeDrawActive = false;
    shapePointerActive = false;
    drawnShapePoints = [];
    drawShapeButton.setAttribute("aria-pressed", "false");
  }
  if (!shapeEditActive) shapeHoverIndex = null;
  shapeCanvas.setAttribute("aria-hidden", String(!(shapeDrawActive || shapeEditActive)));
  editShapeButton.setAttribute("aria-pressed", String(shapeEditActive));
  stageEditShapeButton.setAttribute("aria-pressed", String(shapeEditActive));
  syncPressed();
  shapeStageActions.hidden = !(shapeDrawActive || shapeEditActive);
  document.querySelector(".stage")?.classList.toggle("is-editing", shapeEditActive);
  if (shapeEditActive) meshReadout.textContent = shapeAnchorMode ? "drag anchors" : "drag line";
  else if (renderer && !shapeDrawActive) meshReadout.textContent = `${diagnostics.vertices} vertices`;
}

function toggleShapeAnchorMode() {
  if (!state.drawSourcePoints?.length) {
    const converted = ensureEditableShapeFromPreset({silent: true});
    if (!converted) {
      showToast("Draw, brief or pick a preset first.");
      return;
    }
  }
  shapeAnchorMode = !shapeAnchorMode;
  if (shapeAnchorMode) {
    state.shapeAnchors = createShapeAnchors(state.drawSourcePoints, state.drawAnchorCount);
    setShapeEditing(true);
    showToast("Anchor mode.");
  } else {
    if (state.shapeAnchors?.length) {
      state.drawSourcePoints = sourcePointsFromAnchors(state.shapeAnchors);
      state.drawnPath = fitDrawnPath(state.drawSourcePoints);
      refreshRibbon();
    }
    showToast("Line sculpt mode.");
  }
  syncControls();
  renderShapeGuide();
  updateSpec();
}

function startShapeStroke(event) {
  if (shapeEditActive) {
    startShapeEditDrag(event);
    return;
  }
  if (!shapeDrawActive) return;
  if (event.cancelable) event.preventDefault();
  if (event.pointerId != null && shapeCanvas.setPointerCapture) {
    try {
      shapeCanvas.setPointerCapture(event.pointerId);
    } catch (error) {
      // Pointer capture can fail on synthetic/touch edge cases; drawing still works.
    }
  }
  shapePointerActive = true;
  drawnShapePoints = [shapePointFromEvent(event)];
  renderShapeGuide();
  meshReadout.textContent = "1 draw point";
}

function moveShapeStroke(event) {
  if (shapeEditActive) {
    moveShapeEditDrag(event);
    return;
  }
  if (!shapeDrawActive || !shapePointerActive) return;
  if (event.cancelable) event.preventDefault();
  const point = shapePointFromEvent(event);
  const previous = drawnShapePoints[drawnShapePoints.length - 1];
  const dx = point.x - previous.x;
  const dy = point.y - previous.y;
  if (Math.hypot(dx, dy) < 5) return;
  drawnShapePoints.push(point);
  renderShapeGuide();
  meshReadout.textContent = `${drawnShapePoints.length} draw points`;
}

function endShapeStroke(event) {
  if (shapeEditActive) {
    endShapeEditDrag(event);
    return;
  }
  if (!shapePointerActive) return;
  shapePointerActive = false;
  if (event?.pointerId != null && shapeCanvas.hasPointerCapture(event.pointerId)) {
    shapeCanvas.releasePointerCapture(event.pointerId);
  }
  renderShapeGuide();
  if (drawnShapePoints.length > 3) {
    useDrawnShape(true);
  }
}

function startShapeEditDrag(event) {
  if (!state.drawSourcePoints?.length) return;
  if (event.cancelable) event.preventDefault();
  if (event.pointerId != null && shapeCanvas.setPointerCapture) {
    try {
      shapeCanvas.setPointerCapture(event.pointerId);
    } catch (error) {
      // Pointer capture can fail on synthetic/touch edge cases; editing still works.
    }
  }
  const point = shapePointFromEvent(event);
  const handleHit = shapeAnchorMode ? nearestAnchorIndex(point) : nearestEditHandleIndex(point);
  editDrag = {
    pointerId: event.pointerId,
    index: handleHit?.index ?? nearestSourcePointIndex(point),
    last: point,
    handle: Boolean(handleHit && handleHit.distance < 26),
    anchor: shapeAnchorMode
  };
  shapeHoverIndex = editDrag.index;
  meshReadout.textContent = editDrag.anchor ? "moving anchor" : (editDrag.handle ? "moving handle" : "moving line");
  renderShapeGuide();
}

function moveShapeEditDrag(event) {
  if (!state.drawSourcePoints?.length) return;
  if (event.cancelable) event.preventDefault();
  const point = shapePointFromEvent(event);
  if (!editDrag) {
    const handleHit = shapeAnchorMode ? nearestAnchorIndex(point) : nearestEditHandleIndex(point);
    const nextHover = handleHit && handleHit.distance < 34 ? handleHit.index : nearestSourcePointIndex(point);
    if (nextHover !== shapeHoverIndex) {
      shapeHoverIndex = nextHover;
      renderShapeGuide();
    }
    return;
  }
  const dx = point.x - editDrag.last.x;
  const dy = point.y - editDrag.last.y;
  editDrag.last = point;
  if (Math.hypot(dx, dy) < 0.2) return;
  if (editDrag.anchor && state.shapeAnchors?.length) {
    moveShapeAnchor(editDrag.index, dx, dy);
    state.drawSourcePoints = sourcePointsFromAnchors(state.shapeAnchors);
  } else {
    moveSourcePointNeighborhood(editDrag.index, dx, dy, editDrag.handle ? "handle" : "line");
  }
  state.drawnPath = fitDrawnPath(state.drawSourcePoints);
  refreshRibbon();
  renderShapeGuide();
}

function endShapeEditDrag(event) {
  if (!editDrag) return;
  if (event?.pointerId != null && shapeCanvas.hasPointerCapture(event.pointerId)) {
    shapeCanvas.releasePointerCapture(event.pointerId);
  }
  shapeHoverIndex = editDrag.index;
  editDrag = null;
  if (shapeAnchorMode && state.shapeAnchors?.length) {
    state.drawSourcePoints = sourcePointsFromAnchors(state.shapeAnchors);
  } else {
    state.drawSourcePoints = resampleDrawPoints(state.drawSourcePoints, 132);
  }
  state.drawSourcePoints = sanitizeEditableSource(state.drawSourcePoints);
  state.shapeAnchors = createShapeAnchors(state.drawSourcePoints, state.drawAnchorCount);
  state.drawnPath = fitDrawnPath(state.drawSourcePoints);
  refreshRibbon();
  renderShapeGuide();
  showToast("Line updated.");
}

function nearestSourcePointIndex(point) {
  let nearest = 0;
  let nearestDistance = Infinity;
  state.drawSourcePoints.forEach((sourcePoint, index) => {
    const distance = Math.hypot(sourcePoint.x - point.x, sourcePoint.y - point.y);
    if (distance < nearestDistance) {
      nearest = index;
      nearestDistance = distance;
    }
  });
  return nearest;
}

function nearestAnchorIndex(point) {
  if (!state.shapeAnchors?.length) return null;
  let nearest = null;
  state.shapeAnchors.forEach((anchor, index) => {
    const distance = Math.hypot(anchor.x - point.x, anchor.y - point.y);
    if (!nearest || distance < nearest.distance) nearest = {index, distance};
  });
  return nearest;
}

function moveShapeAnchor(anchorIndex, dx, dy) {
  if (!state.shapeAnchors?.length) return;
  const rect = shapeCanvas.getBoundingClientRect();
  const maxX = Math.max(12, rect.width - 12);
  const maxY = Math.max(12, rect.height - 12);
  const grip = clamp(state.drawGrip ?? 0.58, 0, 1);
  const radius = Math.max(1, Math.round(1 + (1 - grip) * 2));
  state.shapeAnchors = state.shapeAnchors.map((anchor, index) => {
    const distance = Math.abs(index - anchorIndex);
    if (distance > radius) return anchor;
    const weight = Math.exp(-(distance * distance) / (2 * radius * radius));
    return {
      x: clamp(anchor.x + dx * weight, 12, maxX),
      y: clamp(anchor.y + dy * weight, 12, maxY)
    };
  });
}

function nearestEditHandleIndex(point) {
  if (!state.drawSourcePoints?.length) return null;
  const indexes = editHandleIndexes(state.drawSourcePoints);
  let nearest = null;
  for (const index of indexes) {
    const handle = state.drawSourcePoints[index];
    const distance = Math.hypot(handle.x - point.x, handle.y - point.y);
    if (!nearest || distance < nearest.distance) nearest = {index, distance};
  }
  return nearest;
}

function editHandleStep(points) {
  return Math.max(8, Math.floor(points.length / 8));
}

function editHandleIndexes(points) {
  const step = editHandleStep(points);
  const indexes = new Set([0, points.length - 1]);
  for (let index = step; index < points.length - 1; index += step) indexes.add(index);
  return Array.from(indexes).sort((a, b) => a - b);
}

function moveSourcePointNeighborhood(centerIndex, dx, dy, mode = "line") {
  const grip = clamp(state.drawGrip ?? 0.58, 0, 1);
  const flow = clamp(Math.max(state.drawBend ?? 0.86, BRAND_MIN_DRAW_BEND), 0, 1);
  const radiusBase = mode === "handle"
    ? 0.055 + (1 - grip) * 0.07 + flow * 0.035
    : 0.15 + (1 - grip) * 0.11 + flow * 0.085;
  const radius = Math.max(mode === "handle" ? 4 : 6, Math.round(state.drawSourcePoints.length * radiusBase));
  const rect = shapeCanvas.getBoundingClientRect();
  state.drawSourcePoints = state.drawSourcePoints.map((point, index) => {
    const distance = Math.abs(index - centerIndex);
    const weight = Math.exp(-(distance * distance) / (2 * radius * radius));
    const pull = mode === "handle" ? 1 + grip * 0.18 : 1;
    return {
      x: clamp(point.x + dx * weight * pull, 12, Math.max(12, rect.width - 12)),
      y: clamp(point.y + dy * weight * pull, 12, Math.max(12, rect.height - 12))
    };
  });
}

function createShapeAnchors(points, requestedCount = state.drawAnchorCount) {
  const count = clamp(Math.round(requestedCount || 9), 5, 14);
  const sampled = resampleDrawPoints(points, count);
  return clampSourcePoints(sampled.length ? sampled : points).map((point) => ({...point}));
}

function sourcePointsFromAnchors(anchors) {
  if (!anchors?.length) return [];
  if (anchors.length < 3) return resampleDrawPoints(anchors, 132);
  const sampled = [];
  const samplesPerSegment = Math.max(7, Math.ceil(132 / Math.max(1, anchors.length - 1)));
  for (let segment = 0; segment < anchors.length - 1; segment += 1) {
    const p0 = anchors[Math.max(0, segment - 1)];
    const p1 = anchors[segment];
    const p2 = anchors[segment + 1];
    const p3 = anchors[Math.min(anchors.length - 1, segment + 2)];
    for (let step = 0; step < samplesPerSegment; step += 1) {
      const t = step / samplesPerSegment;
      if (segment > 0 || step > 0) sampled.push(anchorSplinePoint(p0, p1, p2, p3, t));
    }
  }
  sampled.push({...anchors[anchors.length - 1]});
  return resampleDrawPoints(clampSourcePoints(sampled), 132);
}

function anchorSplinePoint(p0, p1, p2, p3, t) {
  const flow = clamp(Math.max(state.drawBend ?? 0.86, BRAND_MIN_DRAW_BEND), 0, 1);
  const tangentStrength = 0.16 + flow * 0.09;
  const segmentLength = Math.max(1, Math.hypot(p2.x - p1.x, p2.y - p1.y));
  const maxTangent = segmentLength * (0.34 + clamp(state.drawSmoothing ?? 0.9, 0, 1) * 0.16);
  const m1 = clampedTangent(p0, p2, tangentStrength, maxTangent);
  const m2 = clampedTangent(p1, p3, tangentStrength, maxTangent);
  const t2 = t * t;
  const t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;
  return {
    x: h00 * p1.x + h10 * m1.x + h01 * p2.x + h11 * m2.x,
    y: h00 * p1.y + h10 * m1.y + h01 * p2.y + h11 * m2.y
  };
}

function clampedTangent(previous, next, strength, maxLength) {
  let x = (next.x - previous.x) * strength;
  let y = (next.y - previous.y) * strength;
  const length = Math.hypot(x, y);
  if (length > maxLength && length > 0.0001) {
    const scale = maxLength / length;
    x *= scale;
    y *= scale;
  }
  return {x, y};
}

function shapePointFromEvent(event) {
  const rect = shapeCanvas.getBoundingClientRect();
  return {
    x: clamp(event.clientX - rect.left, 0, rect.width),
    y: clamp(event.clientY - rect.top, 0, rect.height)
  };
}

function useDrawnShape(autoApplied = false) {
  if (shapeEditActive && state.drawSourcePoints?.length) {
    if (shapeAnchorMode && state.shapeAnchors?.length) {
      state.drawSourcePoints = sourcePointsFromAnchors(state.shapeAnchors);
    } else {
      state.drawSourcePoints = resampleDrawPoints(state.drawSourcePoints, 132);
    }
    enforceBrandShapeDefaults();
    state.drawSourcePoints = sanitizeEditableSource(state.drawSourcePoints);
    state.shapeAnchors = createShapeAnchors(state.drawSourcePoints, state.drawAnchorCount);
    state.drawnPath = fitDrawnPath(state.drawSourcePoints);
    state.preset = "custom";
    setShapeEditing(false);
    setShapeDrawing(false);
    shapePointerActive = false;
    if (THREE) viewRotation = new THREE.Euler(PRESETS.custom.viewX, PRESETS.custom.viewY, PRESETS.custom.viewZ, "XYZ");
    syncControls();
    renderShapeGuide();
    refreshRibbon();
    showToast("Shape updated.");
    return;
  }
  enforceBrandShapeDefaults();
  const flow = createFlowSourceFromSketch(drawnShapePoints, {anchorCount: 5});
  const sourcePoints = flow.source;
  const fitted = fitDrawnPath(sourcePoints.length ? sourcePoints : drawnShapePoints);
  if (fitted.length < 2) {
    showToast("Draw a longer shape.");
    return;
  }
  state.drawnPath = fitted;
  state.drawSourcePoints = sourcePoints.length ? sourcePoints : sanitizeEditableSource(drawnShapePoints);
  state.shapeAnchors = flow.anchors?.length ? flow.anchors : createShapeAnchors(state.drawSourcePoints, Math.min(state.drawAnchorCount, 7));
  drawnShapePoints = [];
  state.preset = "custom";
  calmCustomGeometry(1);
  setShapeDrawing(false);
  shapePointerActive = false;
  if (THREE) viewRotation = new THREE.Euler(PRESETS.custom.viewX, PRESETS.custom.viewY, PRESETS.custom.viewZ, "XYZ");
  syncControls();
  renderShapeGuide();
  refreshRibbon();
  if (!renderer) {
    shapeLabel.textContent = PRESETS.custom.label;
    meshReadout.textContent = `${state.drawnPath.length} drawn points`;
    updateSpec();
  }
  showToast(autoApplied ? "Shape applied from drawing." : "Shape applied.");
}

function clearDrawnShape() {
  drawnShapePoints = [];
  state.drawnPath = null;
  state.drawSourcePoints = null;
  state.shapeAnchors = null;
  editDrag = null;
  shapeAnchorMode = false;
  if (state.preset === "custom" && renderer) {
    applyPreset("signal");
  } else if (state.preset === "custom") {
    state.preset = "signal";
    shapeLabel.textContent = PRESETS.signal.label;
    meshReadout.textContent = "draw ready";
    updateSpec();
  }
  setShapeDrawing(false);
  setShapeEditing(false);
  shapePointerActive = false;
  renderShapeGuide();
  showToast("Shape cleared.");
}

function polishDrawnShape() {
  if (!state.drawSourcePoints?.length && !drawnShapePoints.length && !ensureEditableShapeFromPreset({silent: true})) {
    showToast("Draw, brief or pick a preset first.");
    return;
  }
  const source = state.drawSourcePoints?.length
    ? state.drawSourcePoints
    : editableShapeSource(true);
  if (!source.length) {
    showToast("Draw a longer shape.");
    return;
  }
  enforceBrandShapeDefaults(true);
  calmCustomGeometry(0.85);
  const flow = createFlowSourceFromSketch(source, {anchorCount: Math.min(state.drawAnchorCount, 7)});
  state.drawSourcePoints = flow.source;
  state.shapeAnchors = flow.anchors;
  state.drawnPath = fitDrawnPath(state.drawSourcePoints);
  state.preset = "custom";
  drawnShapePoints = [];
  if (THREE) viewRotation = new THREE.Euler(PRESETS.custom.viewX, PRESETS.custom.viewY, PRESETS.custom.viewZ, "XYZ");
  syncControls();
  renderShapeGuide();
  refreshRibbon();
  showToast("Shape polished.");
}

function applyShapeTool(tool) {
  const source = editableShapeSource(true);
  if (!source.length) {
    showToast("Draw, brief or pick a preset first.");
    return;
  }

  let next = source;
  let message = "Shape updated.";
  if (tool === "smooth") {
    enforceBrandShapeDefaults(true);
    next = sanitizeEditableSource(relaxDrawPoints(resampleDrawPoints(source, 168), 10, 0.34), {strong: true});
    message = "Shape smoothed.";
  }
  if (tool === "separate") {
    enforceBrandShapeDefaults(true);
    next = relaxDrawPoints(
      separateDrawSelfOverlaps(resampleDrawPoints(source, 168), sourceSeparationDistance(1), 9),
      3,
      0.12
    );
    message = "Shape separated.";
  }
  if (tool === "air") {
    enforceBrandShapeDefaults();
    state.curl = clamp(Math.min(state.curl, 1.08), 0.35, 2.25);
    state.depth = clamp(Math.min(state.depth, 0.68), 0.04, 1.35);
    next = scaleSourcePoints(source, 1.12, 1.08);
    message = "Shape opened.";
  }
  if (tool === "tighten") {
    enforceBrandShapeDefaults(true);
    state.curl = clamp(Math.min(state.curl, 0.98), 0.35, 2.25);
    state.depth = clamp(Math.min(state.depth, 0.64), 0.04, 1.35);
    state.twist = clamp(Math.min(state.twist, 0.86), 0, 3.2);
    next = sanitizeEditableSource(relaxDrawPoints(resampleDrawPoints(source, 180), 16, 0.28), {strong: true});
    message = "Shape calmed.";
  }

  setEditableShape(next, message);
}

function editableShapeSource(allowPreset = false) {
  resizeShapeCanvas();
  if (state.drawSourcePoints?.length) return state.drawSourcePoints.map((point) => ({...point}));
  if (drawnShapePoints.length) return resampleDrawPoints(drawnShapePoints, 132);
  if (allowPreset && state.preset !== "custom") return presetToEditableSourcePoints();
  return [];
}

function setEditableShape(points, message) {
  enforceBrandShapeDefaults();
  const source = sanitizeEditableSource(points);
  if (source.length < 2) {
    showToast("Draw a longer shape.");
    return;
  }
  state.drawSourcePoints = source;
  state.shapeAnchors = createShapeAnchors(source, state.drawAnchorCount);
  state.drawnPath = fitDrawnPath(source);
  state.preset = "custom";
  drawnShapePoints = [];
  shapePointerActive = false;
  if (THREE) viewRotation = new THREE.Euler(PRESETS.custom.viewX, PRESETS.custom.viewY, PRESETS.custom.viewZ, "XYZ");
  syncControls();
  setShapeDrawing(false);
  setShapeEditing(true);
  renderShapeGuide();
  refreshRibbon();
  if (!renderer) {
    shapeLabel.textContent = PRESETS.custom.label;
    meshReadout.textContent = `${state.drawnPath.length} drawn points`;
    updateSpec();
  }
  showToast(message);
}

function scaleSourcePoints(points, scaleX, scaleY) {
  const bounds = sourceBounds(points);
  const centerX = (bounds.minX + bounds.maxX) * 0.5;
  const centerY = (bounds.minY + bounds.maxY) * 0.5;
  return clampSourcePoints(points.map((point) => ({
    x: centerX + (point.x - centerX) * scaleX,
    y: centerY + (point.y - centerY) * scaleY
  })));
}

function clampSourcePoints(points) {
  const rect = shapeCanvas.getBoundingClientRect();
  const maxX = Math.max(12, rect.width - 12);
  const maxY = Math.max(12, rect.height - 12);
  return points.map((point) => ({
    x: clamp(point.x, 12, maxX),
    y: clamp(point.y, 12, maxY)
  }));
}

function sourceBounds(points) {
  return points.reduce((bounds, point) => ({
    minX: Math.min(bounds.minX, point.x),
    maxX: Math.max(bounds.maxX, point.x),
    minY: Math.min(bounds.minY, point.y),
    maxY: Math.max(bounds.maxY, point.y)
  }), {minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity});
}

function fitDrawnPath(points) {
  const effectiveSmooth = clamp(Math.max(state.drawSmoothing, BRAND_MIN_DRAW_SMOOTHING), 0, 1);
  const effectiveFlow = clamp(Math.max(state.drawBend, BRAND_MIN_DRAW_BEND), 0, 1);
  const effectiveSpacing = clamp(Math.max(state.drawSpacing, BRAND_MIN_DRAW_SPACING), 0, 1);
  const raw = softenSharpTurns(resampleDrawPoints(points, 188), Math.round(6 + effectiveSmooth * 8 + effectiveFlow * 4), 0.26 + effectiveSmooth * 0.12);
  const simplified = simplifyDrawPoints(raw, 1.8 + (1 - effectiveSmooth) * 5.4);
  const rounded = roundDrawCorners(
    simplified.length >= 2 ? simplified : raw,
    Math.round(6 + effectiveSmooth * 8 + effectiveFlow * 3),
    0.34
  );
  const relaxed = relaxDrawPoints(
    resampleDrawPoints(rounded, 168),
    Math.round(10 + effectiveSmooth * 14 + effectiveFlow * 8),
    0.22 + effectiveSmooth * 0.16
  );
  const flowed = softenSharpTurns(relaxed, Math.round(5 + effectiveFlow * 5), 0.18 + effectiveFlow * 0.05);
  const sampled = resampleDrawPoints(flowed, 112);
  if (sampled.length < 2) return [];
  const normalized = normalizeDrawPath(sampled);
  const separated = separateDrawSelfOverlaps(
    normalized,
    state.width * (1.08 + effectiveSpacing * 1.08),
    Math.round(5 + effectiveSpacing * 6)
  );
  const safe = separateDrawSelfOverlaps(
    relaxDrawPoints(separated, Math.round(4 + effectiveSmooth * 5 + effectiveFlow * 3), 0.14 + effectiveSmooth * 0.04),
    state.width * (0.98 + effectiveSpacing * 0.84),
    4
  );
  return softenSharpTurns(
    relaxDrawPoints(safe, Math.round(4 + effectiveFlow * 4), 0.12),
    Math.round(4 + effectiveFlow * 4),
    0.18 + effectiveFlow * 0.04
  );
}

function normalizeDrawPath(points) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const point of points) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  const scale = Math.min(3.45 / width, 2.9 / height);
  const centerX = (minX + maxX) * 0.5;
  const centerY = (minY + maxY) * 0.5;
  return points.map((point) => ({
    x: (point.x - centerX) * scale,
    y: (centerY - point.y) * scale
  }));
}

function simplifyDrawPoints(points, tolerance) {
  if (points.length < 3) return points;
  const keep = new Array(points.length).fill(false);
  keep[0] = true;
  keep[points.length - 1] = true;

  function simplifySection(start, end) {
    let maxDistance = 0;
    let maxIndex = start;
    for (let index = start + 1; index < end; index += 1) {
      const distance = pointLineDistance(points[index], points[start], points[end]);
      if (distance > maxDistance) {
        maxDistance = distance;
        maxIndex = index;
      }
    }
    if (maxDistance <= tolerance) return;
    keep[maxIndex] = true;
    simplifySection(start, maxIndex);
    simplifySection(maxIndex, end);
  }

  simplifySection(0, points.length - 1);
  return points.filter((point, index) => keep[index]);
}

function pointLineDistance(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq < 0.0001) return Math.hypot(point.x - start.x, point.y - start.y);
  const t = clamp(((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSq, 0, 1);
  const x = start.x + dx * t;
  const y = start.y + dy * t;
  return Math.hypot(point.x - x, point.y - y);
}

function roundDrawCorners(points, iterations, cut) {
  if (points.length < 3) return points;
  let rounded = points.map((point) => ({...point}));
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const next = [rounded[0]];
    for (let index = 0; index < rounded.length - 1; index += 1) {
      const a = rounded[index];
      const b = rounded[index + 1];
      next.push({
        x: a.x + (b.x - a.x) * cut,
        y: a.y + (b.y - a.y) * cut
      });
      next.push({
        x: a.x + (b.x - a.x) * (1 - cut),
        y: a.y + (b.y - a.y) * (1 - cut)
      });
    }
    next.push(rounded[rounded.length - 1]);
    rounded = next.length > 180 ? resampleDrawPoints(next, 132) : next;
  }
  return rounded;
}

function relaxDrawPoints(points, iterations, amount) {
  if (points.length < 3) return points;
  let relaxed = points.map((point) => ({...point}));
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    relaxed = relaxed.map((point, index) => {
      if (index === 0 || index === relaxed.length - 1) return point;
      const previous = relaxed[index - 1];
      const next = relaxed[index + 1];
      const average = {
        x: (previous.x + next.x) * 0.5,
        y: (previous.y + next.y) * 0.5
      };
      return {
        x: point.x + (average.x - point.x) * amount,
        y: point.y + (average.y - point.y) * amount
      };
    });
  }
  return relaxed;
}

function bowDrawPoints(points, amount) {
  if (points.length < 3 || amount <= 0.001) return points;
  return points.map((point, index) => {
    if (index === 0 || index === points.length - 1) return point;
    const previous = points[index - 1];
    const next = points[index + 1];
    const chordMid = {
      x: (previous.x + next.x) * 0.5,
      y: (previous.y + next.y) * 0.5
    };
    const outwardX = point.x - chordMid.x;
    const outwardY = point.y - chordMid.y;
    const outwardLength = Math.hypot(outwardX, outwardY);
    if (outwardLength < 0.001) return point;
    const span = (Math.hypot(point.x - previous.x, point.y - previous.y) + Math.hypot(next.x - point.x, next.y - point.y)) * 0.5;
    const angle = turnAngle(previous, point, next);
    const weight = smoothstep(0.12, 1.45, angle);
    const push = span * amount * weight;
    return {
      x: point.x + (outwardX / outwardLength) * push,
      y: point.y + (outwardY / outwardLength) * push
    };
  });
}

function separateDrawSelfOverlaps(points, minDistance, iterations) {
  if (points.length < 5 || minDistance <= 0) return points;
  let separated = points.map((point) => ({...point}));
  const skip = Math.max(8, Math.round(points.length * 0.09));
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const offsets = separated.map(() => ({x: 0, y: 0, count: 0}));
    for (let i = 1; i < separated.length - 1; i += 1) {
      for (let j = i + skip; j < separated.length - 1; j += 1) {
        const dx = separated[j].x - separated[i].x;
        const dy = separated[j].y - separated[i].y;
        const distance = Math.hypot(dx, dy);
        if (distance >= minDistance || distance < 0.0001) continue;
        const push = (minDistance - distance) * 0.14;
        const nx = dx / distance;
        const ny = dy / distance;
        offsets[i].x -= nx * push;
        offsets[i].y -= ny * push;
        offsets[i].count += 1;
        offsets[j].x += nx * push;
        offsets[j].y += ny * push;
        offsets[j].count += 1;
      }
    }

    for (let i = 1; i < separated.length - 2; i += 1) {
      for (let j = i + skip; j < separated.length - 2; j += 1) {
        const intersection = segmentIntersection(separated[i], separated[i + 1], separated[j], separated[j + 1]);
        if (!intersection) continue;
        const aMid = midpoint(separated[i], separated[i + 1]);
        const bMid = midpoint(separated[j], separated[j + 1]);
        let nx = aMid.x - bMid.x;
        let ny = aMid.y - bMid.y;
        const length = Math.hypot(nx, ny);
        if (length < 0.0001) {
          const sx = separated[i + 1].x - separated[i].x;
          const sy = separated[i + 1].y - separated[i].y;
          nx = -sy;
          ny = sx;
        } else {
          nx /= length;
          ny /= length;
        }
        pushOverlapWindow(offsets, i, nx, ny, minDistance * 0.075);
        pushOverlapWindow(offsets, j, -nx, -ny, minDistance * 0.075);
      }
    }

    separated = separated.map((point, index) => {
      if (index === 0 || index === separated.length - 1) return point;
      const offset = offsets[index];
      const capped = capDrawOffset(offset, minDistance * 0.24);
      return {
        x: point.x + capped.x,
        y: point.y + capped.y
      };
    });
  }
  return separated;
}

function capDrawOffset(offset, maxLength) {
  const length = Math.hypot(offset.x, offset.y);
  if (length <= maxLength || length < 0.0001) return offset;
  const scale = maxLength / length;
  return {
    x: offset.x * scale,
    y: offset.y * scale
  };
}

function pushOverlapWindow(offsets, center, nx, ny, amount) {
  const radius = 5;
  for (let index = Math.max(1, center - radius); index <= Math.min(offsets.length - 2, center + radius); index += 1) {
    const distance = Math.abs(index - center);
    const weight = 1 - distance / (radius + 1);
    offsets[index].x += nx * amount * weight;
    offsets[index].y += ny * amount * weight;
    offsets[index].count += 1;
  }
}

function midpoint(a, b) {
  return {
    x: (a.x + b.x) * 0.5,
    y: (a.y + b.y) * 0.5
  };
}

function segmentIntersection(a, b, c, d) {
  const denominator = ((d.y - c.y) * (b.x - a.x)) - ((d.x - c.x) * (b.y - a.y));
  if (Math.abs(denominator) < 0.000001) return false;
  const ua = (((d.x - c.x) * (a.y - c.y)) - ((d.y - c.y) * (a.x - c.x))) / denominator;
  const ub = (((b.x - a.x) * (a.y - c.y)) - ((b.y - a.y) * (a.x - c.x))) / denominator;
  return ua > 0.02 && ua < 0.98 && ub > 0.02 && ub < 0.98;
}

function turnAngle(previous, point, next) {
  const ax = previous.x - point.x;
  const ay = previous.y - point.y;
  const bx = next.x - point.x;
  const by = next.y - point.y;
  const aLength = Math.hypot(ax, ay);
  const bLength = Math.hypot(bx, by);
  if (aLength < 0.001 || bLength < 0.001) return 0;
  return Math.acos(clamp((ax * bx + ay * by) / (aLength * bLength), -1, 1));
}

function resampleDrawPoints(points, targetCount) {
  if (points.length < 2) return [];
  const distances = [0];
  for (let i = 1; i < points.length; i += 1) {
    distances.push(distances[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
  }
  const total = distances[distances.length - 1];
  if (total < 24) return [];
  const resampled = [];
  for (let i = 0; i < targetCount; i += 1) {
    const target = (i / (targetCount - 1)) * total;
    let cursor = 1;
    while (cursor < distances.length - 1 && distances[cursor] < target) cursor += 1;
    const previousDistance = distances[cursor - 1];
    const nextDistance = distances[cursor];
    const amount = nextDistance === previousDistance ? 0 : (target - previousDistance) / (nextDistance - previousDistance);
    resampled.push({
      x: points[cursor - 1].x + (points[cursor].x - points[cursor - 1].x) * amount,
      y: points[cursor - 1].y + (points[cursor].y - points[cursor - 1].y) * amount
    });
  }
  return resampled;
}

function renderShapeGuide() {
  if (!shapeCtx) return;
  const width = shapeCanvas.width;
  const height = shapeCanvas.height;
  shapeCtx.clearRect(0, 0, width, height);
  if (!shapeDrawActive && !shapeEditActive) return;
  const guidePoints = shapeDrawActive ? drawnShapePoints : state.drawSourcePoints || [];
  shapeCtx.save();
  shapeCtx.lineCap = "round";
  shapeCtx.lineJoin = "round";
  shapeCtx.fillStyle = shapeEditActive ? "rgba(255,255,255,.03)" : "rgba(255,211,227,.12)";
  shapeCtx.fillRect(0, 0, width, height);
  if (shapeDrawActive) {
    shapeCtx.strokeStyle = "rgba(45,0,17,.18)";
    shapeCtx.lineWidth = 1;
    shapeCtx.setLineDash([5, 9]);
    shapeCtx.strokeRect(24, 24, Math.max(1, width - 48), Math.max(1, height - 48));
    shapeCtx.setLineDash([]);
  }
  if (guidePoints.length > 1) {
    shapeCtx.strokeStyle = shapeEditActive ? "rgba(45,0,17,.52)" : "rgba(45,0,17,.78)";
    shapeCtx.lineWidth = shapeEditActive ? 5 : 4;
    traceSmoothGuidePath(guidePoints);
    shapeCtx.stroke();
    shapeCtx.strokeStyle = "rgba(255,172,202,.9)";
    shapeCtx.lineWidth = 2;
    shapeCtx.stroke();
    if (shapeEditActive) drawEditHandles(guidePoints);
  }
  shapeCtx.restore();
}

function drawEditHandles(points) {
  const handlePoints = shapeAnchorMode && state.shapeAnchors?.length ? state.shapeAnchors : points;
  const step = editHandleStep(points);
  const activeIndex = editDrag?.index ?? shapeHoverIndex;
  const handleIndexes = shapeAnchorMode
    ? handlePoints.map((_, index) => index)
    : editHandleIndexes(points);

  shapeCtx.save();
  shapeCtx.strokeStyle = "rgba(45,0,17,.18)";
  shapeCtx.lineWidth = 1;
  shapeCtx.setLineDash([3, 7]);
  if (shapeAnchorMode) {
    traceSmoothGuidePath(handlePoints);
    shapeCtx.stroke();
  } else {
    for (const index of handleIndexes) {
      const point = points[index];
      const before = points[Math.max(0, index - Math.floor(step * 0.55))];
      const after = points[Math.min(points.length - 1, index + Math.floor(step * 0.55))];
      shapeCtx.beginPath();
      shapeCtx.moveTo(before.x, before.y);
      shapeCtx.lineTo(point.x, point.y);
      shapeCtx.lineTo(after.x, after.y);
      shapeCtx.stroke();
    }
  }
  shapeCtx.setLineDash([]);

  for (const index of handleIndexes) {
    const point = handlePoints[index];
    const isEnd = index === 0 || index === handlePoints.length - 1;
    const isActive = activeIndex != null && (
      shapeAnchorMode ? index === activeIndex : Math.abs(index - activeIndex) <= Math.ceil(step * 0.55)
    );
    shapeCtx.fillStyle = isActive ? "rgba(255,172,202,.96)" : "rgba(45,0,17,.86)";
    shapeCtx.strokeStyle = isActive ? "rgba(45,0,17,.78)" : "rgba(255,255,255,.9)";
    shapeCtx.lineWidth = isActive ? 2.5 : 2;
    shapeCtx.beginPath();
    if (isEnd) {
      shapeCtx.rect(point.x - 5.5, point.y - 5.5, 11, 11);
    } else {
      shapeCtx.arc(point.x, point.y, isActive ? 7 : 5.5, 0, Math.PI * 2);
    }
    shapeCtx.fill();
    shapeCtx.stroke();
  }
  shapeCtx.restore();
}

function traceSmoothGuidePath(points) {
  shapeCtx.beginPath();
  shapeCtx.moveTo(points[0].x, points[0].y);
  if (points.length === 2) {
    shapeCtx.lineTo(points[1].x, points[1].y);
    return;
  }
  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    shapeCtx.quadraticCurveTo(current.x, current.y, (current.x + next.x) * 0.5, (current.y + next.y) * 0.5);
  }
  const last = points[points.length - 1];
  shapeCtx.lineTo(last.x, last.y);
}

function resizeShapeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  if (shapeCanvas.width === width && shapeCanvas.height === height) return;
  shapeCanvas.width = width;
  shapeCanvas.height = height;
}

function createDrawnCurve() {
  if (!state.drawnPath || state.drawnPath.length < 2) return null;
  const points = state.drawnPath.map((point) => new THREE.Vector3(point.x, point.y + state.lift * 0.32, 0));
  return new THREE.CatmullRomCurve3(points, false, "centripetal", 0.36);
}

function loadPlaceholderImage(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (placeholderUrl) URL.revokeObjectURL(placeholderUrl);
  placeholderUrl = URL.createObjectURL(file);
  placeholderImage.src = placeholderUrl;
  placeholderImage.hidden = false;
  state.placeholderVisible = true;
  updatePlaceholderImage();
  updateSpec();
  showToast("Image loaded.");
}

function updatePlaceholderOpacity() {
  state.placeholderOpacity = Number(placeholderOpacity.value);
  placeholderOpacityOut.textContent = formatNumber(state.placeholderOpacity);
  updatePlaceholderImage();
  updateSpec();
}

function togglePlaceholderFit() {
  state.placeholderFit = state.placeholderFit === "cover" ? "contain" : "cover";
  placeholderFit.textContent = state.placeholderFit === "cover" ? "Cover" : "Contain";
  placeholderFit.setAttribute("aria-pressed", String(state.placeholderFit === "contain"));
  updatePlaceholderImage();
  updateSpec();
}

function clearPlaceholderImage() {
  if (placeholderUrl) URL.revokeObjectURL(placeholderUrl);
  placeholderUrl = "";
  placeholderImage.removeAttribute("src");
  placeholderImage.hidden = true;
  placeholderFile.value = "";
  state.placeholderVisible = false;
  updateSpec();
  showToast("Image cleared.");
}

function updatePlaceholderImage() {
  placeholderImage.style.opacity = String(state.placeholderOpacity);
  placeholderImage.style.objectFit = state.placeholderFit;
}

function setupScene() {
  renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true, preserveDrawingBuffer: true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.94;

  scene = new THREE.Scene();
  scene.environment = createStudioEnvironment();
  satinTexture = createSatinTexture();
  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  camera.position.set(0, 0.12, 6.5);

  const ambient = new THREE.HemisphereLight(0xffffff, 0xf1dce3, 1.18);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 3.25);
  key.position.set(-3.2, 5.4, 5.2);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 24;
  key.shadow.blurSamples = 24;
  key.shadow.camera.near = 0.1;
  key.shadow.camera.far = 18;
  key.shadow.camera.left = -5;
  key.shadow.camera.right = 5;
  key.shadow.camera.top = 5;
  key.shadow.camera.bottom = -5;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xfff5f8, 0.72);
  fill.position.set(3.8, 3.2, 4.4);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xffd3e3, 1.45);
  rim.position.set(3.5, 1.2, -2.4);
  scene.add(rim);

  ribbonGroup = new THREE.Group();
  scene.add(ribbonGroup);

  const floorGeometry = new THREE.PlaneGeometry(16, 16);
  const floorMaterial = new THREE.ShadowMaterial({color: 0x2d0011, opacity: 0.016});
  floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  floorMesh.position.set(0, -2.05, 0);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  const causticGeometry = new THREE.PlaneGeometry(4.2, 1.35);
  const causticMaterial = new THREE.MeshBasicMaterial({
    map: createGlassCausticTexture(),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.NormalBlending
  });
  causticMesh = new THREE.Mesh(causticGeometry, causticMaterial);
  causticMesh.position.set(0.08, -2.035, 0.18);
  causticMesh.rotation.x = -Math.PI / 2;
  causticMesh.renderOrder = -1;
  scene.add(causticMesh);

  refreshRibbon();
  resize();
  animate();
}

function createStudioEnvironment() {
  const faces = [
    makeEnvironmentFace("#fff8fb", "#f3a1b8", "#4f071e", 0.78),
    makeEnvironmentFace("#fffdfd", "#ffe0ea", "#f5b3c5", 0.44),
    makeEnvironmentFace("#ffffff", "#fff0f5", "#ffffff", 0.92),
    makeEnvironmentFace("#f5dfe6", "#fff8fb", "#ead2da", 0.52),
    makeEnvironmentFace("#fffafa", "#fff0f5", "#f6a5bb", 0.64),
    makeEnvironmentFace("#f7e6eb", "#fffefe", "#5a1126", 0.5)
  ];
  const environment = new THREE.CubeTexture(faces);
  environment.colorSpace = THREE.SRGBColorSpace;
  environment.needsUpdate = true;
  return environment;
}

function makeEnvironmentFace(base, glow, accent, accentOpacity) {
  const size = 128;
  const face = document.createElement("canvas");
  face.width = size;
  face.height = size;
  const ctx = face.getContext("2d");
  const baseGradient = ctx.createLinearGradient(0, 0, size, size);
  baseGradient.addColorStop(0, base);
  baseGradient.addColorStop(0.46, "#ffffff");
  baseGradient.addColorStop(1, glow);
  ctx.fillStyle = baseGradient;
  ctx.fillRect(0, 0, size, size);

  const softbox = ctx.createRadialGradient(size * 0.32, size * 0.28, 0, size * 0.32, size * 0.28, size * 0.72);
  softbox.addColorStop(0, "rgba(255,255,255,.98)");
  softbox.addColorStop(0.4, "rgba(255,255,255,.56)");
  softbox.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = softbox;
  ctx.fillRect(0, 0, size, size);

  const accentGradient = ctx.createLinearGradient(size, 0, 0, size);
  accentGradient.addColorStop(0, toRgba(accent, accentOpacity));
  accentGradient.addColorStop(0.34, toRgba(accent, accentOpacity * 0.34));
  accentGradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = accentGradient;
  ctx.fillRect(0, 0, size, size);
  return face;
}

function toRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);
  return `rgba(${red},${green},${blue},${alpha})`;
}

function createGlassCausticTexture() {
  const width = 512;
  const height = 192;
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = width;
  textureCanvas.height = height;
  const ctx = textureCanvas.getContext("2d");
  ctx.clearRect(0, 0, width, height);

  const wash = ctx.createRadialGradient(width * 0.45, height * 0.52, 0, width * 0.45, height * 0.52, width * 0.48);
  wash.addColorStop(0, "rgba(255,216,231,.36)");
  wash.addColorStop(0.42, "rgba(255,236,244,.2)");
  wash.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = "screen";
  ctx.lineCap = "round";
  ctx.lineWidth = 5;
  for (let i = 0; i < 4; i += 1) {
    const y = height * (0.35 + i * 0.08);
    const offset = i * 34;
    const stroke = ctx.createLinearGradient(0, y, width, y);
    stroke.addColorStop(0, "rgba(255,255,255,0)");
    stroke.addColorStop(0.42, "rgba(255,255,255,.28)");
    stroke.addColorStop(0.72, "rgba(255,196,219,.18)");
    stroke.addColorStop(1, "rgba(255,255,255,0)");
    ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.moveTo(width * 0.12, y + offset * 0.1);
    ctx.bezierCurveTo(width * 0.32, y - 28, width * 0.56, y + 34, width * 0.86, y - 8);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createSatinTexture() {
  const size = 256;
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = size;
  textureCanvas.height = size;
  const ctx = textureCanvas.getContext("2d");
  const image = ctx.createImageData(size, size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = (y * size + x) * 4;
      const grain = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const noise = grain - Math.floor(grain);
      const fiber = Math.sin(y * 0.52 + Math.sin(x * 0.075) * 2.4);
      const crossFiber = Math.sin((x + y) * 0.09) * 0.35;
      const value = Math.round(142 + fiber * 13 + crossFiber * 8 + (noise - 0.5) * 18);
      image.data[i] = value;
      image.data[i + 1] = value;
      image.data[i + 2] = value;
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(9.5, 2.2);
  texture.needsUpdate = true;
  return texture;
}

function createAlphaTexture() {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 512;
  textureCanvas.height = 4;
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function updateMaterialBlendTextures() {
  if (!bodyAlphaTexture) bodyAlphaTexture = createAlphaTexture();
  if (!glassAlphaTexture) glassAlphaTexture = createAlphaTexture();

  const start = clamp(1 - state.glassArea, 0.24, 0.88);
  const width = clamp(state.blendWidth, 0.04, 0.34);
  const fadeIn = clamp(start - width * 0.5, 0, 1);
  const fadeOut = clamp(start + width * 0.5, 0, 1);

  paintBlendTexture(bodyAlphaTexture, (t) => 1 - smoothstep(fadeIn, fadeOut, t));
  paintBlendTexture(glassAlphaTexture, (t) => smoothstep(fadeIn, fadeOut, t));
}

function paintBlendTexture(texture, alphaAt) {
  const textureCanvas = texture.image;
  const ctx = textureCanvas.getContext("2d");
  const image = ctx.createImageData(textureCanvas.width, textureCanvas.height);
  for (let y = 0; y < textureCanvas.height; y += 1) {
    for (let x = 0; x < textureCanvas.width; x += 1) {
      const t = x / (textureCanvas.width - 1);
      const alpha = Math.round(clamp(alphaAt(t), 0, 1) * 255);
      const offset = (y * textureCanvas.width + x) * 4;
      image.data[offset] = alpha;
      image.data[offset + 1] = alpha;
      image.data[offset + 2] = alpha;
      image.data[offset + 3] = alpha;
    }
  }
  ctx.putImageData(image, 0, 0);
  texture.needsUpdate = true;
}

function refreshRibbon() {
  if (!ribbonGroup) return;
  if (ribbonMesh) {
    ribbonMesh.geometry.dispose();
    ribbonMesh.material.dispose();
    ribbonGroup.remove(ribbonMesh);
    ribbonMesh = null;
  }
  if (glassBackMesh) {
    glassBackMesh.geometry.dispose();
    glassBackMesh.material.dispose();
    ribbonGroup.remove(glassBackMesh);
    glassBackMesh = null;
  }
  if (rimMesh) {
    rimMesh.geometry.dispose();
    rimMesh.material.dispose();
    ribbonGroup.remove(rimMesh);
    rimMesh = null;
  }
  if (glassMesh) {
    glassMesh.geometry.dispose();
    glassMesh.material.dispose();
    ribbonGroup.remove(glassMesh);
    glassMesh = null;
  }
  for (const line of edgeLines) {
    line.geometry.dispose();
    line.material.dispose();
    ribbonGroup.remove(line);
  }
  edgeLines = [];
  for (const glint of glassGlints) {
    glint.geometry.dispose();
    glint.material.dispose();
    ribbonGroup.remove(glint);
  }
  glassGlints = [];
  for (const cap of endCapMeshes) {
    cap.geometry.dispose();
    cap.material.dispose();
    ribbonGroup.remove(cap);
  }
  endCapMeshes = [];

  const built = buildRibbonGeometry();
  const glassSurface = state.material === "glass";
  if (glassSurface) updateMaterialBlendTextures();
  const primaryGeometry = glassSurface ? built.bodyGeometry : built.geometry;
  const glassLayerGeometry = glassSurface ? built.glassLayerGeometry : built.glassGeometry;
  if (glassSurface) {
    built.geometry.dispose();
    built.opaqueGeometry.dispose();
    built.glassGeometry.dispose();
  } else {
    built.bodyGeometry.dispose();
    built.glassLayerGeometry.dispose();
    built.opaqueGeometry.dispose();
  }
  if (causticMesh) {
    causticMesh.material.opacity = glassSurface ? 0.2 + state.glassArea * 0.24 : 0;
    causticMesh.scale.setScalar(glassSurface ? 1.02 + state.glassArea * 0.38 : 1);
  }
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    vertexColors: true,
    roughness: 0.66 - state.gloss * 0.14,
    roughnessMap: satinTexture,
    metalness: 0,
    clearcoat: 0.18 + state.gloss * 0.22,
    clearcoatRoughness: 0.58 - state.gloss * 0.12,
    sheen: 0.82,
    sheenRoughness: 0.86,
    sheenColor: 0xffd3e3,
    specularIntensity: 0.34,
    specularColor: 0xffffff,
    envMapIntensity: 0.38 + state.gloss * 0.26,
    ior: 1.43,
    reflectivity: 0.22,
    transmission: 0,
    thickness: state.thickness * 1.4,
    attenuationColor: new THREE.Color(glassSurface ? MATERIALS.frankly.pale : MATERIALS[state.material].pale),
    attenuationDistance: 1.6,
    bumpMap: satinTexture,
    bumpScale: 0.013,
    alphaMap: glassSurface ? bodyAlphaTexture : null,
    transparent: glassSurface,
    opacity: 1,
    side: THREE.DoubleSide,
    depthWrite: !glassSurface,
    blending: THREE.NormalBlending
  });
  ribbonMesh = new THREE.Mesh(primaryGeometry, material);
  ribbonMesh.castShadow = true;
  ribbonMesh.receiveShadow = true;
  ribbonMesh.renderOrder = glassSurface ? 2 : 0;
  ribbonGroup.add(ribbonMesh);

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: glassSurface ? 0xffdce8 : 0xfff7fb,
    vertexColors: true,
    roughness: glassSurface ? 0.86 : 0.48,
    roughnessMap: glassSurface ? satinTexture : null,
    metalness: 0,
    clearcoat: glassSurface ? 0.08 : 0.32,
    clearcoatRoughness: glassSurface ? 0.84 : 0.42,
    transmission: glassSurface ? 0.82 : 0.025,
    thickness: state.thickness * (glassSurface ? 18 : 1.2),
    ior: glassSurface ? 1.34 : 1.46,
    reflectivity: glassSurface ? 0.08 : 0.08,
    specularIntensity: glassSurface ? 0.18 : 0.18,
    specularColor: glassSurface ? 0xffb8cf : 0xffffff,
    envMapIntensity: glassSurface ? 0.42 : 0.28,
    attenuationColor: new THREE.Color(glassSurface ? "#ffc3d8" : "#ffd6e5"),
    attenuationDistance: glassSurface ? 0.42 : 0.9,
    alphaMap: glassSurface ? glassAlphaTexture : null,
    bumpMap: glassSurface ? satinTexture : null,
    bumpScale: glassSurface ? 0.0055 : 0,
    emissive: glassSurface ? 0xffc9dd : 0x000000,
    emissiveIntensity: glassSurface ? 0.018 : 0,
    transparent: true,
    opacity: glassSurface ? 0.54 : 0.038,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.NormalBlending
  });
  if (glassSurface) {
    const backMaterial = new THREE.MeshBasicMaterial({
      color: 0xff9dbb,
      transparent: true,
      alphaMap: glassAlphaTexture,
      opacity: 0.24,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.NormalBlending
    });
    glassBackMesh = new THREE.Mesh(glassLayerGeometry.clone(), backMaterial);
    glassBackMesh.renderOrder = 1;
    ribbonGroup.add(glassBackMesh);
  }
  glassMesh = new THREE.Mesh(glassLayerGeometry, glassMaterial);
  glassMesh.scale.setScalar(1.001);
  glassMesh.renderOrder = glassSurface ? 3 : 0;
  ribbonGroup.add(glassMesh);
  if (glassSurface) addGlassGlints(built.edgePoints);

  addSealedEndCaps(built.endProfiles);

  diagnostics.vertices = primaryGeometry.getAttribute("position").count;
  meshReadout.textContent = `${diagnostics.vertices} vertices`;
  shapeLabel.textContent = PRESETS[state.preset]?.label || "Drawn shape";
  renderStatus.textContent = "studio render";
  updateSpec();
}

function addSealedEndCaps(endProfiles) {
  const capPalette = [
    {
      face: MATERIALS[state.material].pink,
      lip: MATERIALS[state.material].edge,
      opacity: state.material === "glass" ? 0.95 : 0.82,
      transmission: 0
    },
    {
      face: state.material === "glass" ? "#FFF2F7" : state.material === "dusk" ? "#F8E7E8" : "#FFF4F8",
      lip: state.material === "glass" ? "#E8AABC" : "#F2C4D2",
      opacity: state.material === "glass" ? 0.2 : 0.3,
      transmission: state.material === "glass" ? 0.92 : 0.06
    }
  ];

  endProfiles.forEach((profile, index) => {
    const palette = capPalette[index];
    const capGeometry = buildEndCapGeometry(profile, index);
    const capMaterial = new THREE.MeshPhysicalMaterial({
      color: palette.face,
      roughness: state.material === "glass" ? 0.68 : index === 0 ? 0.34 : 0.46,
      metalness: 0,
      clearcoat: state.material === "glass" ? 0.035 : index === 0 ? 0.48 : 0.58,
      clearcoatRoughness: state.material === "glass" ? 0.82 : index === 0 ? 0.28 : 0.34,
      transmission: palette.transmission,
      thickness: state.thickness * (state.material === "glass" ? 12 : 5.5),
      ior: state.material === "glass" ? 1.34 : 1.5,
      reflectivity: state.material === "glass" ? 0.05 : index === 0 ? 0.26 : 0.34,
      specularIntensity: state.material === "glass" ? 0.055 : index === 0 ? 0.48 : 0.62,
      specularColor: state.material === "glass" ? 0xffc2d6 : 0xffffff,
      envMapIntensity: state.material === "glass" ? 0.16 : index === 0 ? 0.72 : 0.9,
      transparent: true,
      opacity: palette.opacity,
      side: THREE.DoubleSide,
      depthWrite: state.material === "glass" ? index === 0 : index === 0
    });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.renderOrder = 3;
    ribbonGroup.add(cap);
    endCapMeshes.push(cap);

    const lipCurve = new THREE.CatmullRomCurve3(profile, true, "centripetal", 0.35);
    const lipGeometry = new THREE.TubeGeometry(
      lipCurve,
      Math.max(42, profile.length * 4),
      Math.max(0.0045, state.thickness * 0.105),
      8,
      true
    );
    const lipMaterial = new THREE.MeshBasicMaterial({
      color: palette.lip,
      transparent: true,
      opacity: state.material === "glass" ? (index === 0 ? 0.018 : 0.024) : (index === 0 ? 0.025 : 0.035),
      depthWrite: false,
      blending: THREE.NormalBlending
    });
    const lip = new THREE.Mesh(lipGeometry, lipMaterial);
    lip.renderOrder = 4;
    ribbonGroup.add(lip);
    endCapMeshes.push(lip);
  });
}

function buildEndCapGeometry(profile, endIndex) {
  const center = profile
    .reduce((point, current) => point.add(current), new THREE.Vector3())
    .multiplyScalar(1 / profile.length);
  const positions = [center.x, center.y, center.z];
  const indices = [];

  for (const point of profile) {
    positions.push(point.x, point.y, point.z);
  }

  for (let i = 1; i <= profile.length; i += 1) {
    const next = i === profile.length ? 1 : i + 1;
    if (endIndex === 0) indices.push(0, next, i);
    else indices.push(0, i, next);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function addGlassGlints(edgePoints) {
  const tailStart = Math.max(0, Math.floor((1 - state.glassArea - 0.12) * edgePoints[0].length));
  const topLeft = edgePoints[0].slice(tailStart);
  const topRight = edgePoints[1].slice(tailStart);
  const underside = edgePoints[2].slice(tailStart);
  if (topLeft.length < 4 || topRight.length < 4 || underside.length < 4) return;

  const centerLine = topLeft.map((point, index) => (
    point.clone().lerp(topRight[index], 0.52)
  ));
  const innerShade = underside.map((point, index) => (
    point.clone().lerp(topRight[index], 0.18)
  ));
  const softPearl = topLeft.map((point, index) => (
    point.clone().lerp(topRight[index], 0.18)
  ));

  const frostMaterial = {
    color: 0xffc9dc,
    transparent: true,
    opacity: 0.115,
    depthWrite: false,
    blending: THREE.NormalBlending
  };
  const shadeMaterial = {
    color: 0xc9869a,
    transparent: true,
    opacity: 0.07,
    depthWrite: false,
    blending: THREE.MultiplyBlending
  };
  const pearlMaterial = {
    color: 0xffedf4,
    transparent: true,
    opacity: 0.055,
    depthWrite: false,
    blending: THREE.NormalBlending
  };
  const radius = Math.max(0.004, state.thickness * 0.11);
  const glintSources = [
    {points: centerLine, material: frostMaterial, scale: 1.65},
    {points: innerShade, material: shadeMaterial, scale: 1.1},
    {points: softPearl, material: pearlMaterial, scale: 0.82}
  ];
  for (const source of glintSources) {
    const curve = new THREE.CatmullRomCurve3(source.points);
    const geometry = new THREE.TubeGeometry(curve, Math.min(180, state.segments), radius * source.scale, 8, false);
    const glint = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial(source.material));
    glint.renderOrder = 4;
    ribbonGroup.add(glint);
    glassGlints.push(glint);
  }
}

function buildRibbonFrames(segmentCount) {
  const centers = [];
  const tangents = [];
  const frames = [];
  const drawnCurve = state.preset === "custom" ? createDrawnCurve() : null;
  for (let i = 0; i <= segmentCount; i += 1) {
    centers.push(centerAt(i / segmentCount, drawnCurve));
  }
  sanitizeRibbonCenters(centers, drawnCurve);
  for (let i = 0; i <= segmentCount; i += 1) {
    const previous = centers[Math.max(0, i - 1)];
    const next = centers[Math.min(segmentCount, i + 1)];
    tangents.push(next.clone().sub(previous).normalize());
  }

  let baseWidthAxis = fallbackWidthAxis(tangents[0]);
  let previousTangent = tangents[0].clone();
  for (let i = 0; i <= segmentCount; i += 1) {
    const t = i / segmentCount;
    const tangent = tangents[i];
    if (i > 0) {
      const rotationAxis = new THREE.Vector3().crossVectors(previousTangent, tangent);
      const axisLength = rotationAxis.length();
      if (axisLength > 0.000001) {
        const angle = Math.atan2(axisLength, clamp(previousTangent.dot(tangent), -1, 1));
        const transport = new THREE.Quaternion().setFromAxisAngle(rotationAxis.normalize(), angle);
        baseWidthAxis.applyQuaternion(transport);
      }
      baseWidthAxis.sub(tangent.clone().multiplyScalar(baseWidthAxis.dot(tangent)));
      if (baseWidthAxis.lengthSq() < 0.000001) baseWidthAxis = fallbackWidthAxis(tangent);
      else baseWidthAxis.normalize();
      previousTangent = tangent.clone();
    }

    const twistEase = 0.72 + Math.sin(Math.PI * t) * 0.28;
    const twistAngle = (state.twist * Math.PI * 1.5 * (t - 0.5) * twistEase) + Math.sin(t * Math.PI * 2) * 0.16;
    const twist = new THREE.Quaternion().setFromAxisAngle(tangent, twistAngle);
    const widthAxis = baseWidthAxis.clone().applyQuaternion(twist).normalize();
    const blade = new THREE.Vector3().crossVectors(tangent, widthAxis).normalize();
    frames.push({center: centers[i], tangent, widthAxis, blade});
  }
  return frames;
}

function sanitizeRibbonCenters(centers, drawnCurve) {
  if (!centers?.length || centers.length < 8) return centers;
  const spacing = clamp(Math.max(state.drawSpacing, BRAND_MIN_DRAW_SPACING), 0, 1);
  const xy = centers.map((center) => ({x: center.x, y: center.y}));
  const beforeIntersections = countPathIntersections(xy);
  const presetBoost = drawnCurve ? 1 : 1.16;
  const minDistance = state.width * (BRAND_CENTERLINE_CLEARANCE + spacing * 0.76) * presetBoost;
  let separated = separateDrawSelfOverlaps(
    xy,
    minDistance,
    Math.round((drawnCurve ? 4 : 7) + spacing * 4)
  );
  separated = relaxDrawPoints(separated, drawnCurve ? 2 : 3, drawnCurve ? 0.08 : 0.12);
  const afterIntersections = countPathIntersections(separated);
  if (beforeIntersections || afterIntersections < beforeIntersections) {
    diagnostics.shapeCorrections += Math.max(1, beforeIntersections - afterIntersections);
  }
  separated.forEach((point, index) => {
    centers[index].x = point.x;
    centers[index].y = point.y;
  });
  return centers;
}

function fallbackWidthAxis(tangent) {
  const cameraAxis = new THREE.Vector3(0, 0, 1);
  const upAxis = new THREE.Vector3(0, 1, 0);
  const seed = Math.abs(tangent.dot(cameraAxis)) < 0.92 ? cameraAxis : upAxis;
  return new THREE.Vector3().crossVectors(tangent, seed).normalize();
}

function buildRibbonGeometry() {
  const positions = [];
  const colors = [];
  const bodyColors = [];
  const glassColors = [];
  const uvs = [];
  const indices = [];
  const opaqueIndices = [];
  const glassIndices = [];
  const crossSections = [];
  const edgePoints = [[], [], [], []];
  const segmentCount = state.segments;
  const profileSteps = state.profileSteps;
  const frames = buildRibbonFrames(segmentCount);

  for (let i = 0; i <= segmentCount; i += 1) {
    const t = i / segmentCount;
    const {center: p, widthAxis, blade} = frames[i];

    const endTaper = 0.9 + 0.1 * Math.sin(Math.PI * t);
    const halfWidth = state.width * endTaper * 0.5;
    const halfThickness = state.thickness * 0.5;
    const profile = [];

    for (let j = 0; j <= profileSteps; j += 1) {
      const u = -1 + (j / profileSteps) * 2;
      const crown = Math.sin((j / profileSteps) * Math.PI) * halfThickness * 0.16;
      profile.push({
        point: p.clone()
          .add(widthAxis.clone().multiplyScalar(u * halfWidth))
          .add(blade.clone().multiplyScalar(halfThickness + crown)),
        u,
        shade: 1.02
      });
    }

    profile.push({
      point: p.clone()
        .add(widthAxis.clone().multiplyScalar(halfWidth + halfThickness * 0.2)),
      u: 1,
      shade: 0.74
    });

    for (let j = profileSteps; j >= 0; j -= 1) {
      const u = -1 + (j / profileSteps) * 2;
      const crown = Math.sin((j / profileSteps) * Math.PI) * halfThickness * 0.04;
      profile.push({
        point: p.clone()
          .add(widthAxis.clone().multiplyScalar(u * halfWidth))
          .add(blade.clone().multiplyScalar(-halfThickness - crown)),
        u,
        shade: 0.46
      });
    }

    profile.push({
      point: p.clone()
        .add(widthAxis.clone().multiplyScalar(-halfWidth - halfThickness * 0.2)),
      u: -1,
      shade: 0.72
    });

    crossSections.push({profile, t});
    edgePoints[0].push(profile[0].point);
    edgePoints[1].push(profile[profileSteps].point);
    edgePoints[2].push(profile[profileSteps + 2].point);
    edgePoints[3].push(profile[profileSteps * 2 + 2].point);
  }

  const profileCount = crossSections[0].profile.length;
  const glassSurface = state.material === "glass";
  const frostedTailStart = glassSurface ? clamp(1 - state.glassArea, 0.24, 0.88) : 0.74;
  const blendReach = clamp(state.blendWidth, 0.04, 0.34);
  const glassBlendStart = glassSurface ? Math.max(0, frostedTailStart - blendReach) : frostedTailStart;
  const opaqueBlendEnd = glassSurface ? Math.min(1, frostedTailStart + blendReach) : frostedTailStart;

  function colorAt(t, shade = 1, u = 0, materialKey = state.material, forceGlassTint = false) {
    const mat = MATERIALS[materialKey];
    const glassTint = forceGlassTint;
    const mixValue = glassTint ? Math.min(state.pinkMix, 0.56) : state.pinkMix;
    const headBias = 1 - smoothstep(0.6, 1, t);
    const glassTail = glassTint ? smoothstep(frostedTailStart - 0.08, frostedTailStart + 0.28, t) : 0;
    const tailWhiten = smoothstep(0.74, 1, t) * (glassTint ? 0.018 : 0.2) + glassTail * 0.11;
    const satinFiber = (
      Math.sin(t * 168 + u * 3.2) * 0.018
      + Math.sin(t * 341 - u * 4.6) * 0.01
    ) * (glassTint ? 0.34 : 1);
    const pinkWeight = clamp(headBias * mixValue + 0.04 * Math.sin(t * Math.PI * 2) - tailWhiten - glassTail * 0.34 + satinFiber * 0.8, 0, 1);
    const edgeLight = (
      Math.pow(Math.abs(u), 4) * 0.075
      + smoothstep(0.74, 1, t) * 0.12
    ) * (glassTint ? 0.22 : 1);
    const studioBand = Math.exp(-Math.pow((u - 0.42) / 0.28, 2))
      * smoothstep(0.08, 0.3, t)
      * (1 - smoothstep(0.56, 0.82, t))
      * (glassTint ? 0.025 : 0.16);
    const tailPearl = Math.exp(-Math.pow(u / 0.6, 2))
      * smoothstep(0.72, 0.96, t)
      * (glassTint ? 0.018 : 0.08);
    const refractShade = glassTint
      ? (
        Math.exp(-Math.pow((Math.abs(u) - 0.78) / 0.18, 2)) * 0.13
        + Math.exp(-Math.pow((u + 0.16) / 0.35, 2)) * smoothstep(0.16, 0.76, t) * 0.052
      )
      : 0;
    const base = mixColor(mat.pale, mat.pink, pinkWeight);
    const shadeColor = mixColor(mat.shade, "#ffffff", clamp(shade + edgeLight * 0.35 + satinFiber - refractShade, 0, 1));
    const frostColor = glassTint ? "#FFDCE9" : "#fffafd";
    const frostAmount = glassTint ? 0.03 + glassTail * 0.08 : 0.28;
    return base
      .multiply(shadeColor)
      .lerp(new THREE.Color(frostColor), clamp(edgeLight + studioBand + tailPearl, 0, frostAmount));
  }

  function pushVertex(v, t, u, shade) {
    const index = positions.length / 3;
    positions.push(v.x, v.y, v.z);
    const displayColor = colorAt(t, shade, u, state.material, glassSurface);
    const bodyColor = colorAt(t, shade, u, "frankly", false);
    const glassColor = colorAt(t, shade, u, "glass", true);
    colors.push(displayColor.r, displayColor.g, displayColor.b);
    bodyColors.push(bodyColor.r, bodyColor.g, bodyColor.b);
    glassColors.push(glassColor.r, glassColor.g, glassColor.b);
    uvs.push(t, (u + 1) * 0.5);
    return index;
  }

  for (const section of crossSections) {
    for (const vertex of section.profile) {
      pushVertex(vertex.point, section.t, vertex.u, vertex.shade);
    }
  }

  for (let i = 0; i < crossSections.length - 1; i += 1) {
    const current = i * profileCount;
    const next = (i + 1) * profileCount;
    for (let j = 0; j < profileCount; j += 1) {
      const jNext = (j + 1) % profileCount;
      const a = current + j;
      const b = next + j;
      const c = next + jNext;
      const d = current + jNext;
      const segmentT = (i + 0.5) / (crossSections.length - 1);
      indices.push(a, b, c, a, c, d);
      if (segmentT >= glassBlendStart) {
        glassIndices.push(a, b, c, a, c, d);
      }
      if (segmentT <= opaqueBlendEnd) {
        opaqueIndices.push(a, b, c, a, c, d);
      }
    }
  }

  const firstBase = 0;
  const lastBase = (crossSections.length - 1) * profileCount;
  for (let j = 1; j < profileCount - 1; j += 1) {
    indices.push(firstBase, firstBase + j + 1, firstBase + j);
    indices.push(lastBase, lastBase + j, lastBase + j + 1);
    opaqueIndices.push(firstBase, firstBase + j + 1, firstBase + j);
    glassIndices.push(lastBase, lastBase + j, lastBase + j + 1);
  }

  const endProfiles = [
    crossSections[0].profile.map((vertex) => vertex.point.clone()),
    crossSections[crossSections.length - 1].profile.map((vertex) => vertex.point.clone())
  ];

  const geometry = makeIndexedGeometry(indices, positions, colors, uvs);
  const opaqueGeometry = makeIndexedGeometry(opaqueIndices.length ? opaqueIndices : indices, positions, colors, uvs);
  const glassGeometry = makeIndexedGeometry(glassIndices.length ? glassIndices : indices, positions, colors, uvs);
  const bodyGeometry = makeIndexedGeometry(indices, positions, bodyColors, uvs);
  const glassLayerGeometry = makeIndexedGeometry(indices, positions, glassColors, uvs);
  return {geometry, opaqueGeometry, glassGeometry, bodyGeometry, glassLayerGeometry, edgePoints, endProfiles};
}

function makeIndexedGeometry(indexList, positions, colors, uvs) {
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indexList);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function smoothstep(edge0, edge1, value) {
  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}

function centerAt(t, drawnCurve = null) {
  const curl = state.curl;
  const depth = state.depth;
  const lift = state.lift;
  if (drawnCurve) {
    const point = drawnCurve.getPoint(t);
    const z = (
      Math.sin(t * Math.PI * 2 * clamp(curl, 0.45, 1.8) + 0.2) * 0.34
      + Math.sin(t * Math.PI) * 0.18
    ) * depth;
    return new THREE.Vector3(point.x, point.y, z);
  }
  if (state.preset === "ripple") {
    const x = -1.78 + t * 3.56;
    const y = Math.sin(t * Math.PI * 2.32 - 0.42) * (0.52 + lift * 0.18) + Math.sin(t * Math.PI) * 0.12;
    const z = Math.cos(t * Math.PI * 2 * clamp(curl, 0.45, 1.25) + 0.18) * depth * 0.72;
    return new THREE.Vector3(x, y + lift * 0.32, z);
  }
  if (state.preset === "arc") {
    const x = -1.9 + t * 3.8;
    const y = 0.48 - Math.sin(t * Math.PI) * (0.98 + lift * 0.18) + lift * 0.35;
    const z = Math.sin(t * Math.PI * 1.08 - 0.16) * depth * 0.78;
    return new THREE.Vector3(x, y, z);
  }
  if (state.preset === "coil") {
    const phase = -0.82 + t * Math.PI * 2 * curl * 1.18;
    const radius = 1.02 + Math.sin(t * Math.PI) * 0.18 - t * 0.12;
    const x = Math.sin(phase) * radius;
    const y = 1.58 - t * 3.16 + Math.sin(t * Math.PI * 2) * 0.14 + lift * 0.44;
    const z = Math.cos(phase) * depth * (0.74 + Math.sin(t * Math.PI) * 0.18);
    return new THREE.Vector3(x, y, z);
  }
  if (state.preset === "cascade") {
    const phase = 0.64 + t * Math.PI * 2 * (0.48 + curl * 0.58);
    const x = Math.sin(phase) * (0.42 + Math.sin(t * Math.PI) * 0.24) + (t - 0.5) * 0.22;
    const y = 1.9 - t * 3.8 + Math.sin(t * Math.PI * 2.4) * 0.18 + lift * 0.42;
    const z = Math.cos(phase) * depth * 0.62 + (t - 0.5) * depth * 0.18;
    return new THREE.Vector3(x, y, z);
  }
  if (state.preset === "halo") {
    const turns = Math.min(0.92, 0.66 + clamp(curl, 0.35, 1.45) * 0.2);
    const phase = -0.36 + t * Math.PI * 2 * turns;
    const radius = 1.1 + Math.sin(t * Math.PI * 1.6) * 0.08;
    const x = Math.sin(phase) * radius;
    const y = Math.cos(phase) * radius * 0.5 + Math.sin(t * Math.PI * 2.1) * 0.08 + lift * 0.35 + (t - 0.5) * 0.28;
    const z = Math.sin(t * Math.PI * 1.24 - 0.3) * depth * 0.58 + Math.cos(phase) * depth * 0.22;
    return new THREE.Vector3(x, y, z);
  }
  if (state.preset === "fold") {
    const phase = 0.2 + t * Math.PI * 2 * curl;
    const radius = 0.76 + Math.sin(t * Math.PI) * 0.2;
    const x = Math.sin(phase) * radius + (t - 0.5) * 0.38;
    const y = 1.62 - t * 3.24 + Math.sin(t * Math.PI * 4.1) * 0.15 + lift * 0.36;
    const z = Math.sin(t * Math.PI * 2.65 + 0.6) * depth * 0.72;
    return new THREE.Vector3(x, y, z);
  }
  if (state.preset === "twist") {
    const phase = -0.35 + t * Math.PI * 2 * curl;
    const y = 1.95 - t * 3.9;
    const x = Math.sin(phase) * 0.26;
    const z = Math.cos(phase) * depth * 0.44 + Math.sin(t * Math.PI) * 0.16;
    return new THREE.Vector3(x, y + lift * 0.45, z);
  }
  if (state.preset === "sweep") {
    const x = -1.85 + t * 3.7;
    const y = -0.1 - Math.sin(t * Math.PI) * (0.75 + lift * 0.25) + lift * 0.25;
    const z = Math.sin(t * Math.PI * 1.12 - 0.55) * depth;
    return new THREE.Vector3(x, y, z);
  }
  if (state.preset === "loop") {
    const turns = Math.min(0.94, 0.64 + clamp(curl, 0.35, 1.6) * 0.2);
    const phase = -0.52 + t * Math.PI * 2 * turns;
    const radius = 1.0 + Math.sin(t * Math.PI) * 0.22;
    const x = Math.sin(phase) * radius;
    const y = 1.42 - t * 2.84 + Math.sin(t * Math.PI * 1.75) * 0.18 + lift * 0.45;
    const z = Math.cos(phase) * depth * 0.82;
    return new THREE.Vector3(x, y, z);
  }
  const phase = 0.22 + t * Math.PI * 2 * curl;
  const radius = 0.72 + Math.sin(t * Math.PI) * 0.22;
  const x = Math.sin(phase) * radius + (t - 0.5) * 0.28;
  const y = 1.58 - t * 3.25 + Math.sin(t * Math.PI * 2.2) * 0.12 + lift * 0.38;
  const z = Math.cos(phase) * depth;
  return new THREE.Vector3(x, y, z);
}

function resize() {
  if (!renderer || !camera) return;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  const aspect = width / height;
  camera.position.z = aspect < 0.75 ? 9.4 : 7.1;
  camera.updateProjectionMatrix();
  resizeShapeCanvas();
  renderShapeGuide();
}

function animate() {
  frameId = requestAnimationFrame(animate);
  diagnostics.frames += 1;
  const motionSpeed = clamp(state.motionSpeed || 0.82, 0.1, 2.2);
  const motionDrift = clamp(state.motionDrift || 0.54, 0, 1);
  autoPhase += 0.0048 * motionSpeed;
  if (ribbonGroup) {
    const floatAmount = state.autoRotate ? motionDrift : 0;
    ribbonGroup.rotation.x = viewRotation.x + Math.sin(autoPhase * 0.7) * 0.025 * floatAmount;
    ribbonGroup.rotation.y = viewRotation.y + Math.sin(autoPhase) * 0.085 * floatAmount;
    ribbonGroup.rotation.z = viewRotation.z + Math.sin(autoPhase * 0.44) * 0.018 * floatAmount;
    ribbonGroup.position.y = canvas.clientWidth / Math.max(1, canvas.clientHeight) < 0.75 ? 0.1 : 0;
    ribbonGroup.position.y += Math.sin(autoPhase * 0.82) * 0.035 * floatAmount;
    ribbonGroup.scale.setScalar(canvas.clientWidth / Math.max(1, canvas.clientHeight) < 0.75 ? 0.88 : 0.98);
  }
  renderer.render(scene, camera);
}

function startDrag(event) {
  canvas.setPointerCapture(event.pointerId);
  drag = {x: event.clientX, y: event.clientY, startX: viewRotation.x, startY: viewRotation.y};
  state.autoRotate = false;
  syncPressed();
  updateSpec();
}

function moveDrag(event) {
  if (!drag) return;
  const dx = (event.clientX - drag.x) / Math.max(240, canvas.clientWidth);
  const dy = (event.clientY - drag.y) / Math.max(240, canvas.clientHeight);
  viewRotation.y = drag.startY + dx * Math.PI;
  viewRotation.x = clamp(drag.startX + dy * Math.PI * 0.72, -0.95, 0.95);
}

function endDrag() {
  drag = null;
}

function currentSnapshot(compact = false) {
  resizeShapeCanvas();
  const values = {};
  SNAPSHOT_STATE_KEYS.forEach((key) => {
    values[key] = state[key];
  });
  const sourcePoints = state.drawSourcePoints?.length
    ? resampleDrawPoints(state.drawSourcePoints, compact ? 28 : 72)
    : [];
  const anchors = state.shapeAnchors?.length
    ? state.shapeAnchors
    : (sourcePoints.length ? createShapeAnchors(sourcePoints, state.drawAnchorCount) : []);
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    values,
    view: viewRotation ? {
      x: Number(viewRotation.x.toFixed(4)),
      y: Number(viewRotation.y.toFixed(4)),
      z: Number(viewRotation.z.toFixed(4))
    } : null,
    shape: state.preset === "custom" && (sourcePoints.length || anchors.length) ? {
      editor: shapeAnchorMode ? "anchors" : "line",
      source: normalizeShapePoints(sourcePoints),
      anchors: normalizeShapePoints(anchors)
    } : null
  };
}

function normalizeShapePoints(points) {
  if (!points?.length) return [];
  const rect = shapeCanvas.getBoundingClientRect();
  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);
  return points.map((point) => ({
    x: Number(clamp(point.x / width, 0, 1).toFixed(4)),
    y: Number(clamp(point.y / height, 0, 1).toFixed(4))
  }));
}

function denormalizeShapePoints(points) {
  if (!points?.length) return [];
  resizeShapeCanvas();
  const rect = shapeCanvas.getBoundingClientRect();
  const width = Math.max(1, rect.width || shapeCanvas.width || 1);
  const height = Math.max(1, rect.height || shapeCanvas.height || 1);
  return clampSourcePoints(points.map((point) => ({
    x: point.x * width,
    y: point.y * height
  })));
}

function applyRibbonSnapshot(snapshot, shouldRefresh = true) {
  if (!snapshot?.values) return false;
  SNAPSHOT_STATE_KEYS.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(snapshot.values, key)) state[key] = snapshot.values[key];
  });
  if (!PRESETS[state.preset]) state.preset = "signal";
  if (!MATERIALS[state.material]) state.material = "frankly";
  state.drawAnchorCount = Math.round(clamp(Number(state.drawAnchorCount) || 9, 5, 14));
  state.width = clamp(Number(state.width) || PRESETS.signal.width, 0.18, 0.62);
  state.thickness = clamp(Number(state.thickness) || PRESETS.signal.thickness, 0.015, 0.09);
  state.curl = clamp(Number(state.curl) || PRESETS.signal.curl, 0.35, 2.25);
  state.depth = clamp(Number(state.depth) || PRESETS.signal.depth, 0.04, 1.35);
  state.twist = clamp(Number(state.twist) || PRESETS.signal.twist, 0, 3.2);
  state.lift = clamp(Number(state.lift) || 0, -0.8, 0.8);
  state.glassArea = clamp(Number(state.glassArea) || 0.46, 0.12, 0.74);
  state.blendWidth = clamp(Number(state.blendWidth) || 0.2, 0.04, 0.34);
  state.pinkMix = clamp(Number(state.pinkMix) || 0.94, 0.08, 1);
  state.gloss = clamp(Number(state.gloss) || 0.64, 0.05, 1);
  state.drawSmoothing = clamp(Math.max(Number(state.drawSmoothing) || 0.9, BRAND_MIN_DRAW_SMOOTHING), 0, 1);
  state.drawGrip = clamp(Number(state.drawGrip) || 0.58, 0, 1);
  state.drawBend = clamp(Math.max(Number(state.drawBend) || 0.86, BRAND_MIN_DRAW_BEND), 0, 1);
  state.drawSpacing = clamp(Math.max(Number(state.drawSpacing) || 0.84, BRAND_MIN_DRAW_SPACING), 0, 1);
  state.motionSpeed = clamp(Number(state.motionSpeed) || 0.82, 0.1, 2.2);
  state.motionDrift = clamp(Number(state.motionDrift) || 0.54, 0, 1);
  state.placeholderOpacity = clamp(Number(state.placeholderOpacity) || 0.38, 0.08, 0.78);
  state.placeholderFit = state.placeholderFit === "contain" ? "contain" : "cover";
  state.autoRotate = Boolean(state.autoRotate);

  const shape = snapshot.shape;
  if (shape?.source?.length || shape?.anchors?.length) {
    const anchors = denormalizeShapePoints(shape.anchors);
    const source = denormalizeShapePoints(shape.source);
    state.preset = "custom";
    shapeAnchorMode = shape.editor === "anchors";
    state.shapeAnchors = anchors.length ? anchors : createShapeAnchors(source, state.drawAnchorCount);
    state.drawSourcePoints = source.length
      ? resampleDrawPoints(source, 132)
      : sourcePointsFromAnchors(state.shapeAnchors);
    if (shapeAnchorMode && state.shapeAnchors?.length) {
      state.drawSourcePoints = sourcePointsFromAnchors(state.shapeAnchors);
    }
    enforceBrandShapeDefaults();
    state.drawSourcePoints = sanitizeEditableSource(state.drawSourcePoints);
    state.shapeAnchors = createShapeAnchors(state.drawSourcePoints, state.drawAnchorCount);
    state.drawnPath = fitDrawnPath(state.drawSourcePoints);
  } else {
    shapeAnchorMode = false;
    state.shapeAnchors = null;
    if (state.preset !== "custom") {
      state.drawnPath = null;
      state.drawSourcePoints = null;
    }
  }

  if (snapshot.view && THREE) {
    viewRotation = new THREE.Euler(snapshot.view.x || 0, snapshot.view.y || 0, snapshot.view.z || 0, "XYZ");
  } else if (THREE && PRESETS[state.preset]) {
    const preset = PRESETS[state.preset];
    viewRotation = new THREE.Euler(preset.viewX, preset.viewY, preset.viewZ, "XYZ");
  }

  shapeDrawActive = false;
  shapePointerActive = false;
  shapeEditActive = false;
  editDrag = null;
  shapeHoverIndex = null;
  drawnShapePoints = [];
  shapeCanvas.setAttribute("aria-hidden", "true");
  document.querySelector(".stage")?.classList.remove("is-drawing", "is-editing");
  shapeStageActions.hidden = true;
  updatePlaceholderImage();
  if (shouldRefresh) {
    syncControls();
    renderShapeGuide();
    refreshRibbon();
    syncSnapshotControls();
  }
  return true;
}

function encodeSnapshot(snapshot) {
  const json = JSON.stringify(snapshot);
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeSnapshot(encoded) {
  try {
    const padded = encoded.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(encoded.length / 4) * 4, "=");
    return JSON.parse(decodeURIComponent(escape(atob(padded))));
  } catch (error) {
    return null;
  }
}

function snapshotFromHash() {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  const encoded = params.get(SHARE_HASH_KEY);
  return encoded ? decodeSnapshot(encoded) : null;
}

function applySnapshotFromHash(shouldRefresh = true) {
  const snapshot = snapshotFromHash();
  if (!snapshot) return false;
  return applyRibbonSnapshot(snapshot, shouldRefresh);
}

function loadStoredSnapshots() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SNAPSHOT_STORAGE_KEY) || "[]");
    savedSnapshots = Array.isArray(parsed) ? parsed.filter((snapshot) => snapshot?.values).slice(0, SNAPSHOT_LIMIT) : [];
  } catch (error) {
    savedSnapshots = [];
  }
  syncSnapshotControls();
}

function persistSnapshots() {
  try {
    localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(savedSnapshots.slice(0, SNAPSHOT_LIMIT)));
  } catch (error) {
    showToast("Snapshots could not be saved.");
  }
}

function captureSnapshot() {
  savedSnapshots = [currentSnapshot(false), ...savedSnapshots].slice(0, SNAPSHOT_LIMIT);
  persistSnapshots();
  syncSnapshotControls();
  updateSpec();
  showToast("Snapshot captured.");
}

function loadSnapshot(index) {
  const snapshot = savedSnapshots[index];
  if (!snapshot) {
    showToast("Empty snapshot.");
    return;
  }
  applyRibbonSnapshot(snapshot);
  showToast(`Snapshot ${index + 1} loaded.`);
}

function clearSnapshots() {
  savedSnapshots = [];
  persistSnapshots();
  syncSnapshotControls();
  updateSpec();
  showToast("Snapshots cleared.");
}

function syncSnapshotControls() {
  if (!snapshotReadout || !snapshotSlotButtons.length) return;
  snapshotSlotButtons.forEach((button, index) => {
    const snapshot = savedSnapshots[index];
    const label = snapshot ? snapshotLabel(snapshot, index) : `${index + 1} empty`;
    button.textContent = label;
    button.disabled = !snapshot;
  });
  snapshotReadout.textContent = savedSnapshots.length
    ? `${savedSnapshots.length} local variant${savedSnapshots.length === 1 ? "" : "s"} ready`
    : "No snapshots yet";
}

function snapshotLabel(snapshot, index) {
  const presetLabel = PRESETS[snapshot.values?.preset]?.label || "Ribbon";
  return `${index + 1} ${presetLabel.replace(/\s.+$/, "")}`;
}

async function writeClipboard(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      showToast(successMessage);
    } catch (copyError) {
      showToast("Copy failed.");
    }
    document.body.removeChild(textarea);
  }
}

function createPromptText() {
  const presetLabel = PRESETS[state.preset]?.label || "custom drawn";
  const shapePhrase = state.preset === "custom"
    ? `custom drawn ribbon path with ${state.shapeAnchors?.length || state.drawAnchorCount} soft control anchors`
    : `${presetLabel} ribbon form`;
  const materialPhrase = state.material === "glass"
    ? `Frankly satin pink body blending into a transparent matte glass tail, about ${Math.round(state.glassArea * 100)} percent glass area with a soft ${Math.round(state.blendWidth * 100)} percent transition.`
    : `opaque Frankly satin pink body with a pale frosted tail and a soft material transition.`;
  const motionPhrase = state.autoRotate
    ? `designed to feel slow, floating and website-ready`
    : `posed as a still studio render`;
  return [
    `Create a premium 3D Frankly ribbon visual: ${shapePhrase}.`,
    materialPhrase,
    `The surface should feel satin, soft-touch and refined, with sealed flat ribbon ends, subtle thickness and no hard white shader outline on the edges.`,
    `Use a pale limestone or transparent background, very soft shadows, gentle studio highlights and a calm editorial composition.`,
    `${motionPhrase}. Avoid plastic shine, harsh contrast, jagged twists, open hollow ends and overly clear glass.`
  ].join(" ");
}

function copyPrompt() {
  writeClipboard(createPromptText(), "Prompt copied.");
}

function copyShareLink() {
  const snapshot = currentSnapshot(true);
  const url = new URL(window.location.href);
  url.hash = `${SHARE_HASH_KEY}=${encodeSnapshot(snapshot)}`;
  writeClipboard(url.toString(), "Link copied.");
}

function updateSpec() {
  const glassSurface = state.material === "glass";
  const spec = {
    system: "frankly-ribbon-lab-v0",
    preset: state.preset,
    material: state.material,
    ui: {
      controls: advancedControls ? "advanced" : "simple"
    },
    geometry: {
      width: Number(state.width.toFixed(3)),
      thickness: Number(state.thickness.toFixed(3)),
      curl: Number(state.curl.toFixed(3)),
      depth: Number(state.depth.toFixed(3)),
      twist: Number(state.twist.toFixed(3)),
      lift: Number(state.lift.toFixed(3)),
      blendWidth: Number(state.blendWidth.toFixed(3)),
      segments: state.segments,
      profileSteps: state.profileSteps
    },
    surface: {
      glassArea: Number(state.glassArea.toFixed(3)),
      pinkMix: Number(state.pinkMix.toFixed(3)),
      gloss: Number(state.gloss.toFixed(3)),
      materialLayers: glassSurface
        ? ["Frankly satin pink body", "smooth material blend zone", "transparent matte glass tail", "subtle refractive inner thickness", "soft sealed end caps"]
        : ["satin base", "frosted tail", "sealed end caps"],
      promptReference: glassSurface
        ? "Frankly satin pink ribbon body smoothly blending into transparent matte glass"
        : "satin surface fading from opaque to frosted glass in one direction"
    },
    shape: {
      source: state.preset === "custom" && state.drawnPath ? "drawn" : "preset",
      editor: shapeAnchorMode ? "anchors" : "line",
      points: state.drawnPath?.length || 0,
      smoothing: Number(state.drawSmoothing.toFixed(3)),
      grip: Number(state.drawGrip.toFixed(3)),
      anchors: state.shapeAnchors?.length || 0,
      flow: Number(state.drawBend.toFixed(3)),
      spacing: Number(state.drawSpacing.toFixed(3)),
      editablePoints: state.drawSourcePoints?.length || 0,
      brandSafety: "minimum smoothness and no-overlap separation",
      corrections: diagnostics.shapeCorrections
    },
    motion: {
      enabled: state.autoRotate,
      speed: Number(state.motionSpeed.toFixed(3)),
      drift: Number(state.motionDrift.toFixed(3)),
      interaction: "dragging the canvas pauses motion and sets the view"
    },
    placeholder: {
      visible: state.placeholderVisible,
      opacity: Number(state.placeholderOpacity.toFixed(3)),
      fit: state.placeholderFit
    },
    workflow: {
      snapshots: savedSnapshots.length,
      share: "Copy link stores a compact local ribbon state in the URL hash",
      prompt: "Copy prompt exports a material/look brief for render tools"
    }
  };
  specOutput.textContent = JSON.stringify(spec, null, 2);
  window.__franklyRibbonSpec = spec;
  window.__franklyRibbonDiagnostics = diagnostics;
}

function copySpec() {
  writeClipboard(specOutput.textContent, "Spec copied.");
}

function exportPng() {
  if (!renderer || !camera) {
    showToast("3D render is not ready.");
    return;
  }
  const width = Math.max(1, Math.floor(canvas.clientWidth));
  const height = Math.max(1, Math.floor(canvas.clientHeight));
  const pixelRatio = renderer.getPixelRatio();
  const exportScale = 3;
  renderer.setPixelRatio(1);
  renderer.setSize(width * exportScale, height * exportScale, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `frankly-ribbon-${state.preset}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  renderer.setPixelRatio(pixelRatio);
  resize();
  showToast("3x PNG exported.");
}

function sampleCanvasPixels() {
  try {
    const ctx = document.createElement("canvas").getContext("2d");
    const sampleWidth = 80;
    const sampleHeight = 54;
    ctx.canvas.width = sampleWidth;
    ctx.canvas.height = sampleHeight;
    ctx.drawImage(canvas, 0, 0, sampleWidth, sampleHeight);
    const data = ctx.getImageData(0, 0, sampleWidth, sampleHeight).data;
    let nonTransparent = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 16) nonTransparent += 1;
    }
    diagnostics.nonBackgroundPixels = nonTransparent;
    updateSpec();
  } catch (error) {
    diagnostics.nonBackgroundPixels = -1;
  }
}

function bindDrawOnlyControls() {
  bindPanelTabs();
  bindAdvancedToggle();

  drawShapeButton.addEventListener("click", toggleShapeDrawing);
  editShapeButton.addEventListener("click", toggleShapeEditing);
  polishShapeButton.addEventListener("click", polishDrawnShape);
  shapeAnchorModeButton.addEventListener("click", toggleShapeAnchorMode);
  shapeSmoothButton.addEventListener("click", () => applyShapeTool("smooth"));
  shapeSeparateButton.addEventListener("click", () => applyShapeTool("separate"));
  shapeAirButton.addEventListener("click", () => applyShapeTool("air"));
  shapeTightenButton.addEventListener("click", () => applyShapeTool("tighten"));
  useShapeButton.addEventListener("click", () => useDrawnShape(false));
  clearShapeButton.addEventListener("click", clearDrawnShape);
  stageUseShapeButton.addEventListener("click", () => useDrawnShape(false));
  stageEditShapeButton.addEventListener("click", toggleShapeEditing);
  stagePolishShapeButton.addEventListener("click", polishDrawnShape);
  stageClearShapeButton.addEventListener("click", clearDrawnShape);
  motionToggleButton.addEventListener("click", toggleMotion);
  motionCalmButton.addEventListener("click", () => applyMotionPreset("calm"));
  motionStudioButton.addEventListener("click", () => applyMotionPreset("studio"));
  motionCinematicButton.addEventListener("click", () => applyMotionPreset("cinematic"));
  shapeCanvas.addEventListener("pointerdown", startShapeStroke);
  shapeCanvas.addEventListener("pointermove", moveShapeStroke);
  shapeCanvas.addEventListener("pointerup", endShapeStroke);
  shapeCanvas.addEventListener("pointercancel", endShapeStroke);
  shapeCanvas.addEventListener("lostpointercapture", endShapeStroke);
  placeholderFile.addEventListener("change", loadPlaceholderImage);
  placeholderOpacity.addEventListener("input", updatePlaceholderOpacity);
  placeholderFit.addEventListener("click", togglePlaceholderFit);
  clearPlaceholder.addEventListener("click", clearPlaceholderImage);
  document.getElementById("copy-spec").addEventListener("click", copySpec);
  copyPromptButton.addEventListener("click", copyPrompt);
  copyLinkButton.addEventListener("click", copyShareLink);
  document.getElementById("export-png").addEventListener("click", exportPng);
  snapshotCaptureButton.addEventListener("click", captureSnapshot);
  snapshotClearButton.addEventListener("click", clearSnapshots);
  snapshotSlotButtons.forEach((button) => {
    button.addEventListener("click", () => loadSnapshot(Number(button.dataset.snapshotSlot)));
  });
  window.addEventListener("hashchange", () => {
    if (applySnapshotFromHash()) showToast("Shared state loaded.");
  });
  window.addEventListener("resize", () => {
    resizeShapeCanvas();
    renderShapeGuide();
  });
}

function startDrawOnlyFallback(error) {
  console.error(error);
  buildControls();
  setAdvancedControls(false);
  setControlPanel("design");
  bindDrawOnlyControls();
  loadStoredSnapshots();
  const loadedFromHash = applySnapshotFromHash(false);
  syncControls();
  resizeShapeCanvas();
  updatePlaceholderImage();
  renderShapeGuide();
  updateSpec();
  fallback.hidden = false;
  fallback.textContent = "3D-renderen kunne ikke starte her, men draw-laget virker. Brug den lokale server for fuld ribbon-render.";
  renderStatus.textContent = "draw layer";
  meshReadout.textContent = "draw ready";
  if (loadedFromHash) showToast("Shared state loaded.");
}

async function bootRibbonLab() {
  try {
    THREE = await import("./assets/three.module.min.js");
    viewRotation = new THREE.Euler(PRESETS.signal.viewX, PRESETS.signal.viewY, PRESETS.signal.viewZ, "XYZ");
    buildControls();
    setAdvancedControls(false);
    setControlPanel("design");
    bindControls();
    setupScene();
    loadStoredSnapshots();
    const loadedFromHash = applySnapshotFromHash(false);
    syncControls();
    updatePlaceholderImage();
    renderShapeGuide();
    refreshRibbon();
    if (loadedFromHash) showToast("Shared state loaded.");
    setTimeout(sampleCanvasPixels, 800);
  } catch (error) {
    startDrawOnlyFallback(error);
  }
}

bootRibbonLab();
