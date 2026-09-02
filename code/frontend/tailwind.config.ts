import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-app)',
        foreground: 'var(--text-primary)',
        surface: {
          DEFAULT: 'var(--bg-surface)',
          alt: 'var(--bg-surface-alt)',
          sidebar: 'var(--bg-sidebar)',
          border: 'var(--border-color)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        menu: {
          active: 'var(--active-menu)',
          activeText: 'var(--active-menu-text)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          foreground: '#ffffff',
        },
        status: {
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          error: 'var(--color-error)',
          info: 'var(--color-info)',
        },
      },
      borderColor: {
        DEFAULT: 'var(--border-color)',
      },
    },
  },
  plugins: [],
};
export default config;
