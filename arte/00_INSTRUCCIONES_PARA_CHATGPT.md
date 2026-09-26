# Instrucciones para ChatGPT: imágenes de la app del Parque de la Prehistoria

Hola, ChatGPT. Este documento lo mantiene Claude, que programa la app. Álvaro te pedirá que lo leas y generes las imágenes del **lote activo** (la sección que lleva «LOTE ACTIVO» en el título). Léelo entero antes de empezar: las reglas de la sección 3 se aplican a todas las imágenes.

## 1. Qué es la app

Una app web para el móvil que guía a familias por el **Parque de la Prehistoria**, un parque al aire libre con maquetas a tamaño real: dinosaurios, un volcán, una cueva con pinturas, un poblado prehistórico, Stonehenge… El visitante recorre 21 paradas (y una secreta); en cada una escucha una explicación y los niños juegan a pequeños retos.

**El público que manda son niños de 4 a 10 años y sus familias.** Todo tiene que resultar alegre, amable y fácil de leer en la pantalla de un móvil, a pleno sol.

## 2. Alba, la guía

Alba es una **niña viajera del tiempo** que acompaña a los peques por el parque. Es la cara de la app: aparecerá en muchas pantallas, así que su aspecto tiene que ser **idéntico en todas las imágenes**. Esta ficha es la referencia.

- **Edad:** unos 11 años. Una «hermana mayor» para los peques, no una adulta.
- **Carácter:** curiosa, valiente, simpática y un poco bromista. Se asombra con todo. Nunca da miedo ni está enfadada.
- **Silueta reconocible:** pelo castaño oscuro, **rizado, recogido en una coleta alta** sujeta con un **pañuelo verde azulado** (`#2A9D8F`).
- **Cara:** ojos grandes marrones, cejas expresivas, unas pocas pecas en la nariz, piel morena clara.
- **Ropa de exploradora, práctica y cómoda:**
  - **chaleco color mostaza** (`#E0A526`) con varios bolsillos, sobre una camiseta blanca de manga corta;
  - pantalón por la rodilla de color verde oliva (`#6B7F3A`);
  - botas de montaña marrones (`#6B4226`) con calcetines asomando;
  - **mochila pequeña color rojo teja** (`#C8553D`);
  - una **lupa** colgada del cuello con un cordón.
- **Su objeto mágico, el «reloj del tiempo»:** un reloj grande en la muñeca izquierda, con una esfera redonda de latón. En lugar de números lleva **exactamente cuatro pequeños símbolos**, uno en cada cuarto de la esfera: una hoja de helecho (arriba), una huella de dinosaurio (derecha), una mano (abajo) y un sol (izquierda). Ni un quinto símbolo, ni números, ni letras.

Es una niña: ropa y pose siempre apropiadas para una app infantil.

## 3. Reglas para todas las imágenes

**Estilo elegido: el 1, cartoon limpio** (el de `lote-01/A1_alba_cartoon.png` y el lote 2). Todo lo que generes, en ese estilo.


1. **Nada de texto.** Ni letras, ni números, ni carteles, ni firmas, ni marcas de agua. Si una imagen necesita un rótulo, lo pondrá la app encima.
2. **Estilo propio.** No imites a ningún estudio, película, serie ni artista concreto.
3. **Rigor científico con los animales.** El parque es divulgativo: un error de anatomía es un fallo, aunque el estilo sea de dibujos animados. Caricaturiza la expresión, pero respeta la anatomía:
   - **Triceratops:** camina a cuatro patas, con las patas debajo del cuerpo (no abiertas como un lagarto). **Tres cuernos:** dos largos sobre los ojos y uno corto sobre la nariz. Pico como de loro. Una **gola** (el escudo de hueso detrás de la cabeza) **maciza y lisa: sin óvalos, huecos ni «ventanas» dibujados**, con el borde festoneado. Piel de escamas, **sin plumas**. **Cola corta, estirada hacia atrás casi en horizontal: ni arrastrando por el suelo ni enroscada hacia arriba.**
   - **Brontosaurio:** cuatro patas gruesas como columnas, parecidas a las de un elefante. **Las patas traseras son más largas que las delanteras: el punto más alto del lomo está en las caderas, no en los hombros** (no es una jirafa ni un braquiosaurio). Cabeza pequeña y **cuello muy largo y grueso, inclinado hacia delante y arriba en ángulo moderado, nunca vertical**. Cola larguísima **estirada hacia atrás en horizontal**, afinándose hasta acabar en látigo: **nunca enroscada ni levantada en forma de S**. Piel de escamas, sin plumas. Si es una **cría**: cabeza algo más grande, cuello y cola más cortos en proporción, patas algo rechonchas, aspecto tierno.
   - **Plantas de su época:** helechos, cícadas (parecen palmeras enanas), colas de caballo, coníferas tipo araucaria y ginkgos. **Nada de césped ni de flores:** no existían en tiempos del brontosaurio. **El suelo es tierra, musgo, helechos bajos y piedras: ni pradera verde lisa ni matas de hierba.** Tampoco palmeras de verdad.
   - **Personas y dinosaurios no conviven.** Nunca pintes humanos prehistóricos junto a dinosaurios. Alba es la única excepción, porque viaja en el tiempo.
   - **No juntes en una misma escena, como si convivieran, animales de épocas distintas** (el triceratops y el brontosaurio vivieron separados por más de 80 millones de años). Si hay que mostrarlos juntos, cada uno va en su recuadro o en su mitad de la imagen, con paisajes distintos.
