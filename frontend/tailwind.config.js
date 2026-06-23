/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'on-surface': '#e5e2e1',
        'surface': '#131313',
        'surface-container': '#201f1f',
        'surface-container-low': '#1c1b1b',
        'surface-container-high': '#2a2a2a',
        'surface-variant': '#353534',
        'outline': '#8a919f',
        'outline-variant': '#404753',
        'primary': '#a5c8ff',
        'primary-container': '#2492ff',
        'on-primary': '#00315e',
        'on-primary-container': '#002a53',
        'secondary': '#6de039',
        'secondary-container': '#45b703',
        'on-secondary': '#103900',
        'error': '#ffb4ab',
        'error-container': '#93000a',
      },
      fontFamily: {
        'data-mono': ['"JetBrains Mono"', 'monospace'],
        'address-label': ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
