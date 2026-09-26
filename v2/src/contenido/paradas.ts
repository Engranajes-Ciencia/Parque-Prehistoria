import comun from "../../../contenido/guiones/comun.md?raw";
import guion01 from "../../../contenido/guiones/parada-01-bienvenida.md?raw";
import guion11 from "../../../contenido/guiones/parada-11-galapagos-darwin.md?raw";
import guion12 from "../../../contenido/guiones/parada-12-huellas-de-laetoli.md?raw";
import guion14 from "../../../contenido/guiones/parada-14-neandertales.md?raw";
import guion15 from "../../../contenido/guiones/parada-15-craneos-evolucion-humana.md?raw";
import guion17 from "../../../contenido/guiones/parada-17-poblados-nomadas.md?raw";
import guion20 from "../../../contenido/guiones/parada-20-catalhoyuk.md?raw";
import guion02 from "../../../contenido/guiones/parada-02-origen-de-la-vida.md?raw";
import guion03 from "../../../contenido/guiones/parada-03-la-vida-nace-en-el-agua.md?raw";
import guion04 from "../../../contenido/guiones/parada-04-prototaxites-meganeura-tiktaalik.md?raw";
import guion05 from "../../../contenido/guiones/parada-05-primeros-arboles.md?raw";
import guion06 from "../../../contenido/guiones/parada-06-primeras-flores.md?raw";
import guion08 from "../../../contenido/guiones/parada-08-el-volcan.md?raw";
import guion09 from "../../../contenido/guiones/parada-09-huellas-de-dinosaurio.md?raw";
import guion10 from "../../../contenido/guiones/parada-10-segundos-dinosaurios.md?raw";
import guion07 from "../../../contenido/guiones/parada-07-primeros-dinosaurios.md?raw";
import guion13 from "../../../contenido/guiones/parada-13-atapuerca.md?raw";
import guion16 from "../../../contenido/guiones/parada-16-cuevas-arte-rupestre.md?raw";
import guion18 from "../../../contenido/guiones/parada-18-poblados-sedentarios.md?raw";
import guion19 from "../../../contenido/guiones/parada-19-pinturas-sahara-laja-alta.md?raw";
import guion21 from "../../../contenido/guiones/parada-21-stonehenge.md?raw";
import { leerGuion, seccion, type Guion } from "./guion";

export const SALUDO_ALBA = seccion(comun, "Saludo de Alba");

export interface ParadaDelRecorrido {
  id: number;
  titulo: string;
  /** Lo que se ve en el mapa y en el álbum en lugar del número (la parada secreta). */
  etiqueta?: string;
}

/** Parada secreta del pozo, entre los poblados nómada y sedentario: no lleva número. */
export const PARADA_SECRETA = 100;

// Recorrido del parque tal como está en 2026 (lo confirmó Álvaro el 26-sep). Solo están
// abiertas las paradas registradas en PARADAS; el resto sale como «pronto».
export const RECORRIDO: ParadaDelRecorrido[] = [
  { id: 1, titulo: "Bienvenida" },
  { id: 2, titulo: "La laguna de Yellowstone" },
  { id: 3, titulo: "La vida nace en el agua" },
  { id: 4, titulo: "Prototaxites, Meganeura y Tiktaalik" },
  { id: 5, titulo: "Los primeros árboles" },
  { id: 6, titulo: "Las primeras flores" },
  { id: 7, titulo: "Los primeros dinosaurios" },
  { id: 8, titulo: "El volcán" },
  { id: 9, titulo: "Huellas de dinosaurio" },
  { id: 10, titulo: "Los segundos dinosaurios" },
  { id: 11, titulo: "Galápagos y Darwin" },
  { id: 12, titulo: "Huellas de Laetoli" },
  { id: 13, titulo: "Atapuerca" },
  { id: 14, titulo: "Los neandertales" },
  { id: 15, titulo: "Cráneos y evolución humana" },
  { id: 16, titulo: "Cuevas y arte rupestre" },
  { id: 17, titulo: "Los poblados nómadas" },
  { id: PARADA_SECRETA, titulo: "Parada secreta: el pozo", etiqueta: "✖" },
  { id: 18, titulo: "Primeros poblados sedentarios" },
  { id: 19, titulo: "Pinturas del Sáhara y de Laja Alta" },
  { id: 20, titulo: "Çatalhöyük" },
  { id: 21, titulo: "Stonehenge" },
];

export interface ContenidoParada {
  id: number;
  titulo: string;
  /** Ilustración de la parada; si no la hay, se usa la foto del parque. */
  imagen?: string;
  foto?: string;
  guion: Guion;
  /** Nombre del reto; el componente que lo juega está en src/retos/index.ts. */
  reto?: string;
}

