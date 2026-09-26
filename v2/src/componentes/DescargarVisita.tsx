import { useEffect, useState } from "react";

// Guarda en el móvil todos los audios e imágenes de la visita (lista en recursos.json), en la
// misma caché que usa el service worker. Pensado para la entrada del parque, donde hay algo
// de cobertura: luego la visita funciona aunque no la haya.

interface Recurso {
  url: string;
  bytes: number;
}

type Estado = { fase: "mirando" } | { fase: "pendiente"; faltan: Recurso[]; mb: number } | { fase: "bajando"; hechos: number; total: number } | { fase: "lista" } | { fase: "error" } | { fase: "sin-soporte" };

const CACHE = "recursos";
const mb = (bytes: number) => Math.max(1, Math.round(bytes / 1_000_000));

async function pendientes(): Promise<Recurso[]> {
  const lista: Recurso[] = await fetch("recursos.json", { cache: "no-store" }).then((r) => r.json());
  const cache = await caches.open(CACHE);
  const faltan: Recurso[] = [];
  for (const r of lista) {
    if (!(await cache.match(new URL(r.url, location.href).href))) faltan.push(r);
  }
  return faltan;
}

export default function DescargarVisita() {
  const [estado, setEstado] = useState<Estado>({ fase: "mirando" });

  useEffect(() => {
    if (!("caches" in window)) return setEstado({ fase: "sin-soporte" });
    pendientes()
      .then((faltan) =>
        setEstado(faltan.length ? { fase: "pendiente", faltan, mb: mb(faltan.reduce((s, r) => s + r.bytes, 0)) } : { fase: "lista" }),
      )
      .catch(() => setEstado({ fase: "sin-soporte" }));
  }, []);

  const bajar = async (faltan: Recurso[]) => {
    setEstado({ fase: "bajando", hechos: 0, total: faltan.length });
    try {
      const cache = await caches.open(CACHE);
      let hechos = 0;
      const cola = [...faltan];
      const trabajador = async () => {
        for (let r = cola.shift(); r; r = cola.shift()) {
          await cache.add(new URL(r.url, location.href).href);
          setEstado({ fase: "bajando", hechos: ++hechos, total: faltan.length });
        }
      };
      await Promise.all([trabajador(), trabajador(), trabajador(), trabajador()]);
      setEstado({ fase: "lista" });
    } catch {
      setEstado({ fase: "error" });
    }
  };

  if (estado.fase === "mirando" || estado.fase === "sin-soporte") return null;

  return (
    <section className="tarjeta descargar">
      {estado.fase === "pendiente" && (
        <>
          <p>
            <strong>¿Poca cobertura en el parque?</strong> Guardad ahora la visita en el móvil ({estado.mb} MB) y funcionará
            aunque no haya señal.
          </p>
          <button className="boton" onClick={() => bajar(estado.faltan)}>
            📥 Descargar la visita
          </button>
        </>
      )}
      {estado.fase === "bajando" && (
        <>
          <p>Guardando la visita… {Math.round((estado.hechos / estado.total) * 100)} %</p>
          <span className="medidor-barra">
            <span style={{ width: `${(estado.hechos / estado.total) * 100}%` }} />
          </span>
        </>
      )}
      {estado.fase === "lista" && <p>✔ La visita está guardada en el móvil: funciona aunque no haya cobertura.</p>}
      {estado.fase === "error" && (
        <p>
          No se ha podido terminar la descarga (¿se ha ido la señal?). Lo guardado se conserva; podéis volver a intentarlo
          desde aquí.
        </p>
      )}
    </section>
  );
}
