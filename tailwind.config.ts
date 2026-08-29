import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#0A0A0C',
        'graphite-deep': '#0B0B0E',
        charcoal: '#141110',
        indigo: {
          deep: '#111327',
        },
        slate: {
          midnight: '#12151C',
        },
        plum: '#1B1420',
        lime: {
          DEFAULT: '#C6FF3D',
          dim: '#9FD62E',
        },
        amber: {
          DEFAULT: '#FFB020',
          dim: '#D99420',
        },
        ink: {
          DEFAULT: '#F5F5F2',
          muted: '#9A9A9E',
          faint: '#6B6B70',
        },
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
