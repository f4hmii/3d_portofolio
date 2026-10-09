const stack = [
  { name: "Supabase", mark: "SB", color: "#55d5a0", category: "BACKEND AS A SERVICE", level: "DIKUASAI", score: 85, description: "Membangun backend aplikasi dengan database, autentikasi, dan layanan Supabase." },
  { name: "MySQL", mark: "SQL", color: "#61a8d8", category: "RELATIONAL DATABASE", level: "DIKUASAI", score: 85, description: "Mengelola data relasional dan query untuk kebutuhan aplikasi." },
  { name: "React", mark: "⚛", color: "#67dff5", category: "FRONTEND LIBRARY", level: "DIKUASAI", score: 85, description: "Membangun antarmuka responsif dan interaktif dengan komponen." },
  { name: "Next.js", mark: "N", color: "#f1f0e9", category: "REACT FRAMEWORK", level: "DIKUASAI", score: 85, description: "Mengembangkan aplikasi web berbasis React dengan routing dan rendering modern." },
  { name: "TypeScript", mark: "TS", color: "#579bfa", category: "TYPED JAVASCRIPT", level: "DIKUASAI", score: 85, description: "Menulis JavaScript dengan tipe yang membantu menjaga kode tetap jelas." },
  { name: "JavaScript", mark: "JS", color: "#e8cd58", category: "PROGRAMMING LANGUAGE", level: "DIKUASAI", score: 85, description: "Mengembangkan interaksi dan logika aplikasi di web maupun server." },
  { name: "Tailwind CSS", mark: "TW", color: "#55d5d0", category: "CSS FRAMEWORK", level: "DIKUASAI", score: 85, description: "Membangun tampilan konsisten menggunakan utility classes." },
  { name: "Flutter", mark: "FL", color: "#69b9f5", category: "CROSS-PLATFORM UI", level: "DIKUASAI", score: 85, description: "Membangun aplikasi lintas platform dengan satu basis kode." },
  { name: "Dart", mark: "D", color: "#58b8cc", category: "PROGRAMMING LANGUAGE", level: "DIKUASAI", score: 85, description: "Mengembangkan aplikasi menggunakan bahasa Dart, termasuk untuk Flutter." },
  { name: "Laravel", mark: "L", color: "#f06c63", category: "PHP FRAMEWORK", level: "DIKUASAI", score: 85, description: "Membangun aplikasi backend dengan ekosistem Laravel." },
  { name: "Node.js", mark: "JS", color: "#a8cf67", category: "JAVASCRIPT RUNTIME", level: "DIKUASAI", score: 85, description: "Menjalankan JavaScript di server untuk membangun layanan aplikasi." },
  { name: "Express.js", mark: "EX", color: "#d4d8cf", category: "NODE.JS FRAMEWORK", level: "DIKUASAI", score: 85, description: "Membuat API dan aplikasi web server dengan framework Express." },
  { name: "Cloudflare Pages", mark: "CF", color: "#f3a75a", category: "WEB HOSTING", level: "DIKUASAI", score: 85, description: "Mempublikasikan website dan aplikasi web melalui Cloudflare Pages." },
  { name: "Vercel", mark: "V", color: "#f1f0e9", category: "WEB HOSTING", level: "DIKUASAI", score: 85, description: "Mendeploy aplikasi web melalui platform Vercel." },
  { name: "Git", mark: "G", color: "#ee795e", category: "VERSION CONTROL", level: "DIKUASAI", score: 85, description: "Melacak perubahan kode dan mengelola riwayat pengembangan." },
  { name: "GitHub", mark: "GH", color: "#e7e8e0", category: "CODE COLLABORATION", level: "DIKUASAI", score: 85, description: "Menyimpan repository dan berkolaborasi pada proyek perangkat lunak." },
  { name: "Postman", mark: "PM", color: "#f18c55", category: "API DEVELOPMENT", level: "DIKUASAI", score: 85, description: "Menguji dan mengelola request API selama pengembangan." },
  { name: "Laragon", mark: "LA", color: "#7bbd8b", category: "LOCAL DEVELOPMENT", level: "DIKUASAI", score: 85, description: "Menyiapkan lingkungan pengembangan lokal untuk aplikasi web." },
];

const keycapColors = [
  "#f2efd9", "#f2efd9", "#f2efd9", "#f2efd9", "#f2efd9", "#f2efd9",
  "#f2efd9", "#f2efd9", "#f2efd9", "#f2efd9", "#f2efd9", "#f2efd9",
  "#f2efd9", "#f2efd9", "#f2efd9", "#f2efd9", "#f2efd9", "#f2efd9",
];

