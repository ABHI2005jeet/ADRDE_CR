/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        adrde: {
          navy: '#0A2342',
          blue: '#163B63',
          steel: '#59758F',
          mist: '#EEF3F8',
          ink: '#101828',
        },
      },
      boxShadow: {
        soft: '0 14px 40px rgba(15, 23, 42, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 280ms ease-out both',
        'slide-up': 'slideUp 280ms ease-out both',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
