/**
 * Tan云短链 landing — Liquid Glass boot (pattern from liquidglass2/showcase)
 */
(function () {
  "use strict";

  /** @type {WeakMap<Element, {supported:boolean, refresh:Function, destroy:Function}>} */
  const instances = new WeakMap();
  const live = new Set();

  function applyGlass(el, opts) {
    if (!el || typeof liquidGlass !== "function") return null;
    const prev = instances.get(el);
    if (prev) {
      try {
        prev.destroy();
      } catch (_) {
        /* noop */
      }
      live.delete(prev);
    }
    const inst = liquidGlass(el, opts || {});
    instances.set(el, inst);
    live.add(inst);
    return inst;
  }

  function parseOpts(el) {
    const raw = el.getAttribute("data-glass-opts");
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch (_) {
      return {};
    }
  }

  function bindGlare(el) {
    if (!el.classList.contains("lg-glare")) return;
    el.addEventListener(
      "pointermove",
      function (e) {
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const gx = ((e.clientX - rect.left) / rect.width) * 100;
        const gy = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--gx", gx.toFixed(1) + "%");
        el.style.setProperty("--gy", gy.toFixed(1) + "%");
      },
      { passive: true }
    );
  }

  function mountAllGlass() {
    document.querySelectorAll("[data-glass]").forEach(function (el) {
      applyGlass(el, parseOpts(el));
      bindGlare(el);
    });
  }

  function initBg() {
    const img = document.querySelector(".bg-photo");
    if (!img) return;
    img.addEventListener("error", function () {
      img.style.display = "none";
    });
  }

  function init() {
    initBg();
    mountAllGlass();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