4. **Pixel art de verdad, si alguna vez se pide:** se dibuja directamente a baja resolución (por ejemplo 128×192 píxeles, con paleta limitada) y se amplía sin suavizar. **No vale pixelar los bordes de un dibujo normal.**
5. **Pensado para el móvil:** siluetas claras, buen contraste, pocos detalles diminutos. Tiene que leerse bien en una pantalla pequeña.
6. **Formato:** PNG. Tamaños:
   - personaje suelto: 1024×1536 (vertical), fondo blanco liso;
   - escena de parada: 1024×1536 (vertical);
   - piezas de juego y pegatinas: 1024×1024 con **fondo transparente**. En el lote 2 dijiste que no podías, pero la herramienta sí generó versiones transparentes: guarda siempre esas, con el nombre de la tabla.

## 4. Dónde se guardan

Cada imagen se guarda en la carpeta del lote, **con el nombre exacto** que indica la tabla: `arte/lote-01/A1_alba_cartoon.png`, etc. Si no puedes escribir en la carpeta, entrégale las imágenes a Álvaro con esos nombres para que las guarde él.

Si de una imagen haces varias versiones, añade `_v2`, `_v3` al nombre. **No borres ni sobrescribas nada.**

Claude revisará cada imagen, con especial atención a la anatomía y a que Alba sea siempre la misma. Lo que no pase se repetirá con indicaciones concretas.

## 5. Lote 1, prueba de estilo — HECHO Y REVISADO (24-sep-2026)

**Objetivo:** que Álvaro elija el estilo gráfico de toda la app. Hay tres estilos candidatos y dos imágenes de cada uno: Alba sola y una escena con dinosaurios. **Lo que tiene que cambiar entre una versión y otra es el estilo, no el contenido:** Alba y la escena deben ser las mismas en los tres.

**Estilos:**
- **Estilo 1, cartoon limpio:** dibujo animado 2D moderno, línea de contorno limpia, colores planos y vivos, sombras sencillas. Alegre y muy legible.
- **Estilo 2, álbum ilustrado:** como un libro infantil ilustrado a mano, con textura de gouache o acuarela, colores cálidos y terrosos, bordes suaves.
- **Estilo 3, pixel art:** pixel art detallado, estilo videojuego clásico de 16 bits, paleta limitada pero rica, píxeles nítidos y sin difuminar.

| Archivo | Qué es |
|---|---|
| `A1_alba_cartoon.png` | Alba de cuerpo entero, en tres cuartos, saludando con la mano derecha y sonriendo, con el reloj del tiempo bien visible en la muñeca izquierda. Fondo blanco. **Estilo 1.** |
| `A2_alba_album.png` | Igual que A1. **Estilo 2.** |
| `A3_alba_pixel.png` | Igual que A1. **Estilo 3.** |
| `B1_parada07_cartoon.png` | Escena vertical: un **triceratops adulto** en primer plano a la izquierda, comiendo helechos a ras de suelo, y detrás, a la derecha, una **cría de brontosaurio** estirando el cuello hacia las ramas de una araucaria. Paisaje del Jurásico o Cretácico: helechos, cícadas, colas de caballo, un río a lo lejos, cielo claro. Luz de mañana, ambiente tranquilo y amable (nada de peleas ni dientes amenazantes). Sin Alba y sin personas. **Estilo 1.** |
| `B2_parada07_album.png` | Igual que B1. **Estilo 2.** |
| `B3_parada07_pixel.png` | Igual que B1. **Estilo 3.** |

Al acabar, repasa tú mismo la sección 3 contra cada imagen, sobre todo la anatomía (cuernos, gola, colas en el aire) y la ausencia de texto, y repite lo que no la cumpla.

### Revisión de Claude

**Alba (A1-A3): aprobada.** Coincide con la ficha y es idéntica en las tres versiones. Única corrección: la esfera del reloj tenía cinco símbolos; deben ser exactamente cuatro (ya está en la ficha).

**Escenas (B1-B3): válidas para elegir estilo, no para usarlas en la app.** Errores que no deben repetirse (ya están en las reglas de la sección 3):
- la gola del triceratops lleva dos óvalos que parecen agujeros, y el triceratops no los tenía;
- las dos colas están enroscadas hacia arriba;
- el brontosaurio tiene el cuello vertical como una jirafa, parece adulto y no cría, y tiene los hombros más altos que las caderas;
- el suelo es una pradera con matas de hierba;
- la escena junta como vecinos a dos animales separados por 80 millones de años (el fallo es del encargo, no tuyo).

**Sobre el estilo:** las tres versiones son el mismo dibujo con distinto acabado. En la 3 solo están pixelados los bordes, así que no es pixel art (ver regla 4). Para la elección real cuentan la 1 y la 2.

## 6. Lote 2, ficha de Alba — HECHO Y REVISADO (25-sep-2026)

**No lo empieces hasta que Álvaro te diga qué estilo ha elegido** (1, cartoon limpio, o 2, álbum ilustrado). Entonces, en ese estilo y **usando como referencia la Alba aprobada** (`lote-01/A1_alba_cartoon.png` o `lote-01/A2_alba_album.png`, la del estilo elegido), para que salga idéntica. Guarda en `arte/lote-02/`.

**Hojas de referencia** (fondo blanco, 1536×1024 horizontal):

| Archivo | Qué es |
|---|---|
| `C1_alba_giro.png` | Alba de cuerpo entero tres veces en fila: de frente, de perfil (mirando a la izquierda) y de espalda. Postura neutra, brazos relajados. Que se vean bien la coleta, el pañuelo, la mochila y el reloj. |
| `C2_alba_expresiones.png` | Seis cabezas de Alba en dos filas de tres: alegre, sorprendida (boca en «o», cejas arriba), pensativa (mirando hacia arriba), riendo con los ojos cerrados, animando (boca abierta, como gritando «¡vamos!») y guiñando un ojo. |

