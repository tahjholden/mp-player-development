/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        oldgold: '#CFB53B',
        darkgold: '#B59B2B',
        lightgold: '#E9D56A'
      },
    },
  },
  plugins: [],
};
