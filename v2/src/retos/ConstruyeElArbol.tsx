import { useState } from "react";
import Puzle, { type HuecoPuzle, type PiezaPuzle } from "../componentes/Puzle";
import { dichoDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Un Archaeopteris por piezas: raíces, tronco y copa, en ese orden (de sostén: lo de abajo
// sujeta lo de arriba; ver el guion). Dibujo PROVISIONAL, hasta el lote 6.

const SUELO = 232;
const RAICES =
  "M146 232 L150 232 L154 232 L186 262 L222 276 L218 284 L182 272 L170 262 L176 300 L168 346 L160 344 L162 300 L156 262 L148 266 L140 306 L126 342 L118 338 L130 300 L140 262 L128 270 L90 290 L84 282 L122 262 Z";
const TRONCO = "M140 232 L143 110 L157 110 L160 232 Z";
const COPA =
  "M150 18 C160 40 176 60 190 72 C200 82 214 96 226 118 C200 126 176 128 150 128 C124 128 100 126 74 118 C86 96 100 82 110 72 C124 60 140 40 150 18 Z";

const dibujo = (d: string, color: string, detalle?: React.ReactNode) => (lleno: boolean) =>
  lleno ? (
    <g>
      <path d={d} fill={color} stroke="#4b3a26" strokeWidth="2" strokeLinejoin="round" />
      {detalle}
    </g>
  ) : (
    <path d={d} className="sombra-pieza" />
  );

// Ramitas planas de la copa, como frondas de helecho (nada de agujas ni de flores).
const FRONDAS = (
  <g stroke="#2f6b2a" strokeWidth="2" fill="none" opacity="0.7">
    {[40, 62, 84, 106].map((y, i) => (
      <g key={y}>
        <path d={`M150 ${y} Q${120 - i * 8} ${y + 8} ${104 - i * 10} ${y + 16}`} />
        <path d={`M150 ${y} Q${180 + i * 8} ${y + 8} ${196 + i * 10} ${y + 16}`} />
      </g>
    ))}
  </g>
);

const HUECOS: HuecoPuzle[] = [
  { id: "copa", zona: { x: 70, y: 14, width: 160, height: 116 }, dibujo: dibujo(COPA, "#4f9a44", FRONDAS) },
  { id: "tronco", zona: { x: 128, y: 108, width: 44, height: 124 }, dibujo: dibujo(TRONCO, "#8a5a33") },
  { id: "raices", zona: { x: 80, y: SUELO, width: 146, height: 118 }, dibujo: dibujo(RAICES, "#a4743f") },
];

const mini = (d: string, color: string, caja: string) => (
  <svg viewBox={caja} aria-hidden="true">
    <path d={d} fill={color} stroke="#4b3a26" strokeWidth="3" />
  </svg>
);

const PIEZAS: PiezaPuzle[] = [
  { id: "copa", nombre: "Hojas", hueco: "copa", mini: mini(COPA, "#4f9a44", "70 14 160 116") },
  { id: "raices", nombre: "Raíces", hueco: "raices", mini: mini(RAICES, "#a4743f", "80 228 146 122") },
  { id: "tronco", nombre: "Tronco", hueco: "tronco", mini: mini(TRONCO, "#8a5a33", "100 106 100 130") },
];

const ORDEN = ["raices", "tronco", "copa"];

export default function ConstruyeElArbol({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    final: dicho("Al terminar"),
    pronto: dicho("Antes de tiempo"),
    puesta: {
      raices: dicho("Al poner las raíces"),
      tronco: dicho("Al poner el tronco"),
      copa: dicho("Al poner las hojas"),
    } as Record<string, ReturnType<typeof dicho>>,
  }));

  return (
    <Puzle
      parada={parada.id}
      titulo={parada.reto ?? "Construye el primer árbol"}
      pose="piensa"
      viewBox="0 0 300 360"
      etiqueta="Un árbol primitivo por construir"
      fondo={
        <g>
          <rect width="300" height={SUELO} fill="#bfe3f2" />
          <rect y={SUELO} width="300" height={360 - SUELO} fill="#8c6b4a" />
          <path d={`M0 ${SUELO} H300`} stroke="#5d7f3a" strokeWidth="6" />
          <path d="M20 280 L60 300 M230 300 L280 318 M40 330 L90 322" stroke="#6e5238" strokeWidth="3" />
          {[24, 48, 250, 272].map((x) => (
            <path key={x} d={`M${x} ${SUELO} l-6 -16 M${x} ${SUELO} l0 -20 M${x} ${SUELO} l6 -16`} stroke="#3f7d33" strokeWidth="3" />
          ))}
        </g>
      }
      huecos={HUECOS}
      piezas={PIEZAS}
      frases={{
        inicio: frases.inicio,
        final: frases.final,
        puesta: (p) => frases.puesta[p.id],
        antesDeTiempo: (p, puestas) => (ORDEN.slice(0, ORDEN.indexOf(p.id)).every((h) => puestas[h]) ? null : frases.pronto),
      }}
      rotuloPiezas="Las piezas del árbol"
      nota="Arrastra cada pieza hasta su sombra, o tócala y luego toca la sombra. Dibujo provisional."
    />
  );
}
