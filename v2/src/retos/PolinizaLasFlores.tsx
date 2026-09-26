import { createRef, useRef, useState, type RefObject } from "react";
import MarcoReto, { useAlba } from "../componentes/MarcoReto";
import { useArrastre } from "../componentes/useArrastre";
import { dichoDelReto, dichosDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// La abeja se lleva de flor en flor (arrastrando, o tocándola y luego la flor). Cada visita
// deja polen de la flor anterior; cuando las cuatro están polinizadas, se vuelven frutos.
// Las cuatro son de la MISMA especie (flor de cerezo → cereza): el polen de otra especie no sirve.
// Dibujos PROVISIONALES (SVG), hasta que lleguen las ilustraciones.

const FLORES = [
  { id: "f1", x: 22, y: 30, color: "#f6c9dc" },
  { id: "f2", x: 72, y: 22, color: "#f6c9dc" },
  { id: "f3", x: 30, y: 72, color: "#f6c9dc" },
  { id: "f4", x: 78, y: 68, color: "#f6c9dc" },
];

function Flor({ color, polinizada, fruto }: { color: string; polinizada: boolean; fruto: boolean }) {
  if (fruto) {
    return (
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="M40 18 Q46 8 54 10" stroke="#5b7f2e" strokeWidth="4" fill="none" />
        <circle cx="40" cy="46" r="24" fill="#d9433b" />
        <ellipse cx="32" cy="38" rx="6" ry="4" fill="#ffffff" opacity="0.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true">
      {[0, 72, 144, 216, 288].map((a) => ( // el cerezo tiene cinco pétalos
        <ellipse key={a} cx="40" cy="20" rx="11" ry="17" fill={color} transform={`rotate(${a} 40 40)`} />
      ))}
      <circle cx="40" cy="40" r="11" fill={polinizada ? "#f7d23e" : "#e9b44c"} />
      {polinizada &&
        [0, 1, 2, 3, 4].map((i) => <circle key={i} cx={34 + (i % 3) * 6} cy={36 + Math.floor(i / 3) * 7} r="2" fill="#fff6b0" />)}
    </svg>
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
  const { mensaje, decir, final, terminar, acabado } = useAlba(frases.inicio);
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
    <MarcoReto parada={parada.id} titulo={parada.reto ?? "Poliniza las flores"} mensaje={mensaje} decir={decir} final={final}>
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
            <Flor color={f.color} polinizada={visitadas.includes(f.id)} fruto={!!final} />
          </button>
        ))}
        {!acabado && (
          <button
            className={`prado-abeja pieza-suelta ${arrastre ? "moviendo" : ""} ${elegida ? "elegida" : ""}`}
            aria-label="La abeja"
            {...pieza("abeja")}
          >
            🐝
          </button>
        )}
      </div>
      <p className="nota">Lleva la abeja de flor en flor. Dibujos provisionales.</p>
    </MarcoReto>
  );
}
