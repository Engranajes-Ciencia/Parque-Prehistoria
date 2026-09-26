import { useRef, useState } from "react";
import { dichoDelReto, dichosDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";
import type { PoseAlba } from "./Alba";
import Emparejar, { type PiezaEmparejar, type SitioEmparejar } from "./Emparejar";

// Repartir tarjetas en grupos («Nos lo llevamos» / «Se queda», «Lo hacían» / «Es un mito»…).
// Cada grupo tiene su etiqueta de acierto en el guion, con frases alternativas que se van
// turnando; «Al empezar», «Fallo» y «Al terminar» son comunes.

export interface Grupo extends SitioEmparejar {
  /** Etiqueta de la lista «Voz de Alba» para los aciertos de este grupo. */
  etiqueta: string;
}

interface Props {
  parada: ContenidoParada;
  tituloPorDefecto: string;
  tarjetas: PiezaEmparejar[];
  grupos: Grupo[];
  rotuloPiezas: string;
  rotuloSitios: string;
  pose?: PoseAlba;
  nota?: string;
}

export default function Repartir({ parada, tituloPorDefecto, tarjetas, grupos, rotuloPiezas, rotuloSitios, pose, nota }: Props) {
  const [frases] = useState(() => ({
    inicio: dichoDelReto(parada.guion, parada.id, "Al empezar"),
    fallo: dichoDelReto(parada.guion, parada.id, "Fallo"),
    final: dichoDelReto(parada.guion, parada.id, "Al terminar"),
    acierto: Object.fromEntries(grupos.map((g) => [g.id, dichosDelReto(parada.guion, parada.id, g.etiqueta)])),
  }));
  const vuelta = useRef(0);
  return (
    <Emparejar
      parada={parada.id}
      titulo={parada.reto ?? tituloPorDefecto}
      pose={pose}
      piezas={tarjetas}
      sitios={grupos}
      rotuloPiezas={rotuloPiezas}
      rotuloSitios={rotuloSitios}
      frases={{
        inicio: frases.inicio,
        fallo: frases.fallo,
        final: frases.final,
        acierto: (p) => {
          const lista = frases.acierto[p.destino];
          return lista[vuelta.current++ % lista.length];
        },
      }}
      nota={nota}
    />
  );
}
