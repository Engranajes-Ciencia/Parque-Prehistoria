import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import type { Dicho } from "../contenido/guion";
import type { PoseAlba } from "./Alba";
import MarcoReto, { useAlba } from "./MarcoReto";

// Motor de juego «une con flechas»: dos o tres columnas, y cada cosa se une con la suya de la
// columna de al lado (huella → dinosaurio; animal salvaje → doméstico → lo que nos da). Se une
// tocando una y luego la otra, o arrastrando el dedo de una a otra: la flecha sigue al dedo.
// Si el enlace no vale, la flecha se pone roja un momento y Alba lo dice; no se pierde nada.

export interface ElementoFlecha {
  /** Único en todo el juego (no solo en su columna). */
  id: string;
  nombre: string;
  dibujo: ReactNode;
}

interface Props {
  parada: number;
  titulo: string;
  pose?: PoseAlba;
  /** Dos o tres columnas, de izquierda a derecha. Las de la derecha se muestran desordenadas. */
  columnas: ElementoFlecha[][];
  rotulos: string[];
  /** Enlaces correctos, siempre de una columna a la siguiente: [izquierda, derecha]. */
  pares: [string, string][];
  frases: {
    inicio: Dicho;
    /** Una frase o varias, que se van alternando. */
    fallo: Dicho | Dicho[];
    final: Dicho;
    acierto: (izquierda: string, derecha: string) => Dicho;
  };
  nota: string;
}

type Punto = { x: number; y: number };
type Caja = { izq: Punto; der: Punto };

function barajar<T>(lista: T[]): T[] {
  const l = [...lista];
  for (let i = l.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [l[i], l[j]] = [l[j], l[i]];
  }
  // Que no quede igual que la primera columna: si sale el mismo orden, se gira uno.
  return l.every((e, i) => e === lista[i]) && l.length > 1 ? [...l.slice(1), l[0]] : l;
}

const clave = (a: string, b: string) => `${a}|${b}`;

