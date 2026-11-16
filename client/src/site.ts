import "./index.css";

type WorkflowStage = {
  kicker: string;
  title: string;
  copy: string;
};

const workflowStages: Record<string, WorkflowStage> = {
  intake: {
    kicker: "STAGE 01 · INTAKE",
    title: "One request, one clear starting point.",
    copy: "Bring the message in with its original context intact. No important detail should disappear at the first handoff.",
  },
  structure: {
    kicker: "STAGE 02 · STRUCTURE",
    title: "Useful details become visible.",
    copy: "Information can be organized and routed. Unclear details stay flagged instead of being silently guessed.",
  },
  review: {
    kicker: "STAGE 03 · HUMAN REVIEW",
    title: "A person checks what needs judgment.",
    copy: "Priority, assignment, and sensitive decisions remain with the people responsible for the work.",
  },
  handoff: {
    kicker: "STAGE 04 · HANDOFF",
    title: "The next action reaches its owner.",
    copy: "Approved work moves forward with a clear next step, an exception path, and visibility into what happened.",
  },
};

const menuButton = document.querySelector<HTMLButtonElement>(".mobile-menu-toggle");
const nav = document.querySelector<HTMLElement>("#primary-nav");

function setMenuOpen(open: boolean) {
  if (!menuButton || !nav) return;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  nav.classList.toggle("is-open", open);
}

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  setMenuOpen(open);
});

nav?.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Escape") setMenuOpen(false);
});

const stageButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(".flow-step"));
const stageKicker = document.querySelector<HTMLElement>("#stage-kicker");
const stageTitle = document.querySelector<HTMLElement>("#stage-title");
const stageCopy = document.querySelector<HTMLElement>("#stage-copy");
const progressLine = document.querySelector<HTMLElement>(".flow-map-line span");

function selectStage(button: HTMLButtonElement) {
  const stageKey = button.dataset.stage;
  const stage = stageKey ? workflowStages[stageKey] : undefined;
  if (!stage) return;

  stageButtons.forEach((step) => {
    const selected = step === button;
    step.classList.toggle("is-current", selected);
    step.setAttribute("aria-pressed", String(selected));
  });

  if (stageKicker) stageKicker.textContent = stage.kicker;
  if (stageTitle) stageTitle.textContent = stage.title;
  if (stageCopy) stageCopy.textContent = stage.copy;

  const selectedIndex = stageButtons.indexOf(button);
  const progress = stageButtons.length > 1 ? (selectedIndex / (stageButtons.length - 1)) * 100 : 0;
  if (progressLine) progressLine.style.width = `${progress}%`;
}

stageButtons.forEach((button) => {
  button.addEventListener("click", () => selectStage(button));
});

/* --------------------------------------------------------------------------
   Example builds — business case
   -------------------------------------------------------------------------- */

type DemoKey = "amsterdam" | "kopf";
type DemoAccent = "amber" | "cyan";

type DemoValues = {
  volume: number;
  manual: number;
  assisted: number;
  hourly: number;
};

type ScopeItem = {
  label: string;
  note: string;
  low: number;
  high: number;
};

type DemoSignal = {
  value: string;
  label: string;
  note: string;
};

type DemoCase = {
  label: string;
  scenario: string;
  accent: DemoAccent;
  volumeLabel: string;
  defaults: DemoValues;
  investment: { low: number; high: number };
  scope: ScopeItem[];
  signals: DemoSignal[];
};

