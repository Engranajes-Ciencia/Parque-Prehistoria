// Los guiones (contenido/guiones/*.md) llevan, además de lo que se lee en voz alta, las
// tablas de datos, las fuentes y las notas de trabajo: más de la mitad del peso de la app.
// Al compilar, la app recibe solo las líneas que lee (guion.ts y ParadaSecreta.tsx); las
// demás se cambian por «·». No se borran: una línea no vacía corta párrafos y listas igual
// que el texto original, así que la lectura da exactamente lo mismo. comprobar.mjs lo
// verifica en cada compilación comparando guion entero y recortado.

/** Líneas que lee la app: vacías, títulos, citas «>», la lista de la voz y las respuestas. */
function seLee(linea) {
  return (
    !linea.trim() ||
    linea.startsWith("#") ||
    linea.startsWith(">") ||
    linea.includes("## Reto") ||
    linea.includes("**Voz de Alba:**") ||
    linea.includes("**Si falla:**") ||
    (linea.startsWith("- ") && linea.includes(": ") && linea.includes("«"))
  );
}

export function recortarGuion(md) {
  return md
    .split("\n")
    .map((l) => (seLee(l.replace(/\r$/, "")) ? l : "·"))
    .join("\n");
}

/** Plugin de Vite: los .md?raw de contenido/guiones llegan ya recortados. */
export function recortarGuiones() {
  return {
    name: "recortar-guiones",
    enforce: "pre",
    async load(id) {
      const [ruta, consulta] = id.split("?");
      if (consulta !== "raw" || !/[\\/]contenido[\\/]guiones[\\/][^\\/]+\.md$/.test(ruta)) return null;
      const { readFile } = await import("node:fs/promises");
      this.addWatchFile(ruta);
      return `export default ${JSON.stringify(recortarGuion(await readFile(ruta, "utf8")))};`;
    },
  };
}
