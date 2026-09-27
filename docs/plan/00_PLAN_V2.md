# Parque de la Prehistoria — plan de la versión 2

*Propuesta inicial, 24-sep-2026. Actualizada el mismo día con las primeras respuestas de Álvaro.*

## Estado y decisiones tomadas

**Decidido por Álvaro (24-sep-2026):**
- **Guía para los peques: una chica viajera del tiempo.** Nombre provisional: **Alba** (ficha en `arte/00_INSTRUCCIONES_PARA_CHATGPT.md`, sección 2).
- **Solo en español.** Nada de inglés por ahora.
- **Las imágenes las genera ChatGPT** (Álvaro tiene la suscripción) siguiendo `arte/00_INSTRUCCIONES_PARA_CHATGPT.md`. Claude mantiene ese documento, revisa cada imagen (anatomía, coherencia de Alba, sin texto) y pide que se rehaga lo que no pase.
- **Voz: ElevenLabs**, la cuenta de Álvaro. Los audios originales se hicieron ahí, así que el historial de la cuenta puede decir qué voz se usó (`herramientas/voces.py historial`).
- **Hay cobertura en el parque, pero mala:** el modo sin conexión es imprescindible, no un extra.
- **Los grupos escolares van siempre con monitores:** la app no los tiene en cuenta. Público = familias.
- **Los ficheros `*ENG.mp3` son la versión infantil** porque era la forma más rápida de reconvertir los audios en inglés. Irrelevante para la v2: todo el audio se rehace.
- **Cambios del parque y fotos:** Álvaro los está recopilando. Mientras tanto, pruebas que no dependan del mapa actualizado.

**Parada piloto: la 7 (Los primeros dinosaurios).** Es la que más engancha a los niños y la que menos probabilidades tiene de haber cambiado. Guiones en `contenido/guiones/parada-07-primeros-dinosaurios.md` (borrador 1, con control de rigor).

**Hecho el 25-sep-2026:**
- **Estilo elegido: el 1 (cartoon limpio).** Lote 2 de Alba (giro, expresiones, 6 poses) **aprobado**; recortes transparentes en `arte/aprobado/alba/`.
- **Material del parque recibido** en `Mapa e imágenes de parque/`: 106 fotos (dic-2024, abr-2025, may-2026) y el mapa en varias versiones (con números, sin elementos, **plano con las dimensiones reales**, recorrido y los elementos sueltos). Clasificación propuesta en `Imágenes/CLASIFICACION_PROPUESTA.md`.
- Las fotos de mayo de 2026 muestran **elementos nuevos** que no están en el mapa ni en los guiones: un cráter, una gran zona azul con rocas y los fósiles de trilobites y amonites, huesos junto a un hogar, fósiles de pez y Meganeura en el suelo, icnitas. Probablemente son las paradas cambiadas: **pendiente de que Álvaro lo confirme**.
- El cartel del parque dice **«Parque de Ciencias Prehistóricas»**: la app v2 usa ese nombre (pendiente de confirmar).
- Guion de la parada 7, borrador 2: misión cambiada (los dinosaurios están tras una cuerda) y regla de reparto en el juego (dar un helecho al brontosaurio no es un «error»).
- **Rebanada vertical construida en `v2/`** (ver sección 2) y probada en el navegador con tamaño de móvil: portada con Alba y la pregunta de los peques, recorrido provisional (lista), parada 7 con locución y subtítulos que resaltan la frase, misión «¡Mira bien!», reto «¿Quién come qué?» (arrastrar o tocar), pegatina y álbum. **Provisional:** voz del navegador en vez de ElevenLabs, dinosaurios y comida dibujados a mano o con emojis, ilustración del lote 1.
- Lote 3 de imágenes (todo lo de la parada 7) **activado** en las instrucciones de ChatGPT.

