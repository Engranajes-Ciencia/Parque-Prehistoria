# 🦖 Museo de la Prehistoria

**Museo de la Prehistoria** es una aplicación web interactiva desarrollada con React y Vite. Permite a los visitantes explorar un mapa del museo, acceder a juegos educativos mediante el escaneo de códigos QR y obtener información sobre las diferentes zonas y especies prehistóricas de forma intuitiva y visual.

---

## 🧭 Tabla de Contenidos

- [📷 Capturas de pantalla](#-capturas-de-pantalla)

    En esta sección se adjunta una serie de imágenes sobre el contenido del Parque.
    A continuación se hace referencia a cada parada (y su actividad correspondiente):
    *Parada 1 : 

    *Parada 2 : 
    *Parada 3 : 
    *Parada 4 : 
    *Parada 5 : 
    *Parada 6 : 
    *Parada 7 : 
    *Parada 8 : 
    *Parada 9 : 
    *Parada 10 : 
    *Parada 11: 
    *Parada 12 : 
    *Parada 13 : 
    *Parada 14 : 
    *Parada 15 : 
    *Parada 16 : 
    *Parada 17 : 
    *Parada 18 : 
    *Parada 19 : 
    *Parada 20 : 
    
- [🛠️ Tecnologías utilizadas](#-tecnologías-utilizadas)

    La aplicación web desarrollada para el Parque de la Prehistoria ha sido construida utilizando las siguientes tecnologías y herramientas:

        🔹 React.js
        Framework de JavaScript utilizado para construir toda la interfaz web de la aplicación. React permite una navegación fluida entre las distintas secciones del parque y gestiona la lógica necesaria para mostrar la información de las paradas, las actividades y el sistema de recompensas.

        🔹 Genially
        Herramienta externa empleada para la creación de juegos interactivos y actividades educativas.

        En el parque hay un total de 20 paradas:

        10 paradas ofrecen actividades interactivas desarrolladas en Genially.

        10 paradas cuentan únicamente con una audio guía.

        Todas las actividades también incluyen la opción de escuchar una guía en audio.

        Los usuarios acceden a estas actividades escaneando códigos QR distribuidos a lo largo del recorrido.

        🔹 Sistema de medallas y recompensas
        Al completar cada actividad en el recorrido, el usuario obtiene una medalla digital que se guarda automáticamente en su vitrina virtual.
        Al finalizar el recorrido, la aplicación muestra:

        Un resumen con todas las medallas recogidas.

        Dos diplomas personalizables (modo infantil y modo adulto), generados automáticamente con el nombre del usuario.

        🔹 jsPDF
        Biblioteca JavaScript utilizada para generar y firmar automáticamente los diplomas en PDF según el nombre introducido al comienzo del recorrido. Esto permite a los visitantes descargar y conservar su diploma como recuerdo de la experiencia.


- [🚀 Instalación y ejecución](#-instalación-y-ejecución)
            🔧 Requisitos previos
        Para poder ejecutar el proyecto en local, necesitas tener instalado en tu ordenador:

        *Node.js (versión recomendada: 18 o superior)

        *npm (gestor de paquetes que se instala con Node.js)

        *Git (para clonar el repositorio desde GitHub)

        *Editor de código recomendado: Visual Studio Code

            📥 Clonación del repositorio

        *Cada desarrollador debe seguir estos pasos para obtener el proyecto en su equipo:

        
        git clone https://github.com/Engranajes-Ciencia/Parque-Prehistoria.git

        Luego, entra en la carpeta del proyecto:

        
        cd Parque-Prehistoria

            📦 Instalación de dependencias
        Una vez dentro del proyecto, instala las dependencias necesarias con el siguiente comando:

       
        npm install

            ▶️ Ejecución del proyecto
        Para iniciar la aplicación en modo desarrollo:

        
        npm run dev


        ⚠️ Nota: El puerto puede variar si usas Vite o alguna otra herramienta. Ajusta según el caso.


- [📁 Estructura del proyecto](#-estructura-del-proyecto)

    A continuación se detalla el esquema árbol del directorio de carpetas de la aplicación:
            .
        public/  # Carpeta principal que contiene los recursos accesibles desde el navegador.
  
                ├─ assets/  # Almacena elementos visuales como imágenes, avatares y fondos.
                │  
                │  ├─ avatars/  # Guarda los avatares utilizados en el proyecto.
                │  
                │  ├─ form-fondo/  # Contiene imágenes de fondo utilizadas en formularios.
                │  
                │  ├─ images/  # Carpeta donde se almacenan imágenes generales del proyecto.
                │  │  
                │  │  ├─ imagesMedal/  # Posiblemente imágenes de medallas o logros.
                │  │  
                │  │  ├─ nogenially/  # Carpeta con imágenes específicas para la plataforma Genially.
                
                ├─ fonts/  # Almacena las fuentes tipográficas utilizadas en el proyecto.
                
                ├─ icons/  # Guarda los iconos gráficos que se usan en la interfaz.
                
                ├─ sounds/  # Contiene archivos de sonido para la aplicación.
                │  
                │  ├─ paradasaudio/  # Organiza los audios según idioma y tipo.
                │  │  
                │  │  ├─ ENG/  # Audios en inglés.
                │  │  │  
                │  │  │  ├─ Adultos/  # Audios dirigidos a adultos.
                │  │  │  
                │  │  │  ├─ Infantil/  # Audios dirigidos a niños.
                │  │  
                │  │  ├─ ESP/  # Audios en español.
                │  │  │  
                │  │  │  ├─ Adultos/  # Audios dirigidos a adultos.
                │  │  │  
                │  │  │  ├─ Infantil/  # Audios dirigidos a niños.

                404.html  # Página de error 404 que se muestra cuando un recurso no se encuentra.
                
                site.webmanifest  # Archivo de manifiesto web para configurar la Progressive Web App.
                
                vite.svg  # Archivo SVG, probablemente el logo de Vite, utilizado en el desarrollo.


        Explicación de cada carpeta:
        public: Es la carpeta que contiene archivos que estarán accesibles directamente desde el navegador, como imágenes, fuentes, iconos o archivos de audio.

        src: Contiene el código fuente de la app, donde se desarrollan los componentes de la interfaz de usuario, las configuraciones, los estilos y demás.

        assets: Aquí se almacenan recursos como imágenes o fuentes específicas de la app.

        components: Contiene los componentes reutilizables de la app, organizados por su propósito (comunes, estructuras de página o específicas de una página).

        config: Archivos de configuración que gestionan aspectos de la app, como rutas, configuraciones de estado, etc.

        styles: Donde se definen los estilos de la aplicación, ya sea con CSS o SASS.

- [⚙️ Funcionamiento](#️-funcionamiento)
        En esta sección, se describe cómo funciona la aplicación y cómo interactúan las diferentes partes del sistema. A continuación, se detallan las principales funcionalidades de la app:

        *Mapa interactivo:

        La aplicación presenta un mapa interactivo del parque prehistórico.

        En el mapa, los usuarios pueden ver 20 paradas señalizadas, cada una representando un punto de interés o actividad.

        *QR y actividades de Genially:

        En 10 paradas, se pueden encontrar juegos interactivos creados con Genially.

        Al escanear el QR en la parada, el usuario es redirigido a una actividad en Genially. Estas actividades incluyen juegos, cuestionarios y desafíos relacionados con la prehistoria.

        *Audioguías:

        En las otras 10 paradas, el usuario puede escuchar una audioguía relacionada con el tema de la parada.

        La audioguía está disponible tanto en las actividades como en las paradas con solo audio.

        *Sistema de medallas:

        A medida que los usuarios completan las actividades, reciben medallas que se almacenan en su vitrina personal dentro de la app.

        Las medallas están relacionadas con el rendimiento o la finalización de las actividades.

        Diplomas personalizados:

        Al finalizar el recorrido, los usuarios pueden obtener 2 diplomas: uno para niños y otro para adultos.

        Los diplomas incluyen el nombre del usuario (registrado al comenzar el recorrido) y se firman digitalmente utilizando la fuente de firma almacenada en la carpeta fontsPDF.

        Tecnologías utilizadas:

        React para la construcción de la interfaz de usuario.

        Genially para la creación de las actividades interactivas.

        QR como enlace directo a las actividades de Genially.

        JSPDF para generar los diplomas con las firmas.

        Flujo de usuario:

        El usuario inicia su recorrido en el mapa.

        Al seleccionar una parada, se le dirige a la actividad correspondiente (ya sea un juego o una audioguía).

        Tras completar cada actividad, el sistema otorga una medalla.

        Al finalizar, el usuario recibe sus diplomas y medallas.



- [🎙️ Información sobre audios](#-audios)
    
    En esta sección se añade detalladamente los textos a voz de cada parada:

        🎧 1. Bienvenida – Comienza la aventura
        Bienvenidos y bienvenidas al Parque de las Ciencias de la Prehistoria. Soy X y os invito a acompañarme en este viaje a través del tiempo, desde los orígenes de la vida en la Tierra hasta las primeras civilizaciones humanas. Aquí aprenderemos cómo evolucionaron las plantas, los animales y también nosotros, los seres humanos. Recordad: no toquéis las maquetas, cuidad el entorno y sobre todo… ¡disfrutad aprendiendo!
        ________________________________________
        🎧 2. El origen de la vida
        La Tierra se formó hace unos 4.500 millones de años. Al principio era un lugar sin vida, con volcanes, océanos hirvientes y una atmósfera irrespirable. Pero con el tiempo, aparecieron las primeras formas de vida en el agua: bacterias y algas microscópicas. Aunque parezcan simples, estos seres diminutos fueron el primer paso en una larga cadena evolutiva… que nos lleva hasta hoy.
        ________________________________________
        🎧 3. Las primeras plantas
        Hace unos 500 millones de años, la vida dio un salto muy importante: ¡salió del agua y conquistó la tierra firme! Las primeras plantas en hacerlo fueron los musgos, que no tenían tallo ni raíces y absorbían el agua directamente del suelo. Fueron los primeros pobladores verdes del planeta… y gracias a ellas, después pudieron llegar los animales.
        ________________________________________
        🎧 4. Prototaxites y Meganeuras
        En esta zona vemos dos seres muy distintos, pero igual de sorprendentes. Los Prototaxites eran hongos gigantes que podían alcanzar los 8 metros de altura. A su lado, una criatura que parece una libélula enorme: la Meganeura, un insecto que vivió en el periodo carbonífero y que podía cazar pequeños reptiles. Antes de los dinosaurios, estos eran los reyes de la Tierra.
        ________________________________________
        🎧 5. Los primeros árboles
        Con el paso del tiempo, las plantas se hicieron más complejas. Aparecieron los primeros árboles como los pinos, los ginkgos o las araucarias. Algunos desarrollaron frutos, lo que permitía que los animales ayudaran a esparcir sus semillas por nuevos territorios. Estos árboles dieron forma a los grandes bosques prehistóricos que cubrirían el planeta.
        ________________________________________
        🎧 6. Las primeras flores
        Durante millones de años, las plantas no tuvieron flores. Pero hace unos 150 millones de años aparecieron las angiospermas, es decir, las plantas con flor. Gracias a las flores y a los polinizadores, como las abejas, las plantas pudieron reproducirse más fácilmente y expandirse con rapidez. El mundo vegetal ya empezaba a parecerse al que conocemos hoy.
        ________________________________________
        🎧 7. Los primeros dinosaurios
        Ahora entramos en el Jurásico, la era de los grandes dinosaurios. Aquí encontramos al Triceratops, que comía plantas bajas como los helechos, y al Brontosaurio, que podía alcanzar las copas de los árboles. Todos estos gigantes eran herbívoros, y su tamaño asombroso estaba adaptado a un mundo donde las plantas crecían en abundancia.
        ________________________________________
        🎧 8. La deriva continental
        Hace millones de años, todos los continentes estaban unidos en una gran masa de tierra llamada Pangea. Con el tiempo, esta gran “isla” se fue fragmentando por el movimiento de las placas tectónicas. ¿Cómo lo sabemos? Gracias a los fósiles, que nos muestran restos idénticos en lugares hoy separados por océanos. La deriva continental aún continúa hoy.
        ________________________________________
        🎧 9. Los segundos dinosaurios
        En esta zona encontramos dinosaurios carnívoros, como los alosaurios y los dromeosaurios, que cazaban sobre dos patas. Algunos, como los velociraptores, tenían plumas y compartían rasgos con las aves actuales. Estos dinosaurios nos muestran que la evolución no siempre desaparece, a veces... ¡se transforma!
        ________________________________________
        🎧 10. Galápagos y Darwin
        Charles Darwin viajó a las islas Galápagos en el siglo XIX y descubrió allí algo fascinante: animales muy parecidos entre sí, pero con pequeñas diferencias que les ayudaban a sobrevivir en cada isla. Esto le llevó a formular la teoría de la evolución por selección natural: sólo sobrevive quien mejor se adapta al entorno. Una idea que cambió la ciencia para siempre.
        ________________________________________
        🎧 11. Las huellas de Laetoli
        En Tanzania, África, se encontraron unas huellas muy especiales: las huellas de Laetoli, con más de 3 millones de años. Pertenecen a un Australopithecus, un antepasado lejano del ser humano. Estas huellas demuestran que ya caminaban erguidos sobre dos piernas, como nosotros. Un gran paso en la evolución hacia el Homo sapiens.
        ________________________________________
        🎧 12. Atapuerca
        En España, en el yacimiento de Atapuerca, se han encontrado restos de varios tipos de homínidos. Es uno de los lugares más importantes del mundo para entender cómo hemos evolucionado. Allí aparecieron los restos de especies como el Homo antecessor, que nos ayuda a reconstruir el árbol genealógico de la humanidad.
        ________________________________________
        🎧 13. El hombre de Neandertal
        Durante mucho tiempo convivimos con otra especie humana: el Hombre de Neandertal. Fueron grandes cazadores, vivieron en climas fríos, y también usaban herramientas. Hoy sabemos que no se extinguieron del todo: muchas personas todavía conservan un pequeño porcentaje de ADN neandertal.
        ________________________________________
        🎧 14. Cráneos y evolución humana
        En este museo verás cráneos de distintas especies humanas y de otros primates. Fíjate en cómo ha cambiado la forma del cráneo para dejar espacio al cerebro, que en los humanos modernos es mucho más grande. Ese cerebro nos permitió comunicarnos, crear herramientas, formar grupos… y dar paso a la cultura y la sociedad.
        ________________________________________
        🎧 15. Cuevas y arte rupestre
        Las pinturas que encontrarás aquí son copias de las que se hicieron en cuevas como Lascaux, Chauvet o Nerja. Con pigmentos naturales y candiles, nuestros antepasados decoraban las paredes con animales, figuras humanas… y hasta manos sopladas. Estas pinturas no eran solo arte: también eran enseñanza, ritual y memoria colectiva.
        ________________________________________
        🎧 16. Los poblados nómadas
        Antes de construir casas, nuestros antepasados eran nómadas: se movían buscando comida y refugio. Vivían en tiendas como los tipis, fáciles de desmontar y transportar. Cazaban, recolectaban y decoraban sus cuerpos con plumas y collares. Lejos de ser primitivos, eran expertos en adaptarse al entorno.
        ________________________________________
        🎧 17. Primeros poblados sedentarios
        Con el cambio climático y el descubrimiento de la agricultura, algunas tribus dejaron de moverse y comenzaron a construir los primeros asentamientos fijos. Sembraban, criaban animales y almacenaban comida. Así surgieron los primeros pueblos, los templos, los líderes… y una nueva forma de vida: el sedentarismo.
        ________________________________________
        18. 🎧 Pinturas del Sáhara y de Laja Alta
        En este mural vemos escenas de la vida cotidiana en la Prehistoria. Destacan unas pinturas del Sáhara, en las que aparece un grupo cuidando del ganado, un reflejo realista de las primeras sociedades organizadas. Junto a la casa de Çatalhöyük se representa otra escena sorprendente: barcos de vela encontrados en Laja Alta, Cádiz. Aunque se pensó que eran fenicios, hoy sabemos que son mucho más antiguos, de la Edad del Cobre, y nos muestran que ya entonces… ¡navegaban los mares!

        ________________________________________
        🎧 19. Çatalhöyük
        Çatalhöyük, en Turquía, fue una de las primeras ciudades del mundo. Las casas no tenían puertas a ras del suelo, se entraba por el tejado. Allí ya había hornos, vasijas y hasta figuras religiosas, como la Diosa Madre, que protegía la fertilidad y la caza. Esta ciudad nos habla de espiritualidad, organización social… y del comienzo de las grandes civilizaciones.

        ________________________________________
        🎧 20. Stonehenge
        Ante vosotros tenéis una réplica de Stonehenge, un conjunto de piedras gigantes alineadas con la salida del sol en el solsticio de verano. Fue construido hace más de 4.000 años en Inglaterra y aún hoy no sabemos con certeza para qué servía. ¿Templo, calendario, lugar de reunión? Sea cual sea su función, nos recuerda que desde hace milenios, el ser humano observa el cielo, piensa en el tiempo… y construye en común.


