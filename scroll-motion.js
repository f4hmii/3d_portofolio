(() => {
  const stage = document.querySelector("#keyboard-stage");
  const slot = document.querySelector("#keyboard-stage-slot");
  const about = document.querySelector("#about");
  const aboutGrid = about?.querySelector(".about-grid");
  const technologyDock = document.querySelector("#technology-monitor-dock");
  const monitorJourney = document.querySelector("#monitor-portal-journey");
  const monitorPage = document.querySelector("#monitor-portal-page");
  const experiencePage = document.querySelector("#experience-projects");
  const fallbackBoard = document.querySelector("#keyboard-fallback .fallback-board");
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!stage || !slot || !about || !aboutGrid || !technologyDock || !monitorJourney || !monitorPage || !experiencePage) return;

  window.keyboardScrollProgress = 0;
  window.keyboardTravelProgress = 0;
  window.keyboardTechnologyProgress = 0;
  window.keyboardAboutSectionProgress = 0;
  window.keyboardMonitorZoomProgress = 0;
  window.keyboardExperienceProgress = 0;
  let framePending = false;
  let motionEnabled = !motionPreference.matches;
  let stageWidth = 0;
  let stageHeight = 0;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function smooth(value) {
    return value * value * (3 - 2 * value);
  }

  function updateMotion() {
    framePending = false;
    if (!motionEnabled) {
      document.body.classList.remove("keyboard-motion-ready", "keyboard-about-arrived", "keyboard-technology-arrived");
      window.keyboardScrollProgress = 0;
      window.keyboardTravelProgress = 0;
      window.keyboardTechnologyProgress = 0;
      window.keyboardAboutSectionProgress = 0;
      window.keyboardMonitorZoomProgress = 0;
      window.keyboardExperienceProgress = 0;
      stage.removeAttribute("style");
      stage.classList.remove("in-about", "in-technology");
      monitorPage.style.removeProperty("opacity");
      monitorPage.style.removeProperty("pointer-events");
      monitorPage.style.removeProperty("transform");
      monitorPage.inert = false;
      monitorPage.setAttribute("aria-hidden", "false");
      experiencePage.style.removeProperty("opacity");
      experiencePage.style.removeProperty("pointer-events");
      experiencePage.style.removeProperty("transform");
      experiencePage.inert = false;
      experiencePage.setAttribute("aria-hidden", "false");
      aboutGrid.style.removeProperty("--about-workspace-height");
      fallbackBoard?.style.removeProperty("--keyboard-extra-rotation");
      stageWidth = 0;
      stageHeight = 0;
      return;
    }

    document.body.classList.add("keyboard-motion-ready");
    const scrollY = window.scrollY;
    const aboutTop = about.getBoundingClientRect().top + scrollY;
    const aboutProgress = clamp(scrollY / Math.max(1, aboutTop), 0, 1);
    const aboutPositionProgress = clamp(aboutProgress / 0.84, 0, 1);
    const transferStart = aboutTop;
    const technologyRect = technologyDock.getBoundingClientRect();
    const transferEnd = Math.max(transferStart + 1,
      technologyRect.top + scrollY + technologyRect.height / 2 - window.innerHeight * 0.52);
    const technologyProgress = clamp((scrollY - transferStart) / (transferEnd - transferStart), 0, 1);
    const journeyTop = monitorJourney.getBoundingClientRect().top + scrollY;
    const portalStart = Math.max(transferEnd + window.innerHeight * 0.18, journeyTop - window.innerHeight * 0.65);
    const portalEnd = journeyTop + window.innerHeight * 0.6;
    const monitorZoomProgress = clamp((scrollY - portalStart) / Math.max(1, portalEnd - portalStart), 0, 1);
    const pageReveal = smooth(clamp((monitorZoomProgress - 0.9) / 0.08, 0, 1));
    const experienceStart = journeyTop + window.innerHeight * 1.08;
    const experienceEnd = journeyTop + window.innerHeight * 1.95;
    const experienceProgress = smooth(clamp((scrollY - experienceStart) / (experienceEnd - experienceStart), 0, 1));
    const portalExit = smooth(clamp((experienceProgress - 0.48) / 0.52, 0, 1));
    const source = slot.getBoundingClientRect();
    const aboutRect = about.getBoundingClientRect();
    const aboutSectionProgress = clamp(-aboutRect.top / Math.max(1, aboutRect.height), 0, 1);
    const grid = aboutGrid.getBoundingClientRect();
    const isCompact = window.innerWidth <= 740;
    const aboutWidth = isCompact
      ? Math.max(180, Math.min(source.width * 0.94, grid.width - 36))
      : Math.max(220, (grid.width - 72) * 0.42);
    const aboutHeight = isCompact ? Math.min(source.height * 0.78, 230) : Math.min(source.height * 0.88, 300);
    const aboutLeft = isCompact ? grid.left + (grid.width - aboutWidth) / 2 : grid.left;
    const aboutTopPosition = isCompact ? grid.top - aboutHeight - 18 : grid.top + 8;
    const aboutCenterX = aboutLeft + aboutWidth / 2;
    const aboutCenterY = aboutTopPosition + aboutHeight / 2;
    const technologyCenterX = technologyRect.left + technologyRect.width / 2;
    const technologyCenterY = technologyRect.top + technologyRect.height / 2;
    const technologyWidth = Math.max(180, technologyRect.width * 0.96);
    const technologyHeight = Math.max(180, technologyRect.height * 0.94);
    const aboutScale = Math.min(aboutWidth / source.width, aboutHeight / source.height);
    const technologyScale = Math.min(technologyWidth / source.width, technologyHeight / source.height);

    let centerX;
    let centerY;
    let scale;
    if (scrollY < transferStart) {
      const progress = smooth(aboutPositionProgress);
      const sourceCenterX = source.left + source.width / 2;
      const sourceCenterY = source.top + source.height / 2;
      centerX = sourceCenterX + (aboutCenterX - sourceCenterX) * progress;
      centerY = sourceCenterY + (aboutCenterY - sourceCenterY) * progress;
      scale = 1 + (aboutScale - 1) * progress;
    } else {
      const progress = smooth(technologyProgress);
      centerX = aboutCenterX + (technologyCenterX - aboutCenterX) * progress;
      centerY = aboutCenterY + (technologyCenterY - aboutCenterY) * progress;
      scale = aboutScale + (technologyScale - aboutScale) * progress;
      if (technologyProgress === 1) {
        const zoom = smooth(clamp(monitorZoomProgress / 0.45, 0, 1));
        const fullScreenScale = window.innerWidth / source.width * (isCompact ? 0.98 : 1.02);
        centerX += (window.innerWidth / 2 - centerX) * zoom;
        centerY = window.innerHeight * (0.52 - 0.02 * zoom);
        scale += (fullScreenScale - scale) * zoom;
      }
    }

    const workspaceHeight = `${source.height * aboutScale}px`;
    if (aboutGrid.style.getPropertyValue("--about-workspace-height") !== workspaceHeight) {
      aboutGrid.style.setProperty("--about-workspace-height", workspaceHeight);
      requestUpdate();
    }

    stage.style.left = `${centerX - source.width / 2}px`;
    stage.style.top = `${centerY - source.height / 2}px`;
    if (Math.abs(source.width - stageWidth) > 0.5) {
      stageWidth = source.width;
      stage.style.width = `${stageWidth}px`;
    }
    if (Math.abs(source.height - stageHeight) > 0.5) {
      stageHeight = source.height;
      stage.style.height = `${stageHeight}px`;
    }
    stage.style.transform = `scale(${scale})`;
    stage.style.opacity = String(1 - pageReveal);
    stage.style.visibility = monitorZoomProgress >= 0.98 ? "hidden" : "visible";
    monitorPage.style.opacity = String(pageReveal * (1 - portalExit));
    monitorPage.style.transform = `translate3d(${-75 * experienceProgress}vw, 0, 0) scale(${1 - 0.32 * experienceProgress})`;
    monitorPage.style.pointerEvents = monitorZoomProgress >= 0.98 && experienceProgress < 0.82 ? "auto" : "none";
    monitorPage.inert = monitorZoomProgress < 0.98 || experienceProgress >= 0.82;
    monitorPage.setAttribute("aria-hidden", String(monitorPage.inert));
    experiencePage.style.opacity = String(smooth(clamp(experienceProgress / 0.45, 0, 1)));
    experiencePage.style.transform = `translate3d(${80 * (1 - experienceProgress)}vw, 0, 0) scale(${0.88 + 0.12 * experienceProgress})`;
    experiencePage.style.pointerEvents = experienceProgress >= 0.82 ? "auto" : "none";
    experiencePage.inert = experienceProgress < 0.82;
    experiencePage.setAttribute("aria-hidden", String(experiencePage.inert));
    stage.classList.toggle("in-about", aboutProgress >= 0.84 && scrollY < transferStart);
    stage.classList.toggle("in-technology", technologyProgress >= 0.96);
    document.body.classList.toggle("keyboard-about-arrived", aboutProgress >= 0.84);
    document.body.classList.toggle("keyboard-technology-arrived", technologyProgress >= 0.96);
    window.keyboardScrollProgress = aboutProgress;
    window.keyboardTravelProgress = aboutPositionProgress;
    window.keyboardTechnologyProgress = technologyProgress;
    window.keyboardAboutSectionProgress = aboutSectionProgress;
    window.keyboardMonitorZoomProgress = monitorZoomProgress;
    window.keyboardExperienceProgress = experienceProgress;

    if (fallbackBoard) {
      const rotationProgress = scrollY < transferStart ? aboutPositionProgress : 1 + technologyProgress;
      fallbackBoard.style.setProperty("--keyboard-extra-rotation", `${-rotationProgress * 10}deg`);
    }
  }

  function requestUpdate() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateMotion);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", () => {
    motionEnabled = !motionPreference.matches;
    requestUpdate();
  });
  motionPreference.addEventListener?.("change", (event) => {
    motionEnabled = !event.matches;
    requestUpdate();
  });
  requestUpdate();
})();
