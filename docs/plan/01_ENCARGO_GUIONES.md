# Encargo común para escribir los guiones de una parada

Documento para quien escriba un guion nuevo (persona o agente). El guion de referencia es `contenido/guiones/parada-07-primeros-dinosaurios.md`: **léelo entero antes de empezar** y copia su estructura.

## Para qué sirve el guion

Es la **única fuente de texto** de la parada. La app muestra y locuta exactamente lo que hay en las citas (líneas que empiezan por `>`) de cada sección, y `herramientas/generar_audios.py` genera los audios de ElevenLabs a partir de las mismas líneas. Lo que no está citado (notas, tablas) no se lee en voz alta: es para Álvaro y para quien revise.

## Formato obligatorio (la app lo lee por los títulos)

```
# Parada N — Título

*Borrador 1 · FECHA · pendiente de revisión de Álvaro*

**Qué hay en la parada** (según las fotos X-Y; …). Dudas marcadas con **[VERIFICAR: …]**.

---

## Para todos (7 años en adelante) — voz del narrador
> …párrafos citados…

## Para peques (4-6 años) — voz de Alba
> …

## «¡Mira bien!» (misión de observación)
**Texto en pantalla y en voz de Alba:**
> …
(nota: cómo se responde, qué se busca)

## Reto: «Nombre del juego»
**Qué se ve / Qué se aprende / Cómo se gana** (breve)
**Voz de Alba:**
- Etiqueta exacta: «frase»
- Otra etiqueta: «frase» / «frase alternativa»

## ¿Sabías que…?
> …

## Datos y fuentes
| Afirmación | Dato | Base |

**Corregido respecto al guion antiguo:** …
```

- Las **etiquetas de la lista «Voz de Alba»** son las que te indique el encargo concreto, **al pie de la letra**: el código busca las frases por esas etiquetas.
- Un párrafo citado se separa del siguiente con una línea `>` vacía.
- **El narrador NO anuncia la parada** («Parada tres. La vida…»): la pantalla ya muestra número y título, y así una renumeración no obliga a regrabar. «Para todos» empieza directamente con la primera frase del contenido (decidido el 26-sep-2026).
- **Numeración:** desde el 26-sep-2026 el recorrido tiene 21 paradas (ver `v2/src/contenido/paradas.ts`, `RECORRIDO`). Los textos antiguos (`src/locales/es/pages.json`, `README.md`) y la clasificación de fotos usan la numeración **antigua**: el encargo concreto te dice cuál es la equivalencia.

## Reglas de escritura

- **Voz y estilo:** usa las skills `scicomm-prose-architect` (claridad de Asimov, asombro de Sagan, mirada de Harari), `metaphor-engine` y `asimov-guide-framework` (**el último párrafo de «Para todos» siembra la parada siguiente**). Tratamiento de **vosotros**, castellano de España.
- **Para el oído, no para el ojo:** se oye por el altavoz de un móvil, al aire libre. Frases cortas. **Cifras escritas con letras** («doscientos treinta millones»), sin porcentajes con símbolo, sin abreviaturas, sin paréntesis ni siglas.
- **Anclado a lo que se ve:** «mirad…», «fijaos en…», según las fotos. Si no estás seguro de cómo es algo en el parque, márcalo con **[VERIFICAR: …]** (la app lo borra al leer, pero Álvaro lo ve).
- **Duraciones:** «Para todos», de 250 a 380 palabras (entre 1,5 y 2,5 minutos). «Para peques», de 70 a 110 palabras, **una idea principal**, con Alba en primera persona como viajera del tiempo («lo sé porque he estado allí»), y terminando con una pregunta o una invitación al reto. Misión: de 30 a 60 palabras. Frases del reto: muy cortas (las oye un niño de 4 años mientras juega).
- **Misión «¡Mira bien!»:** algo que se haga en el mundo real, mirando o moviéndose. **Nada que obligue a cruzar una cuerda ni a tocar las maquetas.**
- **Rigor, prioridad absoluta** («del texto debe emanar la verdad»). Pasa `scientific-rigor-check` al final. Cada dato con cifra o atribución va en la tabla «Datos y fuentes» con su base. Si algo es debatido, el texto lo dice con una fórmula sencilla («probablemente», «los científicos aún discuten…») o lo evita. Corrige los errores del guion antiguo y anótalos en «Corregido respecto al guion antiguo».
- **Material de partida:** los textos antiguos de la parada están en `src/locales/es/pages.json` (clave con el número de parada, campo `avatarDialogo.mensaje`) y en `README.md` (sección de audios). Son orientativos y **tienen errores**: no los copies sin comprobar. Las fotos del parque están en `Mapa e imágenes de parque/Imágenes/` (clasificadas en `CLASIFICACION_PROPUESTA.md`).
- **Nombre del parque:** «Parque de Ciencias Prehistóricas» (el del cartel).
- **Juego del reto:** el encargo concreto te da la mecánica y las etiquetas. Los motores que existen son: arrastrar piezas a un destino (o tocar pieza y luego destino), ordenar tarjetas, rascar para descubrir, tocar zonas de una imagen y tocar repetidamente para llenar un medidor. Si propones cambios, que sean dentro de esas mecánicas.
- **Al terminar el reto, Alba dice primero la frase del último paso y después la de «Al terminar»**: que «Al terminar» no repita lo que ya dijo el último acierto.
- Escribe **solo** tu fichero de guion. No toques código ni otros ficheros.
