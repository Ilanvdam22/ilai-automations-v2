import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: "#93c5fd",
      },
      fontFamily: {
        sans: ["var(--font-body)", "Helvetica", "Arial", "sans-serif"],
        heading: ["var(--font-heading)", "Helvetica", "Arial", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
