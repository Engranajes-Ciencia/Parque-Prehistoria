import { useEffect, useRef, useState, type ReactNode } from "react";
import { ir, volver } from "../navegacion";
import type { Dicho } from "../contenido/guion";
import { ganarPegatina } from "../estado";
import { locutar } from "../voz";
import Alba, { type PoseAlba } from "./Alba";
import Barra from "./Barra";
import Pegatina from "./Pegatina";

/**
 * Lo que dice Alba en un reto: el texto del bocadillo y su locución. Habla al empezar.
 * terminar(último, final): Alba explica primero el último paso y, cuando acaba de hablar,
 * aparece la hoja de «¡Reto superado!» con la frase final.
 */
export function useAlba(inicial: Dicho, parada: number) {
  const [mensaje, setMensaje] = useState(inicial);
  const [final, setFinal] = useState<Dicho | null>(null);
  const [terminando, setTerminando] = useState(false);
  const pendiente = useRef<Dicho | null>(null);
  const ganado = useRef(false); // ref y no estado: dos toques en el mismo instante no ganan dos veces
  const reserva = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const espera = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Lo que queda por hacer cuando acabe la frase en curso. Repetirla con el botón 🔊 lo
  // conserva (antes se perdía y, en Atapuerca, dejaba 12 s sin detectar tesoros).
  const despues = useRef<{ d: Dicho; luego: () => void } | null>(null);

  useEffect(() => {
    locutar(inicial.pista, [inicial.texto], "alba");
  }, [inicial]);
  // Al salir del juego no puede quedar nada pendiente que hable en otra pantalla.
  useEffect(
    () => () => {
      clearTimeout(reserva.current);
      clearTimeout(espera.current);
      pendiente.current = null;
    },
    [],
  );

  const cerrar = () => {
    const f = pendiente.current;
    if (!f) return;
    pendiente.current = null;
    clearTimeout(reserva.current);
    clearTimeout(espera.current);
    setFinal(f);
    setMensaje(f);
    locutar(f.pista, [f.texto], "alba");
  };

  /** Alba dice una frase; `luego`, si lo hay, se hace cuando acaba de decirla. */
  const decir = (d: Dicho, luego?: () => void) => {
    const empezo = Date.now();
    const l = luego ?? (despues.current?.d === d ? despues.current.luego : undefined);
    despues.current = l ? { d, luego: l } : null;
    setMensaje(d);
    locutar(d.pista, [d.texto], "alba", {
      // Sin voz, alTerminar llega al instante: se deja un rato para leer.
      alTerminar: () => {
        const leer = Math.max(700, 60 * d.texto.length - (Date.now() - empezo));
        clearTimeout(espera.current);
        if (pendiente.current) espera.current = setTimeout(cerrar, leer);
        else if (l)
          espera.current = setTimeout(() => {
            despues.current = null;
            l();
          }, Math.min(leer, 1500));
      },
    });
  };

  const terminar = (ultimo: Dicho | null, f: Dicho) => {
    if (ganado.current) return;
    ganado.current = true;
    ganarPegatina(parada); // la pegatina se gana al ganar, aunque salgan antes de la hoja final
    pendiente.current = f;
    setTerminando(true);
    if (!ultimo) return cerrar();
    // Por si el navegador nunca avisa del final (le pasa a veces a la voz de Safari): lo que
    // tardaría en decirla, con margen para el relevo a la voz del navegador (antes, 25 s fijos).
    reserva.current = setTimeout(cerrar, Math.max(8000, 5000 + 100 * ultimo.texto.length));
    decir(ultimo);
  };

  return { mensaje, decir, final, terminar, acabado: terminando || !!final };
}

interface Props {
  parada: number;
  titulo: string;
  mensaje: Dicho;
  decir: (d: Dicho, luego?: () => void) => void;
  /** Cuando llega, aparece la hoja final con esta frase (la pegatina ya se ganó en terminar). */
  final: Dicho | null;
  pose?: PoseAlba;
  /** Algo propio que enseñar en la hoja final (p. ej., la mano pintada). */
  recuerdo?: ReactNode;
  children: ReactNode;
}

export default function MarcoReto({ parada, titulo, mensaje, decir, final, pose, recuerdo, children }: Props) {
  return (
    <main className="pantalla reto">
      <Barra titulo={titulo} volver={`/parada/${parada}`} />

      <div className="reto-alba">
        <div className="reto-alba-figura">
          <Alba pose={final ? "celebra" : (pose ?? "piensa")} />
          <button className="boton-oir" onClick={() => decir(mensaje)} aria-label="Repetir lo que dice Alba">
            🔊
          </button>
        </div>
        <div className="bocadillo">
          <p>{mensaje.texto}</p>
        </div>
      </div>

      {children}

      {final && (
        <div className="velo">
          <section className="hoja final" role="dialog" aria-modal="true" aria-label="¡Reto superado!">
            <Alba pose="celebra" className="hoja-alba" />
            <h2>¡Reto superado!</h2>
            {recuerdo}
            <Pegatina parada={parada} grande />
            <p>{final.texto}</p>
            <button className="boton grande" autoFocus onClick={() => volver(`/parada/${parada}`)}>
              Volver a la parada
            </button>
            <button className="boton secundario" onClick={() => ir("/album", true)}>
              Ver mis pegatinas
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