**Hecho el 25-sep (tarde):** lote 3 aprobado e integrado (pegatina reparada; la portada `D1` no está en estilo cartoon, Álvaro decide). **Voces:** Alba diseñada por Álvaro en la web («Alba Guía Prehistoria»); narrador provisional «El Richar atenboru» (voz de la cuenta, NO la de los audios originales, que salieron de otra cuenta). **Parada 7 con audio real completo** (12 pistas: explicaciones, misión, frases del juego y saludo), subtítulos sincronizados con los tiempos reales y pausa/reanudar. Generador: `herramientas/generar_audios.py`.

**Hecho el 25-sep (noche), trabajo desatendido:**
- **Pausas naturales** en los audios (medido: Alba pasaba de 0,10 s entre frases a 0,5-1,5 s; el narrador, de 0,17-0,95 a 0,56-1,12), sin acelerones ni etiquetas leídas. Parada 7 regenerada.
- **Seis paradas más con guion, misión, reto y juego**: 2 (Fábrica de oxígeno), 12 (¡A excavar!), 15 (Tu mano en la cueva), 17 (¿De dónde viene?), 18 (Descubre el mural, sobre la foto real del mural) y 20 (Amanecer del solsticio). Guiones escritos por agentes con `docs/plan/01_ENCARGO_GUIONES.md` y revisados; cada uno con sus [VERIFICAR] y sus dudas de rigor anotadas. Todos los juegos probados en el navegador con tamaño de móvil.
- Estructura común de juegos (`MarcoReto`, `useArrastre`), claves de audio deducidas de las etiquetas, **modo sin cobertura** (PWA + «Descargar la visita»).
- Lote 4 de imágenes preparado para ChatGPT (animales de la domesticación, pegatinas y portadas de las seis paradas, Alba señalando a la izquierda).

**Hecho el 26-sep-2026:**
- **Recorrido nuevo confirmado por Álvaro: 21 paradas + la X secreta del pozo** (entre la 17 y la 18). Lo hecho se renumeró (12→13, 15→16, 17→18, 18→19, 20→21) con migración del progreso guardado.
- **Las 21 paradas y la secreta, con guion, misión, reto, juego, arte (lotes 4 a 7) y voces** (210 pistas, unos 43 MB). Mapa M3 (lote 5 bis, hecho a mano por Álvaro) en la pantalla del recorrido, con editor de marcas en `#/mapa-editar`.
- Revisión de rigor de todos los guiones: 30 correcciones, regrabadas por párrafos (regeneración parcial: 9.066 caracteres en vez de ~35.000).
- Navegación «siguiente/anterior» entre paradas y **fin del viaje**: despedida de Alba, recuento de pegatinas y **diploma** con el nombre (imagen para compartir o guardar).
- **Primer push de la v2 hecho por Álvaro**: publicada en `https://engranajes-ciencia.github.io/Parque-Prehistoria/v2/`; probada en su móvil («va genial»).

**Noche del 26 al 27-sep, revisión desatendida** (parte en `ANTIGRAVITY/_PARTES/`):
- Voz y visita sin cobertura rehechas y **probadas sin red** con un banco de pruebas propio (`herramientas/prueba-sin-red/`, seis escenarios).
- «Atrás» del móvil sin bucles; red de seguridad por pantalla; **comprobación antes de publicar** dentro de `npm run build` (si un guion se rompe, no se publica).
- Móviles viejos (iOS 15) y pantallas de 320 px; accesibilidad (contraste, hojas modales, zonas de toque de 44 px, toque cercano en el mapa).
- Juegos más robustos (varios dedos, tesoros simultáneos en Atapuerca, Piedra del Talón) y diploma sin solapes.
- La app pesa la mitad (779 → 450 kB): al compilar, los guiones llegan sin sus notas y fuentes.
- Revisión de los 21 juegos (agente + verificación): sombras solapadas en los puzles, juegos que caben en pantallas bajas (con desplazamiento automático al arrastrar), cerezas en la hoja final de la 6, último acierto de la 7, 🔊 en Atapuerca.

