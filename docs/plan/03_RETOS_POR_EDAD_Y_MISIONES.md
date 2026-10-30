# Retos por edad, misiones nuevas y audios definitivos

*Encargo de Álvaro del 30-oct-2026 («un trabajo intenso y extenso»). Él va a estar poco atento: decido yo y lo dejo escrito aquí. **Este fichero es también la lista de tareas:** si la sesión se corta, se sigue por la casilla que esté sin marcar.*

## Lo que pidió

1. **Audios de «Para todos».** Él cree que son los antiguos; si es así, grabarlos todos de nuevo. Si hay que pagar ElevenLabs, avisarle por correo (desde su propia cuenta, a sí mismo).
2. **Retos distintos por edad:** más difíciles para los mayores, o directamente otros juegos.
   - Ejemplo suyo: la «Fábrica de oxígeno» está bien para los de 4-6 y es demasiado simple para los demás.
3. **Repetir mucho menos los juegos.** Ideas suyas: unir con flechas, puzles de 9, 12 o 16 piezas, encontrar 5 o 7 diferencias, objetos fuera de lugar…
4. **Misiones revisadas, una a una.** Siempre de observación y que se puedan hacer de verdad: sin cruzar cuerdas ni pisar nada.
   - Ejemplo suyo: no se rodea la laguna de Yellowstone, porque está tras la cuerda.
   - Única excepción ya acordada: los niños pisan las huellas de dinosaurio de la 9, de uno en uno.

## Lo que encontré al empezar (30-oct)

- **Los audios de «Para todos» NO son los antiguos.**
  - Son las 21 pistas nuevas del narrador provisional («El Richar atenboru», una voz de su cuenta), grabadas el 25 y el 26-sep con los guiones nuevos. Lo comprobé en el manifiesto publicado.
  - Los audios antiguos del parque eran de otra voz y de otra cuenta.
  - Si al oírlos le parecen los de antes, puede ser:
    - **la voz**, que sigue siendo provisional (si la quiere distinta, se cambia);
    - **el enlace**: la app vieja sigue en `…/Parque-Prehistoria/` y la nueva está en `…/Parque-Prehistoria/v2/`.
- **Pendientes de regrabar:** las 16 pistas que cambiaron el 16-oct (ya va una).
  - La parada 7 y el saludo de Alba se grabaron el 25-sep con el plan gratuito, que no da licencia comercial. Se regraban enteros con el de pago.
- **Voces nuevas (30-oct, decisión de Álvaro tras un casting de 12 muestras):** narradora **Eva Dorado** y **Alba** (su voz de siempre), las dos con **Eleven v4**, que suena más natural que el modelo anterior. Por eso se regraban **todas** las pistas, no solo las pendientes: unos 20.000 créditos (0,22 por carácter, medido). Muestras en `herramientas/_muestras_voz_2026-10/` (fuera de git).
- **ElevenLabs:** desde el 26-sep tiene un plan de pago (en un día se gastaron más de 51.000 créditos, imposible con el gratuito). El contador del periodo volvió a cero el 26-oct, y el 30-oct grabar funcionó. **Si al grabar se acaban los créditos, se le avisa por correo.**
- **No se publica nada:** el repositorio del parque es público, y Álvaro tiene pendiente decidir qué hacer con las notas internas del 16-oct (`_GITHUB/PLAN_GITHUB.md` §10). Todo queda guardado en local, sin push, hasta que decida.

## Cómo se organiza

- **Dos retos por parada:** el de peques (4-6 años) y el de mayores (7 o más).
  - La parada enseña en grande el de su modo («¿Venís con peques?», en la portada) y, debajo, un enlace al otro. Las familias con niños de las dos edades pueden jugar los dos.
  - La pegatina se gana con cualquiera de los dos.
