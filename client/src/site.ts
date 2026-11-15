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

type ZoneDetail = {
  title: string;
  status: string;
  copy: string;
};

const zoneDetails: Record<string, ZoneDetail> = {
  spirits: {
    title: "SP-01 · Spirits",
    status: "Under bond",
    copy: "The concept brings a zone and its document context into one view for a reviewer.",
  },
  wine: {
    title: "WN-01 · Wine",
    status: "Under bond",
    copy: "A reviewer can see the example status and its supporting record before a next step is approved.",
  },
  beer: {
    title: "BR-01 · Beer",
    status: "Released",
    copy: "A shared view can help warehouse and dispatch teams see what is ready to move.",
  },
  cold: {
    title: "CL-01 · Cold chain",
    status: "On hold",
    copy: "A flagged record stays visible as an exception for a person to resolve.",
  },
  customs: {
    title: "QR-01 · Review bay",
    status: "On hold",
    copy: "The concept can bring relevant paperwork together; an authorized person retains release control.",
  },
  inbound: {
    title: "DK-01 · Inbound dock",
    status: "Released",
    copy: "An approved inbound movement can be linked to its next warehouse handoff.",
  },
  outbound: {
    title: "DK-02 · Outbound",
    status: "Released",
    copy: "A shared status view can expose the next owner while unresolved exceptions stay visible.",
  },
  repack: {
    title: "RT-01 · Repacking",
    status: "Under bond",
    copy: "The example associates work and records, while human checks define whether the process can continue.",
  },
};

const zoneButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(".warehouse-zone"));
const zoneTitle = document.querySelector<HTMLElement>("#warehouse-detail-title");
const zoneStatus = document.querySelector<HTMLElement>("#warehouse-detail-status");
const zoneCopy = document.querySelector<HTMLElement>("#warehouse-detail-copy");

function selectZone(button: HTMLButtonElement) {
  const details = button.dataset.zone ? zoneDetails[button.dataset.zone] : undefined;
  if (!details) return;

  zoneButtons.forEach((zone) => {
    const selected = zone === button;
    zone.classList.toggle("is-selected", selected);
    zone.setAttribute("aria-pressed", String(selected));
  });

  if (zoneTitle) zoneTitle.textContent = details.title;
  if (zoneStatus) {
    zoneStatus.textContent = details.status.toUpperCase();
    zoneStatus.dataset.status = button.dataset.status ?? "bonded";
  }
  if (zoneCopy) zoneCopy.textContent = details.copy;
}

zoneButtons.forEach((button) => {
  button.addEventListener("click", () => selectZone(button));
});

const zoneFilters = Array.from(document.querySelectorAll<HTMLButtonElement>(".warehouse-filter"));

function applyZoneFilter(filter: string) {
  zoneFilters.forEach((button) => {
    const selected = button.dataset.filter === filter;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  zoneButtons.forEach((zone) => {
    const hidden = filter !== "all" && zone.dataset.status !== filter;
    zone.classList.toggle("is-filtered", hidden);
    if (hidden) zone.setAttribute("aria-hidden", "true");
    else zone.removeAttribute("aria-hidden");
  });

  const selectedZone = zoneButtons.find((zone) => zone.getAttribute("aria-pressed") === "true");
  if (selectedZone?.classList.contains("is-filtered")) {
    const nextZone = zoneButtons.find((zone) => !zone.classList.contains("is-filtered"));
    if (nextZone) selectZone(nextZone);
  }
}

zoneFilters.forEach((button) => {
  button.addEventListener("click", () => applyZoneFilter(button.dataset.filter ?? "all"));
});

const volumeInput = document.querySelector<HTMLInputElement>("#impact-volume");
const manualInput = document.querySelector<HTMLInputElement>("#impact-manual");
const assistedInput = document.querySelector<HTMLInputElement>("#impact-assisted");
const hourlyInput = document.querySelector<HTMLInputElement>("#impact-hourly");
const currencyInput = document.querySelector<HTMLSelectElement>("#impact-currency");
const month3Input = document.querySelector<HTMLInputElement>("#impact-month3");
const month6Input = document.querySelector<HTMLInputElement>("#impact-month6");
const month3Share = document.querySelector<HTMLOutputElement>("#impact-month3-share");
const month6Share = document.querySelector<HTMLOutputElement>("#impact-month6-share");
const month3Hours = document.querySelector<HTMLElement>("#impact-month3-hours");
const month6Hours = document.querySelector<HTMLElement>("#impact-month6-hours");
const month3Value = document.querySelector<HTMLElement>("#impact-month3-value");
const month6Value = document.querySelector<HTMLElement>("#impact-month6-value");
const modelStatus = document.querySelector<HTMLElement>("#impact-model-status");

function nonNegativeValue(input: HTMLInputElement | null, maximum: number): number {
  if (!input || input.value.trim() === "") return 0;
  const value = Number(input.value);
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), maximum);
}

function formatHours(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(value);
}

function formatCapacityValue(value: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "USD" ? "USD" : "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function updateImpactModel() {
  if (!volumeInput || !manualInput || !assistedInput || !month3Input || !month6Input) return;

  const volume = nonNegativeValue(volumeInput, 100000);
  const manualMinutes = nonNegativeValue(manualInput, 1440);
  const assistedMinutes = nonNegativeValue(assistedInput, 1440);
  const hourlyCost = nonNegativeValue(hourlyInput, 10000);
  const month3Adoption = Number(month3Input.value) / 100;
  const month6Adoption = Number(month6Input.value) / 100;
  const currency = currencyInput?.value === "USD" ? "USD" : "EUR";
  const timePerItem = Math.max(0, manualMinutes - assistedMinutes);
  const fullAdoptionHours = (volume * timePerItem) / 60;
  const hoursAtMonth3 = fullAdoptionHours * month3Adoption;
  const hoursAtMonth6 = fullAdoptionHours * month6Adoption;

  if (month3Share) month3Share.textContent = `${Math.round(month3Adoption * 100)}%`;
  if (month6Share) month6Share.textContent = `${Math.round(month6Adoption * 100)}%`;
  if (month3Hours) month3Hours.textContent = `${formatHours(hoursAtMonth3)} h / mo`;
  if (month6Hours) month6Hours.textContent = `${formatHours(hoursAtMonth6)} h / mo`;
  if (month3Value) month3Value.textContent = `${formatCapacityValue(hoursAtMonth3 * hourlyCost, currency)} / mo potential capacity value`;
  if (month6Value) month6Value.textContent = `${formatCapacityValue(hoursAtMonth6 * hourlyCost, currency)} / mo potential capacity value`;

  if (modelStatus) {
    if (volume === 0) {
      modelStatus.textContent = "Enter an example monthly volume to see the assumption-based run-rate.";
    } else if (manualMinutes <= assistedMinutes) {
      modelStatus.textContent = "At these assumptions, the assisted path does not release time after review. Try a narrower workflow or a different assisted-time assumption.";
    } else {
      modelStatus.textContent = "Scenario only: month 3 and month 6 are monthly run-rates at your selected case shares—not cumulative totals or a delivery promise.";
    }
  }
}

[volumeInput, manualInput, assistedInput, hourlyInput, currencyInput, month3Input, month6Input].forEach((input) => {
  input?.addEventListener("input", updateImpactModel);
  input?.addEventListener("change", updateImpactModel);
});
updateImpactModel();

const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (revealItems.length && "IntersectionObserver" in window && !prefersReducedMotion) {
  document.documentElement.classList.add("has-scroll-reveal");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);
    revealObserver.observe(item);
  });
}
