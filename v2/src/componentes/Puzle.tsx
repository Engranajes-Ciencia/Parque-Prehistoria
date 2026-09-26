import { createRef, useRef, useState, type ReactNode, type RefObject } from "react";
import type { Dicho } from "../contenido/guion";
import type { PoseAlba } from "./Alba";
import MarcoReto, { useAlba } from "./MarcoReto";
import { useArrastre } from "./useArrastre";

// Motor de juego «cada pieza a su sombra», sobre un dibujo: armar Pangea, construir un
// árbol… Cada hueco sabe dibujarse vacío (sombra) y lleno, y tiene una zona donde soltar.

export interface HuecoPuzle {
  id: string;
  /** Zona donde se puede soltar la pieza, en unidades del dibujo. */
  zona: { x: number; y: number; width: number; height: number };
  dibujo: (lleno: boolean) => ReactNode;
}

export interface PiezaPuzle {
  id: string;
  nombre: string;
  hueco: string;
  mini: ReactNode;
}

interface Props {
  parada: number;
  titulo: string;
  pose?: PoseAlba;
  viewBox: string;
  etiqueta: string;
  /** Lo que se dibuja detrás de los huecos (cielo, suelo…). */
  fondo?: ReactNode;
  /** Lo que se dibuja delante al completar (p. ej., un brillo). */
  alCompletar?: ReactNode;
  huecos: HuecoPuzle[];
  piezas: PiezaPuzle[];
  frases: {
    inicio: Dicho;
    /** Sin frase de fallo, la pieza se sacude y vuelve sin que Alba diga nada. */
    fallo?: Dicho;
    final: Dicho;
    puesta: (pieza: PiezaPuzle) => Dicho;
    antesDeTiempo?: (pieza: PiezaPuzle, puestas: Record<string, string>) => Dicho | null;
  };
  rotuloPiezas: string;
  nota: string;
}

export default function Puzle(p: Props) {
  const { mensaje, decir, final, terminar, acabado } = useAlba(p.frases.inicio, p.parada);
  const [puestas, setPuestas] = useState<Record<string, string>>({}); // hueco -> pieza
  const [sacudida, setSacudida] = useState<string | null>(null);
  const refs = useRef<Record<string, RefObject<HTMLElement | null>>>(
    Object.fromEntries(p.huecos.map((h) => [h.id, createRef<HTMLElement>()])),
  );
  const completo = Object.keys(puestas).length === p.piezas.length;

  const colocar = (id: string, hueco: string) => {
    if (acabado) return;
    const pieza = p.piezas.find((x) => x.id === id)!;
    const rechazar = (d?: Dicho) => {
      setSacudida(id);
      setTimeout(() => setSacudida(null), 500);
      if (d) decir(d);
    };
    if (puestas[hueco] || pieza.hueco !== hueco) return rechazar(p.frases.fallo);
    const pronto = p.frases.antesDeTiempo?.(pieza, puestas);
    if (pronto) return rechazar(pronto);
    const nuevas = { ...puestas, [hueco]: id };
    setPuestas(nuevas);
    if (Object.keys(nuevas).length === p.piezas.length) terminar(p.frases.puesta(pieza), p.frases.final);
    else decir(p.frases.puesta(pieza));
  };

  const { arrastre, elegida, sobre, pieza, tocarDestino } = useArrastre(refs.current, colocar);
  const usadas = Object.values(puestas);

  return (
    <MarcoReto parada={p.parada} titulo={p.titulo} mensaje={mensaje} decir={decir} final={final} pose={p.pose}>
      <svg
        className={`puzle ${completo ? "completo" : ""}`}
        viewBox={p.viewBox}
        role="img"
        aria-label={p.etiqueta}
        onClick={(e) => {
          // Tocar una sombra con una pieza elegida. Si las zonas se solapan, gana la de centro más cercano.
          const m = e.currentTarget.getScreenCTM();
          if (!m) return;
          const q = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
          const dentro = p.huecos.filter(
            ({ zona: z }) => q.x >= z.x && q.x <= z.x + z.width && q.y >= z.y && q.y <= z.y + z.height,
          );
          const centro = (z: HuecoPuzle["zona"]) => Math.hypot(q.x - z.x - z.width / 2, q.y - z.y - z.height / 2);
          const h = dentro.sort((a, b) => centro(a.zona) - centro(b.zona))[0];
          if (h) tocarDestino(h.id);
        }}
      >
        {p.fondo}
        {p.huecos.map((h) => (
          <g key={h.id} className={`puzle-hueco ${puestas[h.id] ? "lleno" : ""} ${sobre === h.id ? "sobre" : ""} ${elegida && !puestas[h.id] ? "esperando" : ""}`}>
            {h.dibujo(!!puestas[h.id])}
            <rect
              ref={refs.current[h.id] as unknown as RefObject<SVGRectElement>}
              {...h.zona}
              fill="transparent"
            />
          </g>
        ))}
        {completo && p.alCompletar}
      </svg>

      <div className="estante">
        <h3>{p.rotuloPiezas}</h3>
        <div className="piezas">
          {p.piezas.map((x) =>
            usadas.includes(x.id) ? (
              <span key={x.id} className="pieza hueco" />
            ) : (
              <button
                key={x.id}
                className={`pieza ${arrastre?.id === x.id ? "moviendo" : ""} ${elegida === x.id ? "elegida" : ""} ${sacudida === x.id ? "sacudida" : ""}`}
                {...pieza(x.id)}
              >
                <span className="pieza-dibujo">{x.mini}</span>
                <span className="pieza-nombre">{x.nombre}</span>
              </button>
            ),
          )}
        </div>
      </div>
      <p className="nota">{p.nota}</p>
    </MarcoReto>
  );
}
