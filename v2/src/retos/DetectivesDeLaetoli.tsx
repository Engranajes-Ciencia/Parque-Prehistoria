import { useState } from "react";
import BuscaEnDibujo from "../componentes/BuscaEnDibujo";
import { dichoDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 12: el suelo de ceniza de Laetoli (ilustración E1b del lote 7 bis, 1536×1024) con
// cuatro pistas. Dos rastros, como en el yacimiento: el de la primera versión tenía tres.
// Las zonas van en píxeles de la ilustración, medidas sobre ella el 27-sep. Las marcas
// de lluvia salpican todo el suelo: su zona es el suelo entero, y como gana la zona más
// pequeña, tocar una pisada o una huella de elefante cuenta como esa pista.

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
      viewBox="0 0 1536 1024"
      etiqueta="El suelo de ceniza de Laetoli, con pisadas, huellas de elefante, marcas de lluvia y un volcán"
      dibujo={<image href="img/p12/laetoli-b.webp" width="1536" height="1024" />}
      zonas={[
        { id: "huellas", nombre: "Las pisadas", x: 305, y: 185, width: 345, height: 810, dicho: f.huellas },
        { id: "animal", nombre: "Un animal", x: 950, y: 190, width: 560, height: 720, dicho: f.animal },
        { id: "lluvia", nombre: "La lluvia", x: 0, y: 175, width: 1536, height: 849, dicho: f.lluvia, marco: false },
        { id: "volcan", nombre: "El volcán", x: 900, y: 0, width: 420, height: 135, dicho: f.volcan },
      ]}
      inicio={f.inicio}
      final={f.final}
      nota="Toca las pistas en el dibujo."
    />
  );
}
