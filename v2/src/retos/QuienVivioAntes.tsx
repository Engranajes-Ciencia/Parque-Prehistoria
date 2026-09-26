import { useState } from "react";
import Emparejar, { type PiezaEmparejar } from "../componentes/Emparejar";
import { dichoDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Línea del tiempo: cada ser a su hueco, por orden de APARICIÓN (los últimos Prototaxites sí
// coincidieron con el Tiktaalik; ver el guion). Las piezas son recortes de las fotos del parque.
const img = (n: string) => <img src={`img/p04/${n}.webp`} alt="" draggable={false} />;
const SERES: PiezaEmparejar[] = [
  { id: "meganeura", nombre: "Meganeura", dibujo: img("meganeura"), destino: "300" },
  { id: "prototaxites", nombre: "Prototaxites", dibujo: img("prototaxites"), destino: "400" },
  { id: "tiktaalik", nombre: "Tiktaalik", dibujo: img("tiktaalik"), destino: "375" },
];

export default function QuienVivioAntes({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    fallo: dicho("Fallo"),
    final: dicho("Al terminar"),
    acierto: Object.fromEntries(
      ["prototaxites", "tiktaalik", "meganeura"].map((id) => [id, dicho(`Acierto ${id}`)]),
    ) as Record<string, Dicho>,
  }));
  return (
    <Emparejar
      parada={parada.id}
      titulo={parada.reto ?? "¿Quién vivió antes?"}
      pose="reloj"
      piezas={SERES}
      sitios={[
        { id: "400", nombre: "Hace más de 400 millones de años", dibujo: "🌱" },
        { id: "375", nombre: "Hace unos 375 millones de años", dibujo: "🏞️" },
        { id: "300", nombre: "Hace unos 300 millones de años", dibujo: "🌿" },
      ]}
      columnas={3}
      rotuloPiezas="¿Quién es quién?"
      rotuloSitios="Del más antiguo al más moderno →"
      frases={{ inicio: frases.inicio, fallo: frases.fallo, final: frases.final, acierto: (p) => frases.acierto[p.id] }}
    />
  );
}
