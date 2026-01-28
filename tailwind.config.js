/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3a7bd5',
        secondary: '#00d395',
        dark: '#121212',
        'dark-paper': '#1e1e1e',
      },
    },
  },
  plugins: [],
  // Important: This prevents Tailwind from conflicting with Material-UI
  corePlugins: {
    preflight: false,
  },
}