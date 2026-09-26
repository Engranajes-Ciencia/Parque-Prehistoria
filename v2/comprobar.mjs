// Comprobación antes de publicar (va dentro de «npm run build»).
//
// Carga la app en Node con el mismo Vite y dibuja cada pantalla y cada juego. Los textos
// salen de los guiones .md y se leen al dibujar: si un guion pierde una sección o una frase
// del reto, el fallo sale AQUÍ y la versión rota no se publica, en vez de aparecer en el
// móvil de una familia en mitad del parque.
//
// Comprueba también que el recorte de los guiones (recortar-guiones.mjs) no cambia nada de
// lo que se lee, y avisa (sin fallar) de los textos que no tienen audio grabado o cuyo
// audio ya no coincide con el guion: esos sonarían con la voz del navegador.
//
// Cada paso va por separado: si uno falla, los demás se comprueban igual y el informe
// dice todo lo que está mal, no solo lo primero.

import { readdirSync, readFileSync } from "node:fs";
import { createServer } from "vite";
import { recortarGuion } from "./recortar-guiones.mjs";

const vite = await createServer({
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: "custom",
  logLevel: "error",
});

const errores = [];
const pistasUsadas = new Map(); // clave -> párrafos
let paradas = 0;
let recortados = 0;

const paso = async (que, f) => {
  try {
    await f();
  } catch (e) {
    errores.push(`${que}: ${e.message}`);
  }
};

try {
  const { createElement: h } = await import("react");
  const { renderToString } = await import("react-dom/server");
  const carga = (m) => vite.ssrLoadModule(m);
  const guion = await carga("/src/contenido/guion.ts");

  // 1. El recorte de los guiones no cambia nada de lo que se lee: cada sección, la voz del
  //    reto y las respuestas de la parada secreta, iguales en el guion entero y en el recortado.
  await paso("Recorte de los guiones", () => {
    const carpeta = new URL("../contenido/guiones/", import.meta.url);
    const intento = (f) => {
      try {
        return JSON.stringify(f());
      } catch (e) {
        return `fallo: ${e.message}`;
      }
    };
    const lecturas = (md) => {
      const titulos = md.split(/\r?\n/).filter((l) => l.startsWith("## ")).map((l) => l.slice(3));
      return [
        ...titulos.map((t) => intento(() => guion.seccion(md, t))),
        intento(() => guion.leerGuion(md)),
        JSON.stringify([...md.matchAll(/^- (Correcta|Incorrecta): «([^»]+)»/gm)].map((m) => m.slice(1))),
        JSON.stringify(md.match(/^\*\*Si falla:\*\*\s*>\s*(.+)$/m)?.[1] ?? null),
      ];
    };
    for (const nombre of readdirSync(carpeta).filter((n) => n.endsWith(".md"))) {
      const original = readFileSync(new URL(nombre, carpeta), "utf8");
      const a = lecturas(original);
      const b = lecturas(recortarGuion(original));
      const distinta = a.findIndex((x, i) => x !== b[i]);
      if (distinta >= 0) errores.push(`El recorte cambia lo que se lee en ${nombre} (lectura ${distinta + 1})`);
      else recortados++;
    }
    if (!recortados) throw new Error("no se ha comprobado ningún guion");
  });

  // 2. Paradas y juegos: cada parada del recorrido existe, lo que anuncia reto lo tiene, y
  //    cada parada y cada juego se dibujan sin fallar.
  await paso("Las paradas no cargan", async () => {
    const { PARADAS, RECORRIDO, PARADA_SECRETA, SALUDO_ALBA, DESPEDIDA_ALBA } = await carga("/src/contenido/paradas.ts");
    const { RETOS } = await carga("/src/retos/index.ts");
    const dibujar = (que, elemento) => paso(que, () => renderToString(elemento));

    for (const p of RECORRIDO) {
      if (p.id === PARADA_SECRETA) continue;
      const parada = PARADAS[p.id];
      if (!parada) errores.push(`La parada ${p.id} está en el recorrido pero no en PARADAS`);
      else if (parada.reto && !RETOS[p.id]) errores.push(`La parada ${p.id} anuncia el reto «${parada.reto}» pero no hay juego`);
    }
    const Parada = (await carga("/src/pantallas/Parada.tsx")).default;
    for (const id of Object.keys(PARADAS)) await dibujar(`Parada ${id}`, h(Parada, { id: Number(id) }));
    for (const [id, Juego] of Object.entries(RETOS)) {
      if (!PARADAS[id]) errores.push(`Hay juego para la parada ${id}, pero no hay parada`);
      else await dibujar(`Reto de la parada ${id}`, h(Juego, { parada: PARADAS[id] }));
    }

    // 3. Audio: cada texto con la pista que pedirá la app (explicaciones, misión y todas
    //    las frases de cada reto, con las mismas claves que deduce guion.ts).
    for (const [id, p] of Object.entries(PARADAS)) {
      const n = `p${String(id).padStart(2, "0")}`;
      pistasUsadas.set(`${n}-todos`, p.guion.todos);
      pistasUsadas.set(`${n}-peques`, p.guion.peques);
      pistasUsadas.set(`${n}-mision`, p.guion.mision);
      for (const etiqueta of Object.keys(p.guion.reto))
        for (const d of guion.dichosDelReto(p.guion, Number(id), etiqueta)) pistasUsadas.set(d.pista, [d.texto]);
    }
    pistasUsadas.set("comun-saludo", SALUDO_ALBA);
    pistasUsadas.set("comun-despedida", DESPEDIDA_ALBA);
    paradas = Object.keys(PARADAS).length;
  });

  // 4. Las pantallas generales, cada una por su lado (la secreta lee su guion al cargarse).
  for (const nombre of ["Inicio", "Recorrido", "Album", "Final", "ParadaSecreta"])
    await paso(nombre, async () => renderToString(h((await carga(`/src/pantallas/${nombre}.tsx`)).default, {})));
} finally {
  await vite.close();
}

// Audio (aviso, no error): texto de la app frente a lo grabado.
const manifiesto = JSON.parse(readFileSync(new URL("./public/audio/manifiesto.json", import.meta.url), "utf8"));
const normal = (ps) => ps.join(" ").replace(/\s+/g, " ").trim();
const sinAudio = [];
for (const [clave, parrafos] of pistasUsadas) {
  const p = manifiesto[clave];
  if (!p) sinAudio.push(`${clave} (sin grabar)`);
  else if (normal(p.parrafos) !== normal(parrafos)) sinAudio.push(`${clave} (el guion cambió después de grabar)`);
}

if (sinAudio.length) {
  console.warn(`\n⚠ ${sinAudio.length} textos sonarán con la voz del navegador:\n  - ${sinAudio.join("\n  - ")}\n`);
}
if (errores.length) {
  const cuantos = errores.length === 1 ? "un fallo" : `${errores.length} fallos`;
  console.error(`\n✖ La app tiene ${cuantos}; no se publica:\n  - ${errores.join("\n  - ")}\n`);
  process.exit(1);
}
console.log(
  `✔ App comprobada: ${paradas} paradas, sus juegos y las pantallas generales; ` +
    `${pistasUsadas.size - sinAudio.length} de ${pistasUsadas.size} textos con su audio; ` +
    `${recortados} guiones recortados sin cambiar lo que se lee.`,
);
