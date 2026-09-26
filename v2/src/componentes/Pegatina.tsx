const IMAGEN: Record<number, string> = {
  ...Object.fromEntries(
    Array.from({ length: 21 }, (_, i) => i + 1).map((n) => [n, `img/p${String(n).padStart(2, "0")}/pegatina.webp`]),
  ),
  100: "img/secreta/pegatina.webp", // la X del pozo
};

export default function Pegatina({ parada, grande = false }: { parada: number; grande?: boolean }) {
  const imagen = IMAGEN[parada];
  return (
    <span className={`pegatina ${grande ? "grande" : ""} ${imagen ? "con-imagen" : ""}`} aria-label={`Pegatina de la parada ${parada}`}>
      {imagen ? <img src={imagen} alt="" draggable={false} /> : "⭐"}
    </span>
  );
}
