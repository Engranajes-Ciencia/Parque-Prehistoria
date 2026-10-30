import { useState } from "react";
import Memory, { type ParejaMemory } from "../componentes/Memory";
import { dichoDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 18, reto de peques: parejas boca abajo; cada animal salvaje con su pariente
// doméstico (lobo-perro, uro-vaca, muflón-oveja, jabalí-cerdo). Ilustraciones del lote 4.
const img = (n: string) => <img src={`img/p18/${n}.webp`} alt="" draggable={false} />;

export default function ParejasDeLaGranja({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [datos] = useState(() => ({
    parejas: [
      { id: "perro", a: { nombre: "Lobo", dibujo: img("lobo") }, b: { nombre: "Perro", dibujo: img("perro") }, dicho: dicho("Acierto perro") },
      { id: "vaca", a: { nombre: "Uro", dibujo: img("uro") }, b: { nombre: "Vaca", dibujo: img("vaca") }, dicho: dicho("Acierto vaca") },
      { id: "oveja", a: { nombre: "Muflón", dibujo: img("muflon") }, b: { nombre: "Oveja", dibujo: img("oveja") }, dicho: dicho("Acierto oveja") },
      { id: "cerdo", a: { nombre: "Jabalí", dibujo: img("jabali") }, b: { nombre: "Cerdo", dibujo: img("cerdo") }, dicho: dicho("Acierto cerdo") },
    ] as ParejaMemory[],
    inicio: dicho("Al empezar"),
    final: dicho("Al terminar"),
  }));
  return (
    <Memory
      parada={parada.id}
      titulo={parada.reto ?? "Parejas de la granja"}
      parejas={datos.parejas}
      inicio={datos.inicio}
      final={datos.final}
      nota="Da la vuelta a dos cartas. Si son pareja, se quedan boca arriba."
    />
  );
}
