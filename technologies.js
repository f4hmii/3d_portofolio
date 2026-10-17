(() => {
  const section = document.querySelector("#stack");
  if (!section) return;

  const filters = section.querySelector(".technology-filters");
  const buttons = [...filters.querySelectorAll("[data-filter]")];
  const items = [...section.querySelectorAll(".technology-item")];
  const results = section.querySelector(".technology-results");
  const cards = [...section.querySelectorAll(".technology-card")];
  const portalTrack = section.querySelector("#monitor-portal-track");
  const portalDetail = section.querySelector("#monitor-portal-detail");
  if (portalTrack && portalDetail) {
    const portalFields = {
      image: portalDetail.querySelector("#monitor-portal-detail-image"),
      category: portalDetail.querySelector("#monitor-portal-detail-category"),
      name: portalDetail.querySelector("#monitor-portal-detail-name"),
      role: portalDetail.querySelector("#monitor-portal-detail-role"),
      description: portalDetail.querySelector("#monitor-portal-detail-description"),
    };
    const logoSet = document.createElement("div");
    logoSet.className = "monitor-portal-logo-set";
    cards.forEach((card) => {
      const tile = document.createElement("button");
      tile.className = "monitor-portal-logo";
      tile.type = "button";
      tile.dataset.techName = card.dataset.name;
      tile.setAttribute("aria-label", `View ${card.dataset.name} information`);
      tile.setAttribute("aria-controls", "monitor-portal-detail");
      tile.setAttribute("aria-pressed", "false");
      const image = document.createElement("img");
      image.src = card.querySelector("img").getAttribute("src");
      image.alt = "";
      image.width = 72;
      image.height = 72;
      tile.append(image);
      logoSet.append(tile);
    });
    const repeat = logoSet.cloneNode(true);
    portalTrack.append(logoSet, repeat);

    const portalButtons = [...portalTrack.querySelectorAll(".monitor-portal-logo")];
    const cardsByName = new Map(cards.map((card) => [card.dataset.name, card]));
    const defaultCard = cards[0];
    let pinnedCard = null;
    function showPortalTechnology(card) {
      portalFields.image.src = card.querySelector("img").getAttribute("src");
      portalFields.category.textContent = card.dataset.categoryLabel;
      portalFields.name.textContent = card.dataset.name;
      portalFields.role.textContent = card.dataset.role;
      portalFields.description.textContent = card.dataset.description;
      portalDetail.hidden = false;
    }
    function restorePortalTechnology() {
      if (pinnedCard || defaultCard) showPortalTechnology(pinnedCard || defaultCard);
      else portalDetail.hidden = true;
    }
    portalButtons.forEach((button) => {
      const card = cardsByName.get(button.dataset.techName);
      button.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "mouse" || event.pointerType === "pen") showPortalTechnology(card);
      });
      button.addEventListener("pointerleave", () => {
        if (document.activeElement !== button) restorePortalTechnology();
      });
      button.addEventListener("focus", () => showPortalTechnology(card));
      button.addEventListener("blur", restorePortalTechnology);
      button.addEventListener("click", () => {
        pinnedCard = card;
        portalButtons.forEach((option) => {
          const selected = option.dataset.techName === card.dataset.name;
          option.classList.toggle("is-selected", selected);
          option.setAttribute("aria-pressed", String(selected));
        });
        showPortalTechnology(card);
      });
    });
    restorePortalTechnology();
  }
  const detail = section.querySelector("#technology-detail");
  const empty = detail.querySelector(".technology-detail-empty");
  const content = detail.querySelector(".technology-detail-content");
  const status = detail.querySelector(".technology-selection-status");
  const fields = {
    icon: detail.querySelector("#technology-detail-icon"),
    name: detail.querySelector("#technology-detail-name"),
    category: detail.querySelector("#technology-detail-category"),
    role: detail.querySelector("#technology-detail-role"),
    description: detail.querySelector("#technology-detail-description"),
  };
  let selectedCard = null;

  function showTechnology(card, announce = false) {
    if (selectedCard !== card) {
      selectedCard = card;
      cards.forEach((option) => {
        const selected = option === card;
        option.classList.toggle("is-selected", selected);
        option.setAttribute("aria-pressed", String(selected));
      });
      fields.icon.src = card.querySelector("img").getAttribute("src");
      fields.name.textContent = card.dataset.name;
      fields.category.textContent = card.dataset.categoryLabel;
      fields.role.textContent = card.dataset.role;
      fields.description.textContent = card.dataset.description;
      empty.hidden = true;
      content.hidden = false;
    }
    if (announce) status.textContent = card.dataset.name + ": " + card.dataset.description;
  }

  cards.forEach((card) => {
    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse" || event.pointerType === "pen") showTechnology(card);
    });
    card.addEventListener("focus", () => showTechnology(card, true));
    card.addEventListener("click", () => {
      showTechnology(card, true);
      // Bring the detail into view when the layout stacks on a small screen.
      if (window.innerWidth <= 740) {
        const rect = detail.getBoundingClientRect();
        if (rect.top >= window.innerHeight || rect.bottom <= 0) {
          detail.scrollIntoView({ block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        }
      }
    });
  });

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      let count = 0;
      items.forEach((item) => {
        const visible = category === "all" || item.dataset.category === category;
        item.hidden = !visible;
        if (visible) count++;
      });
      if (selectedCard?.closest(".technology-item").hidden) {
        selectedCard.classList.remove("is-selected");
        selectedCard.setAttribute("aria-pressed", "false");
        selectedCard = null;
        empty.hidden = false;
        content.hidden = true;
        status.textContent = "";
      }
      buttons.forEach((option) => {
        const selected = option === button;
        option.classList.toggle("is-active", selected);
        option.setAttribute("aria-pressed", String(selected));
      });
      const label = category === "all" ? "" : " · " + button.firstChild.textContent.trim();
      results.textContent = count + " technologies shown" + label;
    });
  });
  filters.hidden = false;

  const links = [...document.querySelectorAll('.nav-link[href^="#"]')];
  const destinations = links.map((link) => document.querySelector(link.getAttribute("href")));
  let pending = false;
  function updateNavigation() {
    pending = false;
    let current = 0;
    destinations.forEach((destination, index) => {
      if (destination && destination.getBoundingClientRect().top <= window.innerHeight * 0.35) {
        current = index;
      }
    });
    links.forEach((link, index) => {
      const active = index === current;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  function requestNavigationUpdate() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(updateNavigation);
  }
  window.addEventListener("scroll", requestNavigationUpdate, { passive: true });
  window.addEventListener("resize", requestNavigationUpdate);
  window.addEventListener("load", requestNavigationUpdate);
  updateNavigation();
})();