**Poses para la app** (1024×1536 vertical, **fondo transparente**, cuerpo entero):

| Archivo | Pose |
|---|---|
| `P1_alba_saluda.png` | la del lote 1: saludando con la mano derecha |
| `P2_alba_senala.png` | señalando con el brazo derecho estirado hacia la derecha de la imagen, mirando hacia donde señala, entusiasmada |
| `P3_alba_celebra.png` | saltando de alegría con los dos brazos arriba |
| `P4_alba_lupa.png` | inclinada hacia delante, mirando por la lupa con un ojo muy abierto |
| `P5_alba_reloj.png` | consultando el reloj del tiempo de su muñeca izquierda, con la esfera brillando un poco |
| `P6_alba_piensa.png` | pensativa, con un dedo en la barbilla y la mirada hacia arriba |

Comprueba en cada imagen los cuatro símbolos del reloj, la coleta rizada con el pañuelo verde azulado, el chaleco mostaza, la mochila roja y la lupa. Si la herramienta no deja fondo transparente, usa fondo blanco liso y dilo.

### Revisión de Claude

**Aprobado.** Alba es idéntica en todas las poses y expresiones. Las versiones con fondo transparente están en `lote-02 bis/`; las elegidas, ya recortadas, están en `arte/aprobado/alba/`. Dos reparos menores, que no hace falta rehacer:
- en `P2_alba_senala` señala con el brazo izquierdo, así que el reloj queda en la muñeca **derecha**;
- en el reloj, la huella de dinosaurio ha salido como una segunda mano.

## 7. Lote 3, parada 7 «Los primeros dinosaurios» — HECHO Y REVISADO (25-sep-2026)

Todo en el estilo 1. Guarda en `arte/lote-03/`.

**Referencias del parque real**, para que los niños reconozcan en la app las maquetas que tienen delante. Úsalas **solo para el color y el aspecto general**: la anatomía la manda la sección 3.
- Triceratops: `Mapa e imágenes de parque/Imágenes/PXL_20241218_090613835.PORTRAIT.jpg`. Gris azulado oscuro, con la tripa y el pico más claros.
- Brontosaurio: `Mapa e imágenes de parque/Imágenes/PXL_20241218_090640210.PORTRAIT.jpg`. Gris claro. **La maqueta lleva el cuello vertical; no lo copies:** en la app va inclinado (sección 3).

**Ilustración de la parada** (1024×1536 vertical, con fondo):

| Archivo | Qué es |
|---|---|
| `D1_parada07_portada.png` | Imagen **partida en dos mitades por una grieta o un rasgado de papel en diagonal**, para que se vea que son dos épocas distintas. **Arriba, el Jurásico:** una cría de brontosaurio gris estirando el cuello (inclinado, no vertical) hacia las ramas de una araucaria, con ginkgos, helechos y colas de caballo, y cielo de mañana. **Abajo, el Cretácico:** un triceratops gris azulado comiendo helechos a ras de suelo, con cícadas y un río al fondo, y cielo de tarde. Suelo de tierra y musgo. Ambiente amable. Sin Alba, sin personas y sin texto. |

**Piezas del juego «¿Quién come qué?»** (fondo transparente; los animales, de cuerpo entero y sin sombra en el suelo):

| Archivo | Tamaño | Qué es |
|---|---|---|
| `J0_juego07_fondo.png` | 1024×1536, con fondo | Paisaje para el juego, **sin animales**: suelo de tierra con helechos bajos abajo y una araucaria alta a la derecha cuyas ramas llegan hasta arriba. Mucho espacio despejado en el centro. Poco detalle, colores suaves (encima irán las piezas). |
| `J1_triceratops.png` | 1024×1024 | Triceratops de perfil, mirando a la derecha, cabeza baja y boca un poco abierta, como esperando comida. Simpático. |
| `J2_brontosaurio.png` | 1024×1024 | Cría de brontosaurio de perfil, mirando a la izquierda, cuello inclinado hacia arriba unos 45° y boca un poco abierta. Simpático. |
| `J3_helecho.png` | 1024×1024 | Una mata de helecho. |
| `J4_cicada.png` | 1024×1024 | Una cícada pequeña: tronco corto y grueso con una corona de hojas largas, como una palmera enana. |
| `J5_cola_de_caballo.png` | 1024×1024 | Un manojo de colas de caballo (tallos verdes a segmentos). |
| `J6_rama_araucaria.png` | 1024×1024 | Una rama de araucaria con sus hojas escamosas. |
| `J7_ginkgo.png` | 1024×1024 | Una ramita de ginkgo con hojas en forma de abanico. |
| `J8_filete.png` | 1024×1024 | Un filete de carne de dibujos animados, con su hueso. Sin sangre. (Es la trampa del juego: los dos dinosaurios eran herbívoros.) |

**Pegatina** (1024×1024, fondo transparente):

| Archivo | Qué es |
|---|---|
| `K1_pegatina_parada07.png` | Pegatina redonda troquelada con borde blanco grueso: la cabeza del triceratops en tres cuartos, sonriente, sobre un círculo verde azulado (`#2A9D8F`). Sin texto. |

Comprueba en cada imagen la sección 3: tres cuernos y gola maciza sin agujeros en el triceratops; colas estiradas y en el aire; brontosaurio con las caderas más altas que los hombros; nada de césped, flores ni palmeras.

