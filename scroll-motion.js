(() => {
  const stage = document.querySelector("#keyboard-stage");
  const slot = document.querySelector("#keyboard-stage-slot");
  const about = document.querySelector("#about");
  const aboutGrid = about?.querySelector(".about-grid");
  const technologyDock = document.querySelector("#technology-monitor-dock");
  const technologyHeading = document.querySelector(".technologies-heading");
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
      monitorPage.style.removeProperty("border-radius");
      monitorPage.style.removeProperty("border");
      monitorPage.style.removeProperty("box-shadow");
      monitorPage.style.removeProperty("visibility");
      monitorPage.style.removeProperty("z-index");
      monitorPage.style.removeProperty("--monitor-bezel-indicator");
      monitorPage.inert = false;
      monitorPage.setAttribute("aria-hidden", "false");
      experiencePage.style.removeProperty("opacity");
      experiencePage.style.removeProperty("pointer-events");
      experiencePage.style.removeProperty("transform");
      experiencePage.style.removeProperty("visibility");
      experiencePage.style.removeProperty("z-index");
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
    // Rest position: anchor the section 03 eyebrow/heading near the top of the
    // viewport so the label, heading, paragraph and the workstation all stay
    // visible together, regardless of viewport height.
    const technologyHeadingTop = (technologyHeading ?? technologyDock).getBoundingClientRect().top + scrollY;
    const technologyRestTopPad = Math.min(96, Math.max(48, window.innerHeight * 0.085));
    const transferEnd = Math.max(transferStart + 1, technologyHeadingTop - technologyRestTopPad);
    const technologyProgress = clamp((scrollY - transferStart) / (transferEnd - transferStart), 0, 1);
    const journeyTop = monitorJourney.getBoundingClientRect().top + scrollY;
    // Zoom into the monitor starts right at the rest position (no dead zone),
    // but the monitor page itself is only revealed once the sticky journey has
    // reached the top of the viewport, so it never appears mid-scroll.
    const portalStart = transferEnd;
    const revealLeadRange = Math.max(0, (journeyTop - portalStart) / 0.9);
    const portalEnd = portalStart + Math.max(
      window.innerHeight * 0.9,
      revealLeadRange + window.innerHeight * 0.05,
    );
    const monitorZoomProgress = clamp((scrollY - portalStart) / Math.max(1, portalEnd - portalStart), 0, 1);
    const pageReveal = smooth(clamp((monitorZoomProgress - 0.9) / 0.08, 0, 1));
    // Experience (SELECTED WORKS) page: takes over right after the CAPABILITIES
    // monitor screen. The experience page is the second sticky child, so it
    // parks at the top of the viewport at 1.0vh; fade it in from there and the
    // monitor screen fades out in the same window (crossfade, no dead scroll).
    const experienceStart = journeyTop + window.innerHeight * 1.0;
    const experienceEnd   = journeyTop + window.innerHeight * 1.7;
    const experienceProgress = smooth(clamp((scrollY - experienceStart) / Math.max(1, experienceEnd - experienceStart), 0, 1));
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
    // Locked resting pose: the on-screen centre of the section 03 dock at the
    // exact scroll position where the workstation parks (scrollY === transferEnd).
    // The dock's viewport rect moves with the page, so this is expressed in
    // absolute page coordinates and only converted back at the rest pose.
    const restCenterX = technologyCenterX;
    const restCenterY = technologyRect.top + scrollY - transferEnd + technologyRect.height / 2;
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
      centerX = aboutCenterX + (restCenterX - aboutCenterX) * progress;
      centerY = aboutCenterY + (restCenterY - aboutCenterY) * progress;
      scale = aboutScale + (technologyScale - aboutScale) * progress;
      if (technologyProgress === 1) {
        // Zoom completes exactly as the monitor page starts to reveal, so the
        // camera keeps moving the whole way without a static pause.
        const zoom = smooth(clamp(monitorZoomProgress / 0.9, 0, 1));
        const fullScreenScale = window.innerWidth / source.width * (isCompact ? 0.98 : 1.02);
        // Interpolate toward the fullscreen framing STARTING FROM the locked
        // rest pose. With zoom === 0 every term is a no-op, so the workstation
        // holds its resting position exactly and never snaps/jumps (or drifts
        // with the page) when the zoom phase begins.
        centerX += (window.innerWidth / 2 - centerX) * zoom;
        centerY += (window.innerHeight * (0.52 - 0.02 * zoom) - centerY) * zoom;
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
    // ── CAPABILITIES menutup seperti layar monitor dengan bingkai PC ──────────
    const monitorExitFade = experienceProgress;
    const exitSmooth      = smooth(clamp(monitorExitFade, 0, 1));

    // Skala berkurang → layar "menyusut masuk ke bingkai"
    const exitScale  = 1 - exitSmooth * 0.13;
    // Border-radius bertambah → sudut bingkai monitor PC muncul
    const exitRadius = Math.round(exitSmooth * 22);
    // Box-shadow berlapis → bingkai / bezel monitor
    const bIn  = Math.round(exitSmooth * 5);
    const bOut = Math.round(exitSmooth * 22);
    const bezelFrame = exitSmooth > 0.02
      ? `0 0 0 ${bIn}px #090e08, 0 0 0 ${bOut}px #182616, 0 0 0 ${bOut + 4}px #0e190d, 0 30px 100px rgba(0,0,0,.85)`
      : '';
    // Opacity tertunda: konten tetap jelas selagi bezel terbentuk,
    // baru memudar di 62% terakhir transisi
    const opacityPhase = smooth(clamp((monitorExitFade - 0.38) / 0.62, 0, 1));

    // Paksa z-index lewat JS agar CAPABILITIES selalu di atas SELECTED WORKS
    monitorPage.style.zIndex     = '3';
    experiencePage.style.zIndex  = '2';

    monitorPage.style.transform    = `perspective(1200px) translate3d(0, 0, 0) scale(${exitScale})`;
    monitorPage.style.borderRadius = exitRadius > 0 ? `${exitRadius}px` : '';
    monitorPage.style.boxShadow    = bezelFrame;
    // Indikator bezel bawah muncul saat monitor menutup
    monitorPage.style.setProperty('--monitor-bezel-indicator',
      String(smooth(clamp(monitorExitFade * 2.5, 0, 1))));
    monitorPage.style.opacity      = String(pageReveal * (1 - opacityPhase));
    monitorPage.style.visibility   = (monitorZoomProgress < 0.9 || experienceProgress >= 0.98) ? "hidden" : "visible";
    // Bersihkan efek bezel setelah transisi selesai
    if (experienceProgress >= 0.98) {
      monitorPage.style.borderRadius = '';
      monitorPage.style.boxShadow    = '';
      monitorPage.style.removeProperty('--monitor-bezel-indicator');
    }
    monitorPage.style.pointerEvents = (monitorZoomProgress >= 0.98 && experienceProgress < 0.55) ? "auto" : "none";
    monitorPage.inert = monitorZoomProgress < 0.98 || experienceProgress >= 0.55;
    monitorPage.setAttribute("aria-hidden", String(monitorPage.inert));

    // ── SELECTED WORKS naik dari belakang saat monitor menutup ───────────────
    const experienceReveal = smooth(clamp(experienceProgress / 0.55, 0, 1));
    // Mulai lebih kecil & lebih jauh ke bawah → kesan "dari balik layar"
    const experienceScale  = 0.88 + 0.12 * experienceReveal;
    const experienceY      = (1 - experienceReveal) * 55;

    experiencePage.style.opacity    = String(experienceReveal);
    experiencePage.style.transform  = `perspective(1200px) translate3d(0, ${experienceY}px, 0) scale(${experienceScale})`;
    experiencePage.style.visibility = experienceProgress <= 0.01 ? "hidden" : "visible";
    experiencePage.style.pointerEvents = experienceProgress >= 0.55 ? "auto" : "none";
    experiencePage.inert = experienceProgress < 0.55;
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