**Hecho el 27-sep (mañana):** lote 7 bis integrado (mitos sin cruz; Laetoli con dos rastros); frase de inicio del juego de la 7 corregida; audio a tasa variable (VBR q7): la descarga baja de 49,5 a 39,7 MB sin regenerar nada.

**Pendiente (27-sep):** push de Álvaro · escuchar nombres propios que no están en la tabla de pronunciación · decidir el narrador y el plan de pago de ElevenLabs (licencia comercial) antes de los audios definitivos · los [VERIFICAR] que solo se resuelven en el parque · provisionales dibujados en SVG: el árbol (5), Pangea (8) y la casa (20) · probar la visita entera en el parque con un iPhone y un Android.

## 1. Qué queremos conseguir

Que una familia recorra el parque sin monitor y salga con la sensación de que ha entendido lo que cuenta cada parada y de que **los niños se lo han pasado bien**. El adulto queda satisfecho si sus hijos disfrutan; si además aprenden algo, mejor.

De ahí salen los principios que mandan sobre todo lo demás:

1. **El protagonista es el parque, no el móvil.** La app sirve para mirar mejor las maquetas, no para mirar la pantalla. Cada parada debe mandar a los niños a buscar algo con los ojos.
2. **Un niño de 4 años no sabe leer.** Todo lo que tenga que hacer un niño pequeño se le dice con voz, con iconos y con gestos, nunca solo con texto.
3. **Móvil de verdad, al aire libre.** Se usa con una mano, al sol, con ruido, con la batería justa y quizá sin cobertura. Botones grandes, contraste alto, nada que obligue a leer párrafos de pie.
4. **Sin instalar nada y sin depender de nadie.** Se abre con un QR. Durante la visita no se llama a ningún servicio de terceros (adiós a Genially).
5. **A su ritmo.** El recorrido tiene un orden recomendado, pero cada cual puede saltarse paradas, volver atrás o parar a hacer fotos. Si se bloquea el móvil o se cierra la pestaña, se retoma donde estaba.
6. **Rigor.** Los textos se escriben con las skills divulgativas (`scicomm-prose-architect`, `metaphor-engine`, `asimov-guide-framework`) y pasan `scientific-rigor-check`. Simplificar sí; falsear no. Los juegos también (ver anexo A: los guiones actuales tienen errores).

## 2. Decisiones técnicas (las tomo yo)

- **Se rehace desde cero, en el mismo repositorio, en la carpeta `v2/`** (proyecto independiente, con su `package.json`). El código actual es pequeño y arrastra dos flujos mezclados; rehacerlo cuesta menos que adaptarlo y cumple la regla de «nada es atadura». *Cambio del 25-sep: carpeta en vez de rama, para que Álvaro no tenga que cambiar de rama y las dos versiones convivan; el despliegue actual solo compila la raíz, así que `v2/` no afecta a la web publicada.* **La versión actual sigue publicada hasta que la nueva la releve**, en la misma dirección web.
- **Los textos salen de los guiones:** la app importa `contenido/guiones/*.md` y locuta y muestra exactamente las citas (líneas `>`) de cada sección. Una sola fuente de verdad.
- **Stack**: React + Vite (como ahora) con TypeScript. Sin servidor: todo estático, publicado gratis en GitHub Pages.
- **Todo el contenido en ficheros de datos** (paradas, guiones, juegos, posiciones en el mapa). Cambiar una parada es editar un fichero, no tocar código.
- **Funciona sin cobertura** (PWA con caché): la app, el mapa y los audios se guardan en el móvil. Al entrar se ofrece «Descargar la visita» (~15-20 MB con los audios recomprimidos; los actuales pesan ~40 MB); si no se descarga, se va cargando la parada siguiente por adelantado.
- **Pantalla encendida durante la visita** (Wake Lock) y audio que sigue sonando con el móvil bloqueado.
- **Progreso guardado en el propio móvil**: paradas vistas, juegos hechos, pegatinas, nombre para el diploma.
- **Juegos programados por nosotros**, sin librerías de terceros en tiempo de ejecución: SVG/canvas y gestos táctiles.
- **Analítica anónima y sin cookies** (propuesta, ver 9): saber cuántos empiezan y terminan, qué paradas se saltan y qué juegos gustan. Sin cookies no hace falta banner de consentimiento.

