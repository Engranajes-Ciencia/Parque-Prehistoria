import { useState } from "react";
import BuscaEnDibujo from "../componentes/BuscaEnDibujo";
import { dichoDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 12: el suelo de ceniza de Laetoli visto desde arriba, con cuatro pistas (el animal
// es un elefante: en la capa de Laetoli hay huellas suyas).
// Dibujo PROVISIONAL (SVG) hasta que llegue la ilustración del lote 7; las zonas se
// recolocan entonces sobre ella.

const pie = (x: number, y: number, giro: number, izq: boolean) => (
  <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${giro}) scale(${izq ? -1 : 1} 1)`}>
    <ellipse cx="0" cy="0" rx="7" ry="15" fill="#8d8373" />
    <circle cx="-4" cy="-15" r="3.2" fill="#8d8373" />
    {[0, 3, 6, 8].map((d, i) => (
      <circle key={i} cx={-0.5 + d * 0.6} cy={-16 + i * 1.2} r="1.8" fill="#8d8373" />
    ))}
  </g>
);

const DIBUJO = (
  <g>
    <rect width="360" height="300" fill="#d9d2c3" />
    {/* volcán al fondo, humeando */}
    <path d="M250 70 L300 18 L318 18 L352 70 Z" fill="#7b6f63" />
    <path d="M300 18 q6 -12 16 -6 q10 -10 18 2" stroke="#b9b2a8" strokeWidth="8" fill="none" strokeLinecap="round" />
    <path d="M0 70 H360" stroke="#c6bda9" strokeWidth="2" />
    {/* rastro de homínidos, en diagonal */}
    {[0, 1, 2, 3, 4, 5].map((i) => pie(70 + i * 32, 270 - i * 30, 40, i % 2 === 0))}
    {[0, 1, 2, 3, 4].map((i) => pie(98 + i * 32, 280 - i * 30, 40, i % 2 === 1))}
    {/* huellas de elefante: grandes y redondas */}
    {[0, 1, 2].map((i) => (
      <ellipse key={i} cx={40 + i * 26} cy={150 - (i % 2) * 14} rx="11" ry="10" fill="#9e9483" />
    ))}
    {/* marcas de gotas de lluvia */}
    {Array.from({ length: 18 }, (_, i) => (
      <circle key={i} cx={262 + ((i * 37) % 70)} cy={150 + ((i * 23) % 60)} r="2.4" fill="#b3aa98" />
    ))}
  </g>
);

export default function DetectivesDeLaetoli({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [f] = useState(() => ({
    inicio: dicho("Al empezar"),
    final: dicho("Al terminar"),
    huellas: dicho("Al encontrar las huellas"),
    animal: dicho("Al encontrar el animal"),
    lluvia: dicho("Al encontrar la lluvia"),
    volcan: dicho("Al encontrar el volcán"),
  }));
  return (
    <BuscaEnDibujo
      parada={parada.id}
      titulo={parada.reto ?? "Detectives de Laetoli"}
      viewBox="0 0 360 300"
      etiqueta="El suelo de ceniza de Laetoli, visto desde arriba"
      dibujo={DIBUJO}
      zonas={[
        { id: "huellas", nombre: "Las huellas", x: 50, y: 110, width: 190, height: 185, dicho: f.huellas },
        { id: "animal", nombre: "Un animal", x: 20, y: 125, width: 80, height: 45, dicho: f.animal },
        { id: "lluvia", nombre: "La lluvia", x: 250, y: 135, width: 90, height: 85, dicho: f.lluvia },
        { id: "volcan", nombre: "El volcán", x: 240, y: 0, width: 120, height: 75, dicho: f.volcan },
      ]}
      inicio={f.inicio}
      final={f.final}
      nota="Toca las pistas en el dibujo. Dibujo provisional: llegará la ilustración."
    />
  );
}
