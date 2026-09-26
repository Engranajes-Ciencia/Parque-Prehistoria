# Herramienta de voces (ElevenLabs) para la app del Parque de la Prehistoria.
#
# La idea central es que la voz quede ANCLADA: cada audio que se genere deja al lado
# un .json con la voz, el modelo, los ajustes y el texto exactos que lo produjeron.
# Asi, dentro de dos anos, una parada nueva puede sonar igual que las demas.
#
# CLAVE: se lee de la variable de entorno ELEVENLABS_API_KEY o, si no esta, del
# fichero ANTIGRAVITY\_secrets\elevenlabs_KEY.txt (fuera del repositorio, para que
# nunca acabe en GitHub). Solo hace falta un fichero de texto con la clave dentro.
#
# USO (desde la carpeta del proyecto)
#   python herramientas/voces.py historial
#       Que voces se usaron en tu cuenta y para que textos. Sirve para recuperar
#       la voz de los audios originales. No gasta creditos.
#   python herramientas/voces.py voces
#       Las voces que tienes en "Mis voces". No gasta creditos.
#   python herramientas/voces.py buscar [--genero female|male] [--edad young|middle_aged|old] [--acento ...]
#       Busca en la biblioteca publica voces en espanol y descarga sus audios de
#       muestra para escucharlos. No gasta creditos.
#   python herramientas/voces.py anadir PROPIETARIO:VOZ --nombre "Alba candidata 1"
#       Anade a "Mis voces" una voz de la biblioteca publica (necesario para usarla).
#   python herramientas/voces.py muestras --rol narrador|alba --voces ID1,ID2,...
#       Genera con cada voz el mismo texto de prueba (parada 7). SI gasta creditos
#       (unos 450-600 caracteres por voz); antes de gastar, dice cuantos.
#   python herramientas/voces.py disenar --rol alba --descripcion "..." [--etiqueta x]
#       Crea voces NUEVAS a partir de una descripcion (Voice Design): tres candidatas
#       leyendo el texto de prueba del rol. SI gasta creditos; al final dice cuantos.
#   python herramientas/voces.py guardar <generated_voice_id> --nombre "Alba" --descripcion "..."
#       Guarda en "Mis voces" la candidata elegida.
#
# Solo usa la biblioteca estandar de Python: no hay que instalar nada.

import argparse
import base64
import datetime
import hashlib
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

PROYECTO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ANTIGRAVITY = os.path.dirname(os.path.dirname(PROYECTO))
FICHERO_CLAVE = os.path.join(ANTIGRAVITY, "_secrets", "elevenlabs_KEY.txt")
SALIDA_MUESTRAS = os.path.join(PROYECTO, "herramientas", "muestras_voz")
API = "https://api.elevenlabs.io"

MODELO_POR_DEFECTO = "eleven_multilingual_v2"
AJUSTES_POR_DEFECTO = {"stability": 0.5, "similarity_boost": 0.75, "style": 0.0, "use_speaker_boost": True}

# Textos de prueba: los mismos para todas las voces, para comparar solo la voz.
# Salen del guion de la parada 7 (contenido/guiones/parada-07-primeros-dinosaurios.md).
TEXTOS_PRUEBA = {
    "narrador": (
        "Parada siete. Los primeros dinosaurios. "
        "Para entender a los dinosaurios hay que empezar por una catástrofe. Hace doscientos "
        "cincuenta y dos millones de años, unas erupciones volcánicas gigantescas cambiaron el "
        "clima de todo el planeta. Fue la mayor extinción de la historia: desaparecieron más de "
        "ocho de cada diez especies del mar, y muchísimas de tierra firme. "
        "Y ahora, la sorpresa. Aunque aquí estén a pocos metros, estos dos animales nunca se "
        "conocieron. Entre uno y otro pasaron más de ochenta millones de años. Es decir: el "
        "triceratops vivió más cerca de nosotros que del brontosaurio."
    ),
    "alba": (
        "¡Hola, exploradores! Soy Alba, la viajera del tiempo. "
        "¿Veis ese dinosaurio con cuernos? Es un triceratops. Vamos a contarlos juntos: uno… "
        "dos… ¡y tres! Tenía un pico, como los loros, y solo comía plantas. "
        "Os cuento un secreto de viajera del tiempo: aunque aquí estén juntos, estos dos nunca "
        "se conocieron. ¡Vivieron en épocas muy, muy distintas! "
        "Y ahora, una pregunta: ¿quién llegaba a las hojas más altas de los árboles? "
        "¡Descubridlo en el reto!"
    ),
}


def aviso(msg):
    print(msg, flush=True)