- **Guion:** el de peques sigue en `## Reto: «…»`; el de mayores va en una sección nueva, `## Reto para mayores: «…»`, con su propia lista «**Voz de Alba:**».
- **Audios:** las frases del reto de mayores llevan la clave `pNN-mayores-<etiqueta>`. Las deducen igual `guion.ts` y `generar_audios.py`.
- **Código:** `RETOS_MAYORES`, en `src/retos/index.ts`, y la ruta `#/parada/N/reto-mayores`.
  - Los motores no cambian: reciben una «parada para mayores» cuyo guion apunta a las frases de mayores (`paraMayores()`).
- **Misiones con comprobación:** cuando la respuesta es segura, la misión lleva una lista de respuestas (`- Correcta: «…»`, `- Incorrecta: «…»`) y la hoja enseña botones en vez de «¡Hecho!».
  - Si aciertan, Alba dice «¡Misión cumplida!»; si no, «Mirad otra vez». Son dos frases comunes, en `comun.md`.

## Los juegos, parada a parada

**N** = juego o motor nuevo; **+** = el de antes, más difícil. Ninguna mecánica sale más de tres veces en cada recorrido, y nunca dos veces seguidas.

| Parada | Peques (4-6) | Mayores (7+) |
|---|---|---|
| 1 | El reloj del tiempo (ordenar 4) | **N** La cinta del tiempo: 6 momentos sobre una cinta de 4.540 millones de años, a escala, con zoom |
| 2 | Fábrica de oxígeno (tocar) | **N** La gran oxidación: el oxígeno oxida primero el hierro del mar (bandas rojas) y solo después llena el aire; las colonias solo fabrican con luz |
| 3 | ¿Cómo se hace un fósil? (ordenar 4) | **N** La losa rota: rompecabezas de 12 piezas del mar antiguo |
| 4 | **N** Laberinto: ¡sal del agua, Tiktaalik! | **N** Detectives del Devónico (test de 5 preguntas con imagen) |
| 5 | Construye el primer árbol (sombras) | **N** Las cinco diferencias: el primer bosque y una copia con cinco cosas que aún no existían |
| 6 | Poliniza las flores (abeja) | **+** Poliniza con flores de varias especies: el polen solo sirve en una flor de su misma especie |
| 7 | ¿Quién come qué? (repartir) | **N** ¿Quién no pudo estar aquí? (intrusos con trampa en el Jurásico) |
| 8 | Arma Pangea (4 piezas) | **+** Pangea con pistas: 7 piezas y bandas de fósiles que tienen que casar |
| 9 | **N** Unir con flechas: cada huella con su dinosaurio | **N** ¿Paseaba o corría? Medir zancadas con la pata |
| 10 | ¿Quién sobrevivió? (dos grupos) | **N** Efecto dominó: ordenar la cadena de la extinción (6 tarjetas) |
| 11 | Cada pico, su comida (emparejar) | **N** El taller de Darwin: 5 pinzones unidos con flechas |
| 12 | Detectives de Laetoli (buscar) | **+** Seis pistas en la ceniza (los dos caminantes por separado y las rocas) |
| 13 | ¡A excavar! (rascar) | **+** Excavación científica: rascar y apuntar la casilla de cada hallazgo |
| 14 | **N** ¿Qué no encaja? (intrusos de risa en el campamento neandertal) | **+** ¿Verdad o mito? con 8 tarjetas |
| 15 | Encuentra las diferencias (cráneos) | **N** Detectives del museo (test sobre los cráneos de las vitrinas) |
| 16 | Tu mano en la cueva | **N** A la luz de la lámpara: explorar la cueva a oscuras con un círculo de luz |
| 17 | ¡Nos mudamos! (dos grupos) | **+** La mudanza con tres grupos: nos lo llevamos, se queda, aún no se había inventado |
| 18 | **N** Memory: cada animal salvaje con su doméstico | **N** Del lobo al perro: salvaje → doméstico → lo que nos da (flechas, 3 columnas) |
| 19 | Descubre el mural | **+** Detalles del mural: 8 detalles más pequeños (sin las jirafas ni el gigante, que son la misión) |
| 20 | **N** Rompecabezas de 6 piezas de Çatalhöyük | Construye una casa de Çatalhöyük (el reto que antes era de todos) |
| 21 | Reconstruye Stonehenge | **N** El calendario de piedra: buscar el día en que el sol sale por el eje |