### Revisión de Claude

**Aprobado y ya integrado en la app** (`arte/aprobado/p07/`). La anatomía está bien en todas las piezas: tres cuernos, gola maciza, colas estiradas, brontosaurio con el cuello inclinado y nada de césped.

- **`K1_pegatina`:** tenía un **agujero de transparencia** dentro del círculo verde (al quitar el fondo se borró una zona del dibujo). Ya está reparado. **Aviso para el futuro:** después de quitar un fondo, comprueba que no haya huecos transparentes *dentro* de la figura.
- **`D1_parada07_portada`:** muy buena, pero **no está en el estilo 1**: es una ilustración pintada y detallada, mientras que Alba y las piezas son cartoon de línea limpia. Se usa de momento; Álvaro decide si se rehace en cartoon.
- **`J2_brontosaurio`:** parece adulto, no cría. Para el juego da igual.

## 8. Lote 4, paradas 2, 12, 15, 17, 18 y 20 — HECHO Y REVISADO (26-sep-2026)

*(Después de este lote el parque renumeró sus paradas: estas son ahora la 2, 13, 16, 18, 19 y 21. Los nombres de archivo se quedan como están.)*

Todo en el **estilo 1** (el de Alba y el lote 3). Guarda en `arte/lote-04/`. Recuerda las reglas de la sección 3: sin texto, anatomía cuidada y **sin huecos transparentes dentro de las figuras** (en la pegatina del lote 3 apareció uno).

### A. Animales del juego «¿De dónde viene?» (parada 17)

Cada animal de cuerpo entero, de perfil y **mirando a la derecha**, amable, sin sombra en el suelo. 1024×1024 con **fondo transparente**. Tienen que reconocerse a simple vista y parecer de la misma familia de dibujos.

| Archivo | Animal | Rasgos que tienen que verse |
|---|---|---|
| `L1_lobo.png` | lobo | lobo gris salvaje, orejas de punta, cola espesa |
| `L2_uro.png` | uro (el toro salvaje del que vienen las vacas; ya extinguido) | **mucho más grande y robusto que una vaca**, pelaje negro o castaño oscuro con una **raya clara a lo largo del lomo**, hocico claro, **cuernos largos que se curvan hacia delante y hacia arriba** |
| `L3_muflon.png` | muflón asiático (el antepasado de la oveja) | carnero salvaje de pelo corto **marrón rojizo** con la tripa y las patas blancas y una **mancha clara en el costado**; **cuernos gruesos enroscados** hacia atrás. **Sin lana rizada** |
| `L4_jabali.png` | jabalí | pelo oscuro y áspero, crin en el lomo, **colmillos** que asoman |
| `L5_perro.png` | perro | perro mestizo corriente, simpático |
| `L6_vaca.png` | vaca | vaca doméstica corriente |
| `L7_oveja.png` | oveja | oveja con lana blanca |
| `L8_cerdo.png` | cerdo | cerdo rosado de granja |

### B. Pegatinas (una por parada)

Como `K1`: pegatina redonda troquelada con **borde blanco grueso**, dibujo sobre un círculo de color, sin texto. 1024×1024, **fondo transparente**.

| Archivo | Dibujo | Color del círculo |
|---|---|---|
| `K2_pegatina_parada02.png` | un estromatolito (roca redondeada a capas, con una capa verde arriba) soltando burbujas en el agua | azul claro `#6CC7E8` |
| `K12_pegatina_parada12.png` | un pincel de arqueólogo y un bifaz (hacha de piedra tallada en forma de lágrima) cruzados | arena `#E3BD76` |
| `K15_pegatina_parada15.png` | una mano en negativo: silueta de mano en color claro rodeada de pigmento rojo soplado, como en las cuevas | ocre `#C8553D` |
| `K17_pegatina_parada17.png` | una oveja y una espiga de trigo | verde oliva `#6B7F3A` |
| `K18_pegatina_parada18.png` | un barco de vela pintado con trazos rojos sencillos, como los de la Laja Alta | mostaza `#E0A526` |
| `K20_pegatina_parada20.png` | el sol saliendo por el hueco de un trilito de Stonehenge (dos piedras con otra encima) | naranja amanecer `#F2A672` |

### C. Ilustraciones de portada (una por parada)

1024×1536 vertical, con fondo, sin texto y sin Alba. Luminosas y alegres.

| Archivo | Escena |
|---|---|
| `D2_parada02_portada.png` | Una fuente termal redonda con anillos de colores (azul intenso en el centro; luego verde, amarillo, naranja y rojo hacia fuera), como la Gran Fuente Prismática; al lado, una orilla con **estromatolitos** (rocas redondeadas a capas) en agua poco profunda. Sin plantas terrestres ni animales. |
| `D12_parada12_portada.png` | Una excavación arqueológica **dividida en cuadrículas con cuerdas**; dos arqueólogos adultos (un hombre y una mujer) trabajan con pinceles y paletines; asoman un cráneo humano y una herramienta de piedra; una libreta de notas y una cinta métrica. |
| `D15_parada15_portada.png` | El interior de una cueva, a la luz de una lámpara de piedra con grasa; en la pared, caballos y bisontes pintados en ocre y negro, y **manos en negativo**; una persona del Paleolítico, vestida con pieles, sopla pigmento sobre su mano apoyada en la pared. |
| `D17_parada17_portada.png` | Un poblado del Neolítico: cabañas de madera y barro con techos vegetales, una empalizada, un pozo, un campo de trigo, un corral con ovejas y cabras y un perro. Gente trabajando (moliendo grano, cuidando animales). Sin metales ni herramientas modernas. |
| `D18_parada18_portada.png` | El **Sáhara verde**, hace unos siete mil años: praderas y lagos con jirafas y ganado vacuno, pastores, y un abrigo rocoso en el que alguien pinta vacas en la pared. |
| `D20_parada20_portada.png` | Stonehenge al amanecer del solsticio de verano, visto desde dentro del círculo: el sol asoma por el hueco entre dos grandes piedras con su dintel; cielo naranja y rosa; hierba verde. Sin personas modernas. |

