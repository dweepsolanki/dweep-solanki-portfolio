import type { Config } from 'tailwindcss';

// Theme colors are CSS variables defined in app/globals.css (light on :root /
// .light, dark on .dark). Channel-form vars keep opacity modifiers working
// (border-lime/50); the `card`/`inset`/`line`/`scrim` tokens carry their own
// alpha in dark mode, so they take no modifier.
const channel = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: 'selector',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: channel('graphite'),
        'graphite-deep': channel('graphite-deep'),
        charcoal: '#141110',
        indigo: {
          deep: '#111327',
        },
        slate: {
          midnight: '#12151C',
        },
        plum: '#1B1420',
        lime: {
          // Accent as text, icons and thin lines: darkened in light mode.
          DEFAULT: channel('lime'),
          // Accent as a fill (with on-lime text): the same bright lime in both themes.
          fill: '#C6FF3D',
          dim: '#9FD62E',
        },
        'on-lime': '#0A0A0C',
        amber: {
          DEFAULT: channel('amber'),
          fill: '#FFB020',
          dim: '#D99420',
        },
        ink: {
          DEFAULT: channel('ink'),
          muted: channel('ink-muted'),
          faint: channel('ink-faint'),
        },
        card: 'var(--card)',
        inset: 'var(--inset)',
        line: {
          DEFAULT: 'var(--line)',
          strong: 'var(--line-strong)',
        },
        scrim: 'var(--scrim)',
      },
      boxShadow: {
        card: 'var(--card-shadow)',
        cta: 'var(--cta-shadow)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.16, 1, 0.3, 1)',
        utility: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
