import { useEffect, useRef, useState, type PointerEvent as EventoPuntero, type ReactNode } from "react";
import type { Dicho } from "../contenido/guion";
import type { PoseAlba } from "./Alba";
import MarcoReto, { useAlba } from "./MarcoReto";
import "./laberinto.css";

// Motor de juego «laberinto»: se lleva una figura de casilla en casilla, desde la salida
// hasta la meta. El plano es un dibujo de texto, una cadena por fila, de arriba abajo:
//   "#" obstáculo · "." libre · "S" salida · "M" meta · otra letra: punto de control (libre).
// La figura solo pasa a una casilla VECINA libre (arriba, abajo, izquierda o derecha; nunca
// en diagonal ni a través de un obstáculo): arrastrándola, cuando el dedo entra en la casilla
// de al lado; tocando una casilla vecina, o con las flechas del teclado. Contra un obstáculo
// tiembla un poco y no se mueve (sin voz). Al pasar por un punto de control, Alba dice su
// frase (solo la primera vez); al llegar a la meta, termina.
// Nada depende de requestAnimationFrame: los movimientos se calculan en los eventos del dedo y
// las animaciones (deslizarse, girar, temblar) son CSS y solo adornan.

/** Lado de una casilla, en unidades del dibujo. El tablero mide columnas × CELDA de ancho. */
export const CELDA = 60;

interface Casilla {
  c: number;
  f: number;
}

interface Props {
  parada: number;
  titulo: string;
  pose?: PoseAlba;
  /** El plano, una cadena por fila (ver arriba). Todas las filas, del mismo largo. */
  plano: string[];
  /** Fondo de todo el tablero (y sus <defs>), en unidades de 0 a columnas × CELDA y filas × CELDA. */
  fondo: ReactNode;
  /** Dibujo de un obstáculo dentro de su casilla, en unidades de 0 a CELDA. */
  obstaculo: (columna: number, fila: number) => ReactNode;
  /** Dibujo de la meta dentro de su casilla (de 0 a CELDA), debajo del aro que la señala. */
  meta?: ReactNode;
  /** La figura que se mueve, centrada en (0, 0) y mirando hacia arriba; cabe en una casilla. */
  figura: ReactNode;
  /** La frase de cada punto de control: letra del plano → lo que dice Alba al pasar por él. */
  controles: Record<string, Dicho>;
  frases: {
    inicio: Dicho;
    /** Lo que explica Alba al llegar a la meta (antes de «¡Reto superado!»). */
    llegada: Dicho;
    final: Dicho;
  };
  etiqueta: string;
  nota: string;
}

const VECINAS: [number, number][] = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
];

/**
 * Lee el plano y comprueba que es jugable: filas iguales, una salida, una meta, frase para
 * cada punto de control y un camino de la salida a la meta. Si no, falla (y comprobar.mjs lo
 * caza antes de publicar, porque dibuja todos los juegos).
 */
function leerPlano(plano: string[], controles: Record<string, Dicho>) {
  const filas = plano.length;
  const columnas = filas ? plano[0].length : 0;
  if (!filas || !columnas || plano.some((l) => l.length !== columnas))
    throw new Error("El plano del laberinto está vacío o tiene filas de distinto largo");
  const salidas: Casilla[] = [];
  const metas: Casilla[] = [];
  const letras = new Set<string>();
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < columnas; c++) {
      const l = plano[f][c];
      if (l === "S") salidas.push({ c, f });
      else if (l === "M") metas.push({ c, f });
      else if (l !== "#" && l !== ".") letras.add(l);
    }
  }
  if (salidas.length !== 1 || metas.length !== 1)
    throw new Error("El plano del laberinto necesita una salida (S) y una meta (M), y solo una de cada");
  for (const l of letras) if (!controles[l]) throw new Error(`El punto de control «${l}» del laberinto no tiene frase`);
  for (const l of Object.keys(controles)) if (!letras.has(l)) throw new Error(`La frase del punto «${l}» no tiene sitio en el plano`);

  // Que se pueda llegar: búsqueda en anchura desde la salida.
  const vistas = new Set([`${salidas[0].c},${salidas[0].f}`]);
  const cola = [salidas[0]];
  while (cola.length) {
    const a = cola.shift()!;
    for (const [dc, df] of VECINAS) {
      const c = a.c + dc;
      const f = a.f + df;
      const clave = `${c},${f}`;
      if (c < 0 || f < 0 || c >= columnas || f >= filas || plano[f][c] === "#" || vistas.has(clave)) continue;
      vistas.add(clave);
      cola.push({ c, f });
    }
  }
  if (!vistas.has(`${metas[0].c},${metas[0].f}`)) throw new Error("En el plano del laberinto no se llega de la salida a la meta");
  return { filas, columnas, salida: salidas[0], meta: metas[0] };
}