const DEMOS: Record<DemoKey, DemoCase> = {
  amsterdam: {
    label: "Amsterdam Freight",
    scenario: "SCENARIO 01 · AMSTERDAM FREIGHT",
    accent: "amber",
    volumeLabel: "Eligible movements / month",
    defaults: { volume: 620, manual: 11, assisted: 4, hourly: 38 },
    investment: { low: 10000, high: 20000 },
    scope: [
      {
        label: "Discovery & process map",
        note: "Shadow the bonded-site handoffs; agree the duty baseline and exception rules.",
        low: 1500,
        high: 2500,
      },
      {
        label: "Workflow & interface",
        note: "The floor, zone and hold views — built around your WMS and the roles that use them.",
        low: 4500,
        high: 8500,
      },
      {
        label: "Integrations & data",
        note: "WMS, bond ledger, customs documents and the files already in use.",
        low: 2500,
        high: 5500,
      },
      {
        label: "Pilot, training & handover",
        note: "Run it with the bonded-site team, document it, refine it.",
        low: 1500,
        high: 3500,
      },
    ],
    signals: [
      { value: "27,910", label: "pallets on one floor", note: "of 30,000 positions" },
      { value: "12", label: "zones in the bond ledger", note: "status-coloured" },
      { value: "740", label: "pallets on hold", note: "50 open documents" },
      { value: "€21.84M", label: "duty suspended", note: "under one roof" },
    ],
  },
  kopf: {
    label: "Kopf-Lubben",
    scenario: "SCENARIO 02 · KOPF-LUBBEN",
    accent: "cyan",
    volumeLabel: "Eligible shipments / month",
    defaults: { volume: 340, manual: 16, assisted: 6, hourly: 36 },
    investment: { low: 10000, high: 20000 },
    scope: [
      {
        label: "Discovery & process map",
        note: "Map the inbox, terminal and customer handoffs; agree the exception rules.",
        low: 1500,
        high: 2500,
      },
      {
        label: "Workflow & interface",
        note: "The inbox, map and shipment card — built around your TMS and the desk that uses them.",
        low: 4500,
        high: 8500,
      },
      {
        label: "Integrations & data",
        note: "Email, TMS, vessel and terminal feeds, and the files already in use.",
        low: 2500,
        high: 5500,
      },
      {
        label: "Pilot, training & handover",
        note: "Run it with the desk, document it, refine it.",
        low: 1500,
        high: 3500,
      },
    ],
    signals: [
      { value: "14", label: "shipments on the map", note: "6 in the inbox" },
      { value: "5", label: "live vessels", note: "in the current view" },
      { value: "4", label: "transport modes", note: "sea · air · road · barge" },
      { value: "3", label: "views, one desk", note: "inbox · map · card" },
    ],
  },
};

const caseState: Record<DemoKey, DemoValues> = {
  amsterdam: { ...DEMOS.amsterdam.defaults },
  kopf: { ...DEMOS.kopf.defaults },
};

let currentDemo: DemoKey = "amsterdam";

const caseTabs = Array.from(document.querySelectorAll<HTMLButtonElement>(".case-tab"));
const casePanel = document.querySelector<HTMLElement>("#case-panel");
const caseInputs = {
  volume: document.querySelector<HTMLInputElement>("#case-volume"),
  manual: document.querySelector<HTMLInputElement>("#case-manual"),
  assisted: document.querySelector<HTMLInputElement>("#case-assisted"),
  hourly: document.querySelector<HTMLInputElement>("#case-hourly"),
};

const numberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

function setText(id: string, text: string) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function readNumber(input: HTMLInputElement | null, maximum: number): number {
  if (!input || input.value.trim() === "") return 0;
  const value = Number(input.value);
  if (!Number.isFinite(value)) return 0;
  return clamp(value, 0, maximum);
}

function formatHours(value: number): string {
  return numberFormatter.format(Math.max(0, value));
}

function formatK(value: number): string {
  if (!Number.isFinite(value)) return "0";
  if (value >= 1000) {
    const thousands = value / 1000;
    return `${Math.abs(thousands) >= 100 ? Math.round(thousands) : thousands.toFixed(1)}k`;
  }
  return `${Math.round(value)}`;
}

function formatEuro(value: number): string {
  if (!Number.isFinite(value)) return "€0";
  return `€${formatK(Math.abs(value))}`;
}

function formatSignedEuro(value: number): string {
  if (!Number.isFinite(value)) return "€0";
  return `${value < 0 ? "−" : "+"}${formatEuro(value)}`;
}

function formatMonths(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "—";
  if (value > 60) return "60+";
  return value >= 10 ? `${Math.round(value)}` : value.toFixed(1);
}

