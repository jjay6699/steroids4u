import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#F7DB3E',
          dark: '#e6c82e',
          light: '#fce8a8',
        },
        dark: {
          bg: '#212121',
          text: '#111111',
        },
        border: '#CECECE',
        muted: '#666666',
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        DEFAULT: '12px',
      },
      spacing: {
        '4.5': '1.125rem',
      },
      boxShadow: {
        subtle: '0 2px 8px rgba(0, 0, 0, 0.1)',
        card: '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
    },
  },
  plugins: [],
};

export default config;