**Repetición, contada al final:** en cada recorrido, ninguna mecánica pasa de tres. Peques: ordenar (1, 3), sombras (5, 8, 21), repartir (7, 10, 17), buscar en un dibujo (12, 15, 19). Mayores: test (4, 15), flechas (11, 18), repartir (14, 17), buscar en un dibujo (5, 12, 19). Un roce: si se cuentan juntos «buscar en un dibujo» e «intrusos», que se juegan los dos tocando en una imagen aunque lo que se busca es distinto, salen cuatro en cada recorrido (peques: 12, 14, 15 y 19, con la 14 y la 15 seguidas; mayores: 5, 7, 12 y 19).

**Dibujos:**
- Los juegos nuevos usan las ilustraciones aprobadas: rompecabezas y diferencias salen de las portadas; intrusos, flechas y memory, de las piezas de cada parada.
- Los objetos «de risa» son emojis del propio móvil: no hacen falta dibujos nuevos ni licencias.
- Lo que va con emoji o con montaje provisional tiene su encargo para ChatGPT: **lote 8** en `arte/00_INSTRUCCIONES_PARA_CHATGPT.md` (los cinco intrusos del bosque de la 5 y las tarjetas de la 10 y la 17).

## Misiones: los criterios

- **Siempre desde el camino:** sin cruzar cuerdas, sin pisar pintura y sin tocar maquetas ni objetos. La única excepción son las huellas de la 9, de uno en uno.
- **Interacción que se pueda hacer:**
  - mirar un detalle concreto;
  - contar;
  - comparar con el propio cuerpo;
  - imitar con el cuerpo;
  - encontrar algo y señalarlo;
  - oler el naranjo, sin tocarlo.
- **Respuesta comprobable solo si es segura**, porque está confirmada por Álvaro o por las fotos del 16-oct. Si el parque puede cambiarla, no se comprueba.
- **Dos ideas por misión como mucho,** cortas, que Alba dice en menos de 30 segundos.

## Lista de tareas

- [x] Infraestructura: guion (sección de mayores y respuestas de misión), generador de audios, `paradas.ts`, rutas, botones de la parada y `comprobar.mjs`.
- [x] Misiones reescritas (21 + el pozo, que ya es una pregunta).
- [x] Motores nuevos: cinta, rompecabezas, test, diferencias, intrusos, flechas, memory, laberinto y linterna.
- [x] Juegos a medida: oxidación, abeja con especies, zancadas, excavación con registro, solsticio.
- [x] Juegos «+»: Pangea con pistas, mudanza en tres grupos, mural con 8, Laetoli con 6, verdad o mito con 8, efecto dominó. La casa de la 20 pasó a mayores tal cual: no se ha hecho más difícil.
- [x] Cambios de peques: 4, 9, 14, 18 y 20.
- [x] Frases de todos los juegos en los guiones, con revisión de rigor.
- [x] Probar cada juego en el navegador, en tamaño de móvil (360×600 y 375×812). Los 42 se abren sin desbordar de lado; los de mayores de la 2, 8 y 13 los jugaron enteros los agentes que los hicieron, y yo solo una parte. Nada probado aún en un móvil de verdad.
- [x] Audios: todo lo pendiente, más la 7 y el saludo enteros.
- [x] Prueba sin red (`herramientas/prueba-sin-red/`).
- [x] Encargo de dibujos definitivos para ChatGPT (lote 8), si hace falta.
- [x] Parte en `_PARTES/`, memoria y estado del plan.
