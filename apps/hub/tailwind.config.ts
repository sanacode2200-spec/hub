import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-instrument-serif)", "Georgia", "serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
