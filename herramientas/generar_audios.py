# Genera los audios de la app a partir de los guiones (contenido/guiones/*.md).
#
# Cada «pista» es un texto del guion + una voz. El generador:
#   - lee el texto EXACTAMENTE como lo lee la app (las líneas citadas con «>» de una
#     sección, o las frases «…» de la lista «Voz de Alba» del reto);
#   - pide a ElevenLabs el audio CON marcas de tiempo, y de ellas saca el momento en
#     que empieza y acaba cada frase (para resaltar los subtítulos a la par de la voz);
#   - normaliza el volumen (-16 LUFS, el estándar para escuchar en el móvil) y lo deja
#     en MP3 mono de 64 kbps;
#   - apunta en v2/public/audio/manifiesto.json la voz, el modelo, los ajustes y el
#     texto de cada pista: la voz queda ANCLADA y cualquier audio se puede rehacer igual.
#
# Si el texto de una pista no ha cambiado desde la última vez, NO se vuelve a generar
# (no gasta créditos). Para forzarlo: --forzar p07-todos (o --forzar todo).
#
# USO (desde la carpeta del proyecto)
#   python herramientas/generar_audios.py                 genera lo que falte o haya cambiado
#   python herramientas/generar_audios.py --solo p07-peques
#   python herramientas/generar_audios.py --lista         muestra las pistas y su estado
#
# La clave se lee igual que en voces.py (ANTIGRAVITY\_secrets\elevenlabs_KEY.txt).

import argparse
import base64
import datetime
import json
import os
import re
import subprocess
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import voces  # noqa: E402  (reutiliza la clave y las peticiones a la API)

PROYECTO = voces.PROYECTO
GUIONES = os.path.join(PROYECTO, "contenido", "guiones")
SALIDA = os.path.join(PROYECTO, "v2", "public", "audio")
MANIFIESTO = os.path.join(SALIDA, "manifiesto.json")

MODELO = "eleven_multilingual_v2"
# Ajustes de «El Richar atenboru» tal y como están en el historial de la cuenta (sep-2025).
VOCES = {
    "narrador": {"voice_id": "WeuNkKS3AvTwCZZERkQa", "nombre": "El Richar atenboru",
                 "ajustes": {"stability": 0.49, "similarity_boost": 0.43, "style": 0.0,
                             "use_speaker_boost": True, "speed": 1.0}},
    "alba": {"voice_id": "OOHm6M5O6WPl7E4nAqyE", "nombre": "Alba Guía Prehistoria",
             "ajustes": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.0,
                         "use_speaker_boost": True, "speed": 1.0}},
}

# PRONUNCIACIÓN. Lo que se le manda a ElevenLabs puede llevar una grafía «de locutor» para
# que la voz acierte (26-sep: Alba decía «triceratóps», aguda). Solo afecta al audio: los
# subtítulos y la app siguen con la grafía correcta. Si cambias esta tabla, regenera con
# --forzar las pistas que contengan la palabra.
PRONUNCIACION = {
    "triceratops": "tricerátops",
    "Triceratops": "Tricerátops",
    "Lascaux": "Lascó",
    "Chauvet": "Chové",
}


def pronunciar(texto):
    for patron, dicho in PRONUNCIACION.items():
        texto = re.sub(r"(?<!\w)" + patron + r"(?!\w)", dicho, texto)
    return texto


# Las pistas se descubren solas a partir de los guiones:
#   comun-saludo                    comun.md, sección «Saludo de Alba»
#   pNN-todos / pNN-peques / pNN-mision   secciones de contenido/guiones/parada-NN-*.md
#   pNN-reto-<etiqueta>[-n]          frases de la lista «Voz de Alba» del reto; -1, -2… si
#                                    la etiqueta tiene varias alternativas
# La app deduce las mismas claves (src/contenido/guion.ts, dichoDelReto).


# ------------------------------------------------ lectura de guiones (igual que la app)

def limpiar(texto):
    texto = re.sub(r"\*\*\[[^\]]*\]\*\*", "", texto)
    texto = re.sub(r"\[VERIFICAR[^\]]*\]", "", texto)
    texto = texto.replace("**", "")
    return re.sub(r"\s+", " ", texto).strip()