def clave_api():
    clave = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not clave and os.path.isfile(FICHERO_CLAVE):
        with open(FICHERO_CLAVE, encoding="utf-8-sig") as f:
            clave = f.read().strip()
    if not clave:
        aviso("No encuentro la clave de ElevenLabs.")
        aviso("Crea el fichero " + FICHERO_CLAVE)
        aviso("con la clave dentro (solo la clave, en una línea) y vuelve a lanzar la orden.")
        sys.exit(1)
    return clave


class ErrorApi(Exception):
    pass


def peticion(metodo, ruta, parametros=None, cuerpo=None, acepta="application/json", timeout=120):
    url = API + ruta
    if parametros:
        url += "?" + urllib.parse.urlencode({k: v for k, v in parametros.items() if v not in (None, "")})
    datos = json.dumps(cuerpo).encode("utf-8") if cuerpo is not None else None
    cabeceras = {"xi-api-key": clave_api(), "Accept": acepta}
    if datos is not None:
        cabeceras["Content-Type"] = "application/json"
    pet = urllib.request.Request(url, data=datos, method=metodo, headers=cabeceras)
    try:
        with urllib.request.urlopen(pet, timeout=timeout) as r:
            contenido = r.read()
    except urllib.error.HTTPError as e:
        detalle = e.read().decode("utf-8", "replace")[:500]
        raise ErrorApi(f"ElevenLabs respondió {e.code} a {metodo} {ruta}: {detalle}") from None
    except urllib.error.URLError as e:
        raise ErrorApi(f"No se pudo conectar con ElevenLabs: {e.reason}") from None
    if acepta == "application/json":
        return json.loads(contenido.decode("utf-8"))
    return contenido


def descargar(url, destino, timeout=60):
    with urllib.request.urlopen(urllib.request.Request(url), timeout=timeout) as r:
        with open(destino, "wb") as f:
            f.write(r.read())


def seguro(nombre):
    return re.sub(r"[^\w\-]+", "_", nombre, flags=re.UNICODE).strip("_")[:60] or "voz"


# ---------------------------------------------------------------- historial

def cmd_historial(args):
    elementos, desde = [], None
    while True:
        r = peticion("GET", "/v1/history", {"page_size": 1000, "start_after_history_item_id": desde})
        elementos += r.get("history", [])
        if not r.get("has_more") or not r.get("last_history_item_id"):
            break
        desde = r["last_history_item_id"]
    if not elementos:
        aviso("El historial de la cuenta está vacío (ElevenLabs puede haber borrado lo antiguo).")
        return
    por_voz = {}
    for e in elementos:
        clave = (e.get("voice_id"), e.get("voice_name"))
        por_voz.setdefault(clave, []).append(e)
    pistas = re.compile(r"parada|dinosaur|prehist|triceratops|atapuerca|neandertal|stonehenge", re.I)
    aviso(f"{len(elementos)} generaciones en el historial, con {len(por_voz)} voces distintas.\n")
    for (vid, nombre), lista in sorted(por_voz.items(), key=lambda kv: -len(kv[1])):
        del_parque = [e for e in lista if pistas.search(e.get("text") or "")]
        fechas = sorted(e.get("date_unix") or 0 for e in lista)
        f0 = datetime.date.fromtimestamp(fechas[0]).isoformat() if fechas[0] else "?"
        f1 = datetime.date.fromtimestamp(fechas[-1]).isoformat() if fechas[-1] else "?"
        modelos = sorted({e.get("model_id") or "?" for e in lista})
        marca = "  <-- usada en textos del parque" if del_parque else ""
        aviso(f"- {nombre}  (id {vid}){marca}")
        aviso(f"    {len(lista)} audios, del {f0} al {f1}; modelos: {', '.join(modelos)}")
        for e in del_parque[:3]:
            aviso("    · «" + (e.get("text") or "")[:90].replace("\n", " ") + "…»")
    ruta = os.path.join(SALIDA_MUESTRAS, "historial.json")
    os.makedirs(SALIDA_MUESTRAS, exist_ok=True)
    with open(ruta, "w", encoding="utf-8") as f:
        json.dump(elementos, f, ensure_ascii=False, indent=1)
    aviso(f"\nHistorial completo guardado en {ruta}")


# ---------------------------------------------------------------- voces

def cmd_voces(args):
    r = peticion("GET", "/v1/voices")
    for v in sorted(r.get("voices", []), key=lambda v: (v.get("category") or "", v.get("name") or "")):
        etiquetas = ", ".join(f"{k}={val}" for k, val in (v.get("labels") or {}).items())
        aviso(f"- {v.get('name')}  (id {v.get('voice_id')}, {v.get('category')})  {etiquetas}")


