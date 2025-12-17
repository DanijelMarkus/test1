/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0078d4',
        secondary: '#106ebe',
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
