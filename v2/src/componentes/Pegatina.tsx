const IMAGEN: Record<number, string> = Object.fromEntries(
  [2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 16, 18, 19, 21].map((n) => [n, `img/p${String(n).padStart(2, "0")}/pegatina.webp`]),
);

export default function Pegatina({ parada, grande = false }: { parada: number; grande?: boolean }) {
  const imagen = IMAGEN[parada];
  return (
    <span className={`pegatina ${grande ? "grande" : ""} ${imagen ? "con-imagen" : ""}`} aria-label={`Pegatina de la parada ${parada}`}>
      {imagen ? <img src={imagen} alt="" draggable={false} /> : "⭐"}
    </span>
  );
}
