// El mapa del parque: un dibujo de fondo y, encima, las marcas de las paradas.
// Las posiciones van en porcentaje del dibujo (x de izquierda a derecha, y de arriba abajo),
// así que cambiar el dibujo o mover una parada no toca el código: basta con ajustar aquí.
// Para recolocarlas a ojo: abre #/mapa-editar, arrastra las marcas y copia el resultado.
//
// 27-sep-2026: fondo = M3, el mapa del lote 5 con las cinco correcciones de Álvaro (fósiles a
// la izquierda de los Prototaxites, laguito de la 3, impacto y flor, huellas, hogar con huesos).

export const FONDO_MAPA = { imagen: "img/mapa/mapa-m3.webp", ancho: 1000, alto: 1500 };

export const POSICIONES: Record<number, { x: number; y: number }> = {
  1: { x: 44.0, y: 78.0 },
  2: { x: 81.0, y: 80.0 },
  3: { x: 82.0, y: 72.0 },
  4: { x: 45.0, y: 64.0 },
  5: { x: 64.0, y: 65.0 },
  6: { x: 79.0, y: 64.0 },
  7: { x: 51.0, y: 57.0 },
  8: { x: 88.0, y: 49.0 },
  9: { x: 57.0, y: 48.0 },
  10: { x: 56.0, y: 40.0 },
  11: { x: 72.0, y: 31.0 },
  12: { x: 56.0, y: 29.0 },
  13: { x: 73.0, y: 22.0 },
  14: { x: 60.0, y: 11.0 },
  15: { x: 52.0, y: 20.0 },
  16: { x: 40.0, y: 12.0 },
  17: { x: 51.0, y: 6.0 },
  100: { x: 14.0, y: 9.0 },
  18: { x: 30.0, y: 17.0 },
  19: { x: 31.0, y: 27.0 },
  20: { x: 47.0, y: 24.0 },
  21: { x: 21.0, y: 25.0 },
};
