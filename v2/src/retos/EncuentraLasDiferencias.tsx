import { useState } from "react";
import BuscaEnDibujo from "../componentes/BuscaEnDibujo";
import { dichoDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 15: cráneo de chimpancé (izquierda) y de persona (derecha), de perfil mirando a la
// derecha (ilustración del lote 7, 1536×1024). Se tocan las diferencias en el cráneo humano;
// las zonas, en píxeles de la ilustración, medidas sobre ella el 27-sep.

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
      viewBox="0 0 1536 1024"
      etiqueta="Un cráneo de chimpancé y uno de persona, de perfil"
      dibujo={<image href="img/p15/craneos.webp" width="1536" height="1024" />}
      zonas={[
        { id: "frente", nombre: "La frente", x: 1050, y: 70, width: 390, height: 320, dicho: f.frente },
        { id: "cara", nombre: "La cara", x: 1320, y: 360, width: 170, height: 230, dicho: f.cara },
        { id: "colmillos", nombre: "Los colmillos", x: 1340, y: 590, width: 150, height: 105, dicho: f.colmillos },
        { id: "menton", nombre: "El mentón", x: 1360, y: 700, width: 130, height: 120, dicho: f.menton },
      ]}
      inicio={f.inicio}
      final={f.final}
      nota="Toca en el cráneo de la persona lo que lo hace distinto."
    />
  );
}