### D. Alba

| Archivo | Qué es |
|---|---|
| `P7_alba_senala_izquierda.png` | Alba señalando con el brazo **derecho** estirado hacia la **izquierda** de la imagen, entusiasmada, con el reloj bien visible en la muñeca **izquierda**. 1024×1536, fondo transparente. |

Al acabar, repasa la sección 3 y esta tabla contra cada imagen, sobre todo los rasgos de los animales (el uro no es una vaca; el muflón no tiene lana).

### Revisión de Claude

Todo aprobado e integrado en la app: animales con los rasgos pedidos (uro robusto con cuernos hacia delante, muflón sin lana), pegatinas sin huecos, portadas luminosas. Buen trabajo.

## 9. Lote 5, el mapa del parque — HECHO; se corrige en el lote 5 bis

**Qué es:** el mapa ilustrado que sirve de pantalla principal de la visita. La app pone encima, ella sola, un círculo con el número de cada parada: **tú solo dibujas el mapa, sin números ni rótulos.**

**Álvaro te dará dos imágenes** (están en `arte/lote-05/`):

1. `PLANTILLA_mapa_sin_elementos.png` — el mapa actual del parque, en estilo pergamino. **Es la plantilla:** respeta la forma de la isla, el recorrido del **camino punteado** (por dónde va y por dónde gira), la taquilla, el barco, las olas, la rosa de los vientos, la palmera, los arbustos, el árbol, las montañas y la **X** de arriba a la izquierda. El camino es lo más importante: las familias lo siguen con el dedo.
2. `REFERENCIA_donde_va_cada_cosa.png` — la misma plantilla con círculos numerados que marcan **dónde va cada elemento** de la tabla de abajo. Los círculos y los números **no se dibujan**: solo indican el sitio.

**Qué tienes que hacer:** redibujar la plantilla en el **estilo 1** (cartoon limpio, el de Alba), como un **mapa del tesoro alegre visto desde arriba en perspectiva suave**, con el mar alrededor, y añadir en cada sitio marcado un **dibujo pequeño y reconocible** del elemento que hay en el parque. Colores vivos pero no chillones; hierba y tierra en la isla, mar azul turquesa. Deja **un poco de espacio libre junto a cada elemento**, sobre el camino, porque ahí irá el círculo con el número.

| Sitio | Qué hay en el parque (dibújalo pequeño) |
|---|---|
| 1 | la **taquilla** de la entrada (ya está en la plantilla) |
| 2 | una **charca de colores** vista desde arriba: centro azul intenso, anillo turquesa, borde amarillo claro y una gran orla rojo anaranjada con regueros |
| 3 | una **zona de agua azul poco profunda** con rocas y guijarros; sobre ella, un **trilobites** y un **amonites** fósiles |
| 4 | dos **columnas blancas altas y rugosas** (Prototaxites, un hongo gigante) y, en el suelo al lado, dos fósiles planos: una **libélula gigante** y un **pez con aletas robustas** |
| 5 | un bosquecillo de **árboles primitivos y helechos arborescentes** |
| 6 | un pequeño macizo de **plantas con flores** sencillas |
| 7 | un **triceratops** y un **brontosaurio** (anatomía de la sección 3), separados |
| 8 | un **volcán pintado en el suelo**, visto desde arriba: un círculo gris de roca con un cráter naranja en el centro y **regueros de lava amarilla y naranja** hacia fuera |
| 9 | una **flor gigante**: un **capullo naranja y amarillo** con forma de bulbo, sobre **pétalos pintados en el suelo** |
| entre 8 y 10 | una **charca azul con una roca negra** en medio (ya estaba en el mapa antiguo) |
| 10 | dos **dinosaurios carnívoros** de dos patas (tamaño mediano, cola rígida estirada hacia atrás) junto a la palmera de la plantilla |
| 11 | una **tortuga gigante** de las Galápagos entre cactus |
| 12 | una **losa gris con huellas** de pies humanos en fila |
| 13 | dos **areneros** rectangulares con una cuadrícula de cuerdas |
| 14 | un **hogar de piedras** con un pequeño fuego y unos huesos al lado |
| 15 | un **edificio pequeño** (el museo) |
| 16 | una **roca con pinturas rupestres** rojas y negras (animales) |
| 17 | tres **tiendas de pieles** (tipis) del poblado nómada |
| X | un **pozo de piedra** con su soporte de madera, junto a la X de la plantilla |
| 18 | una **cabaña redonda de madera con techo de paja** |
| 19 | una **pared pintada** con figuras rojas (ganado, personas, barcos) |
| 20 | una **casa de adobe de tejado plano** (Çatalhöyük) |
| 21 | **Stonehenge**: círculo de piedras grises, algunas con otra encima |

**Reglas:**
- **Nada de texto ni números** en la imagen (ni en la taquilla: el cartel «TICKETS» de la plantilla, fuera).
- **No cambies el camino** ni muevas los elementos de sitio: si algo no cabe, hazlo más pequeño.
- Nada de personas ni de Alba en el mapa.
- **Formato:** PNG vertical de 1024×1536, con fondo (no transparente).