## 3. La visita, pantalla a pantalla

1. **Entrada.** QR en la taquilla → portada con el mapa. Una sola pregunta: *¿Venís con peques de 4 a 6 años?* Eso decide qué audio suena por defecto (se puede cambiar en cualquier parada). Opcional: nombre del equipo o de la familia para el diploma.
2. **El mapa es la «casa» de la visita.** Mapa ilustrado de la isla, con las paradas, las ya visitadas marcadas y la siguiente resaltada con el camino animado. Tocar una parada la abre.
3. **Cada parada**:
   - ilustración grande de la parada y botón de reproducción enorme;
   - selector *Para todos / Para peques*;
   - **subtítulos sincronizados** con el audio (se pueden ocultar): sirven para leer al sol, con ruido o a quien no oye bien;
   - **«¡Mira bien!»**: misión de observación de 20-30 segundos en el mundo real («¿Cuántos cuernos tiene el triceratops que tenéis delante?», «Buscad la huella de dinosaurio en el suelo»);
   - **«¡Reto!»** en las paradas con juego;
   - **«¿Sabías que…?»** breve.
4. **Pegatinas.** Cada reto superado da una pegatina para el álbum de la visita.
5. **Final.** Diploma con el nombre y las pegatinas conseguidas, **marco de foto** prehistórico para hacerse un selfi que se descarga, y petición de reseña en Google (es publicidad gratuita para el parque).

## 4. El mapa

**Tu mapa sirve de base.** Es `public/assets/images/fondo-mapa.png` (el de la isla con el barco y la taquilla). `Mapa.png` es otra cosa: una imagen genérica generada con IA que no se parece al parque.

**Cómo lo haría:** en dos capas.

- **Capa de fondo (el dibujo):** tu mapa redibujado en estilo cartoon con generación de imágenes por IA, **usándolo como plantilla** para conservar la forma de la isla y dónde está cada cosa. Las imágenes las genera ChatGPT siguiendo `arte/00_INSTRUCCIONES_PARA_CHATGPT.md` (decisión del 24-sep).
- **Capa interactiva (encima, vectorial y hecha por mí):** caminos, números, paradas visitadas, la siguiente parpadeando, toques. Esta capa es exacta porque la dibujo yo con coordenadas, así que no importa que la IA haya desplazado un poco un árbol.

**Estilo:** recomiendo **cartoon** antes que pixel art. En la pantalla de un móvil, un pixel art con veinte maquetas pequeñas se vuelve ilegible, y el cartoon encaja mejor con niños de 4-6 años (el pixel art gusta sobre todo a padres nostálgicos). Aun así, **la primera tarea es una prueba de estilo** con 2-3 versiones para que elijas viéndolas.

**Límite honrado:** la IA no calca geografías al milímetro y a veces «inventa» detalles. Por eso lo que tiene que ser exacto (caminos, números) va en la capa vectorial, y el dibujo se revisa a ojo antes de darlo por bueno. Nada de texto dentro de las imágenes: los rótulos van en la capa vectorial.

**Opcional, experimental:** punto azul de «estás aquí» con el GPS. Posible, pero en un parque pequeño el GPS del móvil falla 5-15 m y el mapa no está a escala; solo merece la pena si tras probarlo en el sitio resulta útil.

## 5. Los audios

**Qué hay ahora** (medido): 20 audios generales de 38 a 167 s (unos 30 minutos en total) y 20 infantiles de unos 30 s. **Los ficheros `*ENG.mp3` no son inglés**: son la versión infantil en español (comprobado transcribiéndolos). Solo el nombre está mal.

**Se reescriben enteros**, por dos motivos: hay que cambiar paradas, y los guiones actuales tienen errores científicos (anexo A).

