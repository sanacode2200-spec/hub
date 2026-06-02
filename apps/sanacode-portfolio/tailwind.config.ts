import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blackSoft: "#0b0b0b",
        offWhite: "#f4f4f1",
        graySoft: "#d9d9d4",
        grayMid: "#8a8a84",
        grayDark: "#1a1a1a",
        clinicalBlue: "#2779a7",
        softCoral: "#ff9398",
        chartreuse: "#c9e936",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-apoc)", "Georgia", "serif"],
        serifItalic: ["var(--font-apoc-italic)", "Georgia", "serif"],
        thin: ["var(--font-inferi)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