| Archivo | Qué es |
|---|---|
| `M1_mapa_parque.png` | el mapa completo, como se describe arriba |
| `M2_mapa_parque_sin_elementos.png` | **el mismo mapa sin los dibujos de las paradas**: solo la isla, el camino y la decoración de la plantilla. Es el plan B: si algún elemento del parque cambia, la app puede seguir usándolo |

Al acabar, compara tu mapa con la plantilla: **el camino tiene que seguir el mismo recorrido**. Es lo primero que revisará Claude.

### Revisión de Claude y de Álvaro

`M1` está muy bien: alegre, legible y con casi todo en su sitio. La app ya lo usa. Pero Álvaro conoce el parque y hay que corregir cinco cosas (lote 5 bis). `M2` sirve como plan B tal cual.

## 10. LOTE ACTIVO: lote 5 bis, correcciones del mapa

**Parte de `arte/lote-05/M1_mapa_parque.png` y edítalo: cambia SOLO lo que dice esta lista.** Todo lo demás (el camino, la isla, el mar, el resto de dibujos y sus posiciones) tiene que quedar **igual**, porque la app coloca los números encima de cada dibujo. Guárdalo como `arte/lote-05/M3_mapa_parque_corregido.png`, 1024×1536.

1. **Abajo a la derecha, dos charcas en vez de una.** Deja la **charca de colores** (Yellowstone) donde está, abajo. **Justo encima**, entre ella y las flores rosas, añade una **charca azul pequeña y poco profunda con rocas y guijarros**, y sobre ella un **trilobites** y un **amonites** fósiles, bien visibles.
2. **Los dos fósiles del suelo** (la libélula gigante y el pez de aletas robustas) van **a la IZQUIERDA de las dos columnas blancas**, no a la derecha. Los arbolitos que hay ahora a la izquierda de las columnas pueden pasar a donde estaban los fósiles.
3. **La flor y la charca de la roca negra se intercambian el sitio, más o menos:**
   - la **charca azul con la roca negra** (es el **impacto de un meteorito**) va **a la derecha, casi encima del volcán y un poco a su izquierda**;
   - la **flor gigante** va **a la izquierda**, en la curva del camino donde ahora está la charca.
4. **Entre el volcán y la flor**, pinta en el suelo unas **huellas de dinosaurio** en fila: tres dedos gruesos, como las de un dinosaurio grande.
5. **Arriba, en el centro-derecha, quita el edificio con columnas** (parece un templo griego y en el parque no hay nada así). En su lugar: un **hogar de piedras en círculo** con un fuego pequeño y **unos huesos** al lado.

Nada de texto ni números, como siempre. Al acabar, pon `M1` y `M3` una junto a otra y comprueba que **solo** cambian esas cinco cosas.

## 11. Lote 6, paradas 3, 4, 5, 6, 8, 9 y 10 — HECHO Y REVISADO (26-sep-2026)

Todo en el **estilo 1** y con las reglas de la sección 3 (sin texto, anatomía cuidada, sin huecos transparentes dentro de las figuras). Guarda en `arte/lote-06/`. Si es mucho de una vez, hazlo por partes (A, B, C…) y avisa a Álvaro de cuál has terminado.

**Regla de oro de este lote: no juntes en una escena seres que no convivieron.** Cada portada es un momento concreto; la tabla dice cuál.

### A. Portadas (1024×1536, con fondo, sin Alba, luminosas)

| Archivo | Escena |
|---|---|
| `D3_parada03_portada.png` | Un **mar poco profundo del Devónico**, visto por dentro del agua, con luz: en el fondo arenoso caminan **trilobites** (cuerpo ovalado dividido en tres a lo largo, muchos segmentos, antenas cortas) y por encima nadan **amonites** (concha en espiral plana con costillas; de la abertura salen unos diez brazos cortos y un ojo grande; que no parezcan caracoles). Algún crinoide o coral. Nada de peces modernos ni tiburones. |
| `D4_parada04_portada.png` | La **orilla de un río del Devónico**: columnas altas, blancas y rugosas de **Prototaxites** entre plantas diminutas (tallos verdes sin hojas, de un palmo como mucho); en el agua poco profunda, un **Tiktaalik** asomando la cabeza plana con los ojos encima. **Sin libélulas gigantes** (llegaron setenta millones de años después), sin hierba, sin flores, sin árboles grandes. |
| `D5_parada05_portada.png` | Un **bosque del Devónico**: árboles de **Archaeopteris** (tronco recto; copa alargada de ramas con ramitas planas cubiertas de hojitas en forma de abanico, como frondas de helecho, **nada de agujas**), y algún árbol tipo helecho gigante (**Wattieza**: tronco recto con un penacho de ramas arriba, sin que parezca una palmera). Suelo con plantas bajas y musgo. **Sin flores, frutos, piñas, hierba ni animales grandes.** |
| `D6_parada06_portada.png` | **Las primeras flores**, hace unos ciento veinte millones de años: plantas bajas y arbustos con **flores sencillas de muchos pétalos, blancas o crema, parecidas a las de una magnolia o un nenúfar**, junto a un lago, entre helechos y coníferas; **escarabajos** posados en las flores. **Sin abejas ni mariposas** (llegaron después), sin hierba. |
| `D8_parada08_portada.png` | **Pangea rompiéndose**, hace unos doscientos millones de años: una llanura cruzada por **grietas larguísimas de las que sale lava** en cortinas de fuego (no un volcán con cono), y a lo lejos el mar empezando a entrar en la grieta. Cielo con nubes de gas. Sin animales en primer plano. |
| `D9_parada09_portada.png` | La **orilla fangosa de un lago del Cretácico inferior** (la península ibérica hace unos ciento veinte millones de años): en el barro, un **rastro de huellas de tres dedos** en fila que se aleja; al fondo, dos **iguanodontes** (cabeza alargada con pico, pulgar en pincho, cola recta en el aire) caminando. Helechos, colas de caballo, cícadas y coníferas. Sin hierba. |
| `D10_parada10_portada.png` | **El atardecer del último día de los grandes dinosaurios**, sin nada violento: un cielo naranja con una **estela brillante** que cruza muy alta; en primer plano, sobre una rama, **dos pájaros pequeños**, y en el suelo, un **mamífero diminuto** peludo (como una musaraña) mirando al cielo. Son los que sobrevivirán. Nada de dinosaurios muriendo ni fuego. |

