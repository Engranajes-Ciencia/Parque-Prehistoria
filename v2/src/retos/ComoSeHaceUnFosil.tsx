import { useState } from "react";
import Emparejar, { type PiezaEmparejar } from "../componentes/Emparejar";
import { dichoDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Ordenar las cuatro tarjetas de la historia de un fósil. Cada tarjeta tiene su hueco (1-4).
const img = (n: number) => <img src={`img/p03/fosil-${n}.webp`} alt="" draggable={false} />;
const TARJETAS: PiezaEmparejar[] = [
  { id: "t3", nombre: "Se vuelve piedra", dibujo: img(3), destino: "3" },
  { id: "t1", nombre: "Nada en el mar", dibujo: img(1), destino: "1" },
  { id: "t4", nombre: "¡Aparece!", dibujo: img(4), destino: "4" },
  { id: "t2", nombre: "Lo tapa el barro", dibujo: img(2), destino: "2" },
];

export default function ComoSeHaceUnFosil({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    fallo: dicho("Fallo"),
    final: dicho("Al terminar"),
    tarjeta: Object.fromEntries(["1", "2", "3", "4"].map((n) => [n, dicho(`Tarjeta ${n}`)])) as Record<string, Dicho>,
  }));
  return (
    <Emparejar
      parada={parada.id}
      titulo={parada.reto ?? "¿Cómo se hace un fósil?"}
      pose="lupa"
      piezas={TARJETAS}
      sitios={["1", "2", "3", "4"].map((n) => ({ id: n, nombre: `${n}.º` }))}
      columnas={4}
      rotuloPiezas="Las tarjetas, desordenadas"
      rotuloSitios="¿Qué pasa primero?"
      frases={{ inicio: frases.inicio, fallo: frases.fallo, final: frases.final, acierto: (p) => frases.tarjeta[p.destino] }}
    />
  );
}
