# Casting de voces (30-oct-2026): el mismo párrafo leído por varias combinaciones de voz y
# modelo, para que Álvaro elija de oído la más natural. Pidió que la voz «suene lo más
# realista posible, que no se note que es una IA».
#
# Deja los MP3 y una página para escucharlos en _muestras_voz_2026-10/ (fuera de git: el
# repositorio es público y no hay licencia para publicar muestras de voces ajenas).
#
#   python herramientas/casting_voces.py            genera lo que falte (gasta créditos)
#   python herramientas/casting_voces.py --lista    dice qué generaría y cuántos caracteres
#
# Las voces de la biblioteca se añaden solas a «Mis voces» (hace falta para usarlas por la API).

import argparse
import json
import os
import sys
import urllib.error
import urllib.request

PROYECTO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(PROYECTO, "herramientas"))
import generar_audios as g  # noqa: E402  (PRONUNCIACION y la clave)

SALIDA = os.path.join(PROYECTO, "_muestras_voz_2026-10")
CLAVE = open(os.path.join(os.path.dirname(os.path.dirname(PROYECTO)), "_secrets", "elevenlabs_KEY.txt")).read().strip()

# Párrafos reales de los guiones: uno de narrador (parada 12, con una pausa de suspense y una
# fecha) y uno de Alba (parada 12, para peques, con exclamaciones y una onomatopeya).
TEXTOS = {
    "narrador": (
        "El hallazgo empezó con una broma. En mil novecientos setenta y seis, unos científicos del equipo "
        "de Mary Leakey jugaban a tirarse boñigas secas de elefante. Uno se echó al suelo para esquivar "
        "una… y vio, delante de su nariz, huellas de animales en la roca. ¿Y sabéis qué apareció dos años "
        "después? Unas setenta pisadas de pies casi como los nuestros."
    ),
    "alba": (
        "Os cuento un secreto de viajera del tiempo: un volcán había llenado el suelo de ceniza, y una "
        "lluvia suave la dejó blandita, como el barro. Yo estaba escondida detrás de una roca… ¡y pasaron "
        "unos parientes nuestros, caminando de pie, como vosotros y como yo! Plaf, plaf, plaf. "
        "¿Me ayudáis a buscar sus pistas?"
    ),
}

# (clave, rol, nombre para la página, voice_id, propietario público o None si ya es nuestra, modelo)
MUESTRAS = [
    ("n1-richar-v2", "narrador", "El Richar (la voz de ahora) · modelo de ahora", "WeuNkKS3AvTwCZZERkQa", None, "eleven_multilingual_v2"),
    ("n2-richar-v4", "narrador", "El Richar (la voz de ahora) · Eleven v4", "WeuNkKS3AvTwCZZERkQa", None, "eleven_v4"),
    ("n3-aaron-v4", "narrador", "Aaron Abad (locutor profesional, castellano) · Eleven v4", "t9LRTh3y1ioN00e9wsNh", "7127325d", "eleven_v4"),
    ("n4-osborne-v4", "narrador", "Martin Osborne, cálido · Eleven v4", "W5JElH3dK1UYYAiHH7uh", "e9a6840c", "eleven_v4"),
    ("n5-emilio-v4", "narrador", "Emilio (voz profesional de España) · Eleven v4", "ZCh4e9eZSUf41K4cmCEL", "d97eb7b2", "eleven_v4"),
    ("n6-hernan-v4", "narrador", "Hernán (locutor profesional, grave y pausado) · Eleven v4", "sDuUJMeNJR828mXTRrDh", "f9a6afaf", "eleven_v4"),
    ("n7-eva-v4", "narrador", "Eva Dorado (narradora) · Eleven v4", "RgXx32WYOGrd7gFNifSf", "8be4c94c", "eleven_v4"),
    ("a1-alba-v2", "alba", "Alba (la voz de ahora) · modelo de ahora", "OOHm6M5O6WPl7E4nAqyE", None, "eleven_multilingual_v2"),
    ("a2-alba-v4", "alba", "Alba (la voz de ahora) · Eleven v4", "OOHm6M5O6WPl7E4nAqyE", None, "eleven_v4"),
    ("a3-loida-v4", "alba", "Loida Burgos (locutora profesional, joven) · Eleven v4", "HYlEvvU9GMan5YdjFYpg", "33432244", "eleven_v4"),
    ("a4-raquel-v4", "alba", "Raquel (joven y alegre) · Eleven v4", "1eHrpOW5l98cxiSRjbzJ", "8005ecb7", "eleven_v4"),
    ("a5-laura-v4", "alba", "Laura López (locutora profesional, joven) · Eleven v4", "yiWEefwu5z3DQCM79clN", "8be4c94c", "eleven_v4"),
]

AJUSTES = {
    "eleven_multilingual_v2": {  # los de ahora, del manifiesto
        "narrador": {"stability": 0.49, "similarity_boost": 0.43, "style": 0.0, "use_speaker_boost": True},
        "alba": None,  # se leen del generador
    },
    # En v4 no hay «style» ni «speed»: estabilidad media (natural) y parecido alto.
    "eleven_v4": {"narrador": {"stability": 0.5, "similarity_boost": 0.75}, "alba": {"stability": 0.5, "similarity_boost": 0.75}},
}


def peticion(metodo, ruta, cuerpo=None):
    datos = json.dumps(cuerpo).encode() if cuerpo is not None else None
    r = urllib.request.Request("https://api.elevenlabs.io" + ruta, data=datos, method=metodo,
                               headers={"xi-api-key": CLAVE, "Content-Type": "application/json"})
    with urllib.request.urlopen(r, timeout=180) as f:
        return json.load(f), dict(f.headers)


