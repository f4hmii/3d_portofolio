// Horizontal project carousel: keeps all projects in one viewport row.
(() => {
  const track = document.querySelector("#project-track");
  const dotsWrap = document.querySelector("#project-dots");
  const prevBtn = document.querySelector("[data-carousel-prev]");
  const nextBtn = document.querySelector("[data-carousel-next]");
  if (!track || !dotsWrap || !prevBtn || !nextBtn) return;

  const cards = [...track.querySelectorAll(".experience-project")];
  if (!cards.length) return;

  const dots = cards.map((card, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "project-carousel-dot";
    dot.setAttribute("aria-label", "View project " + (index + 1));
    dot.addEventListener("click", () => {
      closeAllPreviews();
      scrollToIndex(index);
    });
    dotsWrap.append(dot);
    return dot;
  });

  function step() {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return cards[0].getBoundingClientRect().width + gap;
  }

  function maxScroll() {
    return Math.max(0, track.scrollWidth - track.clientWidth);
  }

  function scrollToIndex(index) {
    const clamped = Math.max(0, Math.min(cards.length - 1, index));
    track.scrollTo({ left: clamped * step(), behavior: "smooth" });
  }

  function activeIndex() {
    if (track.scrollLeft >= maxScroll() - 2) return cards.length - 1;
    const size = step();
    if (size <= 0) return 0;
    return Math.max(0, Math.min(cards.length - 1, Math.round(track.scrollLeft / size)));
  }

  function sync() {
    const index = activeIndex();
    cards.forEach((card, i) => card.classList.toggle("is-active", i === index));
    dots.forEach((dot, i) => {
      const on = i === index;
      dot.classList.toggle("is-active", on);
      if (on) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    prevBtn.disabled = track.scrollLeft <= 2;
    nextBtn.disabled = track.scrollLeft >= maxScroll() - 2;
  }

  let pending = false;
  track.addEventListener("scroll", () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      sync();
    });
  }, { passive: true });

  prevBtn.addEventListener("click", () => {
    closeAllPreviews();
    scrollToIndex(activeIndex() - 1);
  });
  nextBtn.addEventListener("click", () => {
    closeAllPreviews();
    scrollToIndex(activeIndex() + 1);
  });

  track.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      closeAllPreviews();
      scrollToIndex(activeIndex() + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      closeAllPreviews();
      scrollToIndex(activeIndex() - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      closeAllPreviews();
      scrollToIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      closeAllPreviews();
      scrollToIndex(cards.length - 1);
    }
  });

  // Mouse drag-to-scroll (touch already scrolls natively).
  let dragging = false;
  let startX = 0;
  let startScroll = 0;
  let moved = false;
  let suppressClick = false;

  track.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    if (event.target.closest("a, button")) return;
    dragging = true;
    moved = false;
    startX = event.clientX;
    startScroll = track.scrollLeft;
    track.style.scrollBehavior = "auto";
    track.style.scrollSnapType = "none";
    track.style.cursor = "grabbing";
  });

  window.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) > 5) moved = true;
    track.scrollLeft = startScroll - delta;
  });

  window.addEventListener("pointerup", () => {
    if (!dragging) return;
    dragging = false;
    track.style.scrollBehavior = "";
    track.style.scrollSnapType = "";
    track.style.cursor = "";
    suppressClick = moved;
    if (moved) {
      closeAllPreviews();
      scrollToIndex(activeIndex());
    }
  });

  // Swallow the click that ends a drag so links are not triggered accidentally.
  track.addEventListener("click", (event) => {
    if (!suppressClick) return;
    suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  // Only take over the wheel when the intent is clearly horizontal
  // (shift+wheel or a trackpad's horizontal delta). A plain vertical wheel must
  // keep scrolling the page, otherwise the sticky section would trap the user.
  track.addEventListener("wheel", (event) => {
    const horizontal = event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY);
    if (!horizontal) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    const atStart = track.scrollLeft <= 0 && delta < 0;
    const atEnd = track.scrollLeft >= maxScroll() - 1 && delta > 0;
    if (atStart || atEnd) return;   // let the page take over at the edges
    event.preventDefault();
    track.scrollLeft += delta;
  }, { passive: false });

  window.addEventListener("resize", sync);
  sync();

  /* ---------------------------------------------------------------
     Image preview mode: click a card to crossfade its text into the
     project screenshot pulled from the local image_asset/ folder.
     --------------------------------------------------------------- */
  cards.forEach((card) => {
    const src = card.dataset.image;
    if (!src) return;

    const preview = document.createElement("div");
    preview.className = "experience-project-preview";
    preview.hidden = true;

    const img = document.createElement("img");
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    // Missing file? Keep the frame elegant with a dark gradient instead of a
    // broken image icon.
    img.addEventListener("error", () => {
      preview.classList.add("is-missing");
      img.removeAttribute("src");
    });
    img.src = src;

    const shade = document.createElement("div");
    shade.className = "experience-project-preview-shade";

    const caption = document.createElement("div");
    caption.className = "experience-project-preview-caption";
    const category = document.createElement("span");
    const rawTag = (card.querySelector(".experience-project-tag") || {}).textContent || "";
    category.textContent = rawTag.replace(/^\s*\d+\s*/, "").trim();
    const title = document.createElement("strong");
    title.textContent = (card.querySelector("h3") || {}).textContent || "";
    caption.append(category, title);

    const actions = document.createElement("div");
    actions.className = "experience-project-preview-actions";

    const back = document.createElement("button");
    back.type = "button";
    back.className = "experience-project-pill";
    back.textContent = "BACK TO DETAILS";
    back.addEventListener("click", (event) => {
      event.stopPropagation();
      closePreview(card);
    });

    const live = document.createElement("a");
    live.className = "experience-project-pill is-primary";
    live.href = card.dataset.link || "#contact";
    live.textContent = "OPEN PROJECT \u2197";
    live.addEventListener("click", (event) => event.stopPropagation());

    actions.append(back, live);
    preview.append(img, shade, caption, actions);
    card.append(preview);

    // Whole card, the top right arrow icon, and the CTA all toggle the preview.
    const toggle = (event) => {
      if (event.target.closest(".experience-project-preview-actions, .experience-project-preview-pill")) return;
      event.preventDefault();
      if (card.classList.contains("is-preview")) closePreview(card);
      else openPreview(card);
    };
    card.addEventListener("click", toggle);

    const cta = card.querySelector(".experience-project-cta");
    if (cta) {
      cta.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openPreview(card);
      });
    }
  });

  function openPreview(card) {
    cards.forEach((other) => { if (other !== card) closePreview(other); });
    const preview = card.querySelector(".experience-project-preview");
    if (!preview) return;
    preview.hidden = false;
    // Force a frame so the opacity transition actually runs.
    preview.getBoundingClientRect();
    card.classList.add("is-preview");
    card.setAttribute("aria-expanded", "true");
  }

  function closePreview(card) {
    if (!card.classList.contains("is-preview")) return;
    card.classList.remove("is-preview");
    card.setAttribute("aria-expanded", "false");
    const preview = card.querySelector(".experience-project-preview");
    if (!preview) return;
    const done = () => {
      if (card.classList.contains("is-preview")) return;
      preview.hidden = true;
      preview.removeEventListener("transitionend", done);
    };
    preview.addEventListener("transitionend", done);
  }

  function closeAllPreviews() {
    cards.forEach(closePreview);
  }

  // Escape closes any open preview.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAllPreviews();
  });

  // Any slide change (arrows, dots, drag, wheel) drops the open preview.
  let lastIndex = activeIndex();
  track.addEventListener("scroll", () => {
    const index = activeIndex();
    if (index !== lastIndex) {
      closeAllPreviews();
      lastIndex = index;
    }
  }, { passive: true });
})();
