// Desde el 31-oct-2026 la app está en la raíz del sitio, no en /v2/. Los móviles que la
// abrieron (o descargaron la visita) en /v2/ tienen aquí un service worker que seguiría
// sirviendo la copia guardada. Este lo sustituye: borra lo que guardó la app en /v2/, se da
// de baja y recarga las pestañas abiertas, que caen en la página de /v2/ que lleva a la raíz.
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    (async () => {
      const deV2 = (url) => url.includes("/Parque-Prehistoria/v2/");
      for (const nombre of await caches.keys()) {
        if (deV2(nombre)) {
          await caches.delete(nombre); // la caché de la app de /v2/ (lleva la dirección en el nombre)
          continue;
        }
        const cache = await caches.open(nombre); // audios e imágenes: cachés compartidas con la raíz
        for (const peticion of await cache.keys()) if (deV2(peticion.url)) await cache.delete(peticion);
      }
      await self.registration.unregister();
      for (const ventana of await self.clients.matchAll({ type: "window" })) ventana.navigate(ventana.url);
    })(),
  );
});
