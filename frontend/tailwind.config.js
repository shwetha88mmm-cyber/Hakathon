/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        trust: {
          emerald: '#10b981',
          blue: '#3b82f6',
          amber: '#f59e0b',
          rose: '#f43f5e',
        }
      },
    },
  },
  plugins: [],
};
