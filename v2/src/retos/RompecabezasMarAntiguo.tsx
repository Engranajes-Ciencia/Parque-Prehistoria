import { useState } from "react";
import Rompecabezas from "../componentes/Rompecabezas";
import { dichoDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 3, reto para mayores: el mar del Paleozoico de la portada (trilobites, amonites,
// lirios de mar) en 12 piezas. Como un paleontólogo que junta los trozos de una losa rota:
// el dibujo entero solo se ve si se pide.
export default function RompecabezasMarAntiguo({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    mitad: dicho("A la mitad"),
    ultima: dicho("Última pieza"),
    final: dicho("Al terminar"),
  }));
  return (
    <Rompecabezas
      parada={parada.id}
      titulo={parada.reto ?? "La losa rota"}
      imagen="img/p03/portada.webp"
      proporcion={600 / 900}
      filas={4}
      columnas={3}
      modelo="boton"
      frases={frases}
      etiqueta="Rompecabezas del mar antiguo"
      nota="Toca dos piezas para cambiarlas de sitio, o arrastra una encima de otra. Las que encajan se quedan fijas."
    />
  );
}
