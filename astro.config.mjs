import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://shopes.online",
  output: "server",
  adapter: vercel({ isr: true }),
  build: { format: "directory" },
  vite: { plugins: [tailwindcss()] }
});