function formatPayback(low: number, high: number): string {
  if (!Number.isFinite(low) || !Number.isFinite(high) || low <= 0) return "—";
  const lowText = formatMonths(low);
  const highText = formatMonths(high);
  return lowText === highText ? `${lowText} mo` : `${lowText}–${highText} mo`;
}

function formatRoi(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value >= 10) return `${Math.round(value)}`;
  return value.toFixed(1);
}

function formatRoiRange(low: number, high: number): string {
  if (!Number.isFinite(low) || !Number.isFinite(high) || high <= -1) return "—";
  const lowText = formatRoi(low);
  const highText = formatRoi(high);
  return lowText === highText ? `${lowText}×` : `${lowText}–${highText}×`;
}

type CaseResult = {
  minutesSaved: number;
  hoursMonth: number;
  valueMonth: number;
  valueYear: number;
  hoursTodayYear: number;
  hoursAfterYear: number;
  paybackLow: number;
  paybackHigh: number;
  roiLow: number;
  roiHigh: number;
  investmentMid: number;
  net12: number;
  breakeven: number;
};

function computeCase(demo: DemoCase, values: DemoValues): CaseResult {
  const minutesSaved = Math.max(0, values.manual - values.assisted);
  const hoursMonth = (values.volume * minutesSaved) / 60;
  const valueMonth = hoursMonth * values.hourly;
  const valueYear = valueMonth * 12;
  const hoursTodayYear = (values.volume * values.manual * 12) / 60;
  const hoursAfterYear = (values.volume * values.assisted * 12) / 60;
  const paybackLow = valueMonth > 0 ? demo.investment.low / valueMonth : Number.POSITIVE_INFINITY;
  const paybackHigh = valueMonth > 0 ? demo.investment.high / valueMonth : Number.POSITIVE_INFINITY;
  const roiLow = valueYear > 0 ? (valueYear * 3 - demo.investment.high) / demo.investment.high : -1;
  const roiHigh = valueYear > 0 ? (valueYear * 3 - demo.investment.low) / demo.investment.low : -1;
  const investmentMid = (demo.investment.low + demo.investment.high) / 2;
  const net12 = valueYear - investmentMid;
  const breakeven = valueMonth > 0 ? investmentMid / valueMonth : Number.POSITIVE_INFINITY;

  return {
    minutesSaved,
    hoursMonth,
    valueMonth,
    valueYear,
    hoursTodayYear,
    hoursAfterYear,
    paybackLow,
    paybackHigh,
    roiLow,
    roiHigh,
    investmentMid,
    net12,
    breakeven,
  };
}

function renderScope(demo: DemoCase) {
  const list = document.getElementById("case-scope-list");
  if (!list) return;

  list.innerHTML = demo.scope
    .map((item, index) => {
      const share = Math.round((item.high / demo.investment.high) * 100);
      return `<li>
        <span class="case-scope-no">${String(index + 1).padStart(2, "0")}</span>
        <div><b>${item.label}</b><p>${item.note}</p></div>
        <span class="case-scope-price">€${formatK(item.low)}–€${formatK(item.high)}</span>
        <div class="case-scope-bar" aria-hidden="true"><i style="width:${share}%"></i></div>
      </li>`;
    })
    .join("");
}

function renderSignals(demo: DemoCase) {
  const container = document.getElementById("case-signals");
  if (!container) return;

  container.innerHTML = demo.signals
    .map(
      (signal) =>
        `<div class="case-signal"><strong>${signal.value}</strong><span>${signal.label}</span><small>${signal.note}</small></div>`,
    )
    .join("");
}

