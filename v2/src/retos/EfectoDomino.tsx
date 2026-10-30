import { useState } from "react";
import Emparejar from "../componentes/Emparejar";
import { dichoDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 10, reto para mayores: la extinción de hace 66 millones de años como un dominó de
// causas y efectos, en seis tarjetas que se ordenan del 1.º al 6.º (en dos filas de tres:
// seis huecos en una fila no caben en un móvil). Frases «Tarjeta N» del guion.
const emoji = (e: string) => <span className="tarjeta-emoji" aria-hidden="true">{e}</span>;
const TARJETAS = [
  { paso: 1, nombre: "Un asteroide choca contra la Tierra", dibujo: emoji("☄️") },
  { paso: 2, nombre: "El polvo y el humo tapan el sol", dibujo: emoji("🌫️") },
  { paso: 3, nombre: "Oscuridad y frío durante meses", dibujo: emoji("🥶") },
  { paso: 4, nombre: "Las plantas dejan de crecer", dibujo: emoji("🥀") },
  { paso: 5, nombre: "Los grandes herbívoros se quedan sin comida", dibujo: emoji("🦕") },
  { paso: 6, nombre: "Los grandes carnívoros se quedan sin presas", dibujo: emoji("🦖") },
];
// Desordenadas a mano (siempre igual: así las frases de ayuda valen para todos).
const ORDEN_EN_PANTALLA = [4, 1, 6, 3, 5, 2];

export default function EfectoDomino({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    fallo: dicho("Fallo"),
    final: dicho("Al terminar"),
    tarjeta: Object.fromEntries(TARJETAS.map((t) => [String(t.paso), dicho(`Tarjeta ${t.paso}`)])) as Record<string, Dicho>,
  }));
  return (
    <Emparejar
      parada={parada.id}
      titulo={parada.reto ?? "Efecto dominó"}
      piezas={ORDEN_EN_PANTALLA.map((n) => TARJETAS[n - 1]).map((t) => ({ id: `t${t.paso}`, nombre: t.nombre, dibujo: t.dibujo, destino: String(t.paso) }))}
      sitios={TARJETAS.map((t) => ({ id: String(t.paso), nombre: `${t.paso}.º` }))}
      columnas={3}
      rotuloPiezas="Lo que pasó"
      rotuloSitios="En orden, del primero al último"
      frases={{ inicio: frases.inicio, fallo: frases.fallo, final: frases.final, acierto: (p) => frases.tarjeta[p.destino] }}
    />
  );
}
