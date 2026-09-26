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

/** Solo la lista que sigue a «**Voz de Alba:**» dentro del reto, hasta la primera línea en blanco. */
function vozDelReto(md: string): Record<string, string[]> {
  const reto = md.indexOf("## Reto");
  if (reto < 0) return {};
  const cabecera = md.indexOf("**Voz de Alba:**", reto);
  if (cabecera < 0) return {};
  const frases: Record<string, string[]> = {};
  for (const linea of md.slice(cabecera).split(/\r?\n/).slice(1)) {
    if (!linea.trim()) break;
    const m = linea.match(/^- (.+?): (.+)$/);
    if (m) {
      const citas = [...m[2].matchAll(/«([^»]+)»/g)].map((c) => c[1]);
      if (citas.length) frases[etiquetaNormal(m[1])] = citas;
    }
  }
  return frases;
}

export function leerGuion(md: string): Guion {
  return {
    todos: seccion(md, "Para todos"),
    peques: seccion(md, "Para peques"),
    mision: seccion(md, "Mira bien"),
    sabiasQue: seccion(md, "Sabías que").join(" "),
    reto: vozDelReto(md),
  };
}

export interface Dicho {
  texto: string;
  pista: string;
}

/**
 * Una frase del reto por su etiqueta exacta (sin paréntesis) y su pista de audio, que se
 * deduce igual que en generar_audios.py: pNN-reto-<etiqueta>, con -1, -2… si la etiqueta
 * tiene varias frases alternativas. Falla si el guion no la tiene.
 */
export function dichoDelReto(guion: Guion, parada: number, etiqueta: string, n = 0): Dicho {
  const frases = guion.reto[etiqueta];
  const texto = frases?.[n];
  if (!texto) throw new Error(`El reto de la parada ${parada} no tiene la frase «${etiqueta}» (${n + 1}.ª)`);
  const base = `p${String(parada).padStart(2, "0")}-reto-${slug(etiqueta)}`;
  return { texto, pista: frases.length > 1 ? `${base}-${n + 1}` : base };
}

/** Todas las frases alternativas de una etiqueta. */
export function dichosDelReto(guion: Guion, parada: number, etiqueta: string): Dicho[] {
  return (guion.reto[etiqueta] ?? []).map((_, n) => dichoDelReto(guion, parada, etiqueta, n));
}

/** Parte párrafos en frases para locutarlas y resaltarlas de una en una. */
export function enFrases(parrafos: string[]): string[] {
  return parrafos.flatMap((p) =>
    p
      .split(/(?<=[.!?…])\s+(?=[¡¿«A-ZÁÉÍÓÚÑ])/)
      .map((f) => f.trim())
      .filter(Boolean),
  );
}
