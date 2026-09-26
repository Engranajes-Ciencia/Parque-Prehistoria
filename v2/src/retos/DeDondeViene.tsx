import { useRef, useState } from "react";
import MarcoReto, { useAlba } from "../componentes/MarcoReto";
import { useArrastre } from "../componentes/useArrastre";
import { dichoDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

type Domestico = "perro" | "vaca" | "oveja" | "cerdo";

const SALVAJES: { id: string; nombre: string; da: Domestico }[] = [
  { id: "lobo", nombre: "Lobo", da: "perro" },
  { id: "uro", nombre: "Uro", da: "vaca" },
  { id: "muflon", nombre: "Muflón", da: "oveja" },
  { id: "jabali", nombre: "Jabalí", da: "cerdo" },
];
const DOMESTICOS: { id: Domestico; nombre: string }[] = [
  { id: "oveja", nombre: "Oveja" },
  { id: "perro", nombre: "Perro" },
  { id: "cerdo", nombre: "Cerdo" },
  { id: "vaca", nombre: "Vaca" },
];

export default function DeDondeViene({ parada }: { parada: ContenidoParada }) {
  const dicho = (etiqueta: string) => dichoDelReto(parada.guion, parada.id, etiqueta);
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    fallo: dicho("Fallo"),
    final: dicho("Al terminar"),
    acierto: {
      perro: dicho("Acierto perro"),
      vaca: dicho("Acierto vaca"),
      oveja: dicho("Acierto oveja"),
      cerdo: dicho("Acierto cerdo"),
    } as Record<Domestico, Dicho>,
  }));
  const { mensaje, decir, final, terminar, acabado } = useAlba(frases.inicio, parada.id);
  const [unidos, setUnidos] = useState<Record<string, Domestico>>({});
  const [sacudida, setSacudida] = useState<string | null>(null);
  const destinos = {
    perro: useRef<HTMLButtonElement>(null),
    vaca: useRef<HTMLButtonElement>(null),
    oveja: useRef<HTMLButtonElement>(null),
    cerdo: useRef<HTMLButtonElement>(null),
  };

  const unir = (id: string, domestico: Domestico) => {
    if (acabado) return;
    const salvaje = SALVAJES.find((s) => s.id === id)!;
    if (salvaje.da !== domestico) {
      setSacudida(id);
      setTimeout(() => setSacudida(null), 500);
      return decir(frases.fallo);
    }
    const nuevos = { ...unidos, [id]: domestico };
    setUnidos(nuevos);
    if (Object.keys(nuevos).length === SALVAJES.length) {
      terminar(frases.acierto[domestico], frases.final);
    } else {
      decir(frases.acierto[domestico]);
    }
  };

  const { arrastre, elegida, sobre, pieza, tocarDestino } = useArrastre(destinos, unir);

  return (
    <MarcoReto parada={parada.id} titulo={parada.reto ?? "¿De dónde viene?"} mensaje={mensaje} decir={decir} final={final}>
      <div className="estante">
        <h3>Animales salvajes</h3>
        <div className="piezas">
          {SALVAJES.map((s) =>
            unidos[s.id] ? (
              <span key={s.id} className="pieza hueco" />
            ) : (
              <button
                key={s.id}
                className={`pieza ${arrastre?.id === s.id ? "moviendo" : ""} ${elegida === s.id ? "elegida" : ""} ${sacudida === s.id ? "sacudida" : ""}`}
                {...pieza(s.id)}
              >
                <img className="pieza-animal" src={`img/p18/${s.id}.webp`} alt="" draggable={false} />
                <span className="pieza-nombre">{s.nombre}</span>
              </button>
            ),
          )}
        </div>
      </div>

      <div className="estante">
        <h3>¿En qué animal de granja se convirtió?</h3>
        <div className="parejas">
          {DOMESTICOS.map((d) => {
            const salvaje = SALVAJES.find((s) => unidos[s.id] === d.id);
            return (
              <button
                key={d.id}
                ref={destinos[d.id]}
                className={`pareja ${sobre === d.id ? "sobre" : ""} ${elegida ? "esperando" : ""} ${salvaje ? "hecha" : ""}`}
                onClick={() => tocarDestino(d.id)}
              >
                {salvaje && (
                  <span className="pareja-origen">
                    <img src={`img/p18/${salvaje.id}.webp`} alt="" draggable={false} /> →
                  </span>
                )}
                <img className="pieza-animal" src={`img/p18/${d.id}.webp`} alt="" draggable={false} />
                <span className="pieza-nombre">{d.nombre}</span>
              </button>
            );
          })}
        </div>
      </div>
    </MarcoReto>
  );
}