### B. Pegatinas (1024×1024, fondo transparente, como las del lote 4)

| Archivo | Dibujo | Color del círculo |
|---|---|---|
| `K3_pegatina_parada03.png` | un amonites | turquesa `#3fb5b0` |
| `K4_pegatina_parada04.png` | un Tiktaalik de cuerpo entero, con sus aletas delanteras «con codo» | verde agua `#8fcfb6` |
| `K5_pegatina_parada05.png` | un Archaeopteris (el árbol de la portada D5) | verde bosque `#4f8a3a` |
| `K6_pegatina_parada06.png` | una flor de cerezo de cinco pétalos con una abeja | rosa `#f2a6c0` |
| `K8_pegatina_parada08.png` | un volcán en erupción, amable | naranja `#e8743b` |
| `K9_pegatina_parada09.png` | una huella de dinosaurio de tres dedos en el barro | arena `#d9b27c` |
| `K10_pegatina_parada10.png` | un pajarito posado y, detrás, en el cielo, la estela de un meteorito | azul atardecer `#5a6fb0` |

### C. Piezas de los juegos (1024×1024, fondo transparente, cuerpo entero, sin sombra en el suelo)

**Parada 3, «¿Cómo se hace un fósil?»:** cuatro tarjetas **con fondo** (no transparentes), cuadradas, del **mismo amonites**. Las describe con precisión el guion: `contenido/guiones/parada-03-la-vida-nace-en-el-agua.md`, sección «Reto», puntos 1 a 4. Archivos: `F1_fosil_vivo.png`, `F2_fosil_barro.png`, `F3_fosil_piedra.png`, `F4_fosil_aparece.png` (en la 4 sale Alba, idéntica a su ficha).

**Parada 6, «Poliniza las flores»:** `G1_flor_cerezo.png` (flor de cerezo abierta, cinco pétalos rosa muy claro, vista de frente), `G2_abeja.png` (abeja amable con granitos de polen amarillo pegados a los pelos de las patas) y `G3_cereza.png` (una cereza roja con su rabito).

**Parada 9, «¿De quién es la huella?»:** los tres dinosaurios, de perfil, **con los pies bien visibles**. La tabla del guion (`contenido/guiones/parada-09-huellas-de-dinosaurio.md`, sección «Reto») dice cómo es cada uno: `H1_teropodo.png` (carnívoro mediano de dos patas; **que no sea un alosaurio calcado**), `H2_iguanodonte.png` y `H3_sauropodo.png` (como el brontosaurio de la sección 3, adulto).

**Parada 10, «¿Quién sobrevivió?»:** `S1_tiranosaurio.png` (brazos de **dos dedos**, cola recta en el aire), `S2_amonites.png`, `S3_pterosaurio.png` (reptil volador de cabeza grande **sin dientes** y cresta, alas de piel; que no parezca un ave), `S4_ave.png` (un pájaro pequeño de suelo, tipo codorniz, **sin dientes**), `S5_cocodrilo.png` y `S6_mamifero.png` (del tamaño de una musaraña, con pelo).

### Revisión de Claude

Aprobado e integrado. Muy buen nivel. Único detalle: en `H3_sauropodo` el cuello va casi vertical; se acepta porque en la península hubo braquiosáuridos, que lo llevaban alto.

## 12. LOTE ACTIVO: lote 7, paradas 1, 11, 12, 14, 15, 17, 20 y la parada secreta

Todo en el **estilo 1**, con las reglas de la sección 3. Guarda en `arte/lote-07/`. Puedes hacerlo por partes (A, B, C…).

### A. Portadas (1024×1536, con fondo, sin Alba salvo donde se diga)

