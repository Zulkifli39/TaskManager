import {defineConfig} from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    host: "0.0.0.0", // agar bisa diakses dari luar container (localhost)
    port: 5173, // port yang kita expose di docker
    watch: {
      usePolling: true, // penting untuk hot reload di Docker
    },
  },
});
