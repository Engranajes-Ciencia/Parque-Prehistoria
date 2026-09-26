export type PoseAlba = "saluda" | "senala" | "senala_izq" | "celebra" | "lupa" | "reloj" | "piensa";

export default function Alba({ pose, className = "" }: { pose: PoseAlba; className?: string }) {
  return (
    <img
      className={`alba ${className}`}
      src={`img/alba/alba_${pose}.webp`}
      alt="Alba, la viajera del tiempo"
      draggable={false}
    />
  );
}
