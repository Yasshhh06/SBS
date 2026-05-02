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
        salon: {
          pink: '#FDF2F8',
          beige: '#F5F5DC',
          dark: '#1F2937',
          primary: '#EC4899', // pink-500
          secondary: '#D946EF', // fuchsia-500
        }
      }
    },
  },
  plugins: [],
}