export default function Laberinto(p: Props) {
  const [mapa] = useState(() => leerPlano(p.plano, p.controles));
  const { mensaje, decir, final, terminar, acabado } = useAlba(p.frases.inicio, p.parada);
  const [pos, setPos] = useState<Casilla>(mapa.salida);
  const posicion = useRef<Casilla>(mapa.salida); // al instante: un trazo rápido da varios pasos antes de repintar
  const [rumbo, setRumbo] = useState(0);
  const giro = useRef(0);
  // Temblor al chocar: se alternan dos animaciones iguales para que cada choque la reinicie.
  const [choque, setChoque] = useState<0 | 1 | 2>(0);
  const llegado = useRef(false);
  const dichos = useRef<string[]>([]);
  const dedo = useRef<{ id: number; x: number; y: number; celda: string } | null>(null);

  const libre = (c: number, f: number) =>
    c >= 0 && f >= 0 && c < mapa.columnas && f < mapa.filas && p.plano[f][c] !== "#";
  const chocar = () => setChoque((n) => (n === 1 ? 2 : 1));

  /** Un paso a una casilla vecina. Devuelve si la figura se ha movido. */
  const paso = (c: number, f: number): boolean => {
    const a = posicion.current;
    if (llegado.current || Math.abs(c - a.c) + Math.abs(f - a.f) !== 1) return false;
    if (!libre(c, f)) {
      chocar();
      return false;
    }
    posicion.current = { c, f };
    setPos({ c, f });
    // Mira hacia donde va, girando por el lado más corto.
    const destino = c > a.c ? 90 : c < a.c ? -90 : f > a.f ? 180 : 0;
    giro.current += ((((destino - giro.current) % 360) + 540) % 360) - 180;
    setRumbo(giro.current);

    const letra = p.plano[f][c];
    if (letra === "M") {
      llegado.current = true;
      dedo.current = null;
      terminar(p.frases.llegada, p.frases.final);
    } else if (p.controles[letra] && !dichos.current.includes(letra)) {
      dichos.current.push(letra);
      decir(p.controles[letra]);
    }
    return true;
  };

  /** El dedo ha entrado en la casilla (c, f): si es vecina, la figura va hacia allí. */
  const hacia = (c: number, f: number) => {
    const a = posicion.current;
    const dc = c - a.c;
    const df = f - a.f;
    if (Math.abs(dc) + Math.abs(df) === 1) {
      paso(c, f);
    } else if (Math.abs(dc) === 1 && Math.abs(df) === 1) {
      // En diagonal (el dedo ha cortado por la esquina): dos pasos rectos, por la casilla
      // libre de en medio. Si no la hay, es como chocar.
      const via = libre(a.c + dc, a.f) ? { c: a.c + dc, f: a.f } : libre(a.c, a.f + df) ? { c: a.c, f: a.f + df } : null;
      if (!via || !libre(c, f)) chocar();
      else if (paso(via.c, via.f)) paso(c, f);
    }
    // Más lejos: el dedo se ha adelantado (o ha saltado un obstáculo); la figura le espera.
  };

  const punto = (e: EventoPuntero<SVGSVGElement>) => {
    const m = e.currentTarget.getScreenCTM();
    if (!m) return null;
    const q = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return { x: q.x, y: q.y };
  };
  const clave = (x: number, y: number) => `${Math.floor(x / CELDA)},${Math.floor(y / CELDA)}`;

  const empezar = (e: EventoPuntero<SVGSVGElement>) => {
    // Un solo dedo a la vez. Un toque «primario» nuevo sí vale: si se perdió el final del
    // anterior (le pasa a algún navegador), el juego no puede quedarse sin responder.
    if (acabado || llegado.current || (dedo.current && !e.isPrimary)) return;
    const q = punto(e);
    if (!q) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* el dedo ya se levantó */
    }
    dedo.current = { id: e.pointerId, x: q.x, y: q.y, celda: clave(q.x, q.y) };
    hacia(Math.floor(q.x / CELDA), Math.floor(q.y / CELDA)); // tocar una casilla vecina también mueve
  };

  const mover = (e: EventoPuntero<SVGSVGElement>) => {
    const d = dedo.current;
    if (!d || d.id !== e.pointerId || llegado.current) return;
    const q = punto(e);
    if (!q) return;
    // El trazo se recorre a pasos cortos (un cuarto de casilla): aunque el dedo vaya muy
    // deprisa, la figura pasa por todas las casillas, en orden.
    const tramos = Math.max(1, Math.ceil(Math.hypot(q.x - d.x, q.y - d.y) / (CELDA / 4)));
    for (let i = 1; i <= tramos && dedo.current === d; i++) {
      const x = d.x + ((q.x - d.x) * i) / tramos;
      const y = d.y + ((q.y - d.y) * i) / tramos;
      const k = clave(x, y);
      if (k === d.celda) continue;
      d.celda = k;
      hacia(Math.floor(x / CELDA), Math.floor(y / CELDA));
    }
    d.x = q.x;
    d.y = q.y;
  };

  const soltar = (e: EventoPuntero<SVGSVGElement>) => {
    if (dedo.current?.id === e.pointerId) dedo.current = null;
  };

  // Flechas del teclado (en el ordenador). Se vuelve a enganchar en cada pintado: así siempre
  // usa la función paso() del momento.
  useEffect(() => {
    const flechas: Record<string, [number, number]> = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
    };
    const pulsar = (e: KeyboardEvent) => {
      const d = flechas[e.key];
      if (!d || llegado.current || e.altKey || e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      paso(posicion.current.c + d[0], posicion.current.f + d[1]);
    };
    window.addEventListener("keydown", pulsar);
    return () => window.removeEventListener("keydown", pulsar);
  });

  const ancho = mapa.columnas * CELDA;
  const alto = mapa.filas * CELDA;
  const x = (pos.c + 0.5) * CELDA;
  const y = (pos.f + 0.5) * CELDA;
  const obstaculos: ReactNode[] = [];
  for (let f = 0; f < mapa.filas; f++) {
    for (let c = 0; c < mapa.columnas; c++) {
      if (p.plano[f][c] === "#")
        obstaculos.push(
          <g key={`${c},${f}`} transform={`translate(${c * CELDA} ${f * CELDA})`}>
            {p.obstaculo(c, f)}
          </g>,
        );
    }
  }
  const vecinas = VECINAS.map(([dc, df]) => ({ c: pos.c + dc, f: pos.f + df })).filter((v) => libre(v.c, v.f));

  return (
    <MarcoReto parada={p.parada} titulo={p.titulo} mensaje={mensaje} decir={decir} final={final} pose={p.pose ?? "senala"}>
      <div
        className="lab-marco"
        // Tan ancho como quepa sin que el tablero pase por debajo de la pantalla.
        style={{ width: `min(100%, 420px, max(220px, calc((100vh - var(--lab-reserva)) * ${(ancho / alto).toFixed(3)})))` }}
      >
        <svg
          className="laberinto"
          viewBox={`0 0 ${ancho} ${alto}`}
          role="img"
          aria-label={p.etiqueta}
          onPointerDown={empezar}
          onPointerMove={mover}
          onPointerUp={soltar}
          onPointerCancel={soltar}
          onLostPointerCapture={soltar}
        >
          {p.fondo}
          <g transform={`translate(${mapa.meta.c * CELDA} ${mapa.meta.f * CELDA})`}>
            {p.meta}
            <circle className="lab-meta" cx={CELDA / 2} cy={CELDA / 2} r={CELDA * 0.4} />
          </g>
          {obstaculos}
          {!acabado &&
            vecinas.map((v) => (
              <circle
                key={`${v.c},${v.f}`}
                className="lab-vecina"
                cx={(v.c + 0.5) * CELDA}
                cy={(v.f + 0.5) * CELDA}
                r={CELDA * 0.17}
              />
            ))}
          {/* La posición y el giro van en el atributo (siempre vale) y en CSS (para que se deslicen). */}
          <g className="lab-figura" transform={`translate(${x} ${y})`} style={{ transform: `translate(${x}px, ${y}px)` }}>
            <g className="lab-giro" transform={`rotate(${rumbo})`} style={{ transform: `rotate(${rumbo}deg)` }}>
              <g className={acabado ? "lab-llego" : undefined}>
                <g className={choque ? `lab-choque-${choque}` : undefined}>{p.figura}</g>
              </g>
            </g>
          </g>
        </svg>
      </div>
      <p className="nota">{p.nota}</p>
    </MarcoReto>
  );
}
