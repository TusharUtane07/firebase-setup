/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {screens: {
      'h700': { 'raw': '(min-height: 799px)' },
      'h500': { 'raw': '(max-height: 630px)' },
    },
    height: {
      '16': '4rem', // Adding h-16 utility
    }},
  },
  plugins: [],
}