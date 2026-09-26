import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://shopes.online",
  output: "server",
  adapter: vercel(),
  build: { format: "directory" },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] }
});
