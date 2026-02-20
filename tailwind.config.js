/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0f172a",
        primary: "#8b5cf6",
        secondary: "#6366f1",
      },
      backgroundImage: {
        "main-gradient": "linear-gradient(to bottom right, #0f172a, #6366f1, #8b5cf6)",
      },
    },
  },
  plugins: [],
};