**Guiones**
- *Para todos* (7 años en adelante): 1,5-2,5 minutos. De pie y al aire libre la atención no da para más. Frases cortas, que se entiendan por el altavoz de un móvil y con ruido. Siempre anclados a lo que se ve («mirad a la derecha del volcán…»), para lo cual necesito fotos de cada parada.
- *Para peques* (4-6 años): 30-50 segundos, con la voz del guía (personaje, si lo hay), una sola idea por parada y una pregunta que les haga mirar la maqueta.
- Además, las **instrucciones habladas de cada juego**, para quien no sabe leer.
- Yo los escribo con las skills divulgativas y el control de rigor; tú los revisas antes de grabar nada.

**Voz**
- Con **voz sintética de calidad**. Recomiendo **ElevenLabs** (la más expresiva en castellano; licencia comercial desde el plan de pago más barato, con un mes basta para generarlo todo) y dejo como alternativa las voces neuronales de **Azure** (oficiales, más planas, prácticamente gratis a este volumen). No usaría el motor de Edge que usamos en las gafas VR: es un acceso no oficial y aquí la actividad se cobra.
- Dos voces: **narrador** para el audio general y **guía** para el infantil y las instrucciones de los juegos.
- **Lo importante: la voz queda «anclada».** Guardo en el repositorio qué voz, con qué ajustes y qué texto generó cada audio, y un guion que los regenera. Así no vuelve a pasar lo de ahora: cualquier parada nueva dentro de dos años suena igual que las demás.
- Tú eliges la voz **de oído**: te preparo 4-5 muestras leyendo el mismo párrafo.
- Los subtítulos sincronizados salen solos: ambos servicios devuelven la marca de tiempo de cada palabra.

## 6. Los juegos

**Dos niveles:**
1. **«¡Mira bien!» en todas las paradas**: misión de observación en el mundo real, sin juego en pantalla. Barata de hacer y la más fiel al principio 1. Exige conocer bien cada maqueta (fotos).
2. **Minijuegos en pantalla en unas 10-12 paradas**, de 1-2 minutos, que un niño de 4 años pueda jugar solo con las instrucciones habladas y que tengan algo de chispa también para uno de 9.

**Se construyen sobre unos pocos «motores» reutilizables**, lo que abarata cada juego nuevo: tocar, arrastrar a su sitio, clasificar en cajas, ordenar, rascar para descubrir, pintar con el dedo, buscar en una escena, trazar un camino y alinear. Todos comparten instrucciones con voz, celebración al acertar y pegatina.

**Catálogo propuesto** (provisional hasta saber qué paradas cambian; ★ = los 10 que haría primero):

