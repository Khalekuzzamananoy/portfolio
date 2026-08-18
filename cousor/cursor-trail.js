/**
 * ============================================================================
 * CURSOR-TRAIL.JS — Smart Inverting Circle Custom Cursor (Black / White)
 * ============================================================================
 * Zero-dependency, ultra-responsive custom cursor system with:
 *  - Dual-layer inertia tracking (crisp lead dot + spring circle halo)
 *  - High-precision surface detection: Black on light -> White on dark
 *  - Instant 0.04s color transitions
 *  - Interactive circle morphs (buttons, project cards, inputs)
 *  - Magnetic attraction on interactive buttons & CTAs
 *  - Automatic touch/mobile device detection & clean disabling
 *  - Full prefers-reduced-motion compliance
 *
 * USAGE:
 *  <script src="cursor-trail.js" data-color="#000000" data-magnetic="true"></script>
 * ============================================================================
 */

(function () {
  "use strict";

  // Do not run on server-side or if touch device
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const isTouchDevice = () => {
    return (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(hover: none)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0
    );
  };

  if (isTouchDevice()) return;

  // --------------------------------------------------------------------------
  // 1. Configuration & Options
  // --------------------------------------------------------------------------
  const currentScript = document.currentScript;
  const attrColor = currentScript?.getAttribute("data-color");
  const attrMagnetic = currentScript?.getAttribute("data-magnetic");
  const attrInertia = currentScript?.getAttribute("data-inertia");

  const userConfig = window.CursorTrailConfig || {};

  const config = {
    color: userConfig.color || attrColor || "#000000",
    dotSize: userConfig.dotSize || 6,
    ringSize: userConfig.ringSize || 36,
    inertia: parseFloat(userConfig.inertia || attrInertia || "0.16"),
    magnetic: userConfig.magnetic !== undefined ? userConfig.magnetic : (attrMagnetic !== "false"),
    magneticDistance: userConfig.magneticDistance || 45,
    zIndex: userConfig.zIndex || 999999
  };

  // --------------------------------------------------------------------------
  // 2. Inject Dynamic CSS Styles
  // --------------------------------------------------------------------------
  const injectStyles = () => {
    if (document.getElementById("cursor-trail-styles")) return;

    const style = document.createElement("style");
    style.id = "cursor-trail-styles";
    style.innerHTML = `
      #ct-cursor-dot,
      #ct-cursor-ring {
        pointer-events: none;
        position: fixed;
        top: 0;
        left: 0;
        z-index: ${config.zIndex};
        border-radius: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        will-change: transform, width, height, opacity, background-color, border-color, left, top;
        transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                    background-color 0.04s ease-out,
                    border-color 0.04s ease-out,
                    color 0.04s ease-out,
                    box-shadow 0.04s ease-out;
      }

      /* Default on Light Background: BLACK */
      #ct-cursor-dot {
        width: ${config.dotSize}px;
        height: ${config.dotSize}px;
        background-color: #000000;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
      }

      #ct-cursor-ring {
        width: ${config.ringSize}px;
        height: ${config.ringSize}px;
        border: 1.5px solid #000000;
        background: rgba(0, 0, 0, 0.04);
        backdrop-filter: blur(1px);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #000000;
        overflow: hidden;
        transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                    height 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                    background 0.04s ease-out,
                    border-color 0.04s ease-out,
                    color 0.04s ease-out,
                    box-shadow 0.04s ease-out,
                    border-radius 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }

      #ct-cursor-ring .ct-cursor-text {
        opacity: 0;
        transform: scale(0.6);
        color: inherit;
        transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), color 0.04s ease-out;
        pointer-events: none;
        white-space: nowrap;
      }

      /* Inversion on Dark Surfaces: WHITE */
      body.ct-on-dark #ct-cursor-dot {
        background-color: #ffffff !important;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.7) !important;
      }

      body.ct-on-dark #ct-cursor-ring {
        border-color: #ffffff !important;
        background: rgba(255, 255, 255, 0.09) !important;
        color: #ffffff !important;
      }

      /* Hover States - Buttons */
      body.ct-hover-btn #ct-cursor-ring {
        width: 58px;
        height: 58px;
        border-color: #000000;
        background: rgba(0, 0, 0, 0.08);
        box-shadow: 0 0 25px rgba(0, 0, 0, 0.15);
      }
      body.ct-on-dark.ct-hover-btn #ct-cursor-ring {
        border-color: #ffffff !important;
        background: rgba(255, 255, 255, 0.18) !important;
        box-shadow: 0 0 25px rgba(255, 255, 255, 0.4) !important;
      }
      body.ct-hover-btn #ct-cursor-dot {
        opacity: 0 !important;
      }

      /* Hover States - Project Cards */
      body.ct-hover-card #ct-cursor-ring {
        width: 82px;
        height: 82px;
        border-color: #000000;
        background: #000000;
        color: #ffffff;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      }
      body.ct-on-dark.ct-hover-card #ct-cursor-ring {
        border-color: #ffffff !important;
        background: #ffffff !important;
        color: #000000 !important;
        box-shadow: 0 10px 30px rgba(255, 255, 255, 0.35) !important;
      }
      body.ct-hover-card #ct-cursor-ring .ct-cursor-text {
        opacity: 1;
        transform: scale(1);
      }
      body.ct-hover-card #ct-cursor-dot {
        opacity: 0 !important;
      }

      /* Hover States - Text Inputs */
      body.ct-hover-text #ct-cursor-ring {
        width: 4px;
        height: 28px;
        border-radius: 2px;
        border-color: #000000;
        background: #000000;
      }
      body.ct-on-dark.ct-hover-text #ct-cursor-ring {
        border-color: #ffffff !important;
        background: #ffffff !important;
      }
      body.ct-hover-text #ct-cursor-dot {
        opacity: 0 !important;
      }

      @media (prefers-reduced-motion: reduce) {
        #ct-cursor-dot,
        #ct-cursor-ring {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  };

  // --------------------------------------------------------------------------
  // 3. Surface Darkness Detection Engine
  // --------------------------------------------------------------------------
  const parseBgColor = (bg) => {
    if (!bg || bg === "transparent" || bg === "rgba(0, 0, 0, 0)") return null;
    const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return null;
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
    if (a < 0.25) return null;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance < 128;
  };

  const isDarkElement = (target) => {
    if (!target || !(target instanceof Element)) return false;

    let el = target;
    while (el && el !== document.documentElement) {
      if (
        el.classList.contains("bg-black") ||
        el.classList.contains("background-color-black") ||
        el.classList.contains("footer_component") ||
        el.classList.contains("testimonials_col-black-overlay")
      ) {
        return true;
      }

      const bg = window.getComputedStyle(el).backgroundColor;
      const isDark = parseBgColor(bg);
      if (isDark !== null) {
        return isDark;
      }

      el = el.parentElement;
    }

    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    const bodyDark = parseBgColor(bodyBg);
    if (bodyDark !== null) return bodyDark;

    return false;
  };

  // --------------------------------------------------------------------------
  // 4. Inject DOM Elements
  // --------------------------------------------------------------------------
  let dot, ring;

  const initDOM = () => {
    injectStyles();

    // Lead Dot
    if (!document.getElementById("ct-cursor-dot")) {
      dot = document.createElement("div");
      dot.id = "ct-cursor-dot";
      dot.setAttribute("aria-hidden", "true");
      document.body.appendChild(dot);
    } else {
      dot = document.getElementById("ct-cursor-dot");
    }

    // Spring Ring Circle
    if (!document.getElementById("ct-cursor-ring")) {
      ring = document.createElement("div");
      ring.id = "ct-cursor-ring";
      ring.setAttribute("aria-hidden", "true");
      ring.innerHTML = "<span class=\"ct-cursor-text\">VIEW ↗</span>";
      document.body.appendChild(ring);
    } else {
      ring = document.getElementById("ct-cursor-ring");
    }
  };

  // --------------------------------------------------------------------------
  // 5. Physics & Circle Motion Engine
  // --------------------------------------------------------------------------
  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isVisible = false;

  const onMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      ringX = mouseX;
      ringY = mouseY;
      if (dot) dot.style.opacity = "1";
      if (ring) ring.style.opacity = "1";
    }

    if (dot) {
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
    }

    // Accurate Dark surface detection
    const target = e.target instanceof Element ? e.target : document.elementFromPoint(mouseX, mouseY);
    if (target && target instanceof Element) {
      if (isDarkElement(target)) {
        if (!document.body.classList.contains("ct-on-dark")) {
          document.body.classList.add("ct-on-dark");
        }
      } else {
        if (document.body.classList.contains("ct-on-dark")) {
          document.body.classList.remove("ct-on-dark");
        }
      }
    }
  };

  const render = () => {
    // Spring Halo Position
    if (ring && isVisible) {
      ringX += (mouseX - ringX) * config.inertia;
      ringY += (mouseY - ringY) * config.inertia;
      ring.style.left = ringX.toFixed(2) + "px";
      ring.style.top = ringY.toFixed(2) + "px";
    }

    requestAnimationFrame(render);
  };

  // --------------------------------------------------------------------------
  // 6. Contextual Hover & Circle Morph Detection (Event Delegation)
  // --------------------------------------------------------------------------
  const clearHoverClasses = () => {
    document.body.classList.remove("ct-hover-btn", "ct-hover-card", "ct-hover-text");
  };

  const attachHoverListeners = () => {
    const cardSelector = "[data-cursor=\"card\"], .pf-work-row";
    const btnSelector = "button, .btn, .mi-shiny-cta, input[type=\"submit\"], input[type=\"button\"], [role=\"button\"], .button";
    const textSelector = "input[type=\"text\"], input[type=\"email\"], input[type=\"tel\"], input[type=\"search\"], textarea, [contenteditable=\"true\"]";

    document.addEventListener("mouseover", (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      const card = target.closest(cardSelector);
      if (card) {
        clearHoverClasses();
        const customText = card.getAttribute("data-cursor-text") || "VIEW ↗";
        const ringTextEl = ring?.querySelector(".ct-cursor-text");
        if (ringTextEl) ringTextEl.innerText = customText;
        document.body.classList.add("ct-hover-card");
        return;
      }

      const btn = target.closest(btnSelector);
      if (btn) {
        clearHoverClasses();
        document.body.classList.add("ct-hover-btn");
        return;
      }

      const text = target.closest(textSelector);
      if (text) {
        clearHoverClasses();
        document.body.classList.add("ct-hover-text");
        return;
      }
    }, { passive: true });

    document.addEventListener("mouseout", (e) => {
      const related = e.relatedTarget;
      if (!related || (related instanceof Element && !related.closest(cardSelector + ", " + btnSelector + ", " + textSelector))) {
        clearHoverClasses();
      }
    }, { passive: true });
  };

  // --------------------------------------------------------------------------
  // 7. Magnetic Elements Pull Physics
  // --------------------------------------------------------------------------
  const setupMagneticAttraction = () => {
    if (!config.magnetic) return;

    const magneticSelector = "[data-magnetic=\"true\"], .magnetic, button, .mi-shiny-cta, .btn";

    document.addEventListener("mousemove", (e) => {
      const el = e.target instanceof Element ? e.target.closest(magneticSelector) : null;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const dist = Math.hypot(deltaX, deltaY);

      if (dist < config.magneticDistance + Math.max(rect.width, rect.height) / 2) {
        const strength = 0.22;
        el.style.transform = "translate3d(" + (deltaX * strength) + "px, " + (deltaY * strength) + "px, 0)";
      }
    }, { passive: true });

    document.addEventListener("mouseout", (e) => {
      const el = e.target instanceof Element ? e.target.closest(magneticSelector) : null;
      if (el) {
        el.style.transform = "";
        el.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
        setTimeout(() => {
          el.style.transition = "";
        }, 400);
      }
    }, { passive: true });
  };

  // --------------------------------------------------------------------------
  // 8. Initialization & Lifecycle
  // --------------------------------------------------------------------------
  const start = () => {
    initDOM();
    attachHoverListeners();
    setupMagneticAttraction();

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    document.addEventListener("mouseleave", () => {
      isVisible = false;
      if (dot) dot.style.opacity = "0";
      if (ring) ring.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
      isVisible = true;
      if (dot) dot.style.opacity = "1";
      if (ring) ring.style.opacity = "1";
    });

    requestAnimationFrame(render);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
