import { useState } from "react";
import Emparejar, { type PiezaEmparejar } from "../componentes/Emparejar";
import { dichoDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 11: tres pinzones de Darwin del mismo tamaño y postura, que solo se diferencian en
// el pico, y la comida de cada uno (ilustraciones del lote 7).
const img = (n: string) => <img src={`img/p11/${n}.webp`} alt="" draggable={false} />;
const PAJAROS: PiezaEmparejar[] = [
  { id: "cactus", nombre: "Pico largo", dibujo: img("pinzon-cactus"), destino: "cactus" },
  { id: "semillas", nombre: "Pico gordo", dibujo: img("pinzon-semillas"), destino: "semillas" },
  { id: "insectos", nombre: "Pico fino", dibujo: img("pinzon-insectos"), destino: "insectos" },
];

export default function CadaPicoSuComida({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    fallo: dicho("Fallo"),
    final: dicho("Al terminar"),
    acierto: {
      semillas: dicho("Acierto semillas"),
      insectos: dicho("Acierto insectos"),
      cactus: dicho("Acierto cactus"),
    } as Record<string, Dicho>,
  }));
  return (
    <Emparejar
      parada={parada.id}
      titulo={parada.reto ?? "Cada pico, su comida"}
      pose="lupa"
      piezas={PAJAROS}
      sitios={[
        { id: "semillas", nombre: "Semillas duras", dibujo: img("semillas") },
        { id: "insectos", nombre: "Bichitos", dibujo: img("insectos") },
        { id: "cactus", nombre: "Flor de cactus", dibujo: img("flor-cactus") },
      ]}
      columnas={3}
      rotuloPiezas="Los pinzones de Darwin"
      rotuloSitios="¿Qué come cada uno?"
      frases={{ inicio: frases.inicio, fallo: frases.fallo, final: frases.final, acierto: (p) => frases.acierto[p.id] }}
    />
  );
}
