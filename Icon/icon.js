/**
 * Doodle Icons Web Component & Helper Library
 * Zero dependencies, drop-in ready for React, Vue, Svelte, or Vanilla JS.
 */

const DOODLE_ICONS = {
  squiggle: {
    viewBox: '0 0 90 40',
    color: '#ff5e8e',
    path: 'M3 30c10-18 20-24 24-16 4 8-12 20-6 24 6 4 14-16 24-20s16 4 12 10c-4 6-14 4-8-4s22-14 36-8',
    attr: 'stroke-linecap="round"',
    strokeWidth: '2.4',
    animation: 'doodle-float'
  },
  sparkle: {
    viewBox: '0 0 32 32',
    color: '#ffd15c',
    path: 'M16 3c1 5.5 3.5 9 10 10-6.5 1.5-9 4.5-10 10-1-5.5-3.5-8.5-10-10 6.5-1 9-4.5 10-10Z',
    attr: 'stroke-linejoin="round"',
    strokeWidth: '2.2',
    animation: 'doodle-twinkle'
  },
  burst: {
    viewBox: '0 0 32 32',
    color: '#b388ff',
    path: 'M16 3v26M5 8l22 16M27 8 5 24M3 16h26',
    attr: 'stroke-linecap="round"',
    strokeWidth: '2.4',
    animation: 'doodle-spin'
  },
  arrow: {
    viewBox: '0 0 48 48',
    color: '#38bdf8',
    path: 'M6 6c20 2 30 12 32 32M30 34l8 6 4-10',
    attr: 'stroke-linecap="round" stroke-linejoin="round"',
    strokeWidth: '2.4',
    animation: 'doodle-bounce'
  },
  zigzag: {
    viewBox: '0 0 70 24',
    color: '#4ade80',
    path: 'M3 18 14 6l8 12L33 6l8 12L52 6l8 12 7-9',
    attr: 'stroke-linecap="round" stroke-linejoin="round"',
    strokeWidth: '2.4',
    animation: 'doodle-wave'
  }
};

// Web Component: <doodle-icon name="sparkle" color="#ffd15c" size="48px" animated="true"></doodle-icon>
class DoodleIcon extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name') || 'squiggle';
    const data = DOODLE_ICONS[name] || DOODLE_ICONS.squiggle;
    const color = this.getAttribute('color') || data.color;
    const size = this.getAttribute('size') || '48px';
    const animated = this.getAttribute('animated') !== 'false';
    const animClass = animated ? data.animation : '';

    this.style.display = 'inline-block';
    this.style.width = size;
    this.style.color = color;

    this.innerHTML = `
      <svg viewBox="${data.viewBox}" fill="none" style="width: 100%; height: 100%; display: block;" class="${animClass}" aria-hidden="true">
        <path d="${data.path}" stroke="currentColor" stroke-width="${data.strokeWidth}" ${data.attr}></path>
      </svg>
    `;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('doodle-icon')) {
  customElements.define('doodle-icon', DoodleIcon);
}

if (typeof window !== 'undefined') {
  window.DOODLE_ICONS = DOODLE_ICONS;
}
