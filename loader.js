/**
 * Site Asset Preloader
 * Tracks loading of critical assets and shows a progress-bar loading screen.
 *
 * PRINSIP PENTING:
 * - Loader adalah position:fixed z-index:9999, jadi konten di baliknya
 *   TIDAK perlu dimanipulasi sama sekali (tidak ada opacity/overflow pada main/body).
 * - Tidak ada class yang ditambahkan ke body/html agar tidak merusak:
 *     • position:sticky pada .monitor-portal-page & .experience-page
 *     • position:fixed pada #keyboard-stage (dikelola scroll-motion.js)
 *     • Semua kalkulasi getBoundingClientRect() di scroll-motion.js
 * - Setelah loader selesai, dispatch "resize" agar scroll-motion.js
 *   merecalculate posisi elemen berdasarkan layout yang sudah stabil.
 */
(function () {
  "use strict";

  var loader = document.getElementById("site-loader");
  var fill   = document.getElementById("loader-fill");
  var pct    = document.getElementById("loader-percent");
  var status = document.getElementById("loader-status");

  if (!loader || !fill || !pct || !status) return;

  // ─── Kumpulkan aset yang perlu dimuat ───────────────────────────────────────

  var assets = [];

  // Gambar — termasuk yang lazy; kita force-load semuanya sekarang
  document.querySelectorAll("img[src]").forEach(function (img) {
    assets.push({ type: "image", src: img.src, label: img.alt || img.src.split("/").pop() });
  });

  // data-image pada kartu proyek
  document.querySelectorAll("[data-image]").forEach(function (el) {
    var src = el.getAttribute("data-image");
    if (src) assets.push({ type: "image", src: src, label: src.split("/").pop() });
  });

  // Stylesheet
  document.querySelectorAll("link[rel='stylesheet']").forEach(function (link) {
    assets.push({ type: "other", label: link.href.split("/").pop() });
  });

  // Script (three.js, dsb.)
  document.querySelectorAll("script[src]").forEach(function (script) {
    assets.push({ type: "other", label: script.src.split("/").pop() });
  });

  // Google Fonts
  document.querySelectorAll("link[href*='fonts.googleapis.com']").forEach(function () {
    assets.push({ type: "font", label: "Google Fonts" });
  });

  // ─── Progress state ─────────────────────────────────────────────────────────

  var MIN_MS     = 1200;          // Minimal durasi tampil (ms)
  var startTime  = Date.now();
  var total      = Math.max(assets.length, 1);
  var loaded     = 0;
  var current    = 0;             // Posisi bar saat ini (animasi smooth)
  var target     = 0;             // Target bar
  var rafId      = null;
  var done       = false;

  function tick() {
    var diff = target - current;
    current = Math.abs(diff) < 0.5 ? target : current + diff * 0.14;

    var rounded = Math.round(current);
    fill.style.width   = rounded + "%";
    pct.textContent    = rounded + "%";

    if (rounded < 100) {
      rafId = requestAnimationFrame(tick);
    } else if (!done) {
      done = true;
      finish();
    }
  }

  function mark(label) {
    loaded++;
    target = Math.min(Math.round(loaded / total * 100), 100);
    if (label) status.textContent = "MEMUAT " + label.toUpperCase().slice(0, 26);
  }

  function finish() {
    var wait = Math.max(0, MIN_MS - (Date.now() - startTime));
    status.textContent = "SIAP";

    setTimeout(function () {
      // Fade-out loader
      loader.classList.add("is-finished");

      // Setelah loader selesai fade-out, trigger resize agar scroll-motion.js
      // merecalculate posisi semua elemen (sticky, fixed, dsb.)
      setTimeout(function () {
        window.dispatchEvent(new Event("resize"));

        // Hapus elemen dari DOM agar tidak ada yang numpuk
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 650);
    }, wait);
  }

  // ─── Muat setiap aset ───────────────────────────────────────────────────────

  status.textContent = "MEMPERSIAPKAN ASET";

  var promises = assets.map(function (asset) {
    return new Promise(function (resolve) {
      if (asset.type === "image") {
        var img = new Image();
        img.onload = img.onerror = function () { mark(asset.label); resolve(); };
        img.src = asset.src;
      } else if (asset.type === "font") {
        var ready = document.fonts && document.fonts.ready
          ? document.fonts.ready
          : new Promise(function (r) { setTimeout(r, 800); });
        ready.then(function () { mark(asset.label); resolve(); });
      } else {
        // Script / stylesheet — browser sudah memuatnya; cukup catat
        mark(asset.label);
        resolve();
      }
    });
  });

  // Tunggu juga event window load (semua subresource selesai)
  var windowReady = new Promise(function (resolve) {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", resolve, { once: true });
  });

  // Mulai animasi progress bar
  rafId = requestAnimationFrame(tick);

  // Ketika semua aset & window load selesai, set target ke 100
  Promise.all(promises).then(function () { return windowReady; }).then(function () {
    target = 100;
    if (!rafId) rafId = requestAnimationFrame(tick);
  });

})();
