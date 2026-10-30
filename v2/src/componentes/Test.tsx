import { useRef, useState, type ReactNode } from "react";
import type { Dicho } from "../contenido/guion";
import type { PoseAlba } from "./Alba";
import MarcoReto, { useAlba } from "./MarcoReto";

// Motor de juego «test de detective»: preguntas de tres o cuatro respuestas, una a una. Alba
// lee la pregunta; si se acierta, explica por qué y se pasa a la siguiente; si no, la
// respuesta tocada se tacha, Alba da una pista y se vuelve a intentar (no se pierde nada).
// Al final se cuenta cuántas se acertaron a la primera. Pensado para 7 años o más.

export interface PreguntaTest {
  id: string;
  pregunta: Dicho;
  dibujo?: ReactNode;
  respuestas: { texto: string; correcta?: boolean }[];
  /** Lo que explica Alba al acertar. */
  explicacion: Dicho;
}

interface Props {
  parada: number;
  titulo: string;
  pose?: PoseAlba;
  preguntas: PreguntaTest[];
  inicio: Dicho;
  /** Una frase o varias, que se van alternando, cuando se falla. */
  fallo: Dicho | Dicho[];
  final: Dicho;
  nota: string;
}

export default function Test(p: Props) {
  const { mensaje, decir, final, terminar, acabado } = useAlba(p.inicio, p.parada);
  const [n, setN] = useState(-1); // -1: aún no ha empezado (se lee la presentación)
  const [tachadas, setTachadas] = useState<string[]>([]);
  const [acertada, setAcertada] = useState(false);
  const aLaPrimera = useRef(0);
  const fallos = useRef(0);

  const empezar = () => {
    setN(0);
    decir(p.preguntas[0].pregunta);
  };

  const pregunta = n >= 0 ? p.preguntas[n] : null;

  const contestar = (texto: string, correcta?: boolean) => {
    if (!pregunta || acabado || acertada || tachadas.includes(texto)) return;
    if (correcta) {
      if (!tachadas.length) aLaPrimera.current++;
      setAcertada(true);
      if (n === p.preguntas.length - 1) terminar(pregunta.explicacion, p.final);
      else decir(pregunta.explicacion);
      return;
    }
    setTachadas([...tachadas, texto]);
    const f = Array.isArray(p.fallo) ? p.fallo : [p.fallo];
    decir(f[fallos.current++ % f.length]);
  };

  const siguiente = () => {
    if (!acertada || n >= p.preguntas.length - 1) return;
    setN(n + 1);
    setTachadas([]);
    setAcertada(false);
    decir(p.preguntas[n + 1].pregunta);
  };

  return (
    <MarcoReto parada={p.parada} titulo={p.titulo} mensaje={mensaje} decir={decir} final={final} pose={p.pose ?? "lupa"}>
      {!pregunta ? (
        <div className="test-portada">
          <p className="test-cuantas">{p.preguntas.length} preguntas de detective</p>
          <button className="boton grande" onClick={empezar}>
            ¡Empezar!
          </button>
        </div>
      ) : (
        <section className="test" aria-live="polite">
          <div className="test-progreso" aria-label={`Pregunta ${n + 1} de ${p.preguntas.length}`}>
            {p.preguntas.map((q, i) => (
              <i key={q.id} className={i < n || (i === n && acertada) ? "hecha" : i === n ? "actual" : ""} />
            ))}
          </div>
          {pregunta.dibujo && <div className="test-dibujo">{pregunta.dibujo}</div>}
          <h2 className="test-pregunta">{pregunta.pregunta.texto}</h2>
          <div className="test-respuestas">
            {pregunta.respuestas.map((r) => (
              <button
                key={r.texto}
                className={[
                  "boton test-respuesta",
                  tachadas.includes(r.texto) ? "tachada" : "",
                  acertada && r.correcta ? "correcta" : "",
                ].join(" ")}
                disabled={tachadas.includes(r.texto) || (acertada && !r.correcta)}
                onClick={() => contestar(r.texto, r.correcta)}
              >
                {r.texto}
              </button>
            ))}
          </div>
          {acertada && n < p.preguntas.length - 1 && (
            <button className="boton grande test-siguiente" onClick={siguiente}>
              Siguiente pregunta ›
            </button>
          )}
          {acabado && (
            <p className="test-marcador" role="status">
              {aLaPrimera.current} de {p.preguntas.length} a la primera
            </p>
          )}
        </section>
      )}
      <p className="nota">{p.nota}</p>
    </MarcoReto>
  );
}
