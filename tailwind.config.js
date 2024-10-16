/** @type {import('tailwindcss').Config} */
export default {
  content: ['./entrypoints/**/*.{js,ts,tsx,html}', './content-scripts/**/*.{js,ts,tsx,html}'], // Ensure correct paths to your source files
  theme: {
    extend: {},
  },
  plugins: [],
}
