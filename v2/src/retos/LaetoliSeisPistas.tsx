import { useState } from "react";
import BuscaEnDibujo from "../componentes/BuscaEnDibujo";
import { dichoDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 12, reto para mayores: el mismo suelo de ceniza que el de peques (laetoli-b, en
// unidades de 1536×1024) con seis pistas en vez de cuatro: los dos caminantes por separado y
// las rocas de lava. Zonas medidas el 30-oct sobre la ilustración con una cuadrícula. Como en
// el de peques, la lluvia ocupa todo el suelo y gana siempre la zona más pequeña. Las rocas
// están en tres sitios: abajo a la izquierda y en las dos orillas del fondo.
export default function LaetoliSeisPistas({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [f] = useState(() => ({
    inicio: dicho("Al empezar"),
    final: dicho("Al terminar"),
    grande: dicho("El caminante grande"),
    pequeno: dicho("El caminante pequeño"),
    elefante: dicho("Un elefante"),
    lluvia: dicho("La lluvia"),
    volcan: dicho("El volcán"),
    rocas: dicho("Las rocas"),
  }));
  return (
    <BuscaEnDibujo
      parada={parada.id}
      titulo={parada.reto ?? "Seis pistas en la ceniza"}
      viewBox="0 0 1536 1024"
      etiqueta="El suelo de ceniza de Laetoli, con dos rastros de pisadas, huellas de elefante, marcas de lluvia, rocas y un volcán"
      dibujo={<image href="img/p12/laetoli-b.webp" width="1536" height="1024" />}
      zonas={[
        { id: "grande", nombre: "El caminante grande", x: 318, y: 187, width: 269, height: 812, dicho: f.grande },
        { id: "pequeno", nombre: "El caminante pequeño", x: 524, y: 395, width: 134, height: 488, dicho: f.pequeno },
        { id: "elefante", nombre: "Un elefante", x: 950, y: 190, width: 560, height: 720, dicho: f.elefante },
        { id: "lluvia", nombre: "La lluvia", x: 0, y: 175, width: 1536, height: 849, dicho: f.lluvia, marco: false },
        { id: "volcan", nombre: "El volcán", x: 900, y: 0, width: 420, height: 135, dicho: f.volcan },
        {
          id: "rocas",
          nombre: "Las rocas",
          x: 0,
          y: 658,
          width: 219,
          height: 366,
          dicho: f.rocas,
          otras: [
            { x: 0, y: 130, width: 320, height: 170 },
            { x: 1380, y: 175, width: 156, height: 80 },
          ],
        },
      ]}
      inicio={f.inicio}
      final={f.final}
      nota="Toca las seis pistas en el dibujo."
    />
  );
}
