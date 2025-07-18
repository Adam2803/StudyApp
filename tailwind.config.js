/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // 👈 make sure all folders are included
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#ffffff",
          dark: "#1a1a1a",
        },
        card: {
          light: "#f3f4f6",
          dark: "#262626",
        },
        text: {
          light: "#000000",
          dark: "#ffffff",
        },
        secondary: {
          light: "#4b5563",
          dark: "#b0b0b0",
        },
        border: {
          light: "#e5e7eb",
          dark: "#333333",
        },
        ring: {
          light: "rgba(0,0,0,0.1)",
          dark: "rgba(255,255,255,0.2)",
        },
        accent: "#22c55e",
        error: {
          light: "#dc2626",
          dark: "#ef4444",
        },
        colors: {
          "input-dark": "#1f1f1f",
        },
      },
    },
  },
  plugins: [],
};
