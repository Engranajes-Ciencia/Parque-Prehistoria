import { useSyncExternalStore } from "react";

export type Modo = "todos" | "peques";

export interface Estado {
  modo: Modo | null;
  pegatinas: number[];
  misiones: number[];
  /** Nombre para el diploma del final (opcional). */
  nombre: string;
}

const CLAVE = "prehistoria-v2";
const INICIAL: Estado = { modo: null, pegatinas: [], misiones: [], nombre: "" };

// 26-sep-2026: el parque añadió paradas y se renumeraron. Los móviles de prueba que
// guardaron el progreso con los números viejos lo recuperan con los nuevos.
const RENUMERACION: Record<number, number> = { 12: 13, 15: 16, 17: 18, 18: 19, 20: 21 };

function cargar(): Estado {
  try {
    const texto = localStorage.getItem(CLAVE);
    if (!texto) return INICIAL;
    const guardado = { ...INICIAL, ...JSON.parse(texto) };
    if (guardado.version !== 2) {
      const nuevo = (id: number) => RENUMERACION[id] ?? id;
      guardado.pegatinas = guardado.pegatinas.map(nuevo);
      guardado.misiones = guardado.misiones.map(nuevo);
      localStorage.setItem(CLAVE, JSON.stringify({ ...guardado, version: 2 })); // una sola vez
    }
    return guardado;
  } catch {
    return INICIAL;
  }
}

let estado = cargar();
const oyentes = new Set<() => void>();

export function actualizar(cambio: Partial<Estado>) {
  estado = { ...estado, ...cambio };
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ ...estado, version: 2 }));
  } catch {
    // Sin almacenamiento (modo privado, etc.): el progreso dura lo que dure la pestaña.
  }
  oyentes.forEach((o) => o());
}

function conUno(lista: number[], id: number) {
  return lista.includes(id) ? lista : [...lista, id];
}

export const ganarPegatina = (id: number) => actualizar({ pegatinas: conUno(estado.pegatinas, id) });
export const completarMision = (id: number) => actualizar({ misiones: conUno(estado.misiones, id) });

export function useEstado(): Estado {
  return useSyncExternalStore(
    (oyente) => {
      oyentes.add(oyente);
      return () => oyentes.delete(oyente);
    },
    () => estado,
    () => estado,
  );
}
