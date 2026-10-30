import { useState } from "react";
import Intrusos, { type CosaEscena } from "../componentes/Intrusos";
import { dichoDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 7, reto para mayores: el Jurásico del brontosaurio (hace unos 150 millones de años)
// con cinco intrusos que no pudieron estar allí y dos trampas que sí: un mamífero pequeño y
// un pariente de los cocodrilos. Todo son ilustraciones aprobadas de otras paradas.
export default function QuienNoPudoEstar({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [escena] = useState(() => ({
    decorado: [
      { id: "bronto", nombre: "Brontosaurio", img: "img/p07/brontosaurio.webp", x: 395, y: 528, ancho: 430, alto: 190, dicho: dicho("Al empezar") },
    ] as CosaEscena[],
    intrusos: [
      { id: "triceratops", nombre: "Triceratops", img: "img/p07/triceratops.webp", x: 175, y: 735, ancho: 300, alto: 175, dicho: dicho("Triceratops") },
      { id: "tiranosaurio", nombre: "Tiranosaurio", img: "img/p10/tiranosaurio.webp", x: 560, y: 655, ancho: 230, alto: 140, espejo: true, dicho: dicho("Tiranosaurio") },
      { id: "vaca", nombre: "Vaca", img: "img/p18/vaca.webp", x: 455, y: 815, ancho: 170, alto: 120, dicho: dicho("Vaca") },
      { id: "flor", nombre: "Flor", img: "img/p06/flor.webp", x: 255, y: 935, ancho: 92, alto: 88, dicho: dicho("Flor") },
      { id: "persona", nombre: "Persona", emoji: "🧍", x: 118, y: 552, ancho: 104, dicho: dicho("Persona") },
    ] as CosaEscena[],
    trampas: [
      { id: "mamifero", nombre: "Mamífero pequeño", img: "img/p10/mamifero.webp", x: 560, y: 960, ancho: 150, alto: 47, dicho: dicho("Mamífero pequeño") },
      { id: "cocodrilo", nombre: "Pariente de los cocodrilos", img: "img/p10/cocodrilo.webp", x: 255, y: 628, ancho: 160, alto: 54, espejo: true, dicho: dicho("Cocodrilo") },
    ] as CosaEscena[],
    inicio: dicho("Al empezar"),
    final: dicho("Al terminar"),
  }));
  return (
    <Intrusos
      parada={parada.id}
      titulo={parada.reto ?? "¿Quién no pudo estar aquí?"}
      fondo={{ src: "img/p07/juego_fondo.webp", ancho: 720, alto: 1080 }}
      viewBox="0 300 720 720"
      etiqueta="Un paisaje del Jurásico con un brontosaurio y algunos intrusos"
      decorado={escena.decorado}
      intrusos={escena.intrusos}
      trampas={escena.trampas}
      inicio={escena.inicio}
      final={escena.final}
      nota="Toca a los que no pudieron vivir en el Jurásico. ¡Cuidado con las trampas!"
    />
  );
}
