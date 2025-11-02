/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {colors: {
      pink: { 500: '#EC4899', 600: '#DB2777' },
      purple: { 500: '#A855F7', 600: '#9333EA' },
      blue: { 500: '#3B82F6' }
    }},
  },
  plugins: [],
}

