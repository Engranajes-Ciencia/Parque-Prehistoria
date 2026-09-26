import { useRef, useState } from "react";
import Emparejar, { type PiezaEmparejar } from "../componentes/Emparejar";
import { dichoDelReto, dichosDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Repartir seis animales entre «Se extinguieron» y «Sobrevivieron» tras el asteroide.
// Dibujos PROVISIONALES (emojis) hasta el lote 6.
const ANIMALES: PiezaEmparejar[] = [
  { id: "tiranosaurio", nombre: "Tiranosaurio", dibujo: "🦖", destino: "extintos" },
  { id: "ave", nombre: "Ave", dibujo: "🐦", destino: "vivos" },
  { id: "amonites", nombre: "Amonites", dibujo: "🐚", destino: "extintos" },
  { id: "cocodrilo", nombre: "Cocodrilo", dibujo: "🐊", destino: "vivos" },
  { id: "pterosaurio", nombre: "Reptil volador", dibujo: "🪽", destino: "extintos" },
  { id: "mamifero", nombre: "Mamífero pequeño", dibujo: "🐭", destino: "vivos" },
];

export default function QuienSobrevivio({ parada }: { parada: ContenidoParada }) {
  const [frases] = useState(() => ({
    inicio: dichoDelReto(parada.guion, parada.id, "Al empezar"),
    fallo: dichoDelReto(parada.guion, parada.id, "Fallo"),
    final: dichoDelReto(parada.guion, parada.id, "Al terminar"),
    extinto: dichosDelReto(parada.guion, parada.id, "Acierto se extinguió"),
    vivo: dichosDelReto(parada.guion, parada.id, "Acierto sobrevivió"),
    ave: dichoDelReto(parada.guion, parada.id, "Acierto ave"),
  }));
  const vuelta = useRef(0);
  const acierto = (p: PiezaEmparejar) => {
    if (p.id === "ave") return frases.ave;
    const lista = p.destino === "extintos" ? frases.extinto : frases.vivo;
    return lista[vuelta.current++ % lista.length];
  };
  return (
    <Emparejar
      parada={parada.id}
      titulo={parada.reto ?? "¿Quién sobrevivió?"}
      piezas={ANIMALES}
      sitios={[
        { id: "extintos", nombre: "Se extinguieron", dibujo: "☄️" },
        { id: "vivos", nombre: "Sobrevivieron", dibujo: "🌅" },
      ]}
      rotuloPiezas="Los animales"
      rotuloSitios="Después del asteroide…"
      frases={{ inicio: frases.inicio, fallo: frases.fallo, final: frases.final, acierto }}
      nota="Dibujos provisionales: llegarán las ilustraciones."
    />
  );
}
