import { useEffect, useState } from "react";
import { callar } from "./voz";
import Inicio from "./pantallas/Inicio";
import Recorrido from "./pantallas/Recorrido";
import Parada from "./pantallas/Parada";
import { PARADAS } from "./contenido/paradas";
import { RETOS } from "./retos";
import Album from "./pantallas/Album";

// Navegación por la almohadilla de la dirección (#/parada/7): funciona en cualquier
// alojamiento estático y el botón «atrás» del móvil se comporta como se espera.
export function ir(ruta: string) {
  window.location.hash = ruta;
}

function rutaActual() {
  return window.location.hash.slice(1) || "/";
}

export default function App() {
  const [ruta, setRuta] = useState(rutaActual);

  useEffect(() => {
    const alCambiar = () => {
      callar();
      setRuta(rutaActual());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", alCambiar);
    return () => window.removeEventListener("hashchange", alCambiar);
  }, []);

  const parada = ruta.match(/^\/parada\/(\d+)$/);
  if (parada) return <Parada id={Number(parada[1])} />;
  const reto = ruta.match(/^\/parada\/(\d+)\/reto$/);
  if (reto) {
    const id = Number(reto[1]);
    const Juego = RETOS[id];
    if (Juego && PARADAS[id]) return <Juego key={id} parada={PARADAS[id]} />;
  }
  if (ruta === "/recorrido") return <Recorrido />;
  if (ruta === "/mapa-editar") return <Recorrido editar />;
  if (ruta === "/album") return <Album />;
  return <Inicio />;
}
