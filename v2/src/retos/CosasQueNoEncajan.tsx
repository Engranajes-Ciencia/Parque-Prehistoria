import { useState } from "react";
import Intrusos, { type CosaEscena } from "../componentes/Intrusos";
import { dichoDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 14, reto de peques: la familia neandertal de la portada, alrededor del fuego, con
// cuatro cosas de hoy que se han colado. Son emojis del propio móvil: se ve enseguida que
// «no son de allí», que es justo la gracia.
export default function CosasQueNoEncajan({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [intrusos] = useState<CosaEscena[]>(() => [
    { id: "gafas", nombre: "Gafas de sol", emoji: "🕶️", x: 148, y: 186, ancho: 74, giro: -6, dicho: dicho("Gafas de sol") },
    { id: "movil", nombre: "Móvil", emoji: "📱", x: 112, y: 486, ancho: 58, giro: 12, dicho: dicho("Móvil") },
    { id: "pizza", nombre: "Pizza", emoji: "🍕", x: 300, y: 690, ancho: 66, giro: -10, dicho: dicho("Pizza") },
    { id: "balon", nombre: "Balón", emoji: "⚽", x: 520, y: 708, ancho: 60, dicho: dicho("Balón") },
  ]);
  const [frases] = useState(() => ({ inicio: dicho("Al empezar"), final: dicho("Al terminar") }));
  return (
    <Intrusos
      parada={parada.id}
      titulo={parada.reto ?? "¿Qué no encaja?"}
      fondo={{ src: "img/p14/portada.webp", ancho: 600, alto: 900 }}
      viewBox="0 140 600 620"
      etiqueta="Una familia neandertal junto al fuego, con cosas que no son de su época"
      intrusos={intrusos}
      inicio={frases.inicio}
      final={frases.final}
      nota="Toca las cosas que los neandertales no podían tener."
    />
  );
}
