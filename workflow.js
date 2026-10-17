// 05 ENGINEERING & WORKFLOW
// Six pillars flank a central inspector card. Hover or click a pillar and the
// inspector crossfades to that pillar's anatomy; RESET VIEW returns to the
// core philosophy statement.
(() => {
  const stage = document.querySelector("#workflow-stage");
  const resetBtn = document.querySelector("#workflow-reset");
  if (!stage || !resetBtn) return;

  const pillars = [...document.querySelectorAll(".workflow-pillar")];
  if (!pillars.length) return;

  const panels = new Map();
  stage.querySelectorAll(".workflow-panel").forEach((panel) => {
    panels.set(panel.id, panel);
  });

  const defaultPanel = stage.querySelector("#workflow-panel-default");
  if (!defaultPanel) return;

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  let selected = null;   // set by click, survives until reset or another click
  let hovered = null;    // transient, cleared on pointerleave

  function activePanelId() {
    return selected || hovered || "workflow-panel-default";
  }

  function showPanel(id) {
    panels.forEach((panel, key) => {
      const on = key === id;
      panel.classList.toggle("is-active", on);
      panel.setAttribute("aria-hidden", String(!on));
    });
    resetBtn.hidden = id === "workflow-panel-default";
  }

  function syncPillars() {
    const id = activePanelId();
    pillars.forEach((pillar) => {
      const on = "workflow-panel-" + pillar.dataset.pillar === id;
      pillar.classList.toggle("is-active", on);
      pillar.setAttribute("aria-pressed", String(on));
    });
    showPanel(id);
    lockStageHeight();
  }

  // The panels are absolutely stacked, so the stage needs an explicit height
  // for the tallest panel currently in play. Measuring keeps the card from
  // jumping between short and tall content.
  function lockStageHeight() {
    let tallest = 0;
    panels.forEach((panel) => {
      // Measure every panel, not just the visible one, so the card never
      // resizes mid crossfade.
      const prev = panel.style.cssText;
      panel.style.cssText = "position:absolute;visibility:hidden;opacity:0;transform:none;width:100%;left:0;right:0;";
      tallest = Math.max(tallest, panel.offsetHeight);
      panel.style.cssText = prev;
    });
    if (tallest > 0) stage.style.height = tallest + "px";
  }

  pillars.forEach((pillar) => {
    const id = "workflow-panel-" + pillar.dataset.pillar;

    pillar.addEventListener("mouseenter", () => {
      if (!canHover.matches) return;
      hovered = id;
      syncPillars();
    });

    pillar.addEventListener("mouseleave", () => {
      if (!canHover.matches) return;
      if (hovered === id) hovered = null;
      syncPillars();
    });

    pillar.addEventListener("focus", () => {
      hovered = id;
      syncPillars();
    });

    pillar.addEventListener("blur", () => {
      if (hovered === id) hovered = null;
      syncPillars();
    });

    pillar.addEventListener("click", () => {
      // Clicking the already selected pillar clears the selection.
      selected = selected === id ? null : id;
      hovered = null;
      syncPillars();
    });
  });

  resetBtn.addEventListener("click", () => {
    selected = null;
    hovered = null;
    syncPillars();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!selected && !hovered) return;
    selected = null;
    hovered = null;
    syncPillars();
  });

  // Keep the measured height correct when the layout reflows.
  let resizePending = false;
  window.addEventListener("resize", () => {
    if (resizePending) return;
    resizePending = true;
    requestAnimationFrame(() => {
      resizePending = false;
      lockStageHeight();
    });
  });

  // Webfonts change text metrics, so re-measure once they settle.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(lockStageHeight);
  }

  syncPillars();
})();
