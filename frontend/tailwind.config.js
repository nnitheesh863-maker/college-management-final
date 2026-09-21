/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        unipix: {
          crimson: '#8B1538',
          'crimson-dark': '#630D25',
          'crimson-light': '#A71D45',
          gold: '#C5A880',
          'gold-light': '#E5D4BA',
          navy: '#0b1329',
          dark: '#0e1118',
          card: '#161b26',
        }
      }
    },
  },
  plugins: [],
}