export default function Flechas(p: Props) {
  const { mensaje, decir, final, terminar, acabado } = useAlba(p.frases.inicio, p.parada);
  const [columnas] = useState(() => p.columnas.map((c, i) => (i === 0 ? c : barajar(c))));
  const colDe = useRef(new Map(p.columnas.flatMap((c, i) => c.map((e) => [e.id, i] as const))));
  const [hechos, setHechos] = useState<string[]>([]);
  const ya = useRef<string[]>([]);
  const [elegido, setElegido] = useState<string | null>(null);
  const [error, setError] = useState<[string, string] | null>(null);
  const [dedo, setDedo] = useState<{ desde: string; punto: Punto } | null>(null);
  const arrastre = useRef<{ desde: string; id: number; movido: boolean } | null>(null);
  const fallos = useRef(0);
  const caja = useRef<HTMLDivElement>(null);
  const elementos = useRef(new Map<string, HTMLElement>());
  const [geo, setGeo] = useState<Record<string, Caja>>({});

  // Dónde está cada cosa dentro del juego, para dibujar las flechas de borde a borde.
  const medir = () => {
    const c = caja.current?.getBoundingClientRect();
    if (!c) return;
    const g: Record<string, Caja> = {};
    elementos.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      const y = r.top - c.top + r.height / 2;
      g[id] = { izq: { x: r.left - c.left, y }, der: { x: r.right - c.left, y } };
    });
    setGeo((viejo) => (JSON.stringify(viejo) === JSON.stringify(g) ? viejo : g));
  };
  useLayoutEffect(() => {
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  });

  const enlaces = (id: string) => p.pares.filter(([a, b]) => a === id || b === id);
  const completo = (id: string) => enlaces(id).every(([a, b]) => ya.current.includes(clave(a, b)));

  const unir = (x: string, y: string) => {
    setElegido(null);
    const cx = colDe.current.get(x)!;
    const cy = colDe.current.get(y)!;
    if (Math.abs(cx - cy) !== 1) return setElegido(y); // misma columna (o no vecina): cambia la elegida
    const [a, b] = cx < cy ? [x, y] : [y, x];
    if (ya.current.includes(clave(a, b))) return;
    if (!p.pares.some(([i, d]) => i === a && d === b)) {
      setError([a, b]);
      setTimeout(() => setError(null), 700);
      const f = p.frases.fallo;
      const lista = Array.isArray(f) ? f : [f];
      decir(lista[fallos.current++ % lista.length]);
      return;
    }
    const nuevos = [...ya.current, clave(a, b)];
    ya.current = nuevos;
    setHechos(nuevos);
    const dicho = p.frases.acierto(a, b);
    if (nuevos.length === p.pares.length) terminar(dicho, p.frases.final);
    else decir(dicho);
  };

  const tocar = (id: string) => {
    if (acabado) return;
    if (elegido === id) return setElegido(null);
    if (elegido) return unir(elegido, id);
    if (!completo(id)) setElegido(id);
  };

  const encima = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-flecha]");
    return el && caja.current?.contains(el) ? el.dataset.flecha! : null;
  };
  const relativo = (x: number, y: number): Punto => {
    const c = caja.current!.getBoundingClientRect();
    return { x: x - c.left, y: y - c.top };
  };
  const empezar = (e: PointerEvent<HTMLButtonElement>, id: string) => {
    if (acabado || arrastre.current || (completo(id) && elegido === null)) return;
    arrastre.current = { desde: id, id: e.pointerId, movido: false };
    try {
      e.currentTarget.releasePointerCapture(e.pointerId); // el soltar se mira con elementFromPoint
    } catch {
      /* da igual */
    }
  };
  const mover = (e: PointerEvent<HTMLDivElement>) => {
    const a = arrastre.current;
    if (!a || a.id !== e.pointerId) return;
    if (!a.movido && encima(e.clientX, e.clientY) === a.desde) return;
    a.movido = true;
    setDedo({ desde: a.desde, punto: relativo(e.clientX, e.clientY) });
  };
  const soltar = (e: PointerEvent<HTMLDivElement>) => {
    const a = arrastre.current;
    if (!a || a.id !== e.pointerId) return;
    arrastre.current = null;
    setDedo(null);
    const sobre = encima(e.clientX, e.clientY);
    if (!a.movido) return sobre === a.desde && tocar(a.desde);
    if (sobre && sobre !== a.desde) unir(a.desde, sobre);
  };
  const teclado = (e: KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      tocar(id);
    }
  };

  // Una flecha de [a] a [b]: del borde derecho de a al borde izquierdo de b.
  const flecha = (a: string, b: string, clase: string, k: string) => {
    const ga = geo[a];
    const gb = geo[b];
    if (!ga || !gb) return null;
    return <line key={k} className={clase} x1={ga.der.x + 2} y1={ga.der.y} x2={gb.izq.x - 4} y2={gb.izq.y} markerEnd="url(#flecha-punta)" />;
  };
  const lineaDedo = () => {
    if (!dedo || !geo[dedo.desde]) return null;
    const g = geo[dedo.desde];
    const desde = dedo.punto.x >= (g.izq.x + g.der.x) / 2 ? g.der : g.izq;
    return <line className="flecha-dedo" x1={desde.x} y1={desde.y} x2={dedo.punto.x} y2={dedo.punto.y} />;
  };

  const n = columnas.length;
  return (
    <MarcoReto parada={p.parada} titulo={p.titulo} mensaje={mensaje} decir={decir} final={final} pose={p.pose ?? "piensa"}>
      <div className={`flechas-rotulos cols-${n}`} aria-hidden="true">
        {p.rotulos.map((r) => (
          <span key={r}>{r}</span>
        ))}
      </div>
      <div
        ref={caja}
        className={`flechas cols-${n}`}
        onPointerMove={mover}
        onPointerUp={soltar}
        onPointerCancel={() => {
          arrastre.current = null;
          setDedo(null);
        }}
      >
        {columnas.map((col, i) => (
          <div key={i} className="flechas-col" role="group" aria-label={p.rotulos[i]}>
            {col.map((e) => {
              const unido = completo(e.id);
              return (
                <button
                  key={e.id}
                  ref={(el) => {
                    if (el) elementos.current.set(e.id, el);
                    else elementos.current.delete(e.id);
                  }}
                  data-flecha={e.id}
                  className={`flecha-cosa ${elegido === e.id ? "elegida" : ""} ${unido ? "unida" : ""}`}
                  aria-pressed={elegido === e.id}
                  aria-label={`${e.nombre}${unido ? ", ya unida" : ""}`}
                  onPointerDown={(ev) => empezar(ev, e.id)}
                  onKeyDown={(ev) => teclado(ev, e.id)}
                >
                  <span className="flecha-dibujo">{e.dibujo}</span>
                  <span className="flecha-nombre">{e.nombre}</span>
                </button>
              );
            })}
          </div>
        ))}
        <svg className="flechas-lineas" aria-hidden="true">
          <defs>
            <marker id="flecha-punta" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 Z" />
            </marker>
          </defs>
          {hechos.map((h) => {
            const [a, b] = h.split("|");
            return flecha(a, b, "flecha-bien", h);
          })}
          {error && flecha(error[0], error[1], "flecha-mal", "error")}
          {lineaDedo()}
        </svg>
      </div>
      <p className="nota">{p.nota}</p>
    </MarcoReto>
  );
}