def hablar(voz, cuerpo):
    """MP3 de la voz (bytes) y las cabeceras de la respuesta (coste en créditos)."""
    r = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{voz}?output_format=mp3_44100_128",
                               data=json.dumps(cuerpo).encode(), method="POST",
                               headers={"xi-api-key": CLAVE, "Content-Type": "application/json"})
    with urllib.request.urlopen(r, timeout=180) as f:
        return f.read(), dict(f.headers)


def mis_voces():
    r, _ = peticion("GET", "/v1/voices")
    return {v["voice_id"] for v in r.get("voices", [])}


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    p = argparse.ArgumentParser()
    p.add_argument("--lista", action="store_true")
    args = p.parse_args()
    os.makedirs(SALIDA, exist_ok=True)
    total = 0
    tengo = None if args.lista else mis_voces()
    for clave, rol, nombre, voz, dueno, modelo in MUESTRAS:
        texto = g.pronunciar(TEXTOS[rol])
        destino = os.path.join(SALIDA, clave + ".mp3")
        if os.path.exists(destino):
            print(f"{clave:16} ya está")
            continue
        total += len(texto)
        if args.lista:
            print(f"{clave:16} {len(texto)} caracteres · {nombre}")
            continue
        if dueno and voz not in tengo:
            peticion("POST", f"/v1/voices/add/{dueno_completo(dueno, voz)}/{voz}", {"new_name": f"Casting {clave}"})
            tengo.add(voz)
        ajustes = AJUSTES[modelo][rol]
        if ajustes is None:
            ajustes = g.VOCES[rol]["ajustes"]
        cuerpo = {"text": texto, "model_id": modelo, "voice_settings": ajustes}
        try:
            mp3, h = hablar(voz, cuerpo)
        except urllib.error.HTTPError as e:
            print(f"{clave:16} ERROR {e.code}: {e.read().decode()[:300]}")
            continue
        with open(destino, "wb") as f:
            f.write(mp3)
        print(f"{clave:16} {len(texto)} caracteres, coste {h.get('character-cost')} · {nombre}")
    print(f"\nCaracteres de esta tanda: {total}")
    if not args.lista:
        pagina()


DUENOS = {
    "t9LRTh3y1ioN00e9wsNh": "7127325de7c126ec8432af88ad90ac469e17cbadb890ca54b1ba95d9ca08bfd2",
    "W5JElH3dK1UYYAiHH7uh": "e9a6840c69b79812b77ea81fa11d55aaf80dcf1938fa0137bf7f514f67f75c99",
    "sDuUJMeNJR828mXTRrDh": "f9a6afaf35adb5210de52be24c76e56f11554978474a2ef938437ac51ecae891",
    "ZCh4e9eZSUf41K4cmCEL": "d97eb7b2d527bfd6f9f645acee9f059e3658a3a214c7f73d34032d608fa7c01b",
    "RgXx32WYOGrd7gFNifSf": "8be4c94ccd12f5d94d1e5ea17b85defec88a912da3b62c7c21d1688d924c5e2e",
    "HYlEvvU9GMan5YdjFYpg": "334322440a4c41928c35360d9419666f56f254066a7c93c483c30eb2f7223151",
    "1eHrpOW5l98cxiSRjbzJ": "8005ecb7e09304a696e5bd13cef3b170ee24f7988d7312352f842d7e07411e49",
    "yiWEefwu5z3DQCM79clN": "8be4c94ccd12f5d94d1e5ea17b85defec88a912da3b62c7c21d1688d924c5e2e"
}


def dueno_completo(prefijo, voz):
    """El id público completo del propietario (en MUESTRAS solo va el prefijo, para leerlo mejor)."""
    if voz in DUENOS:
        return DUENOS[voz]
    import urllib.parse
    r, _ = peticion("GET", "/v1/shared-voices?" + urllib.parse.urlencode({"search": "", "page_size": 100, "language": "es"}))
    for v in r.get("voices", []):
        DUENOS[v["voice_id"]] = v["public_owner_id"]
    if voz not in DUENOS:
        raise SystemExit(f"No encuentro el propietario de la voz {voz} ({prefijo})")
    return DUENOS[voz]


def pagina():
    filas = []
    for rol, titulo in (("narrador", "Narrador («Para todos»)"), ("alba", "Alba (peques y juegos)")):
        filas.append(f"<h2>{titulo}</h2><p class='texto'>{TEXTOS[rol]}</p>")
        for clave, r, nombre, *_ in MUESTRAS:
            if r == rol and os.path.exists(os.path.join(SALIDA, clave + ".mp3")):
                filas.append(f"<div class='m'><b>{clave[:2].upper()}</b> {nombre}<br><audio controls preload='none' src='{clave}.mp3'></audio></div>")
    html = """<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Casting de voces</title><style>body{font:16px system-ui;max-width:720px;margin:20px auto;padding:0 16px;color:#1f2a2e;background:#fbf3e4}
h1{font-size:1.4rem}.texto{font-style:italic;color:#4a5a60}.m{background:#fff;border-radius:12px;padding:10px 12px;margin:10px 0}audio{width:100%;margin-top:6px}</style>
<h1>Casting de voces · 30-oct-2026</h1><p>El mismo texto leído por cada combinación de voz y modelo. Las dos primeras de cada bloque son las voces de ahora: la del modelo de ahora y la del modelo nuevo, Eleven v4. Dime cuál te suena más natural (o si ninguna).</p>
""" + "\n".join(filas)
    with open(os.path.join(SALIDA, "escuchar.html"), "w", encoding="utf-8") as f:
        f.write(html)
    print("Página:", os.path.join(SALIDA, "escuchar.html"))


if __name__ == "__main__":
    main()
