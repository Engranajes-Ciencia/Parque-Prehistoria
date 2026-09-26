import { createRef, useRef, useState, type ReactNode, type RefObject } from "react";
import type { Dicho } from "../contenido/guion";
import type { PoseAlba } from "./Alba";
import MarcoReto, { useAlba } from "./MarcoReto";
import { useArrastre } from "./useArrastre";

// Motor de juego para «lleva cada pieza a su sitio»: ordenar tarjetas (los sitios son los
// pasos 1, 2, 3…), una línea del tiempo, emparejar huellas con dinosaurios o repartir
// tarjetas en dos grupos (varios sitios admiten más de una pieza). Cada juego solo describe
// sus piezas, sus sitios y sus frases.

export interface PiezaEmparejar {
  id: string;
  nombre: string;
  dibujo: ReactNode;
  /** Sitio correcto. */
  destino: string;
}

export interface SitioEmparejar {
  id: string;
  nombre: string;
  dibujo?: ReactNode;
  /** Marca que se pone encima de cada pieza colocada aquí (p. ej., la cruz de «Es un mito»). */
  sello?: string;
}

export interface FrasesEmparejar {
  inicio: Dicho;
  /** Una frase o varias, que se van alternando. */
  fallo: Dicho | Dicho[];
  final: Dicho;
  /** Lo que dice Alba al colocar bien una pieza. */
  acierto: (pieza: PiezaEmparejar) => Dicho;
  /** Si la pieza va bien pero todavía no toca (p. ej., las hojas antes que el tronco). */
  antesDeTiempo?: (pieza: PiezaEmparejar, colocadas: Record<string, string>) => Dicho | null;
}

interface Props {
  parada: number;
  titulo: string;
  pose?: PoseAlba;
  piezas: PiezaEmparejar[];
  sitios: SitioEmparejar[];
  frases: FrasesEmparejar;
  rotuloPiezas: string;
  rotuloSitios: string;
  /** Columnas de la rejilla de sitios (2 por defecto). */
  columnas?: number;
  nota?: string;
}

export default function Emparejar(p: Props) {
  const { mensaje, decir, final, terminar, acabado } = useAlba(p.frases.inicio, p.parada);
  const [colocadas, setColocadas] = useState<Record<string, string>>({}); // pieza -> sitio
  const [sacudida, setSacudida] = useState<string | null>(null);
  const fallos = useRef(0);
  const refs = useRef<Record<string, RefObject<HTMLElement | null>>>(
    Object.fromEntries(p.sitios.map((s) => [s.id, createRef<HTMLElement>()])),
  );

  const rechazar = (id: string, d: Dicho) => {
    setSacudida(id);
    setTimeout(() => setSacudida(null), 500);
    decir(d);
  };

  const soltar = (id: string, sitio: string) => {
    if (acabado || colocadas[id]) return;
    const pieza = p.piezas.find((x) => x.id === id)!;
    if (pieza.destino !== sitio) {
      const f = p.frases.fallo;
      return rechazar(id, Array.isArray(f) ? f[fallos.current++ % f.length] : f);
    }
    const pronto = p.frases.antesDeTiempo?.(pieza, colocadas);
    if (pronto) return rechazar(id, pronto);
    const nuevas = { ...colocadas, [id]: sitio };
    setColocadas(nuevas);
    if (Object.keys(nuevas).length === p.piezas.length) terminar(p.frases.acierto(pieza), p.frases.final);
    else decir(p.frases.acierto(pieza));
  };

  const { arrastre, elegida, sobre, pieza, tocarDestino } = useArrastre(refs.current, soltar);

  return (
    <MarcoReto parada={p.parada} titulo={p.titulo} mensaje={mensaje} decir={decir} final={final} pose={p.pose}>
      <div className="estante">
        <h3>{p.rotuloPiezas}</h3>
        <div className="piezas">
          {p.piezas.map((x) =>
            colocadas[x.id] ? (
              <span key={x.id} className="pieza hueco" />
            ) : (
              <button
                key={x.id}
                className={`pieza ${arrastre?.id === x.id ? "moviendo" : ""} ${elegida === x.id ? "elegida" : ""} ${sacudida === x.id ? "sacudida" : ""}`}
                {...pieza(x.id)}
              >
                <span className="pieza-dibujo">{x.dibujo}</span>
                <span className="pieza-nombre">{x.nombre}</span>
              </button>
            ),
          )}
        </div>
      </div>

      <div className="estante">
        <h3>{p.rotuloSitios}</h3>
        <div className="parejas" style={{ gridTemplateColumns: `repeat(${p.columnas ?? 2}, minmax(0, 1fr))` }}>
          {p.sitios.map((s) => {
            const dentro = p.piezas.filter((x) => colocadas[x.id] === s.id);
            return (
              <button
                key={s.id}
                ref={refs.current[s.id] as RefObject<HTMLButtonElement>}
                className={`pareja ${sobre === s.id ? "sobre" : ""} ${elegida ? "esperando" : ""} ${dentro.length ? "hecha" : ""}`}
                onClick={() => tocarDestino(s.id)}
              >
                {s.dibujo && <span className="pieza-dibujo">{s.dibujo}</span>}
                <span className="pieza-nombre">{s.nombre}</span>
                {dentro.length > 0 && (
                  <span className="pareja-dentro">
                    {dentro.map((x) => (
                      <span key={x.id} className="pareja-mini" title={x.nombre}>
                        {x.dibujo}
                        {s.sello && <span className="pareja-sello">{s.sello}</span>}
                      </span>
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      {p.nota && <p className="nota">{p.nota}</p>}
    </MarcoReto>
  );
}