const fallbackLayout = [
  [["tech", 2, 0], ["tech", 2, 1], ["tech", 2, 2], ["tech", 2, 3], ["tech", 2, 4], ["tech", 2, 5]],
  [["tech", 2, 6], ["tech", 2, 7], ["tech", 2, 8], ["tech", 2, 9], ["tech", 2, 10], ["tech", 2, 11]],
  [["tech", 2, 12], ["tech", 2, 13], ["tech", 2, 14], ["tech", 2, 15], ["tech", 2, 16], ["tech", 2, 17]],
];
const modifierLabels = new Set([]);

const fallback = document.querySelector("#keyboard-fallback");
const showcase = fallback.closest(".showcase");
const board = document.createElement("div");
board.className = "fallback-board";
let capArtworkCount = 0;
function capArtwork() {
  const id = `keycap-${capArtworkCount++}`;
  // Trim the artwork's empty top and bottom gutters so adjacent rows sit close together.
  return `<svg class="cap-geometry" viewBox="0 5 100 92" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="${id}-front" x2="0" y2="1">
        <stop stop-color="#c9c2aa"/><stop offset="1" stop-color="#aaa189"/>
      </linearGradient>
      <linearGradient id="${id}-left" x2="1" y2="1">
        <stop stop-color="#e4e0c8"/><stop offset="1" stop-color="#bab59e"/>
      </linearGradient>
      <linearGradient id="${id}-right" x2="1" y2="1">
        <stop stop-color="#b8b39b"/><stop offset="1" stop-color="#85816d"/>
      </linearGradient>
      <linearGradient id="${id}-top" x2=".4" y2="1">
        <stop stop-color="#f8f4e2"/><stop offset="1" stop-color="#e8e2cb"/>
      </linearGradient>
      <radialGradient id="${id}-dish" cx=".5" cy=".4" r=".65">
        <stop stop-color="#a69d80" stop-opacity=".08"/>
        <stop offset="1" stop-color="#f9f6e8" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- One closed body under the crown; straight walls taper toward the top. -->
    <path fill="url(#${id}-front)" d="M15 6 H85 Q92 6 93 14 L98 88 Q99 96 90 96 H10 Q1 96 2 88 L7 14 Q8 6 15 6 Z"/>
    <path fill="url(#${id}-left)" d="M7 14 L2 88 Q1 96 10 96 L15 67 Q7 67 7 59 Z"/>
    <path fill="url(#${id}-right)" d="M93 14 L98 88 Q99 96 90 96 L85 67 Q93 67 93 59 Z"/>
    <path d="M10 95 H90" fill="none" stroke="#726e5c" stroke-opacity=".45" stroke-width="1.2"/>
    <rect x="7" y="6" width="86" height="61" rx="8" fill="url(#${id}-top)"/>
    <rect x="7" y="6" width="86" height="61" rx="8" fill="url(#${id}-dish)"/>
    <path d="M8 16 V14 Q8 7 15 7 H85 Q92 7 92 14" fill="none" stroke="#fffdf0" stroke-opacity=".4" stroke-width=".8"/>
  </svg>`;
}
fallbackLayout.forEach((row) => {
  const rowElement = document.createElement("div");
  rowElement.className = "fallback-row";
  rowElement.dataset.techCount = row.filter((entry) => Number.isInteger(entry[2])).length;
  row.forEach(([label, width, techIndex]) => {
    // The socket stays on the board while its keycap animates independently.
    const socket = document.createElement("div");
    socket.className = "fallback-socket";
    socket.style.flex = `${width} 1 0`;
    const cap = document.createElement(Number.isInteger(techIndex) ? "button" : "div");
    cap.className = `fallback-cap${Number.isInteger(techIndex) ? " fallback-tech" : ""}`;
    if (Number.isInteger(techIndex)) {
      const tech = stack[techIndex];
      cap.type = "button";
      cap.dataset.tech = techIndex;
      cap.style.setProperty("--assembly-delay", `${0.84 + techIndex * 0.11}s`);
      cap.setAttribute("aria-label", `Lihat teknologi ${tech.name}`);
      cap.setAttribute("aria-pressed", String(techIndex === 0));
      cap.style.setProperty("--tech-color", tech.color);
      cap.style.setProperty("--cap-color", keycapColors[techIndex]);
      cap.innerHTML = `${capArtwork()}<span class="fallback-surface"><span class="fallback-logo">${window.TechStackLogos.markup(tech.name)}</span><span class="fallback-number">${String(techIndex + 1).padStart(2, "0")}</span></span>`;
    } else {
      cap.setAttribute("aria-hidden", "true");
      cap.innerHTML = `${capArtwork()}<span class="fallback-surface">${label || ""}</span>`;
      if (modifierLabels.has(label)) cap.classList.add("fallback-modifier");
      if (label === "Esc") cap.classList.add("fallback-esc");
      if (["â†‘", "â†", "â†“", "â†’"].includes(label)) cap.classList.add("fallback-arrow");
      if (["ðŸ˜", "ðŸ˜†", "ðŸ˜Ž", "ðŸ™„"].includes(label)) cap.classList.add("fallback-emoji");
      if (!label) cap.classList.add("fallback-space");
    }
    socket.appendChild(cap);
    rowElement.appendChild(socket);
  });
  board.appendChild(rowElement);
});
board.insertAdjacentHTML("beforeend", '<div class="fallback-caption"><span>RKâ€”01</span><span>75% COMPACT</span><span>CREATIVE DECK</span></div>');
fallback.appendChild(board);

