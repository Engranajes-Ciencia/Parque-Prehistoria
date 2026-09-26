import { useEffect, useRef, useState } from "react";

// Guarda en el móvil todos los audios e imágenes de la visita (lista en recursos.json), en la
// misma caché que usa el service worker, para que la visita funcione sin cobertura.
//
// Reescrito el 26-sep-2026 tras probarlo sin red (revisión de la visita sin cobertura):
// - espera a que el service worker controle la página: si no, la app misma no quedaba
//   guardada y, sin red, no abría aunque dijera «guardada»;
// - guarda también el manifiesto de audio en la caché «listas», que es donde lo busca el
//   service worker (sin él, todo sonaba con la voz del navegador);
// - cada fichero con su plazo y su error: si se va la señal no se queda colgado, cuenta lo
//   que falta y deja reintentar;
// - borra de la caché las versiones viejas de los audios y pide almacenamiento persistente.

interface Recurso {
  url: string;
  bytes: number;
}

type Estado =
  | { fase: "mirando" }
  | { fase: "pendiente"; faltan: Recurso[]; mb: number; fallidos?: number; novedades: boolean }
  | { fase: "bajando"; hechos: number; total: number }
  | { fase: "lista" }
  | { fase: "sin-soporte" };

const CACHE = "recursos";
const mb = (bytes: number) => Math.max(1, Math.round(bytes / 1_000_000));
const absoluta = (url: string) => new URL(url, location.href).href;
// Marca de «esta visita se guardó entera alguna vez»: si luego falta algo, son novedades.
const MARCA = "prehistoria-v2-guardada";
const marcada = () => {
  try {
    return localStorage.getItem(MARCA) === "1";
  } catch {
    return false;
  }
};
const marcar = () => {
  try {
    localStorage.setItem(MARCA, "1");
  } catch {
    /* sin almacenamiento: solo se pierde el aviso de «novedades» */
  }
};
const esIphone = typeof navigator !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent);

/** Lo que falta por guardar y si ya había algo guardado (entonces es una actualización). */
async function pendientes(): Promise<{ faltan: Recurso[]; novedades: boolean }> {
  const lista: Recurso[] = await fetch("recursos.json", { cache: "no-store" }).then((r) => r.json());
  const cache = await caches.open(CACHE);
  // Limpieza: lo que ya no está en la lista (audios regrabados, imágenes rehechas) sobra.
  const validas = new Set(lista.map((r) => absoluta(r.url)));
  for (const req of await cache.keys()) if (!validas.has(req.url)) await cache.delete(req);
  const faltan: Recurso[] = [];
  for (const r of lista) if (!(await cache.match(absoluta(r.url)))) faltan.push(r);
  return { faltan, novedades: faltan.length > 0 && marcada() };
}

/** Descarga un fichero y lo guarda; false si falla o tarda más de 30 s. */
async function guardar(cache: Cache, url: string): Promise<boolean> {
  const control = new AbortController();
  const plazo = setTimeout(() => control.abort(), 30_000);
  try {
    const r = await fetch(url, { signal: control.signal, cache: "no-store" });
    if (!r.ok) return false;
    await cache.put(url, r);
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(plazo);
  }
}

export default function DescargarVisita() {
  const [estado, setEstado] = useState<Estado>({ fase: "mirando" });
  const trabajando = useRef(false);

  const revisar = async (fallidos?: number) => {
    try {
      const { faltan, novedades } = await pendientes();
      // Además de audios e imágenes: el manifiesto de audio donde lo busca el service worker.
      const manifiesto = await (await caches.open("listas")).match(absoluta("audio/manifiesto.json"));
      if (!faltan.length && manifiesto && !fallidos) {
        marcar();
        return setEstado({ fase: "lista" });
      }
      setEstado({ fase: "pendiente", faltan, mb: faltan.length ? mb(faltan.reduce((s, r) => s + r.bytes, 0)) : 0, fallidos, novedades });
    } catch {
      setEstado({ fase: "sin-soporte" });
    }
  };

  useEffect(() => {
    if (!("caches" in window) || !("serviceWorker" in navigator)) return setEstado({ fase: "sin-soporte" });
    void revisar();
  }, []);

  const bajar = async (faltan: Recurso[]) => {
    if (trabajando.current) return;
    trabajando.current = true;
    setEstado({ fase: "bajando", hechos: 0, total: faltan.length });
    navigator.storage?.persist?.().catch(() => {});
    // Que no se apague la pantalla a media descarga (si el navegador lo permite).
    type Cerrojo = { release: () => Promise<void> };
    const wake = (navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<Cerrojo> } }).wakeLock;
    const cerrojo = await wake?.request("screen").catch(() => null);
    // La app tiene que estar ya guardada por el service worker (hasta 20 s de espera).
    await Promise.race([navigator.serviceWorker.ready, new Promise((r) => setTimeout(r, 20_000))]);

    const cache = await caches.open(CACHE);
    let hechos = 0;
    let fallidos = 0;
    const cola = [...faltan];
    const trabajador = async () => {
      for (let r = cola.shift(); r; r = cola.shift()) {
        if (!(await guardar(cache, absoluta(r.url)))) fallidos++;
        setEstado({ fase: "bajando", hechos: ++hechos, total: faltan.length });
      }
    };
    await Promise.all([trabajador(), trabajador(), trabajador(), trabajador()]);
    // El manifiesto de audio, donde lo busca el service worker cuando no hay red.
    const listas = await caches.open("listas");
    if (!(await guardar(listas, absoluta("audio/manifiesto.json")))) fallidos++;
    await cerrojo?.release().catch(() => {});
    trabajando.current = false;

    const controlada = !!navigator.serviceWorker.controller;
    if (!controlada) fallidos++;
    await revisar(fallidos);
  };

  if (estado.fase === "mirando" || estado.fase === "sin-soporte") return null;

  return (
    <section className="tarjeta descargar">
      {estado.fase === "pendiente" && (
        <>
          {estado.fallidos ? (
            <p>
              <strong>No se ha podido guardar todo</strong> (¿se ha ido la señal?). Lo guardado se conserva
              {estado.mb ? `: faltan ${estado.mb} MB.` : "; falta terminar de preparar la app."}
            </p>
          ) : estado.novedades ? (
            <p>
              <strong>Hay novedades en la visita</strong> (audios o dibujos rehechos). Actualizad lo guardado en el móvil ({estado.mb} MB).
            </p>
          ) : (
            <p>
              <strong>¿Poca cobertura en el parque?</strong> Guardad la visita en el móvil ({Math.max(estado.mb, 1)} MB) y funcionará
              aunque no haya señal. Mejor en casa, con wifi.
            </p>
          )}
          <button className="boton" onClick={() => bajar(estado.faltan)}>
            {estado.fallidos ? "🔄 Reintentar" : estado.novedades ? "📥 Actualizar la visita" : "📥 Descargar la visita"}
          </button>
          {esIphone && (
            <p className="nota">
              En iPhone, usad la visita desde Safari, que es donde se guarda (no desde un icono en la pantalla de inicio), y
              guardadla pocos días antes: Safari borra lo guardado tras una semana sin usarlo.
            </p>
          )}
        </>
      )}
      {estado.fase === "bajando" && (
        <>
          <p>Guardando la visita… {Math.floor((estado.hechos / estado.total) * 100)} %</p>
          <span className="medidor-barra">
            <span style={{ width: `${(estado.hechos / estado.total) * 100}%` }} />
          </span>
        </>
      )}
      {estado.fase === "lista" && <p>✔ La visita está guardada en el móvil: funciona aunque no haya cobertura.</p>}
    </section>
  );
}
