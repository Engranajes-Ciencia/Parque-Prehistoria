import { useState } from "react";
import Emparejar, { type PiezaEmparejar } from "../componentes/Emparejar";
import { dichoDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 11: tres pinzones de Darwin, iguales salvo el pico, y la comida de cada uno.
// Cabezas dibujadas PROVISIONALES (lo único que importa es el pico) hasta el lote 7.
const cabeza = (color: string, pico: string) => (
  <svg viewBox="0 0 70 60" aria-hidden="true">
    <circle cx="26" cy="32" r="22" fill={color} />
    <circle cx="32" cy="26" r="4" fill="#fff" />
    <circle cx="33" cy="26" r="2" fill="#222" />
    <path d={pico} fill="#3b3b3b" />
  </svg>
);
const PAJAROS: PiezaEmparejar[] = [
  // Pico de cactus: largo, puntiagudo, algo curvado hacia abajo.
  { id: "cactus", nombre: "Pico largo", dibujo: cabeza("#8a6f55", "M44 28 Q62 30 69 40 Q58 36 45 37 Z"), destino: "cactus" },
  // Pico de semillas: cónico, altísimo y ancho en la base.
  { id: "semillas", nombre: "Pico gordo", dibujo: cabeza("#2d2d2d", "M42 16 L64 32 L42 46 Z"), destino: "semillas" },
  // Pico de insectos: fino y recto, como una aguja corta.
  { id: "insectos", nombre: "Pico fino", dibujo: cabeza("#8a9a6a", "M46 30 L66 32 L46 34 Z"), destino: "insectos" },
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
        { id: "semillas", nombre: "Semillas duras", dibujo: "🌰" },
        { id: "insectos", nombre: "Bichitos", dibujo: "🐛" },
        { id: "cactus", nombre: "Flor de cactus", dibujo: "🌵" },
      ]}
      columnas={3}
      rotuloPiezas="Los pinzones de Darwin"
      rotuloSitios="¿Qué come cada uno?"
      frases={{ inicio: frases.inicio, fallo: frases.fallo, final: frases.final, acierto: (p) => frases.acierto[p.id] }}
      nota="Dibujos provisionales: llegarán las ilustraciones."
    />
  );
}
