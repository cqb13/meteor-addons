import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import preact from "@preact/preset-vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), preact()],
});
