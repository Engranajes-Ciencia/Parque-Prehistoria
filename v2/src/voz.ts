// Locución. Cada texto tiene una «pista» (p07-todos, p07-reto-final…) con su MP3 de
// ElevenLabs y los tiempos de cada frase, generados por herramientas/generar_audios.py y
// descritos en public/audio/manifiesto.json. Si la pista no existe o su texto ya no
// coincide con el guion (se editó después de grabar), se usa la voz sintética del
// navegador: nunca suena un audio que no corresponde al texto.
//
// 26-sep-2026, tras la revisión de código y de la visita sin cobertura:
// - un único elemento <audio>, «desbloqueado» con el primer toque (iPhone no deja sonar
//   audio que no nazca de un toque, pero sí reutilizar un elemento ya desbloqueado);
// - quien pierde el turno recibe «alInterrumpir» (antes el botón se quedaba en «Pausar»);
// - pausar y seguir saben qué está sonando (MP3 o voz del navegador), y un MP3 que no
//   llega en 5 s, o que falla a medias, cede el paso a la voz del navegador;
// - el manifiesto se busca también en la caché y se reintenta al volver la cobertura;
// - lo que se escucha con red se guarda para poder repetirlo sin ella.

import { useSyncExternalStore } from "react";
import { enFrases } from "./contenido/guion";

export type Voz = "narrador" | "alba";

export interface Frase {
  texto: string;
  inicio: number;
  fin: number;
}

interface Pista {
  archivo: string;
  parrafos: string[];
  frases: Frase[];
}

interface Eventos {
  alEmpezarFrase?: (i: number) => void;
  alTerminar?: () => void;
  /** Otro texto ha empezado a sonar (o se ha mandado callar): este ya no sigue. */
  alInterrumpir?: () => void;
}

const CACHE_RECURSOS = "recursos";

// ---------------------------------------------------------------- manifiesto

let manifiesto: Record<string, Pista> = {};
const oyentes = new Set<() => void>();

let reintento: ReturnType<typeof setTimeout> | undefined;
function cargarManifiesto() {
  clearTimeout(reintento);
  const url = new URL("audio/manifiesto.json", location.href).href;
  // Con cobertura mala la petición puede quedarse colgada sin fallar nunca: plazo de 10 s.
  const control = new AbortController();
  const plazo = setTimeout(() => control.abort(), 10_000);
  fetch(url, { signal: control.signal })
    .finally(() => clearTimeout(plazo))
    .then((r) => (r.ok ? r : Promise.reject(new Error(String(r.status)))))
    // Sin red: el que guardó «Descargar la visita» (caches.match busca en todas las cachés).
    .catch(() =>
      ("caches" in window ? caches.match(url) : Promise.resolve(undefined)).then(
        (r) => r ?? Promise.reject(new Error("sin manifiesto")),
      ),
    )
    .then((r) => r.json())
    .then((m) => {
      manifiesto = m;
      oyentes.forEach((o) => o());
    })
    .catch(() => {
      // Sin manifiesto, todo suena con la voz del navegador. Se reintenta al volver la red
      // o, si la red no llegó a caerse (solo iba lenta), dentro de medio minuto.
      window.addEventListener("online", cargarManifiesto, { once: true });
      reintento = setTimeout(cargarManifiesto, 30_000);
    });
}
if (typeof window !== "undefined") cargarManifiesto();

function useManifiesto() {
  return useSyncExternalStore(
    (o) => {
      oyentes.add(o);
      return () => oyentes.delete(o);
    },
    () => manifiesto,
    () => manifiesto,
  );
}

const normal = (parrafos: string[]) => parrafos.join(" ").replace(/\s+/g, " ").trim();

function pistaValida(clave: string, parrafos: string[]): Pista | null {
  const p = manifiesto[clave];
  return p && normal(p.parrafos) === normal(parrafos) ? p : null;
}

/** Frases para los subtítulos y si hay audio grabado; se actualiza al llegar el manifiesto. */
export function usePista(clave: string, parrafos: string[]) {
  useManifiesto();
  const pista = pistaValida(clave, parrafos);
  return { grabada: !!pista, frases: pista ? pista.frases.map((f) => f.texto) : enFrases(parrafos) };
}

// ---------------------------------------------------------------- reproducción

const hayVoz = typeof window !== "undefined" && "speechSynthesis" in window;
let vozEspanola: SpeechSynthesisVoice | null = null;
if (hayVoz) {
  const elegir = () => {
    const voces = speechSynthesis.getVoices().filter((v) => v.lang.startsWith("es"));
    vozEspanola =
      voces.find((v) => v.lang === "es-ES" && v.localService) ?? voces.find((v) => v.lang === "es-ES") ?? voces[0] ?? null;
  };
  elegir();
  speechSynthesis.addEventListener("voiceschanged", elegir);
}

