import { useRef, useState } from "react";
import MarcoReto, { useAlba } from "../componentes/MarcoReto";
import { useArrastre } from "../componentes/useArrastre";
import { dichoDelReto, dichosDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

type Dino = "tri" | "bronto";

interface Comida {
  id: string;
  nombre: string;
  imagen: string;
  donde: "alto" | "suelo";
  para: Dino | null; // null = trampa: ninguno de los dos comía carne
}

const COMIDA: Comida[] = [
  { id: "araucaria", nombre: "Rama de araucaria", imagen: "img/p07/araucaria.webp", donde: "alto", para: "bronto" },
  { id: "ginkgo", nombre: "Hojas de ginkgo", imagen: "img/p07/ginkgo.webp", donde: "alto", para: "bronto" },
  { id: "helecho", nombre: "Helecho", imagen: "img/p07/helecho.webp", donde: "suelo", para: "tri" },
  { id: "filete", nombre: "Filete", imagen: "img/p07/filete.webp", donde: "suelo", para: null },
  { id: "cicada", nombre: "Cícada", imagen: "img/p07/cicada.webp", donde: "suelo", para: "tri" },
  { id: "cola", nombre: "Cola de caballo", imagen: "img/p07/cola.webp", donde: "suelo", para: "tri" },
];
const PLANTAS = COMIDA.filter((c) => c.para !== null).length;

export default function QuienComeQue({ parada }: { parada: ContenidoParada }) {
  const dicho = (etiqueta: string) => dichoDelReto(parada.guion, parada.id, etiqueta);
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    aciertos: dichosDelReto(parada.guion, parada.id, "Acierto"),
    altoAlTriceratops: dicho("Planta alta al triceratops"),
    sueloAlBrontosaurio: dicho("Planta del suelo al brontosaurio"),
    filete: dicho("Filete a cualquiera"),
    final: dicho("Al terminar"),
  }));
  const { mensaje, decir, final, terminar, acabado } = useAlba(frases.inicio, parada.id);
  const [colocadas, setColocadas] = useState<Record<string, Dino>>({});
  const [sacudida, setSacudida] = useState<string | null>(null);
  const [masticando, setMasticando] = useState<Dino | null>(null);
  const aciertos = useRef(0);
  const zonas = { tri: useRef<HTMLButtonElement>(null), bronto: useRef<HTMLButtonElement>(null) };

  const rechazar = (id: string, d: Dicho) => {
    setSacudida(id);
    setTimeout(() => setSacudida(null), 500);
    decir(d);
  };

  const dar = (id: string, dino: Dino) => {
    if (acabado) return;
    const comida = COMIDA.find((c) => c.id === id)!;
    if (comida.para === null) return rechazar(id, frases.filete);
    if (comida.para !== dino) {
      return rechazar(id, dino === "tri" ? frases.altoAlTriceratops : frases.sueloAlBrontosaurio);
    }
    const nuevas = { ...colocadas, [id]: dino };
    setColocadas(nuevas);
    setMasticando(dino);
    setTimeout(() => setMasticando(null), 700);
    // También la última planta tiene su «¡acierto!» antes de la hoja final (regla de Álvaro).
    const acierto = frases.aciertos[aciertos.current++ % frases.aciertos.length];
    if (Object.keys(nuevas).length === PLANTAS) terminar(acierto, frases.final);
    else decir(acierto);
  };

  const { arrastre, elegida, sobre, pieza, tocarDestino } = useArrastre(zonas, dar);

  const estante = (donde: Comida["donde"], titulo: string) => (
    <div className="estante">
      <h3>{titulo}</h3>
      <div className="piezas">
        {COMIDA.filter((c) => c.donde === donde).map((c) =>
          colocadas[c.id] ? (
            <span key={c.id} className="pieza hueco" />
          ) : (
            <button
              key={c.id}
              className={`pieza ${arrastre?.id === c.id ? "moviendo" : ""} ${elegida === c.id ? "elegida" : ""} ${sacudida === c.id ? "sacudida" : ""}`}
              {...pieza(c.id)}
            >
              <img className="pieza-imagen" src={c.imagen} alt="" draggable={false} />
              <span className="pieza-nombre">{c.nombre}</span>
            </button>
          ),
        )}
      </div>
    </div>
  );

  const zona = (dino: Dino, nombre: string) => (
    <button
      ref={zonas[dino]}
      className={`zona ${sobre === dino ? "sobre" : ""} ${elegida ? "esperando" : ""}`}
      onClick={() => tocarDestino(dino)}
      aria-label={`Dar de comer al ${nombre}`}
    >
      <img
        className={`dino ${masticando === dino ? "comiendo" : ""}`}
        src={dino === "tri" ? "img/p07/triceratops.webp" : "img/p07/brontosaurio.webp"}
        alt=""
        draggable={false}
      />
      <span className="zona-nombre">{nombre}</span>
      <span className="zona-comido">
        {COMIDA.filter((c) => colocadas[c.id] === dino).map((c) => (
          <img key={c.id} src={c.imagen} alt={c.nombre} draggable={false} />
        ))}
      </span>
    </button>
  );

  return (
    <MarcoReto parada={parada.id} titulo="¿Quién come qué?" mensaje={mensaje} decir={decir} final={final}>
      <div className="zonas" style={{ backgroundImage: "url(img/p07/juego_fondo.webp)" }}>
        {zona("tri", "triceratops")}
        {zona("bronto", "brontosaurio")}
      </div>
      {estante("alto", "Arriba, en los árboles")}
      {estante("suelo", "Abajo, en el suelo")}
    </MarcoReto>
  );
}
