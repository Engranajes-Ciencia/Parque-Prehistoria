# Pasa los audios ya hechos a la calidad de generar_audios.py (MP3 y CODIFICACION), sin
# volver a pedirlos a ElevenLabs: no gasta créditos. Solo convierte: el texto, los tiempos de
# las frases y la duración no cambian (medido el 27-sep: desfase de 0 ms).
#
# Cada fichero convertido lleva huella nueva en el nombre (el móvil descarga la versión
# nueva en vez de quedarse con la vieja), se apunta en el manifiesto y el viejo se borra.
# Las pistas que ya están en la calidad actual se saltan: se puede lanzar las veces que haga
# falta.
#
# OJO: convertir un MP3 en otro pierde algo más que generarlo directamente así. Hazlo desde
# los mejores originales que haya (la copia de 64 kbps del 27-sep está en
# _copias/2026-09-27-audio-64kbps/, con su manifiesto) y no encadenes conversiones.
#
#   python herramientas/convertir_audios.py            convierte lo que no esté al día
#   python herramientas/convertir_audios.py --lista    solo dice qué convertiría

import argparse
import json
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import generar_audios as g  # noqa: E402


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    p = argparse.ArgumentParser(description="Pasa los audios hechos a la calidad actual del generador")
    p.add_argument("--lista", action="store_true", help="solo muestra qué se convertiría")
    args = p.parse_args()

    manifiesto = g.cargar_manifiesto()
    antes = despues = hechas = 0
    for clave, pista in manifiesto.items():
        viejo = os.path.join(g.SALIDA, pista["archivo"])
        if pista.get("mp3") == g.CODIFICACION or not os.path.exists(viejo):
            continue
        if args.lista:
            print(f"{clave:26} {pista['archivo']}")
            continue
        provisional = os.path.join(g.SALIDA, f"{clave}.nuevo.mp3")
        subprocess.run([g.ffmpeg(), "-y", "-loglevel", "error", "-i", viejo,
                        "-ar", str(g.FS), "-ac", "1", *g.MP3, provisional], check=True)
        antes += os.path.getsize(viejo)
        despues += os.path.getsize(provisional)
        archivo = g.con_huella(provisional, clave)
        if archivo != pista["archivo"]:
            os.remove(viejo)
        pista["archivo"] = archivo
        pista["mp3"] = g.CODIFICACION
        hechas += 1
        # El manifiesto se guarda tras cada pista: si algo se corta, lo hecho queda apuntado.
        with open(g.MANIFIESTO, "w", encoding="utf-8") as f:
            json.dump(manifiesto, f, ensure_ascii=False, indent=1)
    if not args.lista:
        print(f"{hechas} pistas convertidas a {g.CODIFICACION}: {antes / 1e6:.1f} MB → {despues / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
