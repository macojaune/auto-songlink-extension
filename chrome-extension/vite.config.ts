import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: { port: 5173, strictPort: true },
  build: {
    target: "chrome120",
    rolldownOptions: { input: "popup.html" },
    assetsInlineLimit: 0,
  },
});
