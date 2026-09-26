import { useState } from "react";
import { ir } from "../navegacion";
import Alba from "../componentes/Alba";
import Barra from "../componentes/Barra";
import Pegatina from "../componentes/Pegatina";
import { seccion } from "../contenido/guion";
import { PARADA_SECRETA } from "../contenido/paradas";
import { ganarPegatina, useEstado } from "../estado";
import { locutar } from "../voz";
import md from "../../../contenido/guiones/parada-secreta-pozo.md?raw";

// La X del mapa: el tesoro del pozo. Una pregunta sobre lo que se ve en el pozo abre el
// cofre, que da una pegatina secreta y una curiosidad. Textos en parada-secreta-pozo.md.

const PISTA = seccion(md, "Pista");
const PREGUNTA = seccion(md, "Pregunta");
const PREMIO = seccion(md, "Premio");
const respuesta = (tipo: string) => [...md.matchAll(new RegExp(`^- ${tipo}: «([^»]+)»`, "gm"))].map((m) => m[1]);
const CORRECTA = respuesta("Correcta")[0];
const OPCIONES = [...respuesta("Incorrecta"), CORRECTA].sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
const FALLA = md.match(/^\*\*Si falla:\*\*\s*>\s*(.+)$/m)?.[1].trim() ?? "¡Casi! Mirad otra vez.";
if (!CORRECTA || OPCIONES.length < 2) throw new Error("A la parada secreta le faltan las respuestas");

export default function ParadaSecreta() {
  const { pegatinas } = useEstado();
  const [abierto, setAbierto] = useState(pegatinas.includes(PARADA_SECRETA));
  const [fallo, setFallo] = useState<string | null>(null);

  const contestar = (r: string) => {
    if (r === CORRECTA) {
      setFallo(null);
      setAbierto(true);
      ganarPegatina(PARADA_SECRETA);
      locutar("secreta-premio", PREMIO, "alba");
    } else {
      setFallo(r);
      locutar("secreta-falla", [FALLA], "alba");
    }
  };

  return (
    <main className="pantalla secreta">
      <Barra titulo="Parada secreta" volver="/recorrido" />
      <div className="secreta-cabecera">
        <Alba pose={abierto ? "celebra" : "senala"} className="secreta-alba" />
        <span className={`cofre ${abierto ? "abierto" : ""}`} aria-label={abierto ? "Cofre abierto" : "Cofre cerrado"}>
          {abierto ? "🔓" : "🔒"}
        </span>
      </div>

      {!abierto ? (
        <>
          <section className="tarjeta">
            {PISTA.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <button className="boton secundario" onClick={() => locutar("secreta-pista", PISTA, "alba")}>
              🔊 Escuchar a Alba
            </button>
          </section>
          <section className="tarjeta pregunta">
            <h2>{PREGUNTA.join(" ")}</h2>
            <button className="boton-oir" onClick={() => locutar("secreta-pregunta", PREGUNTA, "alba")} aria-label="Escuchar la pregunta">
              🔊
            </button>
            {OPCIONES.map((o) => (
              <button key={o} className={`boton grande ${fallo === o ? "sacudida" : ""}`} onClick={() => contestar(o)}>
                {o}
              </button>
            ))}
            {fallo && <p className="nota" role="status">{FALLA}</p>}
          </section>
        </>
      ) : (
        <section className="tarjeta premio">
          <h2>¡Cofre abierto!</h2>
          <Pegatina parada={PARADA_SECRETA} grande />
          {PREMIO.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <button className="boton secundario" onClick={() => locutar("secreta-premio", PREMIO, "alba")}>
            🔊 Escuchar a Alba
          </button>
          <button className="boton grande" onClick={() => ir("/parada/18")}>
            Seguir a la parada 18
          </button>
        </section>
      )}
    </main>
  );
}