| # | Parada | Juego | Mecánica |
|---|---|---|---|
| 1 | Bienvenida | Pasaporte del explorador: nombre, dibujo y primer sello | formulario visual |
| 2 ★ | Origen de la vida | Fábrica de oxígeno: tocar cianobacterias que sueltan burbujas hasta que el cielo pasa de naranja a azul | tocar |
| 3 | Primeras plantas | Parejas del tiempo: fósil ↔ su pariente actual (helecho, cola de caballo, amonites ↔ nautilo) | memoria |
| 4 | Prototaxites y Meganeura | ¿Cómo de grande? Colocar la Meganeura y el Prototaxites junto a una paloma o una persona | arrastrar |
| 5 | Primeros árboles | Atrapado en ámbar: la gota de resina cae sobre el insecto y se convierte en joya fósil | tocar |
| 6 | Primeras flores | Abeja polinizadora: trazar el vuelo entre flores iguales; las visitadas dan fruto | trazar |
| 7 ★ | Primeros dinosaurios | ¿Quién come qué? Helechos bajos al triceratops, hojas altas al brontosaurio | arrastrar |
| 8 ★ | Deriva continental | Puzle de Pangea: encajar Sudamérica con África y lo demás | arrastrar |
| 9 ★ | Segundos dinosaurios | ¿Es un dinosaurio? Clasificar gallina, T-rex, pterosaurio, cocodrilo, plesiosaurio… (la sorpresa: la gallina sí; el pterosaurio, no) | clasificar |
| 10 ★ | Galápagos y Darwin | El pico perfecto: cada pinzón con su comida | arrastrar |
| 11 | Laetoli | Reto sin pantalla: coger cosas sin usar el pulgar (el pulgar oponible) | reto físico |
| 12 ★ | Atapuerca | Excavación: rascar la arena por cuadrículas y apuntar en qué casilla sale cada hallazgo, como los arqueólogos | rascar |
| 13 | Neandertal | ¿Qué sobra aquí? Encontrar los objetos que un neandertal nunca tuvo (móvil, gafas de sol…) | buscar |
| 14 | Cráneos | Ordenar cráneos del más antiguo al más reciente | ordenar |
| 15 ★ | Cuevas y arte rupestre | Tu mano en la cueva: pintar la mano en negativo «soplando» pigmento con el dedo; se guarda en el álbum | pintar |
| 16 | Poblados nómadas | La mudanza: qué se lleva un nómada y qué deja | clasificar |
| 17 ★ | Poblados sedentarios | ¿De dónde viene? Lobo → perro, uro → vaca, muflón → oveja, jabalí → cerdo | arrastrar |
| 18 ★ | Sáhara y Laja Alta | Descubre el mural: encontrar los barcos, la rueda y el ganado | buscar |
| 19 | Çatalhöyük | Entra por el tejado: laberinto por las azoteas hasta tu casa | trazar |
| 20 ★ | Stonehenge | Amanecer del solsticio: mover el sol por el horizonte hasta que su rayo cruce las piedras | alinear |

Cada juego se diseña con su ficha (objetivo didáctico, qué se ve, qué se oye, cuándo se acierta, qué se aprende) y la **revisamos antes de programarlo**.

## 7. Paradas que cambian

Pendiente de que me digas cuáles son y qué hay ahora (sección 9). El plan no depende de ello: el catálogo y el mapa se ajustan cuando lo sepamos.

## 8. Lo que no veo factible o tiene límites

- **No dibujo a mano como un ilustrador.** Las ilustraciones salen de IA de imágenes (revisadas) y de dibujo vectorial mío. Para un acabado de ilustrador profesional haría falta contratar a uno. La prueba de estilo dirá si lo que sale basta; mi apuesta es que sí.
- **La IA dibuja mal la anatomía** (dedos, cuernos, plumas). Toda imagen de un animal se revisa con criterio científico antes de usarla, y se descarta si no pasa.
- **No oigo audio.** Puedo transcribirlo para comprobar el contenido, pero la voz la eliges tú y la calidad final la juzgas tú.
- **No puedo probar en el parque.** Cobertura, sol, volumen, distancias y tiempos se validan en una prueba de campo, a ser posible con una familia real.
- **Clonar la voz antigua**: técnicamente se podría a partir de los MP3 actuales, pero solo si los derechos están claros (si era una persona real, hace falta su permiso). No lo recomiendo: con una voz nueva «anclada» el problema desaparece para siempre.
- **Realidad aumentada** (un dinosaurio en la cámara): posible, pero cara, pesada y desigual entre iPhone y Android. Fuera de la v2; se puede plantear después.

## 9. Qué necesito de ti

**Resuelto el 24-sep:** personaje guía (Alba), inglés (no), cuenta de ElevenLabs (sí), cobertura (mala), grupos escolares (fuera), origen de los audios (ElevenLabs).

