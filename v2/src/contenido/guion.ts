// Lee los guiones de contenido/guiones/*.md. El guion es la única fuente de los textos:
// la app muestra y locuta exactamente lo que hay en las citas (líneas que empiezan por ">")
// y en la lista «Voz de Alba» del reto. herramientas/generar_audios.py lee lo mismo.

export interface Guion {
  todos: string[];
  peques: string[];
  mision: string[];
  sabiasQue: string;
  /** Frases del reto por etiqueta («Al empezar», «Acierto (se alternan)»…). */
  reto: Record<string, string[]>;
  /** Frases del reto para mayores (7 años o más), si la parada lo tiene. */
  mayores: Record<string, string[]>;
  /**
   * Prefijo de las pistas de audio del reto: «reto» (el de peques) o «mayores». Los motores
   * de juego no lo miran: para el reto de mayores reciben un guion cuyo `reto` son las
   * frases de mayores y cuyo `retoClave` es «mayores» (paraMayores, en paradas.ts).
   */
  retoClave?: "reto" | "mayores";
  /** Si la misión se comprueba: la respuesta correcta y todas las opciones, en orden. */
  respuestas: Respuestas | null;
}

export interface Respuestas {
  correcta: string;
  opciones: string[];
}

function limpiar(texto: string): string {
  return texto
    .replace(/\*\*\[[^\]]*\]\*\*/g, "") // marcas de trabajo tipo **[VERIFICAR: …]**
    .replace(/\[VERIFICAR[^\]]*\]/g, "")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function seccion(md: string, titulo: string): string[] {
  const lineas = md.split(/\r?\n/);
  const inicio = lineas.findIndex((l) => l.startsWith("## ") && l.includes(titulo));
  if (inicio < 0) throw new Error(`Al guion le falta la sección «${titulo}»`);
  const parrafos: string[] = [];
  let actual: string[] = [];
  const cerrar = () => {
    if (actual.length) parrafos.push(limpiar(actual.join(" ")));
    actual = [];
  };
  for (let i = inicio + 1; i < lineas.length && !lineas[i].startsWith("## "); i++) {
    const linea = lineas[i];
    if (!linea.startsWith(">")) {
      cerrar();
      continue;
    }
    const texto = linea.replace(/^>\s?/, "").trim();
    if (texto) actual.push(texto);
    else cerrar();
  }
  cerrar();
  if (!parrafos.length) throw new Error(`La sección «${titulo}» del guion no tiene texto citado`);
  return parrafos;
}

/** «Acierto (se alternan)» → «Acierto»: la etiqueta sin aclaraciones entre paréntesis. */
export function etiquetaNormal(etiqueta: string): string {
  return etiqueta.replace(/\s*\([^)]*\)/g, "").trim();
}

