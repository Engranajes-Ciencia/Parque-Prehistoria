import { useRef, useState, type MouseEvent, type PointerEvent as EventoPuntero } from "react";
import { ir } from "../navegacion";
import { FONDO_MAPA, POSICIONES } from "../contenido/mapa";
import { PARADAS, PARADA_SECRETA, RECORRIDO, type ParadaDelRecorrido } from "../contenido/paradas";
import { useEstado } from "../estado";

type Posiciones = Record<number, { x: number; y: number }>;

/**
 * El mapa del parque con una marca por parada. Tocar una parada abierta la abre; tocar una
 * que aún no está lista dice qué es. Con `editar`, las marcas se arrastran y debajo sale el
 * texto para pegar en src/contenido/mapa.ts.
 */
export default function MapaParque({ editar = false }: { editar?: boolean }) {
  const { pegatinas, misiones } = useEstado();
  const [posiciones, setPosiciones] = useState<Posiciones>(POSICIONES);
  const [aviso, setAviso] = useState<ParadaDelRecorrido | null>(null);
  const [moviendo, setMoviendo] = useState<number | null>(null);
  const lienzo = useRef<HTMLDivElement>(null);

  const visitada = (id: number) => pegatinas.includes(id) || misiones.includes(id);
  const siguiente = RECORRIDO.find((p) => p.id in PARADAS && !visitada(p.id))?.id;

  const tocar = (p: ParadaDelRecorrido) => {
    if (editar) return;
    if (p.id in PARADAS || p.id === PARADA_SECRETA) ir(`/parada/${p.id}`);
    else setAviso(p);
  };

  // Las marcas miden 26 px en un móvil pequeño y algunas están a 22 px unas de otras: más
  // grandes se pisarían. Así que un toque en el mapa, fuera de las marcas, abre la marca más
  // cercana si está a menos de 32 px. Cada marca gana toda la zona que es «suya».
  const tocarMapa = (e: MouseEvent<HTMLDivElement>) => {
    if (editar || (e.target as HTMLElement).closest(".mapa-marca")) return; // ya lo lleva la marca
    let mejor: ParadaDelRecorrido | null = null;
    let distancia = 32;
    for (const marca of e.currentTarget.querySelectorAll<HTMLElement>(".mapa-marca")) {
      const r = marca.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      const p = RECORRIDO.find((q) => String(q.id) === marca.dataset.id);
      if (p && d < distancia) {
        mejor = p;
        distancia = d;
      }
    }
    if (mejor) tocar(mejor);
  };

  const arrastrar = (e: EventoPuntero<HTMLButtonElement>, id: number) => {
    if (moviendo !== id || !lienzo.current) return;
    const r = lienzo.current.getBoundingClientRect();
    const x = Math.round(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)) * 10) / 10;
    const y = Math.round(Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)) * 10) / 10;
    setPosiciones((p) => ({ ...p, [id]: { x, y } }));
  };

  const texto = Object.entries(posiciones)
    .map(([id, { x, y }]) => `  ${id}: { x: ${x.toFixed(1)}, y: ${y.toFixed(1)} },`)
    .join("\n");

  return (
    <>
      <div
        className={`mapa ${editar ? "editando" : ""}`}
        ref={lienzo}
        style={{ aspectRatio: `${FONDO_MAPA.ancho} / ${FONDO_MAPA.alto}` }}
        onClick={tocarMapa}
      >
        <img src={FONDO_MAPA.imagen} alt="Mapa del parque" draggable={false} />
        {RECORRIDO.map((p) => {
          const pos = posiciones[p.id];
          if (!pos) return null;
          const estado =
            p.id === PARADA_SECRETA
              ? "secreta"
              : visitada(p.id)
                ? "visitada"
                : p.id === siguiente
                  ? "siguiente"
                  : p.id in PARADAS
                    ? "abierta"
                    : "pronto";
          return (
            <button
              key={p.id}
              className={`mapa-marca ${estado}`}
              data-id={p.id}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              aria-label={`${p.etiqueta ? "" : `Parada ${p.id}: `}${p.titulo}`}
              onClick={() => tocar(p)}
              onPointerDown={(e) => {
                if (!editar) return;
                e.currentTarget.setPointerCapture(e.pointerId);
                setMoviendo(p.id);
              }}
              onPointerMove={(e) => arrastrar(e, p.id)}
              onPointerUp={() => setMoviendo(null)}
            >
              {estado === "visitada" ? "✔" : (p.etiqueta ?? p.id)}
            </button>
          );
        })}
      </div>

      {aviso && !editar && (
        <p className="mapa-aviso" role="status">
          <strong>{aviso.id}</strong> · {aviso.titulo}: esta parada llegará pronto a la app.
        </p>
      )}

      {editar && (
        <section className="tarjeta">
          <p className="nota">Arrastra las marcas a su sitio y copia esto en src/contenido/mapa.ts:</p>
          <textarea className="mapa-texto" readOnly value={texto} rows={8} onFocus={(e) => e.currentTarget.select()} />
          <button className="boton" onClick={() => navigator.clipboard?.writeText(texto)}>
            Copiar posiciones
          </button>
        </section>
      )}
    </>
  );
}
