import { useState, type ReactNode } from "react";
import Test, { type PreguntaTest } from "../componentes/Test";
import { dichoDelReto, dichosDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Los tests de detective para mayores (paradas 4 y 15). Las preguntas y las explicaciones las
// dice Alba y salen del guion («Pregunta N», «Explicación N»); las respuestas, cortas, van
// aquí, como los nombres de las tarjetas de otros juegos.

type Opciones = { texto: string; correcta?: boolean }[];

const img = (ruta: string) => <img src={ruta} alt="" draggable={false} />;

const RESPUESTAS: Record<number, { opciones: Opciones; dibujo?: ReactNode }[]> = {
  4: [
    {
      dibujo: img("img/p04/prototaxites.webp"),
      opciones: [{ texto: "Un árbol" }, { texto: "Un ser vivo misterioso, quizá un hongo gigante", correcta: true }, { texto: "Una roca con forma de tronco" }],
    },
    {
      dibujo: img("img/p04/tiktaalik.webp"),
      opciones: [{ texto: "Cuello", correcta: true }, { texto: "Plumas" }, { texto: "Caparazón" }],
    },
    {
      dibujo: img("img/p04/meganeura.webp"),
      opciones: [{ texto: "Como una mosca" }, { texto: "Como una paloma", correcta: true }, { texto: "Como un avión" }],
    },
    {
      opciones: [{ texto: "El Prototaxites", correcta: true }, { texto: "La Meganeura" }, { texto: "Los dos a la vez" }],
    },
    {
      dibujo: img("img/p04/tiktaalik.webp"),
      opciones: [
        { texto: "Era el pez más grande de su época" },
        { texto: "Es un pez a medio camino de los animales de cuatro patas", correcta: true },
        { texto: "Podía volar" },
      ],
    },
  ],
  15: [
    {
      opciones: [{ texto: "Para sujetar los músculos de masticar", correcta: true }, { texto: "Para pelear a cabezazos" }, { texto: "Para que no le diera el sol" }],
    },
    {
      opciones: [{ texto: "El chimpancé" }, { texto: "El australopiteco" }, { texto: "El neandertal", correcta: true }],
    },
    {
      opciones: [{ texto: "A cuatro patas" }, { texto: "De pie, sobre dos piernas", correcta: true }, { texto: "A saltos" }],
    },
    {
      opciones: [
        { texto: "Es el cráneo humano más antiguo" },
        { texto: "Es uno de los cráneos fósiles más completos del mundo", correcta: true },
        { texto: "Es de un gigante" },
      ],
    },
    {
      opciones: [{ texto: "Una: la nuestra", correcta: true }, { texto: "Tres" }, { texto: "Diez" }],
    },
  ],
};

export default function TestDeDetective({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [datos] = useState(() => ({
    preguntas: (RESPUESTAS[parada.id] ?? []).map(
      (r, i): PreguntaTest => ({
        id: `p${i + 1}`,
        pregunta: dicho(`Pregunta ${i + 1}`),
        explicacion: dicho(`Explicación ${i + 1}`),
        respuestas: r.opciones,
        dibujo: r.dibujo,
      }),
    ),
    inicio: dicho("Al empezar"),
    fallo: dichosDelReto(parada.guion, parada.id, "Fallo"),
    final: dicho("Al terminar"),
  }));
  if (!datos.preguntas.length) throw new Error(`No hay test para la parada ${parada.id}`);
  return (
    <Test
      parada={parada.id}
      titulo={parada.reto ?? "Test de detective"}
      preguntas={datos.preguntas}
      inicio={datos.inicio}
      fallo={datos.fallo}
      final={datos.final}
      nota="Si fallas, la respuesta se tacha y puedes volver a intentarlo."
    />
  );
}
