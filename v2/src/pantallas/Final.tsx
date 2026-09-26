import { useState } from "react";
import { ir } from "../navegacion";
import Alba from "../componentes/Alba";
import Barra from "../componentes/Barra";
import { imagenPegatina } from "../componentes/Pegatina";
import { DESPEDIDA_ALBA, PARADA_SECRETA, RECORRIDO } from "../contenido/paradas";
import { actualizar, useEstado } from "../estado";
import { locutar } from "../voz";

// Fin del viaje: la despedida de Alba, el recuento de pegatinas y un diploma con el nombre
// que se dibuja en un canvas y se comparte o se descarga como imagen.

const TOTAL = RECORRIDO.length; // 21 paradas + la secreta
const FUENTE = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

function cargarImagen(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = () => resolve(null); // sin la imagen, el diploma sale igual
    im.src = src;
  });
}

function fechaDeHoy() {
  return new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

/** Parte un texto en líneas que quepan en `ancho` píxeles. */
function lineas(ctx: CanvasRenderingContext2D, texto: string, ancho: number) {
  const salida: string[] = [];
  let actual = "";
  for (const palabra of texto.split(" ")) {
    const prueba = actual ? `${actual} ${palabra}` : palabra;
    if (ctx.measureText(prueba).width > ancho && actual) {
      salida.push(actual);
      actual = palabra;
    } else actual = prueba;
  }
  if (actual) salida.push(actual);
  return salida;
}

async function dibujarDiploma(nombre: string, pegatinas: number[]): Promise<Blob | null> {
  const W = 1080;
  const H = 1350;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#fbf3e4";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#2a9d8f";
  ctx.lineWidth = 18;
  ctx.strokeRect(30, 30, W - 60, H - 60);
  ctx.strokeStyle = "#e0a526";
  ctx.lineWidth = 4;
  ctx.strokeRect(58, 58, W - 116, H - 116);

  ctx.textAlign = "center";
  ctx.fillStyle = "#1d6f65";
  ctx.font = `800 44px ${FUENTE}`;
  ctx.fillText("Parque de Ciencias Prehistóricas", W / 2, 150);
  ctx.fillStyle = "#1f2a2e";
  ctx.font = `900 76px ${FUENTE}`;
  ctx.fillText("Diploma de viaje", W / 2, 250);
  ctx.fillText("en el tiempo", W / 2, 335);

  ctx.font = `400 38px ${FUENTE}`;
  ctx.fillStyle = "#4a5a60";
  ctx.fillText(nombre ? "Otorgado a" : "Otorgado a quien ha completado el viaje", W / 2, 420);
  let y = 420;
  if (nombre) {
    ctx.fillStyle = "#c8553d";
    ctx.font = `900 72px ${FUENTE}`;
    for (const l of lineas(ctx, nombre, W - 220)) {
      y += 88;
      ctx.fillText(l, W / 2, y);
    }
  }
  ctx.fillStyle = "#1f2a2e";
  ctx.font = `400 36px ${FUENTE}`;
  y += 40;
  for (const l of lineas(ctx, "por viajar desde los primeros microbios hasta los constructores de Stonehenge: más de tres mil millones de años en un paseo.", W - 240)) {
    y += 48;
    ctx.fillText(l, W / 2, y);
  }

  // Pegatinas conseguidas, en rejilla.
  const conseguidas = RECORRIDO.filter((p) => pegatinas.includes(p.id));
  ctx.font = `800 34px ${FUENTE}`;
  ctx.fillStyle = "#1d6f65";
  y += 80;
  ctx.fillText(`${conseguidas.length} de ${TOTAL} pegatinas`, W / 2, y);
  const lado = 96;
  const porFila = 8;
  const imagenes = await Promise.all(conseguidas.map((p) => cargarImagen(imagenPegatina(p.id) ?? "")));
  imagenes.forEach((im, i) => {
    const fila = Math.floor(i / porFila);
    const enFila = Math.min(porFila, conseguidas.length - fila * porFila);
    const x0 = W / 2 - (enFila * (lado + 12) - 12) / 2;
    const x = x0 + (i % porFila) * (lado + 12);
    const yy = y + 30 + fila * (lado + 12);
    if (im) ctx.drawImage(im, x, yy, lado, lado);
  });

  // Alba y la firma.
  const alba = await cargarImagen("img/alba/alba_celebra.webp");
  if (alba) {
    const h = 300;
    ctx.drawImage(alba, 90, H - 90 - h, (alba.width / alba.height) * h, h);
  }
  ctx.textAlign = "right";
  ctx.fillStyle = "#4a5a60";
  ctx.font = `400 30px ${FUENTE}`;
  ctx.fillText(fechaDeHoy(), W - 110, H - 170);
  ctx.fillStyle = "#1f2a2e";
  ctx.font = `italic 700 36px ${FUENTE}`;
  ctx.fillText("Alba, viajera del tiempo", W - 110, H - 115);

  return new Promise((resolve) => c.toBlob(resolve, "image/png"));
}

export default function Final() {
  const { pegatinas, nombre } = useEstado();
  const [preparando, setPreparando] = useState(false);
  const [vista, setVista] = useState<string | null>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const conseguidas = RECORRIDO.filter((p) => pegatinas.includes(p.id)).length;
  const faltan = RECORRIDO.filter((p) => p.id !== PARADA_SECRETA && !pegatinas.includes(p.id));

  const hacerDiploma = async () => {
    setPreparando(true);
    const blob = await dibujarDiploma(nombre.trim(), pegatinas);
    setPreparando(false);
    if (!blob) return;
    if (vista) URL.revokeObjectURL(vista);
    setVista(URL.createObjectURL(blob));
    setArchivo(new File([blob], "diploma-prehistoria.png", { type: "image/png" }));
  };

  const compartir = async () => {
    if (!archivo || !vista) return;
    try {
      if (navigator.canShare?.({ files: [archivo] })) {
        await navigator.share({ files: [archivo], title: "Mi diploma de viaje en el tiempo" });
        return;
      }
    } catch {
      // Si se cancela o falla el menú de compartir, se descarga sin más.
    }
    const a = document.createElement("a");
    a.href = vista;
    a.download = archivo.name;
    a.click();
  };

  return (
    <main className="pantalla final-viaje">
      <Barra titulo="¡Fin del viaje!" volver="/recorrido" atras />
      <div className="inicio-alba">
        <Alba pose="celebra" />
        <div className="bocadillo">
          {DESPEDIDA_ALBA.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <button className="boton-oir" onClick={() => locutar("comun-despedida", DESPEDIDA_ALBA, "alba")}>
            🔊 Escuchar a Alba
          </button>
        </div>
      </div>

      <section className="tarjeta">
        <h2>
          {conseguidas} de {TOTAL} pegatinas
        </h2>
        {faltan.length > 0 ? (
          <p className="nota">
            Aún podéis conseguir {faltan.length === 1 ? "la de la parada" : "las de las paradas"} {faltan.map((p) => p.id).join(", ")}
            {pegatinas.includes(PARADA_SECRETA) ? "." : ", y hay una secreta escondida en el camino…"}
          </p>
        ) : (
          <p className="nota">¡Las tenéis todas! Sois exploradores de verdad.</p>
        )}
        <button className="boton secundario" onClick={() => ir("/album")}>
          Ver mis pegatinas
        </button>
      </section>

      <section className="tarjeta diploma">
        <h2>Vuestro diploma</h2>
        <label className="nota" htmlFor="nombre-diploma">
          Escribid el nombre del explorador, de la exploradora o de toda la familia:
        </label>
        <input
          id="nombre-diploma"
          className="campo"
          value={nombre}
          maxLength={40}
          placeholder="Por ejemplo: Familia García"
          onChange={(e) => actualizar({ nombre: e.target.value })}
        />
        <button className="boton grande" onClick={hacerDiploma} disabled={preparando}>
          {preparando ? "Preparando…" : vista ? "Rehacer el diploma" : "Hacer el diploma"}
        </button>
        {vista && (
          <>
            <img className="diploma-vista" src={vista} alt="Vuestro diploma de viaje en el tiempo" />
            <button className="boton" onClick={compartir}>
              Guardar o compartir el diploma
            </button>
          </>
        )}
      </section>
    </main>
  );
}
