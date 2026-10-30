import { useState } from "react";
import Rompecabezas from "../componentes/Rompecabezas";
import { dichoDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 20, reto de peques: la ilustración de Çatalhöyük (casas pegadas, se entra por el
// tejado) partida en 6 piezas grandes. El dibujo entero se ve al lado, como en la caja.
export default function RompecabezasCatalhoyuk({ parada }: { parada: ContenidoParada }) {
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
      titulo={parada.reto ?? "El rompecabezas de Çatalhöyük"}
      imagen="img/p20/portada.webp"
      proporcion={600 / 900}
      filas={3}
      columnas={2}
      modelo="siempre"
      frases={frases}
      etiqueta="Rompecabezas de Çatalhöyük"
      nota="Toca una pieza y luego otra para cambiarlas de sitio, o arrástrala encima. Las que están bien se quedan quietas."
    />
  );
}
