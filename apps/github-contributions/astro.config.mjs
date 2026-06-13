import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";

export default defineConfig({
  output: "static",
  site: process.env.PUBLIC_SITE_URL ?? "http://localhost:4324",
  integrations: [svelte()],
  server: {
    port: 4324,
  },
});
