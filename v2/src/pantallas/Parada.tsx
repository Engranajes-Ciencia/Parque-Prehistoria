import { useEffect, useRef, useState } from "react";
import { ir } from "../navegacion";
import Alba from "../componentes/Alba";
import Barra from "../componentes/Barra";
import Locucion from "../componentes/Locucion";
import Pegatina from "../componentes/Pegatina";
import { MISION_CUMPLIDA, MISION_OTRA_VEZ, PARADAS, PARADA_SECRETA, RECORRIDO } from "../contenido/paradas";
import { completarMision, useEstado } from "../estado";
import { callar, locutar } from "../voz";

export default function Parada({ id }: { id: number }) {
  const { modo, pegatinas, misiones } = useEstado();
  const [mision, setMision] = useState(false);
  const [misionSonando, setMisionSonando] = useState(false);
  const [fallo, setFallo] = useState<string | null>(null);
  const [acierto, setAcierto] = useState(false);
  const hoja = useRef<HTMLElement>(null);
  // Al abrir la misión, el foco va a la hoja: el lector de pantalla empieza a leer por ella.
  useEffect(() => {
    if (mision) hoja.current?.focus();
  }, [mision]);
  const parada = PARADAS[id];

  if (!parada) {
    return (
      <main className="pantalla">
        <Barra titulo={`Parada ${id}`} volver="/recorrido" />
        <p className="tarjeta">Esta parada todavía no está lista.</p>
      </main>
    );
  }

  const { guion } = parada;
  // Dos retos por parada: el de peques (4-6 años) y el de mayores (7 o más). Se enseña en
  // grande el del modo elegido en la portada y, debajo, un enlace al otro.
  const retos = [
    parada.reto && { clave: "peques", nombre: parada.reto, ruta: `/parada/${id}/reto`, edad: "De 4 a 6 años" },
    parada.retoMayores && { clave: "mayores", nombre: parada.retoMayores, ruta: `/parada/${id}/reto-mayores`, edad: "Para 7 años o más" },
  ].filter((r): r is { clave: string; nombre: string; ruta: string; edad: string } => !!r);
  const principal = retos.find((r) => r.clave === (modo === "peques" ? "peques" : "mayores")) ?? retos[0];
  const otro = retos.find((r) => r !== principal);
  // Paradas vecinas en el orden del camino (la secreta no cuenta: se descubre en el pozo).
  const orden = RECORRIDO.filter((p) => p.id !== PARADA_SECRETA);
  const aqui = orden.findIndex((p) => p.id === id);
  const anterior = orden[aqui - 1];
  const siguiente = orden[aqui + 1];
  const pista = `p${String(parada.id).padStart(2, "0")}`;
  const portada = parada.imagen ?? parada.foto;
  const cerrarMision = () => {
    if (misionSonando) callar(); // la explicación que estuviera sonando sigue
    setMisionSonando(false);
    setMision(false);
    setFallo(null);
    setAcierto(false);
  };
  // Misión que se comprueba: Alba celebra si aciertan y, si no, pide mirar otra vez.
  const contestar = (o: string) => {
    if (!guion.respuestas) return;
    setMisionSonando(true);
    const listo = { alTerminar: () => setMisionSonando(false), alInterrumpir: () => setMisionSonando(false) };
    if (o === guion.respuestas.correcta) {
      setFallo(null);
      setAcierto(true);
      completarMision(id);
      locutar("comun-mision-cumplida", MISION_CUMPLIDA, "alba", listo);
    } else {
      setFallo(o);
      locutar("comun-mision-otra-vez", MISION_OTRA_VEZ, "alba", listo);
    }
  };

  return (
    <main className="pantalla parada">
      <Barra titulo={`Parada ${parada.id}`} volver="/recorrido" />

      <div className={`parada-portada ${portada ? "" : "sin-imagen"}`}>
        {portada && <img src={portada} alt={parada.titulo} />}
        {!parada.imagen && parada.foto && <span className="sello-provisional">Foto del parque</span>}
        <h2>{parada.titulo}</h2>
      </div>

      <Locucion
        todos={guion.todos}
        peques={guion.peques}
        pistas={{ todos: `${pista}-todos`, peques: `${pista}-peques` }}
        modoInicial={modo ?? "todos"}
      />

      <div className="acciones">
        <button className="accion mira" onClick={() => setMision(true)}>
          <Alba pose="lupa" />
          <span>
            <strong>¡Mira bien!</strong>
            {misiones.includes(id) ? "Misión cumplida ✔" : "Una misión en el parque"}
          </span>
        </button>
        {principal && (
          <button className="accion reto" onClick={() => ir(principal.ruta)}>
            <Alba pose="piensa" />
            <span>
              <strong>¡Reto!</strong>
              {principal.nombre}
              {otro && <small className="reto-edad">{principal.edad}</small>}
            </span>
            {pegatinas.includes(id) && <Pegatina parada={id} />}
          </button>
        )}
      </div>
      {otro && (
        <button className="enlace otro-reto" onClick={() => ir(otro.ruta)}>
          {otro.clave === "peques" ? "¿Y los peques? Su reto" : "¿Y los mayores? Su reto"}: {otro.nombre} ›
        </button>
      )}

      <details className="tarjeta sabias">
        <summary>¿Sabías que…?</summary>
        <p>{guion.sabiasQue}</p>
      </details>

      {id === 17 && (
        <p className="parada-pista">🤫 De camino a la siguiente parada hay un pozo… y en el mapa, una X. ¿Qué esconderá?</p>
      )}
      <nav className="parada-nav" aria-label="Otras paradas">
        {anterior && (
          <button className="boton secundario" onClick={() => ir(`/parada/${anterior.id}`)} aria-label={`Parada anterior: ${anterior.titulo}`}>
            ‹ {anterior.id}
          </button>
        )}
        {siguiente ? (
          <button className="boton grande" onClick={() => ir(`/parada/${siguiente.id}`)}>
            Siguiente: {siguiente.id} · {siguiente.titulo} ›
          </button>
        ) : (
          <button className="boton grande" onClick={() => ir("/final")}>
            ¡Terminar el viaje! 🎉
          </button>
        )}
      </nav>

      {mision && (
        <div className="velo" onClick={cerrarMision}>
          <section
            className="hoja"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="¡Mira bien!"
            tabIndex={-1}
            ref={hoja}
          >
            <Alba pose="lupa" className="hoja-alba" />
            <h2>¡Mira bien!</h2>
            {guion.mision.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <button className="boton secundario" onClick={() => {
                setMisionSonando(true);
                locutar(`${pista}-mision`, guion.mision, "alba", {
                  alTerminar: () => setMisionSonando(false),
                  alInterrumpir: () => setMisionSonando(false),
                });
              }}>
              🔊 Escuchar a Alba
            </button>
            {guion.respuestas && !acierto ? (
              <div className="mision-respuestas" role="group" aria-label="Vuestra respuesta">
                {guion.respuestas.opciones.map((o) => (
                  <button key={o} className={`boton grande ${fallo === o ? "sacudida" : ""}`} onClick={() => contestar(o)}>
                    {o}
                  </button>
                ))}
                {fallo && (
                  <p className="nota" role="status">
                    {MISION_OTRA_VEZ.join(" ")}
                  </p>
                )}
              </div>
            ) : (
              <>
                {acierto && (
                  <p className="mision-cumplida" role="status">
                    ✔ {MISION_CUMPLIDA.join(" ")}
                  </p>
                )}
                <button
                  className="boton grande"
                  onClick={() => {
                    completarMision(id);
                    cerrarMision();
                  }}
                >
                  {acierto ? "Volver a la parada" : "¡Hecho!"}
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
