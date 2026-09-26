import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath } from "node:url";
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const PUBLICO = fileURLToPath(new URL("public", import.meta.url));

/** Escribe public/recursos.json: los audios e imágenes que «Descargar la visita» guarda en el móvil. */
function listaDeRecursos(): Plugin {
  const recorrer = (dir: string): string[] =>
    readdirSync(dir).flatMap((n) => {
      const ruta = join(dir, n);
      return statSync(ruta).isDirectory() ? recorrer(ruta) : [ruta];
    });
  const escribir = () => {
    const archivos = ["audio", "img"]
      .flatMap((d) => recorrer(join(PUBLICO, d)))
      .filter((f) => /\.(mp3|webp|json)$/.test(f))
      .map((f) => ({ url: relative(PUBLICO, f).split("\\").join("/"), bytes: statSync(f).size }));
    writeFileSync(join(PUBLICO, "recursos.json"), JSON.stringify(archivos));
  };
  return { name: "lista-de-recursos", buildStart: escribir };
}

// base relativa: la misma compilación funciona en la raíz del sitio o en una subcarpeta
// de prueba (p. ej. /Parque-Prehistoria/prueba/) sin tocar nada.
export default defineConfig({
  plugins: [
    react(),
    listaDeRecursos(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["iconos/*.png"],
      manifest: {
        name: "Parque de Ciencias Prehistóricas",
        short_name: "Prehistoria",
        lang: "es",
        start_url: ".",
        scope: ".",
        display: "standalone",
        background_color: "#fbf3e4",
        theme_color: "#2a9d8f",
        icons: [
          { src: "iconos/icono-192.png", sizes: "192x192", type: "image/png" },
          { src: "iconos/icono-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        // La app en sí se guarda al abrirla por primera vez; audios e imágenes, al usarlos
        // o todos de golpe con «Descargar la visita» (misma caché: «recursos»).
        globPatterns: ["**/*.{js,css,html,webmanifest}", "img/alba/*.webp", "iconos/*.png"],
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => /\/(audio|img)\//.test(url.pathname) && !url.pathname.endsWith(".json"),
            handler: "CacheFirst",
            options: {
              cacheName: "recursos",
              rangeRequests: true,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.endsWith(".json"),
            handler: "NetworkFirst",
            options: { cacheName: "listas", networkTimeoutSeconds: 3 },
          },
        ],
      },
    }),
  ],
  base: "./",
  server: {
    port: 3100,
    strictPort: true,
    // Los guiones viven fuera de v2/ (contenido/guiones) y la app los importa tal cual.
    fs: { allow: [fileURLToPath(new URL("..", import.meta.url))] },
  },
});