export const PARADAS: Record<number, ContenidoParada> = {
  1: {
    id: 1,
    titulo: "Bienvenida",
    foto: "img/p01/foto.webp",
    guion: leerGuion(guion01),
    reto: "El reloj del tiempo",
  },
  11: {
    id: 11,
    titulo: "Galápagos y Darwin",
    foto: "img/p11/foto.webp",
    guion: leerGuion(guion11),
    reto: "Cada pico, su comida",
  },
  12: {
    id: 12,
    titulo: "Huellas de Laetoli",
    foto: "img/p12/foto.webp",
    guion: leerGuion(guion12),
    reto: "Detectives de Laetoli",
  },
  14: {
    id: 14,
    titulo: "Los neandertales",
    foto: "img/p14/foto.webp",
    guion: leerGuion(guion14),
    reto: "¿Verdad o mito?",
  },
  15: {
    id: 15,
    titulo: "Cráneos y evolución humana",
    foto: "img/p15/foto.webp",
    guion: leerGuion(guion15),
    reto: "Encuentra las diferencias",
  },
  17: {
    id: 17,
    titulo: "Los poblados nómadas",
    foto: "img/p17/foto.webp",
    guion: leerGuion(guion17),
    reto: "¡Nos mudamos!",
  },
  20: {
    id: 20,
    titulo: "Çatalhöyük",
    foto: "img/p20/foto.webp",
    guion: leerGuion(guion20),
    reto: "Construye una casa de Çatalhöyük",
  },
  2: {
    id: 2,
    titulo: "La laguna de Yellowstone",
    imagen: "img/p02/portada.webp",
    foto: "img/p02/foto.webp",
    guion: leerGuion(guion02),
    reto: "Fábrica de oxígeno",
  },
  3: {
    id: 3,
    titulo: "La vida nace en el agua",
    imagen: "img/p03/portada.webp",
    foto: "img/p03/foto.webp",
    guion: leerGuion(guion03),
    reto: "¿Cómo se hace un fósil?",
  },
  4: {
    id: 4,
    titulo: "Prototaxites, Meganeura y Tiktaalik",
    imagen: "img/p04/portada.webp",
    foto: "img/p04/foto.webp",
    guion: leerGuion(guion04),
    reto: "¿Quién vivió antes?",
  },
  5: {
    id: 5,
    titulo: "Los primeros árboles",
    imagen: "img/p05/portada.webp",
    guion: leerGuion(guion05),
    reto: "Construye el primer árbol",
  },
  6: {
    id: 6,
    titulo: "Las primeras flores",
    imagen: "img/p06/portada.webp",
    guion: leerGuion(guion06),
    reto: "Poliniza las flores",
  },
  8: {
    id: 8,
    titulo: "El volcán",
    imagen: "img/p08/portada.webp",
    foto: "img/p08/foto.webp",
    guion: leerGuion(guion08),
    reto: "Arma Pangea",
  },
  9: {
    id: 9,
    titulo: "Huellas de dinosaurio",
    imagen: "img/p09/portada.webp",
    foto: "img/p09/foto.webp",
    guion: leerGuion(guion09),
    reto: "¿De quién es la huella?",
  },
  10: {
    id: 10,
    titulo: "Los segundos dinosaurios",
    imagen: "img/p10/portada.webp",
    foto: "img/p10/foto.webp",
    guion: leerGuion(guion10),
    reto: "¿Quién sobrevivió?",
  },
  7: {
    id: 7,
    titulo: "Los primeros dinosaurios",
    imagen: "img/p07/portada.webp",
    guion: leerGuion(guion07),
    reto: "¿Quién come qué?",
  },
  13: {
    id: 13,
    titulo: "Atapuerca",
    imagen: "img/p13/portada.webp",
    foto: "img/p13/foto.webp",
    guion: leerGuion(guion13),
    reto: "¡A excavar!",
  },
  16: {
    id: 16,
    titulo: "Cuevas y arte rupestre",
    imagen: "img/p16/portada.webp",
    foto: "img/p16/foto.webp",
    guion: leerGuion(guion16),
    reto: "Tu mano en la cueva",
  },
  18: {
    id: 18,
    titulo: "Primeros poblados sedentarios",
    imagen: "img/p18/portada.webp",
    foto: "img/p18/foto.webp",
    guion: leerGuion(guion18),
    reto: "¿De dónde viene?",
  },
  19: {
    id: 19,
    titulo: "Pinturas del Sáhara y de Laja Alta",
    imagen: "img/p19/portada.webp",
    foto: "img/p19/foto.webp",
    guion: leerGuion(guion19),
    reto: "Descubre el mural",
  },
  21: {
    id: 21,
    titulo: "Stonehenge",
    imagen: "img/p21/portada.webp",
    guion: leerGuion(guion21),
    reto: "Reconstruye Stonehenge",
  },
};
