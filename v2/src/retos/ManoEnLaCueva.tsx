import { useEffect, useRef, useState, type PointerEvent as EventoPuntero } from "react";
import MarcoReto, { useAlba } from "../componentes/MarcoReto";
import { dichoDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Mano en negativo: el pigmento que cae sobre la mano no llega a la pared, así que al
// terminar la mano queda dibujada por su hueco. Todo en unidades lógicas de 300×400.
const ANCHO = 300;
const ALTO = 400;
const RADIO = 24;
const MITAD = 0.45;
const COMPLETO = 0.8;
export const CLAVE_MANO = "prehistoria-v2-mano";

/** Rectángulo redondeado a mano: Path2D.roundRect no existe antes de iOS 16. */
function redondo(p: Path2D, x: number, y: number, w: number, h: number, radio: number) {
  const r = Math.min(radio, w / 2, h / 2);
  p.moveTo(x + r, y);
  p.arcTo(x + w, y, x + w, y + h, r);
  p.arcTo(x + w, y + h, x, y + h, r);
  p.arcTo(x, y + h, x, y, r);
  p.arcTo(x, y, x + w, y, r);
  p.closePath();
}

function formaDeMano(): Path2D {
  const derecha = new Path2D();
  const dedo = (x: number, y: number, angulo: number, largo: number, ancho: number) => {
    const d = new Path2D();
    redondo(d, -ancho / 2, -largo, ancho, largo + 8, ancho / 2);
    derecha.addPath(d, new DOMMatrix().translate(x, y).rotate(angulo));
  };
  redondo(derecha, 97, 185, 110, 128, 36);
  redondo(derecha, 112, 290, 82, 110, 22);
  dedo(117, 200, -10, 106, 27);
  dedo(145, 194, -2, 120, 28);
  dedo(172, 198, 6, 110, 27);
  dedo(196, 212, 16, 86, 23);
  dedo(106, 280, -50, 90, 31);
  // Se dibuja una derecha y se refleja: casi todas las manos en negativo de las cuevas son
  // izquierdas, porque con la derecha se sujetaba el tubo para soplar.
  const mano = new Path2D();
  mano.addPath(derecha, new DOMMatrix([-1, 0, 0, 1, ANCHO, 0]));
  return mano;
}

// La forma se construye una sola vez, la primera vez que hace falta (no en cada dibujado).
let formaHecha: Path2D | null = null;
const laMano = () => (formaHecha ??= formaDeMano());

function pintarRoca(ctx: CanvasRenderingContext2D) {
  const g = ctx.createRadialGradient(150, 170, 40, 150, 200, 280);
  g.addColorStop(0, "#d9a66d");
  g.addColorStop(1, "#8a5b35");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ANCHO, ALTO);
  for (let i = 0; i < 2600; i++) {
    const t = Math.random();
    ctx.fillStyle = t < 0.5 ? "rgba(90,55,30,0.18)" : "rgba(255,230,190,0.16)";
    ctx.beginPath();
    ctx.arc(Math.random() * ANCHO, Math.random() * ALTO, Math.random() * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(70,40,20,0.35)";
  ctx.lineWidth = 1.5;
  for (const [x, y] of [[30, 60], [250, 90], [60, 330], [240, 300]]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + 20, y + 15, x - 10, y + 40, x + 15, y + 70);
    ctx.stroke();
  }
}

export default function ManoEnLaCueva({ parada }: { parada: ContenidoParada }) {
  const [frases] = useState(() => ({
    inicio: dichoDelReto(parada.guion, parada.id, "Al empezar"),
    mitad: dichoDelReto(parada.guion, parada.id, "A la mitad"),
    final: dichoDelReto(parada.guion, parada.id, "Al terminar"),
  }));
  const { mensaje, decir, final, terminar: rematar, acabado } = useAlba(frases.inicio, parada.id);
  const [recuerdo, setRecuerdo] = useState<string | null>(null);
  const pared = useRef<HTMLCanvasElement>(null);
  const guia = useRef<HTMLCanvasElement>(null);
  const escala = useRef(2);
  const puntos = useRef<{ x: number; y: number; hecho: boolean }[]>([]);
  const dichoMitad = useRef(false);

  useEffect(() => {
    const k = Math.min(window.devicePixelRatio || 1, 2) * 1.2;
    escala.current = k;
    for (const c of [pared.current!, guia.current!]) {
      c.width = ANCHO * k;
      c.height = ALTO * k;
      c.getContext("2d")!.setTransform(k, 0, 0, k, 0, 0);
    }
    pintarRoca(pared.current!.getContext("2d")!);
    const g = guia.current!.getContext("2d")!;
    g.setLineDash([7, 6]);
    g.lineWidth = 2.5;
    g.strokeStyle = "rgba(255,255,255,0.85)";
    g.stroke(laMano());

    // Puntos de control: el halo alrededor de la mano que hay que cubrir de pigmento.
    const ctx = pared.current!.getContext("2d")!;
    const dentro = (x: number, y: number) => ctx.isPointInPath(laMano(), x * k, y * k);
    const lista: typeof puntos.current = [];
    for (let y = 40; y < ALTO; y += 12) {
      for (let x = 10; x < ANCHO - 10; x += 12) {
        if (dentro(x, y)) continue;
        const cerca = [0, 45, 90, 135, 180, 225, 270, 315].some((a) =>
          dentro(x + 30 * Math.cos((a * Math.PI) / 180), y + 30 * Math.sin((a * Math.PI) / 180)),
        );
        if (cerca) lista.push({ x, y, hecho: false });
      }
    }
    puntos.current = lista;
  }, []);

  const soplar = (e: EventoPuntero<HTMLCanvasElement>) => {
    if (acabado || (e.type === "pointermove" && e.buttons === 0)) return;
    const c = pared.current!;
    const r = c.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * ANCHO;
    const y = ((e.clientY - r.top) / r.height) * ALTO;
    const ctx = c.getContext("2d")!;
    const k = escala.current;
    ctx.fillStyle = "rgba(142, 38, 24, 0.22)";
    for (let i = 0; i < 45; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = RADIO * Math.sqrt(Math.random());
      const px = x + d * Math.cos(a);
      const py = y + d * Math.sin(a);
      if (ctx.isPointInPath(laMano(), px * k, py * k)) continue;
      ctx.beginPath();
      ctx.arc(px, py, 1 + Math.random() * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const p of puntos.current) {
      if (!p.hecho && Math.hypot(p.x - x, p.y - y) < RADIO) p.hecho = true;
    }
    const cubierto = puntos.current.filter((p) => p.hecho).length / puntos.current.length;
    if (cubierto >= COMPLETO) {
      terminar();
    } else if (cubierto >= MITAD && !dichoMitad.current) {
      dichoMitad.current = true;
      decir(frases.mitad);
    }
  };

  const terminado = useRef(false); // varios movimientos antes de repintar no deben terminar dos veces
  const terminar = () => {
    if (terminado.current) return;
    terminado.current = true;
    guia.current!.getContext("2d")!.clearRect(0, 0, ANCHO, ALTO);
    const copia = document.createElement("canvas");
    copia.width = 240;
    copia.height = 320;
    copia.getContext("2d")!.drawImage(pared.current!, 0, 0, 240, 320);
    const imagen = copia.toDataURL("image/jpeg", 0.72);
    try {
      localStorage.setItem(CLAVE_MANO, imagen);
    } catch {
      // Sin almacenamiento: la mano se ve ahora, pero no quedará en el álbum.
    }
    setRecuerdo(imagen);
    rematar(null, frases.final);
  };

  return (
    <MarcoReto
      parada={parada.id}
      titulo={parada.reto ?? "Tu mano en la cueva"}
      mensaje={mensaje}
      decir={decir}
      final={final}
      recuerdo={recuerdo && <img className="mano-recuerdo" src={recuerdo} alt="Tu mano en la cueva" />}
    >
      <div className="cueva">
        <canvas
          ref={pared}
          onPointerDown={(e) => {
            try {
              e.currentTarget.setPointerCapture(e.pointerId);
            } catch {
              /* el dedo ya se levantó */
            }
            soplar(e);
          }}
          onPointerMove={soplar}
        />
        <canvas ref={guia} className="cueva-guia" aria-hidden="true" />
      </div>
      <p className="nota">Pasa el dedo alrededor de la mano para soplar el pigmento rojo.</p>
    </MarcoReto>
  );
}
