// Navegación por la almohadilla de la dirección (#/parada/7): funciona en cualquier
// alojamiento estático y el botón «atrás» del móvil pasa por las pantallas de la app.
//
// Cada entrada del historial lleva su número (history.state.n) y aquí se apunta qué ruta
// hay en cada una. Así «volver» sabe si la pantalla a la que vuelve es justo la anterior:
// entonces retrocede de verdad; si no, sustituye la entrada actual. Antes cada «‹» añadía
// una entrada nueva y, tras ganar un juego y volver a la parada, el «atrás» del móvil
// metía otra vez en el juego (revisión del 27-sep-2026).
//
// Lo apuntado se guarda en sessionStorage: el móvil recarga la pestaña a menudo (al volver
// de la cámara, por ejemplo) y el historial del navegador sobrevive a la recarga.

import { useSyncExternalStore } from "react";

const CLAVE = "prehistoria-v2-historial";

export function rutaActual() {
  return typeof location === "undefined" ? "/" : location.hash.slice(1) || "/";
}

function leer(): string[] {
  try {
    const r: unknown = JSON.parse(sessionStorage.getItem(CLAVE) ?? "[]");
    return Array.isArray(r) ? r : [];
  } catch {
    return [];
  }
}

function guardar() {
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify(rutas));
  } catch {
    /* sin almacenamiento: «volver» sustituye en vez de retroceder, nada más */
  }
}

const estado: unknown = typeof history !== "undefined" ? history.state : null;
const numero = (s: unknown) => (s && typeof (s as { n?: unknown }).n === "number" ? (s as { n: number }).n : null);
let actual = numero(estado) ?? 0;
const rutas: string[] = numero(estado) !== null ? leer() : [];
rutas[actual] = rutaActual();
if (typeof history !== "undefined") {
  history.replaceState({ n: actual }, "");
  guardar();
}

const oyentes = new Set<() => void>();
let mostrada = rutaActual();
function avisar() {
  const r = rutaActual();
  if (r === mostrada) return;
  mostrada = r;
  oyentes.forEach((o) => o());
}

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    const n = numero(history.state);
    if (n !== null) actual = n;
    else {
      // Entrada nueva que no ha pasado por ir() (dirección escrita a mano, enlace viejo…).
      actual++;
      history.replaceState({ n: actual }, "");
    }
    rutas[actual] = rutaActual();
    guardar();
    avisar();
  });
  window.addEventListener("hashchange", avisar); // por si algún navegador no avisa con popstate
}

/** Va a otra pantalla. Con `sustituir`, la actual no queda en el historial. */
export function ir(ruta: string, sustituir = false) {
  if (!sustituir) actual++;
  rutas[actual] = ruta;
  rutas.length = actual + 1; // lo que hubiera «hacia delante» ya no existe
  guardar();
  if (sustituir) history.replaceState({ n: actual }, "", "#" + ruta);
  else history.pushState({ n: actual }, "", "#" + ruta);
  avisar();
}

/**
 * Vuelve a `ruta`: si es la pantalla anterior, retrocede (como el «atrás» del móvil);
 * si no, la pone en lugar de la actual. Con `laQueSea`, vuelve a la anterior sea cual sea
 * y solo usa `ruta` si no hay anterior (el álbum vuelve a donde estabas).
 */
export function volver(ruta: string, laQueSea = false) {
  const previa = rutas[actual - 1];
  // (null: hueco de antes de una recarga, no se sabe qué había; mejor no retroceder a ciegas)
  if (previa != null && (laQueSea || previa === ruta)) return history.back();
  ir(ruta, true);
}

/** Avisa de cada cambio de pantalla ANTES de pintar la nueva (para callar la voz). */
export function alCambiar(f: () => void) {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
}

/** La ruta que se está mostrando; cambia con ir(), volver() y el «atrás» del navegador. */
export function useRuta() {
  return useSyncExternalStore(
    (o) => {
      oyentes.add(o);
      return () => oyentes.delete(o);
    },
    () => mostrada,
    () => mostrada,
  );
}
