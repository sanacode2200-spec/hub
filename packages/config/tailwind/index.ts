import type { Config } from "tailwindcss";

const config: Omit<Config, "content"> = {
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
