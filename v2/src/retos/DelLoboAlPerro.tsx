import { useState } from "react";
import Flechas from "../componentes/Flechas";
import { dichoDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 18, reto para mayores: una cadena de tres columnas. Cada animal salvaje con su
// pariente doméstico, y cada doméstico con lo que daba a los primeros agricultores.
const img = (n: string) => <img src={`img/p18/${n}.webp`} alt="" draggable={false} />;
const emoji = (e: string) => <span aria-hidden="true">{e}</span>;

export default function DelLoboAlPerro({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    fallo: [dicho("Fallo"), dicho("Fallo otra vez")],
    final: dicho("Al terminar"),
    pariente: { perro: dicho("Acierto perro"), vaca: dicho("Acierto vaca"), oveja: dicho("Acierto oveja"), cerdo: dicho("Acierto cerdo") } as Record<string, Dicho>,
    da: { perro: dicho("Nos da perro"), vaca: dicho("Nos da vaca"), oveja: dicho("Nos da oveja"), cerdo: dicho("Nos da cerdo") } as Record<string, Dicho>,
  }));
  return (
    <Flechas
      parada={parada.id}
      titulo={parada.reto ?? "Del lobo al perro"}
      columnas={[
        [
          { id: "lobo", nombre: "Lobo", dibujo: img("lobo") },
          { id: "uro", nombre: "Uro", dibujo: img("uro") },
          { id: "muflon", nombre: "Muflón", dibujo: img("muflon") },
          { id: "jabali", nombre: "Jabalí", dibujo: img("jabali") },
        ],
        [
          { id: "perro", nombre: "Perro", dibujo: img("perro") },
          { id: "vaca", nombre: "Vaca", dibujo: img("vaca") },
          { id: "oveja", nombre: "Oveja", dibujo: img("oveja") },
          { id: "cerdo", nombre: "Cerdo", dibujo: img("cerdo") },
        ],
        [
          { id: "da-perro", nombre: "Ayuda a cazar y vigila", dibujo: emoji("🦴") },
          { id: "da-vaca", nombre: "Leche y fuerza", dibujo: emoji("🥛") },
          { id: "da-oveja", nombre: "Leche y lana", dibujo: emoji("🧶") },
          { id: "da-cerdo", nombre: "Carne", dibujo: emoji("🍖") },
        ],
      ]}
      rotulos={["Salvaje", "Doméstico", "¿Qué nos da?"]}
      pares={[
        ["lobo", "perro"],
        ["uro", "vaca"],
        ["muflon", "oveja"],
        ["jabali", "cerdo"],
        ["perro", "da-perro"],
        ["vaca", "da-vaca"],
        ["oveja", "da-oveja"],
        ["cerdo", "da-cerdo"],
      ]}
      frases={{
        inicio: frases.inicio,
        fallo: frases.fallo,
        final: frases.final,
        acierto: (a, b) => (b.startsWith("da-") ? frases.da[a] : frases.pariente[b]),
      }}
      nota="Une cada animal salvaje con su pariente doméstico, y cada doméstico con lo que nos da."
    />
  );
}