def seccion(md, titulo):
    lineas = md.splitlines()
    inicio = next((i for i, l in enumerate(lineas) if l.startswith("## ") and titulo in l), None)
    if inicio is None:
        raise SystemExit(f"Al guion le falta la sección «{titulo}»")
    parrafos, actual = [], []
    for linea in lineas[inicio + 1:]:
        if linea.startswith("## "):
            break
        if not linea.startswith(">"):
            if actual:
                parrafos.append(limpiar(" ".join(actual)))
            actual = []
            continue
        texto = re.sub(r"^>\s?", "", linea).strip()
        if texto:
            actual.append(texto)
        elif actual:
            parrafos.append(limpiar(" ".join(actual)))
            actual = []
    if actual:
        parrafos.append(limpiar(" ".join(actual)))
    if not parrafos:
        raise SystemExit(f"La sección «{titulo}» no tiene texto citado")
    return parrafos


def etiqueta_normal(etiqueta):
    return re.sub(r"\s*\([^)]*\)", "", etiqueta).strip()


def slug(texto):
    """Igual que slug() en src/contenido/guion.ts."""
    import unicodedata
    t = unicodedata.normalize("NFD", etiqueta_normal(texto).lower())
    t = "".join(c for c in t if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")


def voz_del_reto(md):
    """{etiqueta normalizada: [frases]} de la lista que sigue a «**Voz de Alba:**» en el reto,
    hasta la primera línea en blanco (igual que la app)."""
    if "## Reto" not in md:
        return {}
    reto = md[md.index("## Reto"):]
    if "**Voz de Alba:**" not in reto:
        return {}
    salida = {}
    for linea in reto[reto.index("**Voz de Alba:**"):].splitlines()[1:]:
        if not linea.strip():
            break
        m = re.match(r"^- (.+?): (.+)$", linea)
        if m:
            frases = re.findall(r"«([^»]+)»", m.group(2))
            if frases:
                salida[etiqueta_normal(m.group(1))] = frases
    return salida


def frases_del_reto(md, selector):
    etiqueta, _, n = selector.partition("#")
    frases = voz_del_reto(md).get(etiqueta)
    if not frases:
        raise SystemExit(f"El reto no tiene la frase «{etiqueta}»")
    return [frases[int(n) if n else 0]]


def descubrir_pistas():
    import glob
    pistas = {"comun-saludo": ("comun.md", "seccion", "Saludo de Alba", "alba")}
    for ruta in sorted(glob.glob(os.path.join(GUIONES, "parada-*.md"))):
        nombre = os.path.basename(ruta)
        pref = "p" + re.match(r"parada-(\d+)", nombre).group(1)
        pistas[f"{pref}-todos"] = (nombre, "seccion", "Para todos", "narrador")
        pistas[f"{pref}-peques"] = (nombre, "seccion", "Para peques", "alba")
        pistas[f"{pref}-mision"] = (nombre, "seccion", "Mira bien", "alba")
        for etiqueta, frases in voz_del_reto(open(ruta, encoding="utf-8").read()).items():
            base = f"{pref}-reto-{slug(etiqueta)}"
            if len(frases) == 1:
                pistas[base] = (nombre, "reto", etiqueta, "alba")
            else:
                for i in range(len(frases)):
                    pistas[f"{base}-{i + 1}"] = (nombre, "reto", f"{etiqueta}#{i}", "alba")
    return pistas


PISTAS = descubrir_pistas()


def en_frases(parrafos):
    """Mismo corte en frases que src/contenido/guion.ts (enFrases)."""
    salida = []
    for p in parrafos:
        salida += [f.strip() for f in re.split(r"(?<=[.!?…])\s+(?=[¡¿«A-ZÁÉÍÓÚÑ])", p) if f.strip()]
    return salida


def texto_de(clave):
    guion, tipo, selector, _ = PISTAS[clave]
    md = open(os.path.join(GUIONES, guion), encoding="utf-8").read()
    return seccion(md, selector) if tipo == "seccion" else frases_del_reto(md, selector)


# ------------------------------------------------ generación
#
# PAUSAS. Si se manda todo el texto de golpe, ElevenLabs apenas respira: medido el
# 25-sep-2026, Alba dejaba 0,10 s entre frases y el cambio de párrafo no se notaba.
# Así que cada párrafo se genera aparte (en trozos de hasta FRASES_POR_TROZO frases,
# unidas con etiquetas <break>, porque demasiadas etiquetas en una sola petición la
# vuelven inestable), se recorta a la voz según las marcas de tiempo y se pega con
# silencios de duración exacta. previous_text/next_text mantienen la entonación.

PAUSAS = {  # segundos
    "narrador": {"frase": 0.55, "pregunta": 0.8, "parrafo": 1.1},
    "alba": {"frase": 0.5, "pregunta": 1.0, "parrafo": 0.9},
}
FRASES_POR_TROZO = 4
FS = 44100


def ffmpeg():
    import imageio_ffmpeg  # pip install imageio-ffmpeg (trae su propio ffmpeg)
    return imageio_ffmpeg.get_ffmpeg_exe()


def mp3_a_muestras(datos):
    import numpy as np
    r = subprocess.run([ffmpeg(), "-loglevel", "error", "-i", "pipe:0", "-f", "s16le", "-ac", "1",
                        "-ar", str(FS), "pipe:1"], input=datos, capture_output=True, check=True)
    return np.frombuffer(r.stdout, np.int16)


def pausa_tras(frase, voz, tipo):
    p = PAUSAS[voz]
    if tipo == "parrafo":
        return max(p["parrafo"], p["pregunta"]) if frase.endswith("?") else p["parrafo"]
    return p["pregunta"] if frase.endswith("?") else p["frase"]


def etiqueta(segundos):
    return f' <break time="{segundos:.1f}s" /> '


def trozos_de(parrafos):
    """[(frases del trozo, ¿cierra párrafo?)] con como mucho FRASES_POR_TROZO frases."""
    salida = []
    for par in parrafos:
        frases = en_frases([par])
        for i in range(0, len(frases), FRASES_POR_TROZO):
            grupo = frases[i:i + FRASES_POR_TROZO]
            salida.append((grupo, i + FRASES_POR_TROZO >= len(frases)))
    return salida


def localizar(frases, alineacion):
    """Inicio y fin de cada frase dentro de un trozo, sea cual sea la forma en que
    ElevenLabs devuelva las etiquetas <break> en la alineación."""
    chars = alineacion["characters"]
    ini = alineacion["character_start_times_seconds"]
    fin = alineacion["character_end_times_seconds"]
    unido = "".join(chars)
    salida, cursor = [], 0
    for f in frases:
        pos = unido.find(f, cursor)
        if pos < 0:
            raise SystemExit(f"No encuentro «{f[:40]}…» en la alineación de ElevenLabs")
        ultimo = pos + len(f) - 1
        salida.append((f, ini[pos], fin[ultimo]))
        cursor = ultimo + 1
    return salida


def generar(clave):
    import numpy as np
    parrafos = texto_de(clave)
    nombre_voz = PISTAS[clave][3]
    voz = VOCES[nombre_voz]
    trozos = trozos_de(parrafos)
    planos = [pronunciar(" ".join(fr)) for fr, _ in trozos]
    piezas, frases_finales, t, caracteres = [], [], 0.0, 0
    for n, (frases, cierra) in enumerate(trozos):
        texto = ""
        for i, f in enumerate(frases):
            texto += pronunciar(f) + (etiqueta(pausa_tras(f, nombre_voz, "frase")) if i < len(frases) - 1 else "")
        cuerpo = {"text": texto.strip(), "model_id": MODELO, "voice_settings": voz["ajustes"]}
        if n > 0:
            cuerpo["previous_text"] = " ".join(planos[:n])[-600:]
        if n < len(planos) - 1:
            cuerpo["next_text"] = " ".join(planos[n + 1:])[:600]
        r = voces.peticion("POST", f"/v1/text-to-speech/{voz['voice_id']}/with-timestamps",
                           {"output_format": "mp3_44100_128"}, cuerpo=cuerpo, timeout=300)
        caracteres += len(cuerpo["text"])
        muestras = mp3_a_muestras(base64.b64decode(r["audio_base64"]))
        dichas = localizar([pronunciar(f) for f in frases], r["alignment"])
        situadas = [(f, i0, i1) for f, (_, i0, i1) in zip(frases, dichas)]
        a = max(0.0, situadas[0][1] - 0.04)
        b = min(len(muestras) / FS, situadas[-1][2] + 0.12)
        piezas.append(muestras[int(a * FS):int(b * FS)])
        for f, i0, i1 in situadas:
            frases_finales.append({"texto": f, "inicio": round(t + i0 - a, 3), "fin": round(t + i1 - a, 3)})
        t += b - a
        if n < len(trozos) - 1:
            silencio = pausa_tras(frases[-1], nombre_voz, "parrafo" if cierra else "frase")
            piezas.append(np.zeros(int(silencio * FS), np.int16))
            t += silencio
    os.makedirs(SALIDA, exist_ok=True)
    pcm = np.concatenate(piezas).tobytes()
    provisional = os.path.join(SALIDA, f"{clave}.nuevo.mp3")
    subprocess.run([ffmpeg(), "-y", "-loglevel", "error", "-f", "s16le", "-ar", str(FS), "-ac", "1",
                    "-i", "pipe:0", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", str(FS), "-ac", "1",
                    "-b:a", "64k", provisional], input=pcm, check=True)
    archivo = con_huella(provisional, clave)
    return {
        "archivo": archivo, "parrafos": parrafos, "frases": frases_finales,
        "duracion": round(t, 2),
        "voz": voz["nombre"], "voice_id": voz["voice_id"], "modelo": MODELO, "ajustes": voz["ajustes"],
        "pausas": PAUSAS[nombre_voz], "frases_por_trozo": FRASES_POR_TROZO,
        "caracteres": caracteres, "fecha": datetime.datetime.now().isoformat(timespec="seconds"),
    }


def con_huella(ruta, clave):
    """Renombra el MP3 a «clave.<huella>.mp3». El móvil guarda los audios para usarlos sin
    cobertura y no vuelve a pedir un fichero que ya tiene: si al regenerar una pista se
    mantuviera el nombre, seguiría sonando la versión vieja. Con la huella, cada versión es
    un fichero distinto."""
    import hashlib
    huella = hashlib.sha1(open(ruta, "rb").read()).hexdigest()[:8]
    archivo = f"{clave}.{huella}.mp3"
    os.replace(ruta, os.path.join(SALIDA, archivo))
    return archivo


def cargar_manifiesto():
    try:
        return json.load(open(MANIFIESTO, encoding="utf-8"))
    except FileNotFoundError:
        return {}


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    p = argparse.ArgumentParser(description="Genera los audios de la app desde los guiones")
    p.add_argument("--solo", help="genera solo esta pista")
    p.add_argument("--forzar", help="regenera esta pista aunque no haya cambiado ('todo' = todas)")
    p.add_argument("--lista", action="store_true", help="muestra las pistas y su estado, sin generar")
    p.add_argument("--parada", help="genera solo las pistas de esta parada (p. ej. 12)")
    args = p.parse_args()

    manifiesto = cargar_manifiesto()
    claves = [args.solo] if args.solo else list(PISTAS)
    if args.parada:
        claves = [c for c in claves if c.startswith(f"p{int(args.parada):02d}-")]
    gastado = 0
    for clave in claves:
        if clave not in PISTAS:
            raise SystemExit(f"No existe la pista «{clave}»")
        parrafos = texto_de(clave)
        previa = manifiesto.get(clave)
        al_dia = (previa and previa["parrafos"] == parrafos
                  and previa["voice_id"] == VOCES[PISTAS[clave][3]]["voice_id"]
                  and previa.get("pausas") == PAUSAS[PISTAS[clave][3]]
                  and os.path.exists(os.path.join(SALIDA, previa["archivo"])))
        forzada = args.forzar in (clave, "todo")
        if args.lista:
            print(f"{clave:22} {'al día' if al_dia else 'PENDIENTE'}  ({len(' '.join(parrafos))} caracteres)")
            continue
        if al_dia and not forzada:
            print(f"{clave:22} al día, no se regenera")
            continue
        try:
            manifiesto[clave] = generar(clave)
        except voces.ErrorApi as e:
            raise SystemExit(str(e))
        if previa and previa["archivo"] != manifiesto[clave]["archivo"]:
            viejo = os.path.join(SALIDA, previa["archivo"])
            if os.path.exists(viejo):
                os.remove(viejo)  # la versión anterior ya no la usa nadie
        gastado += manifiesto[clave]["caracteres"]
        with open(MANIFIESTO, "w", encoding="utf-8") as f:
            json.dump(manifiesto, f, ensure_ascii=False, indent=1)
        m = manifiesto[clave]
        print(f"{clave:22} generada: {m['duracion']:.1f} s, {len(m['frases'])} frases, voz {m['voz']}")
    if not args.lista:
        print(f"\nCaracteres enviados en esta tanda: {gastado}. Manifiesto: {MANIFIESTO}")


if __name__ == "__main__":
    main()
