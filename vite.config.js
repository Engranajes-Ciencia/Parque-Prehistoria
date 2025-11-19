// vite.config.js

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // *** RUTA BASE CONFIGURADA PARA GITHUB PAGES ***
  // Anterior: '/04-WebApp-Prehistoria/'
  // Nuevo: '/Parque-Prehistoria/' (Coincide con el nombre del repositorio)
  base: '/Parque-Prehistoria/', 
  // ***********************************************
  plugins: [react()],
  server: {
    fs: {
      // 🔐 Reforzar seguridad: evitar que se lean archivos fuera del directorio del proyecto
      strict: true,
      deny: [".."], // niega acceso a rutas padres
    },
    port: 3000, // Cambia si usas otro puerto
    open: true, // Abre el navegador automáticamente
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
