import { useState } from "react";
import Flechas from "../componentes/Flechas";
import { dichoDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 11, reto para mayores: cada pinzón de Darwin con su comida, y cada comida con la
// herramienta de hoy que hace el mismo trabajo que su pico. Pinzones y comidas, del lote 7.
const img = (n: string) => <img src={`img/p11/${n}.webp`} alt="" draggable={false} />;
const emoji = (e: string) => <span aria-hidden="true">{e}</span>;

export default function ElTallerDeDarwin({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    fallo: [dicho("Fallo"), dicho("Fallo otra vez")],
    final: dicho("Al terminar"),
    comida: { semillas: dicho("Acierto semillas"), insectos: dicho("Acierto insectos"), cactus: dicho("Acierto cactus") } as Record<string, Dicho>,
    herramienta: {
      semillas: dicho("Herramienta semillas"),
      insectos: dicho("Herramienta insectos"),
      cactus: dicho("Herramienta cactus"),
    } as Record<string, Dicho>,
  }));
  return (
    <Flechas
      parada={parada.id}
      titulo={parada.reto ?? "El taller de Darwin"}
      pose="lupa"
      columnas={[
        [
          { id: "p-semillas", nombre: "Pico gordo", dibujo: img("pinzon-semillas") },
          { id: "p-insectos", nombre: "Pico fino", dibujo: img("pinzon-insectos") },
          { id: "p-cactus", nombre: "Pico largo", dibujo: img("pinzon-cactus") },
        ],
        [
          { id: "semillas", nombre: "Semillas duras", dibujo: img("semillas") },
          { id: "insectos", nombre: "Bichitos", dibujo: img("insectos") },
          { id: "cactus", nombre: "Flor de cactus", dibujo: img("flor-cactus") },
        ],
        [
          { id: "h-semillas", nombre: "Cascanueces", dibujo: emoji("🌰") },
          { id: "h-insectos", nombre: "Palillos", dibujo: emoji("🥢") },
          { id: "h-cactus", nombre: "Pajita", dibujo: emoji("🥤") },
        ],
      ]}
      rotulos={["Pinzón", "Comida", "Herramienta"]}
      pares={[
        ["p-semillas", "semillas"],
        ["p-insectos", "insectos"],
        ["p-cactus", "cactus"],
        ["semillas", "h-semillas"],
        ["insectos", "h-insectos"],
        ["cactus", "h-cactus"],
      ]}
      frases={{
        inicio: frases.inicio,
        fallo: frases.fallo,
        final: frases.final,
        acierto: (a, b) => (b.startsWith("h-") ? frases.herramienta[a] : frases.comida[b]),
      }}
      nota="Une cada pinzón con su comida, y cada comida con la herramienta que hace el mismo trabajo que el pico."
    />
  );
}
