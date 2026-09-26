import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://shopes.online",
  output: "static",
  build: { format: "directory" },
  vite: { plugins: [tailwindcss()] }
});