**Pendiente:**
1. **Cambios del parque:** qué paradas cambian, qué hay ahora en ellas y si cambia el orden del recorrido.
2. **Fotos de cada parada** (2-4 por parada, incluidos los detalles que se mencionan: huellas, fósiles en las rocas, pinturas…). Sin ellas no puedo escribir «mirad a la derecha» ni las misiones de observación.
3. **El mapa original a la máxima resolución** (el PSD si lo conservas; el PNG del proyecto mide 765×1080) y los cambios marcados, aunque sea a boli sobre una captura.
4. **La clave de ElevenLabs** en `ANTIGRAVITY/_secrets/elevenlabs_KEY.txt`.
5. **Elegir estilo gráfico** cuando esté el lote 1, y **elegir voces** cuando estén las muestras.
6. **Revisar los guiones de la parada 7** y confirmar el nombre de Alba.
7. ¿Analítica anónima sí o no?
8. Logo y colores del parque, y quién figura como titular en créditos y aviso legal.

## 10. Orden de trabajo

| Fase | Qué | Depende de ti |
|---|---|---|
| 0 | Publicar ya los arreglos de julio en la versión actual (hoy **la parada 1 no aparece** en la web publicada) y quitar el token de la configuración de git | tu visto bueno |
| 1 | Definición: cambios del parque, fotos (personaje e idioma ya decididos) | 1, 2, 3 |
| 2 | **Prueba de estilo** (lote 1: Alba y escena de la parada 7 en 3 estilos; el mapa, cuando esté confirmado) y **muestras de voz** — EN MARCHA | elegir |
| 3 | **Rebanada vertical**: la v2 completa pero con UNA parada (mapa, audio, subtítulos, misión, un juego, pegatina, final). La pruebas en el parque antes de hacer las otras 19 | prueba de campo |
| 4 | Guiones de las 20 paradas × 2 públicos + instrucciones de juegos | revisar textos |
| 5 | Generación de audios | escuchar |
| 6 | Juegos (primero los ★) | revisar fichas |
| 7 | Mapa definitivo e ilustraciones de parada | revisar |
| 8 | Pulido, modo sin cobertura, pruebas en iPhone y Android, prueba de campo final | prueba de campo |
| 9 | Relevo: la v2 sustituye a la actual en la misma dirección | visto bueno |

La fase 3 es la clave: sirve para equivocarnos en pequeño. Si algo del planteamiento no funciona en el parque, se descubre con una parada hecha y no con veinte.

**Tamaño:** del orden de 15-20 sesiones de trabajo mías. El calendario real lo marcan tus revisiones y las pruebas de campo, no la programación.

## Anexo A — errores detectados en los guiones actuales

Una muestra, sin haberlos revisado todavía a fondo. Justifica reescribirlos:

- **Laetoli (11):** atribuye las huellas a «Lucy». Lucy se encontró en Hadar (Etiopía) en 1974; las huellas de Laetoli están en Tanzania y tienen unos 3,66 millones de años. Son de la misma especie (*Australopithecus afarensis*), pero no de Lucy. Además, la medalla dice «más de 800.000 años».
- **Prototaxites y Meganeura (4):** se presentan como contemporáneos, pero entre ellos hay decenas de millones de años (Prototaxites: Silúrico-Devónico, hasta hace unos 360 millones de años; Meganeura: Carbonífero, hace unos 300). Que la Meganeura «cazara reptiles» es, como poco, especulativo.
- **Primeros árboles (5):** pone como ejemplo las araucarias. Los primeros árboles (*Wattieza*, *Archaeopteris*, hace unos 385 millones de años) no tienen nada que ver con ellas; las araucarias llegan mucho después, en la era de los dinosaurios.
- **Extinción de los dinosaurios (9):** «hace 65 millones de años» (hoy se da 66) y «desapareció casi el 50 % de la vida» (se estima en torno al 75 % de las especies). Además, el «¿Sabías que…?» de esta parada habla del triceratops, que es de la parada 7.
- **Çatalhöyük (19):** el texto termina con un párrafo de Stonehenge pegado por error, con piedras «de más de 40 toneladas». *Corregido el 25-sep:* la media ronda las 25 toneladas, pero para los pilares del Gran Trilito hay estimaciones de unas 40 (Richards y Whitby, 1997), así que el «más de cuarenta» exagera, pero no es un disparate. El guion nuevo dice «las mayores, treinta o más».
- Erratas: «ignitas» por *icnitas*.
