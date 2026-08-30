/* SIGIL — progressive enhancement. The site is fully usable with this file
   absent; everything here adds polish, never function. Kept tiny and dependency
   free. */
(function () {
  "use strict";
  var root = document.documentElement;

  /* ---- low-end detection: drop glass blur where it would cost too much --- */
  try {
    var lowMem = navigator.deviceMemory && navigator.deviceMemory <= 4;
    var lowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    var saveData = navigator.connection && navigator.connection.saveData;
    if (lowMem || lowCPU || saveData) root.classList.add("no-glass");
  } catch (e) {}

  /* ---- theme toggle ----------------------------------------------------- */
  var THEME_KEY = "sigil-theme";
  function applyTheme(t) {
    if (t === "light" || t === "dark") root.setAttribute("data-theme", t);
    else root.removeAttribute("data-theme");
  }
  try {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved) applyTheme(saved);
  } catch (e) {}

  function currentTheme() {
    var attr = root.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  document.addEventListener("click", function (ev) {
    var btn = ev.target.closest("[data-theme-toggle]");
    if (!btn) return;
    var next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    updateToggle();
  });

  function updateToggle() {
    var btns = document.querySelectorAll("[data-theme-toggle]");
    var isDark = currentTheme() === "dark";
    btns.forEach(function (b) {
      b.setAttribute("aria-pressed", String(isDark));
      var label = b.querySelector("[data-theme-label]");
      if (label) label.textContent = isDark ? "Light" : "Dark";
      b.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    });
  }
  updateToggle();

  /* ---- language suggestion banner --------------------------------------
     If the visitor's Accept-Language (approximated by navigator.language)
     differs from the page language, offer the mirror — but never redirect.
     The choice is remembered so we ask only once. Crawlers don't run JS, so
     indexing always sees the canonical language of the URL. */
  try {
    var LANG_KEY = "sigil-lang-ack";
    var pageLang = (root.getAttribute("lang") || "en").slice(0, 2);
    var altUrl = root.getAttribute("data-alt-url");
    var altLang = root.getAttribute("data-alt-lang");
    var pref = (navigator.language || "en").slice(0, 2).toLowerCase();
    var acked = localStorage.getItem(LANG_KEY);
    var banner = document.getElementById("lang-banner");
    if (banner && altUrl && altLang && !acked && pref === altLang && pref !== pageLang) {
      banner.classList.add("show");
      var dismiss = banner.querySelector("[data-lang-dismiss]");
      if (dismiss) dismiss.addEventListener("click", function () {
        banner.classList.remove("show");
        try { localStorage.setItem(LANG_KEY, pageLang); } catch (e) {}
      });
      var go = banner.querySelector("a");
      if (go) go.addEventListener("click", function () { try { localStorage.setItem(LANG_KEY, altLang); } catch (e) {} });
    }
  } catch (e) {}

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- mark draw-in (once per session) ---------------------------------- */
  try {
    var hero = document.querySelector(".mk-animated");
    if (hero && !reduceMotion && !sessionStorage.getItem("sigil-mark-drawn")) {
      requestAnimationFrame(function () { hero.classList.add("play"); });
      sessionStorage.setItem("sigil-mark-drawn", "1");
    } else if (hero) {
      hero.classList.add("play"); // static end-state; CSS both-fills
    }
  } catch (e) { }

  /* ---- section-seal stamps + reveals via IntersectionObserver ----------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".h-seal, .reveal"));
  function revealNow(el) { el.classList.add(el.classList.contains("h-seal") ? "stamped" : "in"); }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { revealNow(en.target); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.15 });
    revealEls.forEach(function (el) {
      // reveal immediately if already in view on load (covers no-scroll pages)
      var r = el.getBoundingClientRect();
      if (r.top < (window.innerHeight || document.documentElement.clientHeight)) revealNow(el);
      else io.observe(el);
    });
    // failsafe: never leave content hidden if the observer never fires
    setTimeout(function () { revealEls.forEach(revealNow); }, 1200);
  } else {
    revealEls.forEach(revealNow);
  }

  /* ---- reading axis ----------------------------------------------------- */
  var axis = document.querySelector(".axis > i");
  if (axis && !reduceMotion) {
    var ticking = false;
    function upd() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
      axis.style.setProperty("--p", (p * 100).toFixed(2) + "%");
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(upd); ticking = true; }
    }, { passive: true });
    upd();
  }
})();