// Un solo elemento de audio para toda la app.
let elemento: HTMLAudioElement | null = null;
function reproductor() {
  if (!elemento) elemento = new Audio();
  return elemento;
}
if (typeof window !== "undefined") {
  // Primer toque: se «desbloquea» el elemento con un silencio de una décima.
  window.addEventListener(
    "pointerdown",
    () => {
      const a = reproductor();
      if (a.src) return;
      a.src = "silencio.mp3";
      a.play().catch(() => {});
    },
    { once: true, capture: true },
  );
}

let turno = 0;
let motor: "mp3" | "voz" | null = null;
let enPausa = false; // pausado por la familia: el MP3 que tarda no debe ceder el paso a la otra voz
let interrumpir: (() => void) | undefined;

export function callar() {
  const aviso = interrumpir;
  interrumpir = undefined;
  turno++;
  motor = null;
  enPausa = false;
  if (hayVoz) {
    speechSynthesis.cancel();
    speechSynthesis.resume(); // cancel() no quita la pausa: sin esto, todo lo siguiente saldría mudo
  }
  if (elemento) {
    elemento.onended = elemento.onerror = elemento.ontimeupdate = elemento.onplaying = null;
    elemento.pause();
  }
  aviso?.();
}

export function pausar() {
  enPausa = true;
  if (motor === "mp3") elemento?.pause();
  else if (motor === "voz" && hayVoz) speechSynthesis.pause();
}

export function reanudar() {
  enPausa = false;
  if (motor === "mp3") void elemento?.play().catch(() => {});
  else if (motor === "voz" && hayVoz) speechSynthesis.resume();
}

function sintetica(frases: string[], voz: Voz, eventos: Eventos, mio: number) {
  if (!hayVoz || !frases.length) {
    motor = null;
    eventos.alTerminar?.();
    return;
  }
  motor = "voz";
  frases.forEach((frase, i) => {
    const u = new SpeechSynthesisUtterance(frase);
    u.lang = "es-ES";
    if (vozEspanola) u.voice = vozEspanola;
    u.rate = voz === "alba" ? 1.02 : 0.96;
    u.pitch = voz === "alba" ? 1.35 : 1;
    u.onstart = () => {
      if (mio === turno) eventos.alEmpezarFrase?.(i);
    };
    if (i === frases.length - 1) {
      u.onend = () => {
        if (mio !== turno) return;
        motor = null;
        interrumpir = undefined;
        eventos.alTerminar?.();
      };
    }
    speechSynthesis.speak(u);
  });
}

/** Guarda en segundo plano un audio que ha sonado con red, para poder repetirlo sin ella. */
function guardarParaDespues(url: string) {
  if (!("caches" in window)) return;
  caches
    .open(CACHE_RECURSOS)
    .then(async (c) => {
      if (!(await c.match(url))) await c.add(url);
    })
    .catch(() => {});
}

/** Locuta un texto del guion con su audio grabado o, si no lo hay, con la voz del navegador. */
export function locutar(clave: string, parrafos: string[], voz: Voz, eventos: Eventos = {}) {
  callar();
  const mio = turno;
  interrumpir = eventos.alInterrumpir;
  const pista = pistaValida(clave, parrafos);
  if (!pista) {
    sintetica(enFrases(parrafos), voz, eventos, mio);
    return;
  }
  const url = new URL(`audio/${pista.archivo}`, location.href).href;
  const a = reproductor();
  motor = "mp3";
  let relevado = false;
  const relevo = () => {
    // El MP3 no llega o se rompe: la voz del navegador toma el relevo desde el principio.
    if (relevado || enPausa || mio !== turno) return;
    relevado = true;
    clearTimeout(plazo);
    a.onended = a.onerror = a.ontimeupdate = a.onplaying = null;
    a.pause();
    sintetica(enFrases(parrafos), voz, eventos, mio);
  };
  const plazo = setTimeout(() => {
    if (a.readyState < 3) relevo();
  }, 5000);
  let actual = -1;
  a.ontimeupdate = () => {
    if (mio !== turno) return;
    let i = -1;
    for (let j = 0; j < pista.frases.length && pista.frases[j].inicio <= a.currentTime + 0.05; j++) i = j;
    if (i !== actual && i >= 0) {
      actual = i;
      eventos.alEmpezarFrase?.(i);
    }
  };
  a.onplaying = () => {
    clearTimeout(plazo);
    guardarParaDespues(url);
  };
  a.onerror = relevo;
  a.onended = () => {
    if (mio !== turno) return;
    clearTimeout(plazo);
    motor = null;
    interrumpir = undefined;
    eventos.alTerminar?.();
  };
  a.src = url;
  a.play().catch((e: unknown) => {
    // Si lo ha parado la propia app (pausa, otra locución), no hay que hacer nada.
    if (e instanceof DOMException && e.name === "AbortError") return;
    relevo();
  });
}