/** «Planta alta al triceratops» → «planta-alta-al-triceratops». Igual que slug() en generar_audios.py. */
export function slug(texto: string): string {
  return etiquetaNormal(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "") // quita las tildes que NFD separa de su letra
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Cabeceras de las secciones de los dos retos. «## Reto: «…»» es el de peques. */
export const SECCION_RETO = { reto: "## Reto:", mayores: "## Reto para mayores" } as const;

/**
 * Solo la lista que sigue a «**Voz de Alba:**» dentro de la sección del reto (la de peques o
 * la de mayores), hasta la primera línea en blanco.
 */
function vozDelReto(md: string, cabeceraSeccion: string): Record<string, string[]> {
  const lineas = md.split(/\r?\n/);
  const inicio = lineas.findIndex((l) => l.startsWith(cabeceraSeccion));
  if (inicio < 0) return {};
  let fin = lineas.findIndex((l, i) => i > inicio && l.startsWith("## "));
  if (fin < 0) fin = lineas.length;
  const cabecera = lineas.findIndex((l, i) => i > inicio && i < fin && l.includes("**Voz de Alba:**"));
  if (cabecera < 0) return {};
  const frases: Record<string, string[]> = {};
  for (const linea of lineas.slice(cabecera + 1, fin)) {
    if (!linea.trim()) break;
    const m = linea.match(/^- (.+?): (.+)$/);
    if (m) {
      const citas = [...m[2].matchAll(/«([^»]+)»/g)].map((c) => c[1]);
      if (citas.length) frases[etiquetaNormal(m[1])] = citas;
    }
  }
  return frases;
}

/**
 * Respuestas de una misión que se comprueba: líneas «- Correcta: «…»» y «- Incorrecta: «…»»
 * dentro de la sección «¡Mira bien!». Sin ellas, la misión se cierra con «¡Hecho!».
 */
function respuestasDeMision(md: string): Respuestas | null {
  const lineas = md.split(/\r?\n/);
  const inicio = lineas.findIndex((l) => l.startsWith("## ") && l.includes("Mira bien"));
  if (inicio < 0) return null;
  let correcta = "";
  const opciones: string[] = [];
  for (const linea of lineas.slice(inicio + 1)) {
    if (linea.startsWith("## ")) break;
    const m = linea.match(/^- (Correcta|Incorrecta): «([^»]+)»/);
    if (!m) continue;
    opciones.push(m[2]);
    if (m[1] === "Correcta") correcta = m[2];
  }
  if (!opciones.length) return null;
  if (!correcta || opciones.length < 2) throw new Error("Las respuestas de la misión necesitan una correcta y al menos otra");
  return { correcta, opciones };
}

export function leerGuion(md: string): Guion {
  return {
    todos: seccion(md, "Para todos"),
    peques: seccion(md, "Para peques"),
    mision: seccion(md, "Mira bien"),
    sabiasQue: seccion(md, "Sabías que").join(" "),
    reto: vozDelReto(md, SECCION_RETO.reto),
    mayores: vozDelReto(md, SECCION_RETO.mayores),
    respuestas: respuestasDeMision(md),
  };
}

export interface Dicho {
  texto: string;
  pista: string;
}

/**
 * Una frase del reto por su etiqueta exacta (sin paréntesis) y su pista de audio, que se
 * deduce igual que en generar_audios.py: pNN-reto-<etiqueta> (pNN-mayores-<etiqueta> en el
 * reto de mayores), con -1, -2… si la etiqueta tiene varias frases alternativas. Falla si
 * el guion no la tiene.
 */
export function dichoDelReto(guion: Guion, parada: number, etiqueta: string, n = 0): Dicho {
  const frases = guion.reto[etiqueta];
  const texto = frases?.[n];
  const cual = guion.retoClave === "mayores" ? "El reto para mayores" : "El reto";
  if (!texto) throw new Error(`${cual} de la parada ${parada} no tiene la frase «${etiqueta}» (${n + 1}.ª)`);
  const base = `p${String(parada).padStart(2, "0")}-${guion.retoClave ?? "reto"}-${slug(etiqueta)}`;
  return { texto, pista: frases.length > 1 ? `${base}-${n + 1}` : base };
}

/** Todas las frases alternativas de una etiqueta. */
export function dichosDelReto(guion: Guion, parada: number, etiqueta: string): Dicho[] {
  return (guion.reto[etiqueta] ?? []).map((_, n) => dichoDelReto(guion, parada, etiqueta, n));
}

/** Parte párrafos en frases para locutarlas y resaltarlas de una en una. */
export function enFrases(parrafos: string[]): string[] {
  // Corta tras . ! ? … seguidos de espacio y de una mayúscula, ¡, ¿ o «. Sin «lookbehind»
  // (?<=…): Safari anterior a la 16.4 no lo entiende y la app entera se quedaba en blanco.
  // Mismo resultado que en_frases() de generar_audios.py.
  const corte = /([.!?…])\s+(?=[¡¿«A-ZÁÉÍÓÚÑ])/g;
  return parrafos.flatMap((p) =>
    p
      .replace(corte, "$1\u0000")
      .split("\u0000")
      .map((f) => f.trim())
      .filter(Boolean),
  );
}
