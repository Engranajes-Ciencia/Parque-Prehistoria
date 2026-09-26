// Locución. Cada texto tiene una «pista» (p07-todos, p07-reto-final…) con su MP3 de
// ElevenLabs y los tiempos de cada frase, generados por herramientas/generar_audios.py y
// descritos en public/audio/manifiesto.json. Si la pista no existe o su texto ya no
// coincide con el guion (se editó después de grabar), se usa la voz sintética del
// navegador: nunca suena un audio que no corresponde al texto.

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
}

// ---------------------------------------------------------------- manifiesto

let manifiesto: Record<string, Pista> = {};
const oyentes = new Set<() => void>();

fetch("audio/manifiesto.json")
  .then((r) => (r.ok ? r.json() : {}))
  .then((m) => {
    manifiesto = m;
    oyentes.forEach((o) => o());
  })
  .catch(() => {
    // Sin manifiesto: todo se locuta con la voz del navegador.
  });

function useManifiesto() {
  return useSyncExternalStore(
    (o) => {
      oyentes.add(o);
      return () => oyentes.delete(o);
    },
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
    const voces = speechSynthesis.getVoices();
    vozEspanola = voces.find((v) => v.lang === "es-ES") ?? voces.find((v) => v.lang.startsWith("es")) ?? null;
  };
  elegir();
  speechSynthesis.addEventListener("voiceschanged", elegir);
}

let turno = 0;
let audio: HTMLAudioElement | null = null;

export function callar() {
  turno++;
  if (hayVoz) speechSynthesis.cancel();
  if (audio) {
    audio.pause();
    audio = null;
  }
}

export function pausar() {
  if (audio) audio.pause();
  else if (hayVoz) speechSynthesis.pause();
}

export function reanudar() {
  if (audio) void audio.play();
  else if (hayVoz) speechSynthesis.resume();
}

function sintetica(frases: string[], voz: Voz, eventos: Eventos, mio: number) {
  if (!hayVoz || !frases.length) {
    eventos.alTerminar?.();
    return;
  }
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
        if (mio === turno) eventos.alTerminar?.();
      };
    }
    speechSynthesis.speak(u);
  });
}

/** Locuta un texto del guion con su audio grabado o, si no lo hay, con la voz del navegador. */
export function locutar(clave: string, parrafos: string[], voz: Voz, eventos: Eventos = {}) {
  callar();
  const mio = turno;
  const pista = pistaValida(clave, parrafos);
  if (!pista) {
    sintetica(enFrases(parrafos), voz, eventos, mio);
    return;
  }
  const a = new Audio(`audio/${pista.archivo}`);
  audio = a;
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
  a.onended = () => {
    if (mio === turno) {
      audio = null;
      eventos.alTerminar?.();
    }
  };
  a.play().catch(() => {
    // Si el navegador no deja reproducir (o el fichero no carga), la voz sintética toma el relevo.
    if (mio === turno) sintetica(enFrases(parrafos), voz, eventos, mio);
  });
}
