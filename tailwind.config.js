import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        box: '0px 0px 34px rgba(12, 63, 94, 0.12)',
      },
      container: {
        center: true,
        screens: {
          sm: '576px',
          md: '768px',
          lg: '992px',
          xl: '1200px',
          '2xl': '1400px',
        },
      },
      colors: {
        light: '#f2f5f7',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: '#e86161',
              50: '#fdf3f3',
              100: '#fce4e4',
              200: '#fbcdcd',
              300: '#f7aaaa',
              400: '#f07979',
              500: '#e86161',
              600: '#d23030',
              700: '#b02525',
              800: '#922222',
              900: '#792323',
              950: '#420d0d',
            },
            default: {
              100: '#F2F5F7',
            },
            secondary: {
              DEFAULT: '#7994a3',
              50: '#f2f5f7',
              100: '#ecf2f3',
              200: '#E1E9EF',
              250: '#DBE2E7',
              300: '#C7D6E1',
              400: '#aec5cb',
              500: '#98b2bc',
              600: '#7994a3',
              700: '#6f8593',
              800: '#5b6d78',
              900: '#4d5b62',
              950: '#2d3439',
              foreground: '#ffffff',
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: '#e86161',
              50: '#fdf3f3',
              100: '#fce4e4',
              200: '#fbcdcd',
              300: '#f7aaaa',
              400: '#f07979',
              500: '#e86161',
              600: '#d23030',
              700: '#b02525',
              800: '#922222',
              900: '#792323',
              950: '#420d0d',
            },
            secondary: {
              DEFAULT: '#8890a2',
              50: '#303237',
              100: '#3C3F46',
              200: '#3A3F4A',
              250: '#3A3F4A',
              300: '#505869',
              400: '#585F6E',
              500: '#8890a2',
              600: '#585F6E',
              700: '#828999',
              800: '#828999',
              900: '#828999',
              950: '#1D2024',
            },
          },
        },
      },
      layout: {
        radius: {
          small: '1rem',
          medium: '1.25rem',
          large: '2rem',
        },
      },
    }),
  ],
};

export default tailwindConfig;
