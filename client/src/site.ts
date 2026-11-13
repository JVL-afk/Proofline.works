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
