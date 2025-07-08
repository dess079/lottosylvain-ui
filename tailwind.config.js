/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0056b3',
          50: '#e6f0ff',
          100: '#cce0ff',
          200: '#99c1ff',
          300: '#66a3ff',
          400: '#3384ff',
          500: '#0056b3',
          600: '#0045a1',
          700: '#003380',
          800: '#00225f',
          900: '#00113d',
        },
        secondary: {
          DEFAULT: '#ffcc00',
          50: '#fffce6',
          100: '#fff9cc',
          200: '#fff399',
          300: '#ffed66',
          400: '#ffe633',
          500: '#ffcc00',
          600: '#e6b800',
          700: '#b38f00',
          800: '#806600',
          900: '#4d3d00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'lotto-ball': '50%',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
