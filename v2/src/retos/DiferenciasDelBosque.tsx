import { useState } from "react";
import BuscaEnDibujo, { type ZonaBuscar } from "../componentes/BuscaEnDibujo";
import { dichoDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 5, reto para mayores: las cinco diferencias. Arriba, el bosque de la portada (su mitad
// de abajo); debajo, la misma imagen con cinco cosas que entonces no existían, pegadas el 30-oct
// con dibujos de otras paradas (flor, abeja y cereza de la 6; pájaro y mamífero de la 10). Las zonas, en unidades de las imágenes (800×640 cada una), valen en las dos: como en
// cualquier juego de diferencias, se puede tocar arriba o abajo.

const ALTO = 640;
const COPIA = ALTO + 20; // la copia empieza 20 unidades más abajo

const COSAS: { id: string; nombre: string; x: number; y: number; width: number; height: number }[] = [
  { id: "flor", nombre: "La flor", x: 216, y: 439, width: 84, height: 82 },
  { id: "cereza", nombre: "La cereza", x: 377, y: 30, width: 67, height: 82 },
  { id: "pajaro", nombre: "El pájaro", x: 640, y: 392, width: 108, height: 106 },
  { id: "abeja", nombre: "La abeja", x: 443, y: 326, width: 81, height: 79 },
  { id: "raton", nombre: "El ratoncito", x: 291, y: 566, width: 126, height: 64 },
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
          <image href="img/p05/bosque-copia.webp" y={COPIA} width="800" height={ALTO} />
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