function renderChart(demo: DemoCase, result: CaseResult) {
  const container = document.getElementById("case-chart");
  if (!container) return;

  const accent = demo.accent === "amber" ? "#e3a94a" : "#5bc8e8";
  const compact = window.matchMedia("(max-width: 600px)").matches;
  const width = compact ? 340 : 560;
  const height = compact ? 250 : 230;
  const pad = compact
    ? { left: 54, right: 10, top: 18, bottom: 30 }
    : { left: 44, right: 14, top: 16, bottom: 28 };
  const labelSize = compact ? 12 : 10;
  const monthSize = compact ? 12 : 11;
  const valueSize = compact ? 14 : 12;
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;
  const maxNet = Math.max(result.net12, 0, result.valueMonth * 12 - demo.investment.low);
  const minNet = -demo.investment.high;
  const range = Math.max(maxNet - minNet, 1);

  const x = (month: number) => pad.left + (month / 12) * plotWidth;
  const y = (value: number) => pad.top + ((maxNet - value) / range) * plotHeight;

  const points = Array.from({ length: 13 }, (_, month) => {
    const value = result.valueMonth * month - result.investmentMid;
    return `${x(month).toFixed(1)},${y(value).toFixed(1)}`;
  });
  const linePath = `M${points.join(" L")}`;
  const areaPath = `${linePath} L${x(12).toFixed(1)},${y(0).toFixed(1)} L${x(0).toFixed(1)},${y(0).toFixed(1)} Z`;

  const gridLines = [0, 3, 6, 9, 12]
    .map(
      (month) =>
        `<line x1="${x(month)}" y1="${pad.top}" x2="${x(month)}" y2="${height - pad.bottom}" stroke="rgba(255,255,255,.07)" stroke-width="1" />`,
    )
    .join("");

  const monthLabels = [0, 3, 6, 9, 12]
    .map(
      (month) =>
        `<text x="${x(month)}" y="${height - 8}" text-anchor="middle" fill="#7e9187" font-size="${monthSize}" font-family="Inter, sans-serif">${month === 12 ? "12 mo" : month}</text>`,
    )
    .join("");

  const showBreakeven =
    Number.isFinite(result.breakeven) && result.breakeven > 0 && result.breakeven < 12;
  const breakevenX = showBreakeven ? x(result.breakeven) : 0;
  const breakevenMarkup = showBreakeven
    ? `
    <rect x="${x(0)}" y="${pad.top}" width="${(breakevenX - x(0)).toFixed(1)}" height="${plotHeight}" fill="${accent}" opacity=".035" />
    <line x1="${breakevenX}" y1="${pad.top}" x2="${breakevenX}" y2="${height - pad.bottom}" stroke="${accent}" stroke-width="1" stroke-dasharray="3 4" opacity=".4" />
    <circle cx="${breakevenX}" cy="${y(0)}" r="4" fill="${accent}" stroke="#0a1413" stroke-width="2" />
    <text x="${breakevenX}" y="${y(0) + 17}" text-anchor="middle" fill="${accent}" font-size="${valueSize}" font-weight="700" font-family="Inter, sans-serif" paint-order="stroke" stroke="#0a1413" stroke-width="3">${formatMonths(result.breakeven)} mo</text>
  `
    : "";

  const zeroLine = `<line x1="${pad.left}" y1="${y(0)}" x2="${width - pad.right}" y2="${y(0)}" stroke="#8fa198" stroke-width="1" stroke-dasharray="4 4" opacity=".55" />`;

  const yLabels = `
    <text x="${pad.left - 6}" y="${y(maxNet) + 4}" text-anchor="end" fill="#7e9187" font-size="${labelSize}" font-family="Inter, sans-serif">${formatSignedEuro(maxNet)}</text>
    <text x="${pad.left - 6}" y="${y(0) + 4}" text-anchor="end" fill="#8fa198" font-size="${labelSize}" font-family="Inter, sans-serif">€0</text>
    <text x="${pad.left - 6}" y="${y(minNet) + 4}" text-anchor="end" fill="#7e9187" font-size="${labelSize}" font-family="Inter, sans-serif">${formatSignedEuro(minNet)}</text>
  `;

  const endLabel = `<text x="${x(12) - 2}" y="${y(result.net12) - 9}" text-anchor="end" fill="${accent}" font-size="${valueSize}" font-weight="750" font-family="Inter, sans-serif" paint-order="stroke" stroke="#0a1413" stroke-width="3">${formatSignedEuro(result.net12)}</text>`;

  const ariaLabel = `Cumulative value over 12 months for ${demo.label}: ${formatSignedEuro(result.net12)} net after a ${formatEuro(result.investmentMid)} midpoint build${showBreakeven ? `, break-even at ${formatMonths(result.breakeven)} months` : ""}.`;

  container.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${ariaLabel}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="case-chart-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${accent}" stop-opacity=".32" />
        <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
      </linearGradient>
    </defs>
    ${gridLines}
    ${yLabels}
    ${zeroLine}
    ${breakevenMarkup}
    <path d="${areaPath}" fill="url(#case-chart-fill)" />
    <path d="${linePath}" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    ${endLabel}
    ${monthLabels}
  </svg>`;
}

function readCaseValues(): DemoValues {
  return {
    volume: readNumber(caseInputs.volume, 100000),
    manual: readNumber(caseInputs.manual, 1440),
    assisted: readNumber(caseInputs.assisted, 1440),
    hourly: readNumber(caseInputs.hourly, 10000),
  };
}

function syncCaseInputs() {
  const values = caseState[currentDemo];
  if (caseInputs.volume) caseInputs.volume.value = String(values.volume);
  if (caseInputs.manual) caseInputs.manual.value = String(values.manual);
  if (caseInputs.assisted) caseInputs.assisted.value = String(values.assisted);
  if (caseInputs.hourly) caseInputs.hourly.value = String(values.hourly);
}

function updateCase() {
  const demo = DEMOS[currentDemo];
  const values = readCaseValues();
  caseState[currentDemo] = values;
  const result = computeCase(demo, values);

  setText("case-value", formatEuro(result.valueYear));
  setText(
    "case-value-note",
    `${formatHours(result.hoursMonth)} h released / month · €${formatHours(values.hourly)}/h loaded cost`,
  );
  setText("case-payback", formatPayback(result.paybackLow, result.paybackHigh));
  setText("case-roi", formatRoiRange(result.roiLow, result.roiHigh));
  setText(
    "case-time",
    `${formatHours(values.manual)} → ${formatHours(values.assisted)} min`,
  );
  setText(
    "case-breakeven",
    result.breakeven > 0 && Number.isFinite(result.breakeven) && result.breakeven <= 12
      ? `Break-even at ${formatMonths(result.breakeven)} mo`
      : "Break-even beyond 12 months at these assumptions",
  );
  setText(
    "case-chart-note",
    result.valueMonth > 0 ? "Net of the €10–20k build band" : "No time released at these assumptions",
  );

  const maxHours = Math.max(result.hoursTodayYear, result.hoursAfterYear, 1);
  const todayBar = document.getElementById("case-bar-today");
  const afterBar = document.getElementById("case-bar-after");
  if (todayBar) todayBar.style.width = `${(result.hoursTodayYear / maxHours) * 100}%`;
  if (afterBar) afterBar.style.width = `${(result.hoursAfterYear / maxHours) * 100}%`;
  setText("case-hours-today", `${formatHours(result.hoursTodayYear)} h`);
  setText("case-hours-after", `${formatHours(result.hoursAfterYear)} h`);

  renderChart(demo, result);
}

function selectDemo(key: DemoKey) {
  currentDemo = key;
  const demo = DEMOS[key];

  caseTabs.forEach((tab) => {
    const active = tab.dataset.demo === key;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });

  if (casePanel) {
    casePanel.dataset.accent = demo.accent;
    casePanel.setAttribute("aria-labelledby", `case-tab-${key}`);
  }

  setText("case-scenario", demo.scenario);
  setText("case-signals-label", demo.label.toUpperCase());
  setText("case-volume-label", demo.volumeLabel);

  syncCaseInputs();
  renderScope(demo);
  renderSignals(demo);
  updateCase();
}

caseTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    const key = tab.dataset.demo as DemoKey | undefined;
    if (key) selectDemo(key);
  });

  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + caseTabs.length) % caseTabs.length;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % caseTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = caseTabs.length - 1;

    const nextTab = caseTabs[nextIndex];
    const key = nextTab.dataset.demo as DemoKey | undefined;
    if (!key) return;
    selectDemo(key);
    nextTab.focus();
  });
});

Object.values(caseInputs).forEach((input) => {
  input?.addEventListener("input", updateCase);
});

document.getElementById("case-reset")?.addEventListener("click", () => {
  caseState[currentDemo] = { ...DEMOS[currentDemo].defaults };
  syncCaseInputs();
  updateCase();
});

if (caseTabs.length > 0 && casePanel) {
  selectDemo("amsterdam");
}

let chartResizeTimer = 0;
window.addEventListener("resize", () => {
  window.clearTimeout(chartResizeTimer);
  chartResizeTimer = window.setTimeout(() => updateCase(), 150);
});

/* --------------------------------------------------------------------------
   Screenshot lightbox
   -------------------------------------------------------------------------- */

const lightboxTriggers: HTMLButtonElement[] = [];

document.querySelectorAll<HTMLImageElement>(".shot-frame > img").forEach((img) => {
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "shot-zoom";
  trigger.setAttribute("aria-label", `Open full view: ${img.alt}`);
  trigger.dataset.lightboxSrc = img.getAttribute("src") ?? "";

  const figure = img.closest("figure");
  const title = figure?.querySelector("h3")?.textContent?.trim() ?? "";
  const kicker = figure?.querySelector(".shot-kicker")?.textContent?.trim() ?? "";
  trigger.dataset.lightboxTitle = [kicker, title].filter(Boolean).join(" — ");

  img.replaceWith(trigger);
  trigger.appendChild(img);
  lightboxTriggers.push(trigger);
});

if (lightboxTriggers.length > 0) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.id = "lightbox";
  lightbox.hidden = true;
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-labelledby", "lightbox-title");
  lightbox.innerHTML = `
    <button class="lightbox-backdrop" type="button" tabindex="-1" aria-label="Close full view" data-lightbox-close></button>
    <div class="lightbox-panel">
      <div class="lightbox-bar"><span>FULL VIEW · SYNTHETIC DEMO DATA</span><button class="lightbox-close" type="button" aria-label="Close full view" data-lightbox-close>✕</button></div>
      <div class="lightbox-scroll"><img id="lightbox-image" alt="" /></div>
      <p id="lightbox-title"></p>
      <small class="lightbox-hint">Drag the image to explore the full screenshot.</small>
    </div>`;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector<HTMLImageElement>("#lightbox-image");
  const lightboxTitle = lightbox.querySelector<HTMLElement>("#lightbox-title");
  let returnFocus: HTMLButtonElement | null = null;

  const openLightbox = (trigger: HTMLButtonElement) => {
    const src = trigger.dataset.lightboxSrc;
    if (!src || !lightboxImage) return;
    returnFocus = trigger;
    lightboxImage.src = src;
    const inner = trigger.querySelector("img");
    lightboxImage.alt = inner?.alt ?? "";
    if (lightboxTitle) lightboxTitle.textContent = trigger.dataset.lightboxTitle ?? "";
    lightbox.hidden = false;
    document.body.classList.add("has-lightbox");
    lightbox.querySelector<HTMLButtonElement>(".lightbox-close")?.focus();
  };

  const closeLightbox = () => {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.classList.remove("has-lightbox");
    if (lightboxImage) lightboxImage.removeAttribute("src");
    returnFocus?.focus();
    returnFocus = null;
  };

  lightboxTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openLightbox(trigger));
  });

  lightbox.querySelectorAll<HTMLElement>("[data-lightbox-close]").forEach((element) => {
    element.addEventListener("click", closeLightbox);
  });

  lightbox.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      lightbox.querySelectorAll<HTMLElement>("button:not([tabindex='-1'])"),
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
}

/* --------------------------------------------------------------------------
   Scroll reveal
   -------------------------------------------------------------------------- */

const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (revealItems.length && "IntersectionObserver" in window && !prefersReducedMotion) {
  document.documentElement.classList.add("has-scroll-reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
  );

  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);
    revealObserver.observe(item);
  });
}
