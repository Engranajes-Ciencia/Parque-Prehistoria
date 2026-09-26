import { createRef, useRef, useState, type RefObject } from "react";
import MarcoReto, { useAlba } from "../componentes/MarcoReto";
import { useArrastre } from "../componentes/useArrastre";
import { dichoDelReto, dichosDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// La abeja se lleva de flor en flor (arrastrando, o tocándola y luego la flor). Cada visita
// deja polen de la flor anterior; cuando las cuatro están polinizadas, se vuelven frutos.
// Las cuatro son de la MISMA especie (flor de cerezo → cereza): el polen de otra especie no sirve.
// Ilustraciones del lote 6: flor de cerezo, abeja con polen y cereza.

const FLORES = [
  { id: "f1", x: 22, y: 30 },
  { id: "f2", x: 72, y: 22 },
  { id: "f3", x: 30, y: 72 },
  { id: "f4", x: 78, y: 68 },
];

function Flor({ polinizada, fruto }: { polinizada: boolean; fruto: boolean }) {
  return (
    <span className={`flor ${polinizada ? "polinizada" : ""}`}>
      <img src={fruto ? "img/p06/cereza.webp" : "img/p06/flor.webp"} alt="" draggable={false} />
      {polinizada && !fruto && <span className="polen" aria-hidden="true" />}
    </span>
  );
}

export default function PolinizaLasFlores({ parada }: { parada: ContenidoParada }) {
  const dicho = (etiqueta: string) => dichoDelReto(parada.guion, parada.id, etiqueta);
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    primera: dicho("Primera flor"),
    otras: dichosDelReto(parada.guion, parada.id, "Otra flor"),
    ultima: dicho("Última flor"),
    final: dicho("Al terminar"),
  }));
  const { mensaje, decir, final, terminar, acabado } = useAlba(frases.inicio, parada.id);
  const [visitadas, setVisitadas] = useState<string[]>([]);
  const refs = useRef<Record<string, RefObject<HTMLElement | null>>>(
    Object.fromEntries(FLORES.map((f) => [f.id, createRef<HTMLElement>()])),
  );

  const visitar = (_abeja: string, flor: string) => {
    if (acabado || visitadas.includes(flor)) return;
    const nuevas = [...visitadas, flor];
    setVisitadas(nuevas);
    if (nuevas.length === FLORES.length) terminar(frases.ultima, frases.final);
    else if (nuevas.length === 1) decir(frases.primera);
    else decir(frases.otras[(nuevas.length - 2) % frases.otras.length]);
  };

  const { arrastre, elegida, sobre, pieza, tocarDestino } = useArrastre(refs.current, visitar);

  return (
    <MarcoReto
      parada={parada.id}
      titulo={parada.reto ?? "Poliniza las flores"}
      mensaje={mensaje}
      decir={decir}
      final={final}
      // Alba dice «¡Mira! … se han convertido en frutos» con la hoja final delante del prado:
      // los frutos se enseñan también dentro de la hoja (revisión del 27-sep).
      recuerdo={
        <div className="frutos-recuerdo" aria-label="Las flores ya son cerezas">
          {FLORES.map((f) => (
            <img key={f.id} src="img/p06/cereza.webp" alt="" draggable={false} />
          ))}
        </div>
      }
    >
      <div className={`prado ${final ? "con-frutos" : ""}`}>
        {FLORES.map((f) => (
          <button
            key={f.id}
            ref={refs.current[f.id] as RefObject<HTMLButtonElement>}
            className={`prado-flor ${sobre === f.id ? "sobre" : ""} ${elegida ? "esperando" : ""}`}
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
            onClick={() => tocarDestino(f.id)}
            aria-label={visitadas.includes(f.id) ? "Flor polinizada" : "Flor"}
          >
            <Flor polinizada={visitadas.includes(f.id)} fruto={!!final} />
          </button>
        ))}
        {!acabado && (
          <button
            className={`prado-abeja pieza-suelta ${arrastre ? "moviendo" : ""} ${elegida ? "elegida" : ""}`}
            aria-label="La abeja"
            {...pieza("abeja")}
          >
            <img src="img/p06/abeja.webp" alt="" draggable={false} />
          </button>
        )}
      </div>
      <p className="nota">Lleva la abeja de flor en flor.</p>
    </MarcoReto>
  );
}
