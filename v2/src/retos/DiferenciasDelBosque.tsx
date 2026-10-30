import { useState } from "react";
import BuscaEnDibujo, { type ZonaBuscar } from "../componentes/BuscaEnDibujo";
import { dichoDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 5, reto para mayores: las cinco diferencias. Arriba, el bosque de la portada (su mitad
// de abajo); debajo, la misma imagen con cinco cosas que entonces no existían: los intrusos del
// lote 8 (I1 a I5, pintados como la portada), pegados encima el 30-oct. Nunca se redibuja la
// portada entera: cambiaría detalles por todas partes y el juego tendría diferencias que no cuenta. Las zonas, en unidades de las imágenes (800×640 cada una), valen en las dos: como en
// cualquier juego de diferencias, se puede tocar arriba o abajo.

const ALTO = 640;
const COPIA = ALTO + 20; // la copia empieza 20 unidades más abajo

const COSAS: { id: string; nombre: string; x: number; y: number; width: number; height: number }[] = [
  { id: "flor", nombre: "La flor", x: 214, y: 421, width: 90, height: 101 },
  { id: "cereza", nombre: "Las cerezas", x: 370, y: 27, width: 76, height: 75 },
  { id: "pajaro", nombre: "El pájaro", x: 646, y: 405, width: 94, height: 91 },
  { id: "abeja", nombre: "La abeja", x: 443, y: 329, width: 80, height: 76 },
  { id: "raton", nombre: "El ratoncito", x: 293, y: 548, width: 120, height: 80 },
];

export default function DiferenciasDelBosque({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [f] = useState(() => ({
    inicio: dicho("Al empezar"),
    final: dicho("Al terminar"),
    cosa: Object.fromEntries(COSAS.map((c) => [c.id, dicho(c.nombre)])) as Record<string, Dicho>,
  }));
  const zonas: ZonaBuscar[] = COSAS.map((c) => ({
    ...c,
    y: c.y + COPIA,
    dicho: f.cosa[c.id],
    otras: [{ x: c.x, y: c.y, width: c.width, height: c.height }],
  }));
  return (
    <BuscaEnDibujo
      parada={parada.id}
      titulo={parada.reto ?? "Las cinco diferencias"}
      viewBox={`0 0 800 ${COPIA + ALTO}`}
      etiqueta="Dos dibujos del primer bosque, uno encima del otro: en el de abajo se han colado cinco cosas"
      dibujo={
        <>
          <image href="img/p05/bosque.webp" width="800" height={ALTO} />
          <image href="img/p05/bosque-copia-b.webp" y={COPIA} width="800" height={ALTO} />
        </>
      }
      zonas={zonas}
      inicio={f.inicio}
      final={f.final}
      nota="Arriba, el bosque de verdad; abajo, la copia. Toca las cinco diferencias, arriba o abajo."
      nombresOcultos
    />
  );
}
