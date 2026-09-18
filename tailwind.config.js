/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './js/**/*.js', './config/**/*.js'],
  theme: {
    extend: {
      colors: {
        cave: {
          black: '#0a0a0b',
          soft: '#121214',
          surface: '#17171a',
          border: '#2a2a30'
        },
        gold: {
          DEFAULT: '#c9a227',
          light: '#e8c766',
          dark: '#8c6d12'
        },
        gray: {
          light: '#e6e6e8',
          mid: '#9a9aa2',
          dim: '#6b6b73'
        }
      },
      fontFamily: {
        display: ['Bebas Neue', 'Oswald', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      borderRadius: { sm: '8px', md: '14px', lg: '20px' }
    }
  },
  plugins: []
};