# ---------------------------------------------------------------- buscar

def cmd_buscar(args):
    r = peticion("GET", "/v1/shared-voices", {
        "page_size": args.cuantas, "language": "es", "gender": args.genero,
        "age": args.edad, "accent": args.acento, "search": args.texto,
    })
    voces = r.get("voices", [])
    if not voces:
        aviso("Ninguna voz coincide con esos filtros.")
        return
    carpeta = os.path.join(SALIDA_MUESTRAS, "biblioteca")
    os.makedirs(carpeta, exist_ok=True)
    indice = []
    for v in voces:
        nombre = seguro(v.get("name") or "voz")
        ref = f"{v.get('public_owner_id')}:{v.get('voice_id')}"
        fichero = f"{nombre}__{v.get('voice_id')}.mp3"
        if v.get("preview_url"):
            try:
                descargar(v["preview_url"], os.path.join(carpeta, fichero))
            except Exception as e:  # una muestra caída no debe parar la búsqueda
                fichero = f"(no se pudo descargar: {e})"
        indice.append({"nombre": v.get("name"), "ref_para_anadir": ref, "acento": v.get("accent"),
                       "genero": v.get("gender"), "edad": v.get("age"),
                       "descripcion": v.get("description"), "muestra": fichero})
        aviso(f"- {v.get('name')}  [{v.get('accent')}, {v.get('gender')}, {v.get('age')}]  -> {fichero}")
    with open(os.path.join(carpeta, "indice.json"), "w", encoding="utf-8") as f:
        json.dump(indice, f, ensure_ascii=False, indent=1)
    aviso(f"\nMuestras e índice en {carpeta}")
    aviso("Para usar una: python herramientas/voces.py anadir <ref_para_anadir> --nombre \"...\"")


def cmd_anadir(args):
    propietario, _, voz = args.ref.partition(":")
    if not voz:
        aviso("La referencia tiene la forma PROPIETARIO:VOZ (columna ref_para_anadir del índice).")
        sys.exit(1)
    r = peticion("POST", f"/v1/voices/add/{propietario}/{voz}", cuerpo={"new_name": args.nombre})
    aviso(f"Añadida a «Mis voces» como «{args.nombre}» con id {r.get('voice_id')}")


# ---------------------------------------------------------------- muestras

def cmd_muestras(args):
    texto = TEXTOS_PRUEBA[args.rol]
    ids = [i.strip() for i in args.voces.split(",") if i.strip()]
    aviso(f"Se van a generar {len(ids)} muestras de {len(texto)} caracteres: "
          f"unos {len(texto) * len(ids)} caracteres de tu cuota.")
    nombres = {v["voice_id"]: v.get("name") for v in peticion("GET", "/v1/voices").get("voices", [])}
    carpeta = os.path.join(SALIDA_MUESTRAS, args.rol)
    os.makedirs(carpeta, exist_ok=True)
    for vid in ids:
        base = os.path.join(carpeta, f"{seguro(nombres.get(vid, vid))}__{vid}")
        audio = peticion("POST", f"/v1/text-to-speech/{vid}", {"output_format": "mp3_44100_128"},
                         cuerpo={"text": texto, "model_id": args.modelo, "voice_settings": AJUSTES_POR_DEFECTO},
                         acepta="audio/mpeg")
        with open(base + ".mp3", "wb") as f:
            f.write(audio)
        # El ancla: todo lo necesario para volver a producir exactamente este audio.
        with open(base + ".json", "w", encoding="utf-8") as f:
            json.dump({"voice_id": vid, "voice_name": nombres.get(vid), "model_id": args.modelo,
                       "voice_settings": AJUSTES_POR_DEFECTO, "texto": texto,
                       "sha1_texto": hashlib.sha1(texto.encode("utf-8")).hexdigest(),
                       "fecha": datetime.datetime.now().isoformat(timespec="seconds")},
                      f, ensure_ascii=False, indent=1)
        aviso(f"- {nombres.get(vid, vid)} -> {os.path.basename(base)}.mp3")
    aviso(f"\nMuestras en {carpeta}")


# ---------------------------------------------------------------- diseñar voces nuevas

def creditos():
    """(usados, límite), o (None, None) si la clave no tiene el permiso user_read."""
    try:
        r = peticion("GET", "/v1/user/subscription")
    except ErrorApi:
        return None, None
    return r.get("character_count", 0), r.get("character_limit", 0)


