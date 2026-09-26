import { useState } from "react";
import Puzle, { type HuecoPuzle, type PiezaPuzle } from "../componentes/Puzle";
import { dichoDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 20: una casa de Çatalhöyük en corte. Paredes (sin puerta) → tejado plano con su
// agujero → escalera que asoma por él; el horno, dentro, en cuanto hay paredes.
// Dibujo PROVISIONAL hasta el lote 7.

const SUELO = 250;
const PAREDES = "M60 120 H80 V250 H60 Z M240 120 H260 V250 H240 Z";
const FONDO_CASA = "M80 124 H240 V250 H80 Z";
const TEJADO = "M50 100 H188 V122 H50 Z M228 100 H270 V122 H228 Z";
const ESCALERA = "M194 248 L202 66 L226 66 L222 248 Z";
const HORNO = "M92 250 Q92 208 120 208 Q148 208 148 250 Z";

const sombra = (d: string) => <path d={d} className="sombra-pieza" />;

const HUECOS: HuecoPuzle[] = [
  {
    id: "paredes",
    zona: { x: 55, y: 115, width: 210, height: 137 },
    dibujo: (lleno) =>
      lleno ? (
        <g>
          <path d={FONDO_CASA} fill="#e9dcc3" />
          <path d={PAREDES} fill="#c9a26b" stroke="#7a5a33" strokeWidth="2" />
        </g>
      ) : (
        sombra(PAREDES)
      ),
  },
  {
    id: "horno",
    zona: { x: 92, y: 206, width: 56, height: 46 },
    dibujo: (lleno) =>
      lleno ? (
        <g>
          <path d={HORNO} fill="#b7794a" stroke="#6b4226" strokeWidth="2" />
          <path d="M110 250 Q110 232 120 232 Q130 232 130 250 Z" fill="#3a2a1c" />
          <path d="M116 244 q4 -8 8 0" stroke="#f2a33a" strokeWidth="3" fill="none" />
        </g>
      ) : (
        sombra(HORNO)
      ),
  },
  {
    id: "tejado",
    zona: { x: 45, y: 95, width: 230, height: 32 },
    dibujo: (lleno) => (lleno ? <path d={TEJADO} fill="#a88758" stroke="#6b4f2a" strokeWidth="2" /> : sombra(TEJADO)),
  },
  {
    id: "escalera",
    zona: { x: 190, y: 62, width: 40, height: 188 },
    dibujo: (lleno) =>
      lleno ? (
        <g stroke="#7a5230" strokeWidth="5" strokeLinecap="round">
          <line x1="198" y1="248" x2="205" y2="68" />
          <line x1="220" y1="248" x2="224" y2="68" />
          {[90, 120, 150, 180, 210, 238].map((y) => (
            <line key={y} x1={197 + (248 - y) * 0.04} y1={y} x2={219 + (248 - y) * 0.02} y2={y} strokeWidth="4" />
          ))}
        </g>
      ) : (
        sombra(ESCALERA)
      ),
  },
];

const mini = (d: string, color: string, caja: string) => (
  <svg viewBox={caja} aria-hidden="true">
    <path d={d} fill={color} stroke="#5a4326" strokeWidth="3" />
  </svg>
);

const PIEZAS: PiezaPuzle[] = [
  { id: "tejado", nombre: "Tejado", hueco: "tejado", mini: mini(TEJADO, "#a88758", "45 60 230 110") },
  { id: "horno", nombre: "Horno", hueco: "horno", mini: mini(HORNO, "#b7794a", "86 200 68 56") },
  { id: "escalera", nombre: "Escalera", hueco: "escalera", mini: mini(ESCALERA, "#a0703f", "150 60 120 196") },
  { id: "paredes", nombre: "Paredes", hueco: "paredes", mini: mini(PAREDES, "#c9a26b", "50 110 220 146") },
];

const ANTES: Record<string, string[]> = { tejado: ["paredes"], escalera: ["paredes", "tejado"], horno: ["paredes"] };

export default function ConstruyeLaCasa({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    final: dicho("Al terminar"),
    pronto: dicho("Antes de tiempo"),
    puesta: {
      paredes: dicho("Al poner las paredes"),
      tejado: dicho("Al poner el tejado"),
      escalera: dicho("Al poner la escalera"),
      horno: dicho("Al poner el horno"),
    } as Record<string, Dicho>,
  }));

  return (
    <Puzle
      parada={parada.id}
      titulo={parada.reto ?? "Construye una casa de Çatalhöyük"}
      pose="piensa"
      viewBox="0 0 320 300"
      etiqueta="Una casa de Çatalhöyük en corte, por construir"
      fondo={
        <g>
          <rect width="320" height={SUELO} fill="#cfe8f2" />
          <rect y={SUELO} width="320" height={300 - SUELO} fill="#9c7a52" />
          <rect x="0" y="96" width="46" height="154" fill="#d8c09a" opacity="0.6" />
          <rect x="274" y="96" width="46" height="154" fill="#d8c09a" opacity="0.6" />
        </g>
      }
      huecos={HUECOS}
      piezas={PIEZAS}
      frases={{
        inicio: frases.inicio,
        final: frases.final,
        puesta: (p) => frases.puesta[p.id],
        antesDeTiempo: (p, puestas) => ((ANTES[p.id] ?? []).every((h) => puestas[h]) ? null : frases.pronto),
      }}
      rotuloPiezas="Las piezas de la casa"
      nota="Arrastra cada pieza hasta su sombra, o tócala y luego toca la sombra. Dibujo provisional."
    />
  );
}
