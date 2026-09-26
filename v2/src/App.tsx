import { useEffect } from "react";
import { callar } from "./voz";
import { alCambiar, useRuta } from "./navegacion";
import Inicio from "./pantallas/Inicio";
import Recorrido from "./pantallas/Recorrido";
import Parada from "./pantallas/Parada";
import { PARADAS, PARADA_SECRETA } from "./contenido/paradas";
import { RETOS } from "./retos";
import Album from "./pantallas/Album";
import ParadaSecreta from "./pantallas/ParadaSecreta";
import Final from "./pantallas/Final";
import Tropiezo from "./componentes/Tropiezo";

export default function App() {
  const ruta = useRuta();

  // Al cambiar de pantalla, callar y arriba del todo. Va en el aviso y no en un efecto:
  // un efecto llegaría después de que el juego nuevo empezara a hablar y lo cortaría.
  useEffect(
    () =>
      alCambiar(() => {
        callar();
        window.scrollTo(0, 0);
      }),
    [],
  );

  // Cada pantalla, con su red de seguridad (key: al cambiar de pantalla se vuelve a intentar).
  return (
    <Tropiezo key={ruta}>
      <Pantalla ruta={ruta} />
    </Tropiezo>
  );
}

function Pantalla({ ruta }: { ruta: string }) {
  const parada = ruta.match(/^\/parada\/(\d+)$/);
  if (parada && Number(parada[1]) === PARADA_SECRETA) return <ParadaSecreta />;
  if (parada) return <Parada id={Number(parada[1])} />;
  const reto = ruta.match(/^\/parada\/(\d+)\/reto$/);
  if (reto) {
    const id = Number(reto[1]);
    const Juego = RETOS[id];
    if (Juego && PARADAS[id]) return <Juego parada={PARADAS[id]} />;
  }
  if (ruta === "/recorrido") return <Recorrido />;
  if (ruta === "/mapa-editar") return <Recorrido editar />;
  if (ruta === "/album") return <Album />;
  if (ruta === "/final") return <Final />;
  return <Inicio />;
}