def cmd_disenar(args):
    """Crea voces candidatas a partir de una descripción (Voice Design). Cada llamada
    devuelve varias previsualizaciones leyendo el texto de prueba del rol."""
    texto = TEXTOS_PRUEBA[args.rol]
    usados0, limite = creditos()
    r = peticion("POST", "/v1/text-to-voice/design", cuerpo={
        "voice_description": args.descripcion, "text": texto, "model_id": args.modelo,
    }, timeout=240)
    carpeta = os.path.join(SALIDA_MUESTRAS, f"diseno_{args.rol}")
    os.makedirs(carpeta, exist_ok=True)
    marca = datetime.datetime.now().strftime("%H%M%S")
    for i, prev in enumerate(r.get("previews", []), 1):
        base = os.path.join(carpeta, f"{args.etiqueta}_{marca}_{i}")
        with open(base + ".mp3", "wb") as f:
            f.write(base64.b64decode(prev["audio_base_64"]))
        with open(base + ".json", "w", encoding="utf-8") as f:
            json.dump({"generated_voice_id": prev["generated_voice_id"], "descripcion": args.descripcion,
                       "modelo_diseno": args.modelo, "texto": texto,
                       "duracion": prev.get("duration_secs")}, f, ensure_ascii=False, indent=1)
        aviso(f"- {os.path.basename(base)}.mp3  ({prev.get('duration_secs', 0):.1f} s)  id {prev['generated_voice_id']}")
    usados1, _ = creditos()
    if usados0 is not None:
        aviso(f"\nCréditos gastados: {usados1 - usados0} (quedan {limite - usados1} de {limite}).")
    aviso(f"Carpeta: {carpeta}")
    aviso("Para quedarte una: python herramientas/voces.py guardar <id> --nombre \"...\" --descripcion \"...\"")


def cmd_guardar(args):
    r = peticion("POST", "/v1/text-to-voice", cuerpo={
        "voice_name": args.nombre, "voice_description": args.descripcion,
        "generated_voice_id": args.id,
    })
    aviso(f"Guardada en «Mis voces» como «{r.get('name')}» con id {r.get('voice_id')}")


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    p = argparse.ArgumentParser(description="Voces de ElevenLabs para la app del Parque de la Prehistoria")
    sub = p.add_subparsers(dest="orden", required=True)
    sub.add_parser("historial", help="voces usadas en la cuenta (recupera la voz original)")
    sub.add_parser("voces", help="lista de «Mis voces»")
    b = sub.add_parser("buscar", help="buscar voces en español en la biblioteca pública")
    b.add_argument("--genero", choices=["female", "male"])
    b.add_argument("--edad", choices=["young", "middle_aged", "old"])
    b.add_argument("--acento", help="p. ej. peninsular, castilian, spain (depende de cómo lo etiquete ElevenLabs)")
    b.add_argument("--texto", help="palabras a buscar en el nombre o la descripción")
    b.add_argument("--cuantas", type=int, default=20)
    a = sub.add_parser("anadir", help="añadir a «Mis voces» una voz de la biblioteca")
    a.add_argument("ref", help="PROPIETARIO:VOZ, del índice de «buscar»")
    a.add_argument("--nombre", required=True)
    m = sub.add_parser("muestras", help="generar el texto de prueba con varias voces")
    m.add_argument("--rol", choices=list(TEXTOS_PRUEBA), required=True)
    m.add_argument("--voces", required=True, help="ids separados por comas")
    m.add_argument("--modelo", default=MODELO_POR_DEFECTO)
    d = sub.add_parser("disenar", help="crear voces candidatas a partir de una descripción")
    d.add_argument("--rol", choices=list(TEXTOS_PRUEBA), required=True)
    d.add_argument("--descripcion", required=True, help="cómo es la voz (mejor en inglés)")
    d.add_argument("--etiqueta", default="candidata", help="prefijo de los ficheros")
    d.add_argument("--modelo", default="eleven_multilingual_ttv_v2")
    g = sub.add_parser("guardar", help="guardar en «Mis voces» una voz diseñada")
    g.add_argument("id", help="generated_voice_id de la candidata elegida")
    g.add_argument("--nombre", required=True)
    g.add_argument("--descripcion", required=True)
    args = p.parse_args()
    try:
        {"historial": cmd_historial, "voces": cmd_voces, "buscar": cmd_buscar,
         "anadir": cmd_anadir, "muestras": cmd_muestras,
         "disenar": cmd_disenar, "guardar": cmd_guardar}[args.orden](args)
    except ErrorApi as e:
        aviso(str(e))
        sys.exit(2)


if __name__ == "__main__":
    main()
