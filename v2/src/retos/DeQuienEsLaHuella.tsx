import { useState } from "react";
import Emparejar, { type PiezaEmparejar } from "../componentes/Emparejar";
import { dichoDelReto, dichosDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Cada huella con el dinosaurio que la dejó. Las huellas del carnívoro y del herbívoro con pico
// miden lo mismo: hay que fijarse en los dedos, no en el tamaño. Dinosaurios PROVISIONALES.
const huella = (d: string) => (
  <svg viewBox="0 0 60 60" aria-hidden="true">
    <path d={d} fill="#7a5a3a" fillRule="evenodd" />
  </svg>
);
// Dedos finos acabados en garra.
const TEROPODO = huella(
  "M30 58 C22 58 20 48 24 40 L12 10 Q11 6 14 8 L27 34 L28 4 Q30 1 32 4 L33 34 L46 8 Q49 6 48 10 L36 40 C40 48 38 58 30 58 Z",
);
// Tres dedos cortos, anchos y redondeados, como un trébol.
const ORNITOPODO = huella(
  "M30 58 C18 58 16 46 22 40 C14 38 8 30 12 22 C16 16 22 22 24 30 C24 20 24 10 30 8 C36 10 36 20 36 30 C38 22 44 16 48 22 C52 30 46 38 38 40 C44 46 42 58 30 58 Z",
);
// Redonda, con tres marcas cortas de uña delante.
const SAUROPODO = huella(
  "M30 58 C10 58 3 44 5 30 C7 17 18 10 30 10 C42 10 53 17 55 30 C57 44 50 58 30 58 Z M16 15 L11 6 L21 12 Z M28 10 L30 2 L33 10 Z M40 12 L48 5 L45 15 Z",
);

const HUELLAS: PiezaEmparejar[] = [
  { id: "ornitopodo", nombre: "Tres dedos gorditos", dibujo: ORNITOPODO, destino: "ornitopodo" },
  { id: "sauropodo", nombre: "Redonda y enorme", dibujo: SAUROPODO, destino: "sauropodo" },
  { id: "teropodo", nombre: "Tres dedos finos", dibujo: TEROPODO, destino: "teropodo" },
];

export default function DeQuienEsLaHuella({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    fallo: dichosDelReto(parada.guion, parada.id, "Fallo"),
    final: dicho("Al terminar"),
    acierto: {
      teropodo: dicho("Acierto terópodo"),
      ornitopodo: dicho("Acierto ornitópodo"),
      sauropodo: dicho("Acierto saurópodo"),
    } as Record<string, Dicho>,
  }));
  return (
    <Emparejar
      parada={parada.id}
      titulo={parada.reto ?? "¿De quién es la huella?"}
      pose="lupa"
      piezas={HUELLAS}
      sitios={[
        { id: "teropodo", nombre: "Carnívoro de dos patas", dibujo: "🦖" },
        { id: "ornitopodo", nombre: "Iguanodonte, con pico", dibujo: "🦎" },
        { id: "sauropodo", nombre: "Cuello largo", dibujo: "🦕" },
      ]}
      columnas={3}
      rotuloPiezas="Las huellas"
      rotuloSitios="¿Quién la dejó?"
      frases={{ inicio: frases.inicio, fallo: frases.fallo, final: frases.final, acierto: (p) => frases.acierto[p.id] }}
      nota="Dibujos de los dinosaurios provisionales: llegarán las ilustraciones."
    />
  );
}
