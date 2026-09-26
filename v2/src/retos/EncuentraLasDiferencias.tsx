import { useState } from "react";
import BuscaEnDibujo from "../componentes/BuscaEnDibujo";
import { dichoDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 15: cráneo de chimpancé (izquierda) y de persona (derecha), de perfil mirando a la
// derecha. Se tocan las diferencias en el cráneo humano. Dibujo PROVISIONAL (SVG) hasta la
// ilustración del lote 7; entonces se recolocan las zonas.

const HUESO = "#f1e9d6";
const TRAZO = "#8a7a5e";

const DIBUJO = (
  <g>
    <rect width="360" height="240" fill="#f7f2e7" />
    <path d="M180 20 V220" stroke="#e1d6bf" strokeWidth="2" strokeDasharray="6 6" />
    {/* chimpancé: bóveda baja, cara que sobresale, colmillos grandes, sin mentón */}
    <g fill={HUESO} stroke={TRAZO} strokeWidth="3">
      <path d="M22 110 Q30 58 88 56 Q130 58 138 96 L168 130 Q170 160 150 170 L112 172 Q96 178 80 170 Q50 168 40 150 Q18 140 22 110 Z" />
      <circle cx="112" cy="104" r="12" fill="#e6dcc4" />
      <path d="M140 162 L146 184 L152 162 Z M126 166 L130 180 L134 166 Z" fill="#fff" />
    </g>
    {/* persona: bóveda alta y redonda, cara plana bajo la frente, colmillos pequeños, mentón */}
    <g fill={HUESO} stroke={TRAZO} strokeWidth="3">
      <path d="M200 120 Q196 40 270 34 Q334 34 338 104 Q338 128 328 140 L330 160 Q332 176 322 186 L326 200 Q318 214 300 210 L286 206 Q278 196 280 180 Q262 178 250 170 Q214 166 200 120 Z" />
      <circle cx="312" cy="112" r="11" fill="#e6dcc4" />
      <path d="M318 176 L321 186 L324 176 Z" fill="#fff" />
    </g>
  </g>
);

export default function EncuentraLasDiferencias({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [f] = useState(() => ({
    inicio: dicho("Al empezar"),
    final: dicho("Al terminar"),
    frente: dicho("Al encontrar la frente"),
    cara: dicho("Al encontrar la cara"),
    menton: dicho("Al encontrar el mentón"),
    colmillos: dicho("Al encontrar los colmillos"),
  }));
  return (
    <BuscaEnDibujo
      parada={parada.id}
      titulo={parada.reto ?? "Encuentra las diferencias"}
      viewBox="0 0 360 240"
      etiqueta="Un cráneo de chimpancé y uno de persona, de perfil"
      dibujo={DIBUJO}
      zonas={[
        { id: "frente", nombre: "La frente", x: 250, y: 28, width: 95, height: 60, dicho: f.frente },
        { id: "cara", nombre: "La cara", x: 300, y: 92, width: 45, height: 58, dicho: f.cara },
        { id: "menton", nombre: "El mentón", x: 290, y: 192, width: 50, height: 30, dicho: f.menton },
        { id: "colmillos", nombre: "Los colmillos", x: 305, y: 160, width: 32, height: 32, dicho: f.colmillos },
      ]}
      inicio={f.inicio}
      final={f.final}
      nota="Toca en el cráneo de la persona lo que lo hace distinto. Dibujo provisional."
    />
  );
}
