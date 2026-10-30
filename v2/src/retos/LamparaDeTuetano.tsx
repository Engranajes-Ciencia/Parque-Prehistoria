import { useState } from "react";
import Linterna, { type CosaEscondida } from "../componentes/Linterna";
import { dichoDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 16 (mayores): la portada (img/p16/portada.webp, 600×900) a oscuras, con la luz de
// una lámpara. Se ve la franja de y = 20 a 735, la que tiene todo lo que hay que buscar: así
// la cueva cabe entera bajo Alba en un móvil de 360×600 (abajo solo hay suelo y pieles).
// Zonas en píxeles de la ilustración, medidas sobre ella con una cuadrícula el 30-oct.
const RECORTE = { x: 0, y: 20, width: 600, height: 715 };
const RADIO = 102; // el 17 % del ancho de la imagen

type Cosa = Omit<CosaEscondida, "dicho"> & { etiqueta: string };
const COSAS: Cosa[] = [
  {
    id: "caballo",
    nombre: "Caballo",
    etiqueta: "Caballo",
    // El grande, arriba a la izquierda, y el pequeño de debajo.
    zonas: [
      { x: 105, y: 40, width: 200, height: 160 },
      { x: 120, y: 185, width: 135, height: 85 },
    ],
  },
  {
    id: "bisonte",
    nombre: "Bisonte",
    etiqueta: "Bisonte",
    // El grande, arriba a la derecha, y el que asoma por el borde derecho.
    zonas: [
      { x: 300, y: 72, width: 278, height: 205 },
      { x: 488, y: 226, width: 112, height: 136 },
    ],
  },
  {
    id: "manos",
    nombre: "Manos",
    etiqueta: "Manos",
    // Las cuatro manos en negativo: arriba, la que está soplando el pintor y las dos de abajo.
    zonas: [
      { x: 298, y: 15, width: 92, height: 97 },
      { x: 338, y: 258, width: 120, height: 150 },
      { x: 452, y: 380, width: 100, height: 95 },
      { x: 392, y: 452, width: 98, height: 105 },
    ],
  },
  {
    id: "lampara",
    nombre: "Lámpara",
    etiqueta: "Lámpara",
    // La lámpara de piedra con su llama, en el suelo.
    zonas: [{ x: 362, y: 628, width: 120, height: 102 }],
  },
  {
    id: "pintor",
    nombre: "Pintor",
    etiqueta: "Pintor",
    // La cabeza con el tubo de soplar y, debajo, los brazos, el pecho y las rodillas.
    zonas: [
      { x: 140, y: 262, width: 205, height: 150 },
      { x: 40, y: 400, width: 300, height: 220 },
    ],
  },
];

export default function LamparaDeTuetano({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [f] = useState(() => ({
    inicio: dicho("Al empezar"),
    final: dicho("Al terminar"),
    cosas: COSAS.map(({ etiqueta, ...c }) => ({ ...c, dicho: dicho(etiqueta) })),
  }));
  return (
    <Linterna
      parada={parada.id}
      titulo={parada.reto ?? "Con la lámpara de tuétano"}
      imagen="img/p16/portada.webp"
      ancho={600}
      alto={900}
      recorte={RECORTE}
      radio={RADIO}
      cosas={f.cosas}
      inicio={f.inicio}
      final={f.final}
      etiqueta="Una cueva a oscuras con pinturas de animales y manos, un pintor y una lámpara de piedra"
      nota="Mueve el dedo por la cueva para alumbrarla."
    />
  );
}
