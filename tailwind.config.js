/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfcf8',
          100: '#faf8f3',
          200: '#f5f1e8',
          300: '#ede7d6',
          400: '#e0d8c2',
          500: '#d4c9ad',
        },
        slateGreen: {
          50: '#f2f6f4',
          100: '#e3ece8',
          200: '#c7d9d1',
          300: '#a1c1b3',
          400: '#7ba894',
          500: '#5b8f76',
          600: '#47745e',
          700: '#3a5e4b',
          800: '#2f4b3d',
          900: '#263d32',
          950: '#1a2b23',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
