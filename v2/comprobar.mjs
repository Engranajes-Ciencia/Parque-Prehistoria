// Comprobación antes de publicar (va dentro de «npm run build»).
//
// Carga la app en Node con el mismo Vite y dibuja cada pantalla y cada juego. Los textos
// salen de los guiones .md y se leen al dibujar: si un guion pierde una sección o una frase
// del reto, el fallo sale AQUÍ y la versión rota no se publica, en vez de aparecer en el
// móvil de una familia en mitad del parque.
//
// También avisa (sin fallar) de los textos que no tienen audio grabado o cuyo audio ya no
// coincide con el guion: esos sonarían con la voz del navegador.

import { readFileSync } from "node:fs";
import { createServer } from "vite";

const vite = await createServer({
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: "custom",
  logLevel: "error",
});

const errores = [];
const pistasUsadas = new Map(); // clave -> párrafos
let paradas = 0;
try {
  const { createElement: h } = await import("react");
  const { renderToString } = await import("react-dom/server");
  const carga = (m) => vite.ssrLoadModule(m);

  const guion = await carga("/src/contenido/guion.ts");
  const { PARADAS, RECORRIDO, PARADA_SECRETA, SALUDO_ALBA, DESPEDIDA_ALBA } = await carga("/src/contenido/paradas.ts");
  const { RETOS } = await carga("/src/retos/index.ts");
  const pantalla = async (nombre) => (await carga(`/src/pantallas/${nombre}.tsx`)).default;

  const dibujar = (que, elemento) => {
    try {
      renderToString(elemento);
    } catch (e) {
      errores.push(`${que}: ${e.message}`);
    }
  };

  // 1. Cada parada del recorrido existe, y si anuncia reto, el reto existe.
  for (const p of RECORRIDO) {
    if (p.id === PARADA_SECRETA) continue;
    const parada = PARADAS[p.id];
    if (!parada) errores.push(`La parada ${p.id} está en el recorrido pero no en PARADAS`);
    else if (parada.reto && !RETOS[p.id]) errores.push(`La parada ${p.id} anuncia el reto «${parada.reto}» pero no hay juego`);
  }

  // 2. Cada pantalla y cada juego se dibuja sin fallar.
  const Parada = await pantalla("Parada");
  for (const id of Object.keys(PARADAS)) dibujar(`Parada ${id}`, h(Parada, { id: Number(id) }));
  for (const [id, Juego] of Object.entries(RETOS)) {
    if (!PARADAS[id]) errores.push(`Hay juego para la parada ${id}, pero no hay parada`);
    else dibujar(`Reto de la parada ${id}`, h(Juego, { parada: PARADAS[id] }));
  }
  for (const nombre of ["Inicio", "Recorrido", "Album", "Final", "ParadaSecreta"]) dibujar(nombre, h(await pantalla(nombre), {}));

  // 3. Audio: cada texto con la pista que pedirá la app (explicaciones, misión y todas las
  //    frases de cada reto, con las mismas claves que deduce guion.ts).
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
} catch (e) {
  errores.push(`La app no carga: ${e.stack ?? e.message}`);
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
    `${pistasUsadas.size - sinAudio.length} de ${pistasUsadas.size} textos con su audio.`,
);