| Archivo | Escena |
|---|---|
| `D1_parada01_portada.png` | **Alba** en la entrada del parque, mirando su **reloj del tiempo** con ilusión; detrás, un camino que se pierde entre dinosaurios, volcanes y cabañas, a lo lejos y en pequeño. **En el reloj, la huella de dinosaurio con TRES dedos gruesos**, no con cinco (en la ficha de Alba salió como una segunda mano). |
| `D11_parada11_portada.png` | Una playa de roca volcánica negra de las Galápagos: una **tortuga gigante** junto a una **chumbera alta** de tronco grueso y flores amarillas, un pinzón posado y, en el mar, un velero de principios del siglo diecinueve. |
| `D12_parada12_portada.png` | Una llanura de ceniza gris bajo un cielo nublado, con un volcán humeando al fondo: dos **australopitecos** caminando erguidos, de espaldas, dejando huellas en la ceniza húmeda. Cuerpo peludo, brazos algo largos, **caminan sobre dos pies**; sin ropa ni herramientas. |
| `D14_parada14_portada.png` | De noche, junto a un **hogar de piedras** con fuego: una familia **neandertal** (hombres, mujeres y niños; cuerpo robusto, cara ancha con arcos sobre los ojos, nariz grande; **erguidos**, vestidos con pieles). Uno tiene un brazo vendado y otro le da de comer. Nada de garrotes ni de gestos brutos. |
| `D15_parada15_portada.png` | Un **arbusto** muy ramificado, dibujado como un árbol de la vida, con pequeños retratos de especies humanas en las puntas de sus ramas (australopiteco, *Homo erectus*, neandertal, persona actual) y muchas ramas secas; **no una fila de monos que se van poniendo de pie**. |
| `D17_parada17_portada.png` | Un grupo de **cazadores-recolectores** de la Edad de Hielo recogiendo su campamento de **tiendas de pieles**: fardos a la espalda, lanzas, niños ayudando, un perro. Estepa fría con renos a lo lejos. Nada de plumas de «indios» de película. |
| `D20_parada20_portada.png` | Los **tejados planos** de Çatalhöyük, casas de adobe pegadas unas a otras, **sin calles**; la gente camina y trabaja sobre los tejados; de algunos agujeros asoma una **escalera**; al fondo, una montaña volcánica de dos picos. |

### B. Pegatinas (1024×1024, fondo transparente, como las de los lotes 4 y 6)

| Archivo | Dibujo | Color del círculo |
|---|---|---|
| `K1_pegatina_parada01.png` | el reloj del tiempo de Alba (cuatro símbolos; huella de TRES dedos) | verde azulado `#2a9d8f` |
| `K11_pegatina_parada11.png` | una tortuga gigante de las Galápagos | verde lima `#a7c957` |
| `K12_pegatina_parada12.png` | dos huellas de pie humano descalzo en la ceniza | gris ceniza `#b8b0a2` |
| `K14_pegatina_parada14.png` | una hoguera con piedras alrededor | naranja fuego `#e76f51` |
| `K15_pegatina_parada15.png` | un cráneo humano de perfil, simpático (que no dé miedo) | crema `#e9d8a6` |
| `K17_pegatina_parada17.png` | una tienda de pieles | marrón `#a0754a` |
| `K20_pegatina_parada20.png` | una escalera que sale de un agujero en un tejado plano | adobe `#d4a373` |
| `K100_pegatina_secreta.png` | un **cofre del tesoro** abierto junto a un pozo de piedra con dos palos cruzados en X encima | dorado `#e9c46a` |

### C. Piezas de los juegos (1024×1024, fondo transparente salvo que se diga)

**Parada 1, «El reloj del tiempo»:** cuatro tarjetas **con fondo**, cuadradas, descritas en `contenido/guiones/parada-01-bienvenida.md`, sección «Reto»: `R1_microbios.png`, `R2_mar_trilobites.png`, `R3_dinosaurios.png`, `R4_personas_cueva.png`.

**Parada 11, «Cada pico, su comida»:** los tres pinzones y sus tres comidas, tal como los describe `contenido/guiones/parada-11-galapagos-darwin.md` (sección «Reto»): `P1_pinzon_semillas.png`, `P2_pinzon_insectos.png`, `P3_pinzon_cactus.png` (**los tres del mismo tamaño y en la misma postura: solo cambia el pico**), `P4_semillas.png`, `P5_insectos.png`, `P6_flor_cactus.png`.

**Parada 12, «Detectives de Laetoli»:** `E1_laetoli_suelo.png`, **1536×1024 horizontal, con fondo**: la escena descrita en `contenido/guiones/parada-12-huellas-de-laetoli.md`, sección «Reto» (el suelo de ceniza visto desde arriba con las cuatro pistas: el rastro de pisadas, las huellas de elefante, las marcas de lluvia y el volcán al fondo). Las pisadas, **con el dedo gordo en línea con los demás**.

**Parada 14, «¿Verdad o mito?»:** seis tarjetas **con fondo**, cuadradas: `V1_hoguera.png` (neandertales haciendo una hoguera), `V2_tallar.png` (tallando una piedra), `V3_cuidar.png` (cuidando a un herido), `V4_cazar.png` (cazando un ciervo o un bisonte en grupo), `V5_nudillos.png` (un neandertal caricaturesco caminando encorvado con los nudillos en el suelo, **con un gesto de «¡esto es falso!»**, por ejemplo tachado con una cruz roja dibujada), `V6_dinosaurio.png` (un neandertal montado en un dinosaurio, **también tachado**). Neandertales como en la portada D14.

**Parada 15, «Encuentra las diferencias»:** `C1_craneos.png`, **1536×1024 horizontal, fondo claro liso**: dos cráneos de perfil mirando a la derecha, a la izquierda el de un **chimpancé** (bóveda baja, cara que sobresale como un hocico, **colmillos grandes**, sin barbilla) y a la derecha el de una **persona actual** (frente alta, cráneo redondo, **cara plana** bajo la frente, **colmillos pequeños**, **barbilla**). Anatomía correcta, simpáticos, nada de miedo. Mismo tamaño aproximado.

**Parada 17, «¡Nos mudamos!»:** seis tarjetas **con fondo**, cuadradas, descritas en `contenido/guiones/parada-17-poblados-nomadas.md` (sección «Reto»): `N1_pieles.png`, `N2_herramientas.png`, `N3_lanza.png`, `N4_collar.png`, `N5_casa_piedra.png`, `N6_campo_trigo.png`.

## 13. Próximos lotes (NO generar todavía)

- `D1` rehecha en el estilo 1, si Álvaro lo pide.
- Lo que haga falta para las paradas que faltan.