const fields = {
  number: document.querySelector("#tech-number"), icon: document.querySelector("#tech-icon"),
  name: document.querySelector("#tech-name"), category: document.querySelector("#tech-category"),
  description: document.querySelector("#tech-description"), level: document.querySelector("#tech-level"),
  fill: document.querySelector("#level-fill"),
};
function chooseTech(index) {
  const tech = stack[index];
  fields.number.textContent = `${String(index + 1).padStart(2, "0")} / ${String(stack.length).padStart(2, "0")}`;
  fields.icon.innerHTML = window.TechStackLogos.markup(tech.name);
  fields.icon.style.color = tech.color;
  fields.icon.style.borderColor = `${tech.color}45`;
  fields.icon.style.background = "#f2efd9";
  fields.name.textContent = tech.name;
  fields.category.textContent = tech.category;
  fields.description.textContent = tech.description;
  fields.level.textContent = tech.level;
  fields.fill.style.width = `${tech.score}%`;
  fields.fill.style.background = tech.color;
  fallback.querySelectorAll(".fallback-tech").forEach((cap) => {
    const selected = Number(cap.dataset.tech) === index;
    cap.classList.toggle("selected", selected);
    cap.setAttribute("aria-pressed", String(selected));
  });
}
fallback.querySelectorAll(".fallback-tech").forEach((cap) => {
  const select = () => {
    chooseTech(Number(cap.dataset.tech));
    showcase.classList.add("card-visible");
  };
  cap.addEventListener("mouseenter", select);
  cap.addEventListener("focus", select);
  cap.addEventListener("click", () => {
    select();
    window.keyboardAudio?.press();
    window.keyboardAudio?.release(0.065);
  });
});
fallback.addEventListener("mouseleave", () => showcase.classList.remove("card-visible"));
fallback.addEventListener("focusout", (event) => {
  if (!fallback.contains(event.relatedTarget)) showcase.classList.remove("card-visible");
});
chooseTech(0);

// Reveal exactly one keyboard. The fallback is only for a failed 3D startup.
const keyboardStage = document.querySelector("#keyboard-stage");
const fallbackMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let keyboardViewState = "loading";
function startKeyboardAssembly() {
  keyboardStage.classList.add("assembling");
  keyboardStage.setAttribute("aria-busy", "true");
  fallback.inert = true;
}
function finishKeyboardAssembly() {
  keyboardStage.classList.remove("assembling");
  keyboardStage.setAttribute("aria-busy", "false");
  fallback.inert = keyboardViewState !== "fallback";
}
function revealKeyboard(view) {
  if (keyboardViewState !== "loading") return;
  keyboardViewState = view;
  const useFallback = view === "fallback";
  if (useFallback) {
    if (fallbackMotionPreference.matches) finishKeyboardAssembly();
    else startKeyboardAssembly();
  }
  const assembling = keyboardStage.classList.contains("assembling");
  fallback.inert = !useFallback || assembling;
  fallback.setAttribute("aria-hidden", String(!useFallback));
  document.querySelector("#keyboard-canvas").setAttribute("aria-hidden", String(useFallback));
  keyboardStage.classList.add(`${view}-ready`);
  keyboardStage.setAttribute("aria-busy", String(assembling));
  document.querySelector("#canvas-loading").classList.add("loaded");
}
window.keyboardView = Object.freeze({
  showWebGL: () => revealKeyboard("webgl"),
  showFallback: () => revealKeyboard("fallback"),
  startAssembly: startKeyboardAssembly,
  finishAssembly: finishKeyboardAssembly,
});
fallback.addEventListener("animationend", (event) => {
  if (event.animationName === "fallback-key-assembly" && event.target.dataset.tech === String(stack.length - 1)) {
    finishKeyboardAssembly();
  }
});
fallbackMotionPreference.addEventListener("change", (event) => {
  if (event.matches && keyboardViewState === "fallback") finishKeyboardAssembly();
});

// A missing or invalid entry script cannot report its own startup failure.
window.addEventListener("load", () => {
  if (typeof initializeKeyboard3D !== "function") window.keyboardView.showFallback();
}, { once: true });


