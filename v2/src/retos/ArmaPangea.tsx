import { useState } from "react";
import Puzle, { type HuecoPuzle, type PiezaPuzle } from "../componentes/Puzle";
import { dichoDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Pangea hace unos doscientos millones de años, esquemática: una «C» abierta al este (el mar
// de Tetis). Los trozos que no se juegan (Antártida, India, Australia) ya están, en gris.
// Contornos PROVISIONALES, dibujados a mano; el lote 6 traerá unos más fieles.

interface Continente {
  id: string;
  nombre: string;
  d: string;
  caja: { x: number; y: number; width: number; height: number };
  color: string;
}

const CONTINENTES: Continente[] = [
  {
    id: "america-norte",
    nombre: "América del Norte",
    d: "M60 40 L110 28 L150 34 L176 50 L178 82 L172 110 L176 132 L150 138 L128 130 L108 138 L96 120 L70 112 L52 90 L44 62 Z",
    caja: { x: 40, y: 24, width: 142, height: 118 },
    color: "#e0a526",
  },
  {
    id: "europa-asia",
    nombre: "Europa y Asia",
    d: "M178 50 L200 30 L240 22 L290 24 L330 34 L342 60 L336 90 L320 108 L290 112 L262 118 L238 124 L214 118 L196 110 L178 82 Z",
    caja: { x: 174, y: 18, width: 172, height: 110 },
    color: "#c8553d",
  },
  {
    id: "africa",
    nombre: "África",
    d: "M176 132 L196 116 L214 118 L238 124 L256 138 L262 170 L254 200 L238 226 L214 238 L198 226 L188 200 L178 182 L162 172 L160 150 L172 138 Z",
    caja: { x: 156, y: 112, width: 110, height: 130 },
    color: "#6b7f3a",
  },
  {
    id: "america-sur",
    nombre: "América del Sur",
    d: "M162 172 L178 182 L188 200 L180 226 L164 248 L146 272 L128 280 L118 262 L108 230 L96 204 L100 180 L120 164 L144 160 L160 150 Z",
    caja: { x: 92, y: 146, width: 100, height: 138 },
    color: "#2a9d8f",
  },
];

const RESTO = "M198 226 L214 238 L238 226 L254 240 L270 262 L250 284 L200 290 L160 282 L150 270 L164 248 L180 226 Z";

const HUECOS: HuecoPuzle[] = CONTINENTES.map((c) => ({
  id: c.id,
  zona: c.caja,
  dibujo: (lleno) =>
    lleno ? (
      <path d={c.d} fill={c.color} stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
    ) : (
      <path d={c.d} className="sombra-pieza" />
    ),
}));

const PIEZAS: PiezaPuzle[] = ["africa", "europa-asia", "america-sur", "america-norte"].map((id) => {
  const c = CONTINENTES.find((x) => x.id === id)!;
  return {
    id,
    nombre: c.nombre,
    hueco: id,
    mini: (
      <svg viewBox={`${c.caja.x} ${c.caja.y} ${c.caja.width} ${c.caja.height}`} aria-hidden="true">
        <path d={c.d} fill={c.color} />
      </svg>
    ),
  };
});

export default function ArmaPangea({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    fallo: dicho("Fallo"),
    final: dicho("Al terminar"),
    puesta: {
      "america-sur": dicho("Al poner América del Sur"),
      africa: dicho("Al poner África"),
      "america-norte": dicho("Al poner América del Norte"),
      "europa-asia": dicho("Al poner Europa y Asia"),
    } as Record<string, Dicho>,
  }));

  return (
    <Puzle
      parada={parada.id}
      titulo={parada.reto ?? "Arma Pangea"}
      pose="senala"
      viewBox="0 0 360 300"
      etiqueta="El contorno de Pangea con cuatro huecos"
      fondo={
        <g>
          <rect width="360" height="300" fill="#6fb3d6" />
          <path d={RESTO} fill="#b9b2a4" stroke="#fff" strokeWidth="2" />
        </g>
      }
      huecos={HUECOS}
      piezas={PIEZAS}
      frases={{ inicio: frases.inicio, fallo: frases.fallo, final: frases.final, puesta: (p) => frases.puesta[p.id] }}
      rotuloPiezas="Los continentes"
      nota="Arrastra cada continente hasta su sombra. Contornos provisionales."
    />
  );
}
