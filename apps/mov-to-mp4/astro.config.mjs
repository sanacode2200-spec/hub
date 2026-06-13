import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";

export default defineConfig({
  output: "static",
  site: process.env.PUBLIC_SITE_URL ?? "http://localhost:3001",
  integrations: [svelte()],
  server: {
    port: 3001,
  },
});
