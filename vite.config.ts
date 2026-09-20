import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: process.env.CODEX_SANDBOX === "seatbelt"
    ? { watch: { useFsEvents: false, usePolling: true } }
    : undefined,
});
