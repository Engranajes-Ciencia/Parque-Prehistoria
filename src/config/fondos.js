const BASE = import.meta.env.BASE_URL; 
// En tu caso BASE = "/Parque-Prehistoria/"

export const fondosMapa = [
    `${BASE}assets/form-fondo/fondo1.png`,
    `${BASE}assets/form-fondo/fondo2.png`,
    `${BASE}assets/form-fondo/fondo3.png`,
    `${BASE}assets/form-fondo/fondo4.png`,
    `${BASE}assets/form-fondo/fondo5.png`,
    `${BASE}assets/form-fondo/fondo6.png`,
    `${BASE}assets/form-fondo/sahara.png`,
    `${BASE}assets/form-fondo/sedentario.png`,
    `${BASE}assets/form-fondo/arboles.png`,
    `${BASE}assets/form-fondo/bienvenida.png`,
    `${BASE}assets/form-fondo/craneos.png`,
    `${BASE}assets/form-fondo/dinos.png`,
    `${BASE}assets/form-fondo/laetoli.png`,
    `${BASE}assets/form-fondo/meganeura.png`,
    `${BASE}assets/form-fondo/origen.png`,
    `${BASE}assets/form-fondo/pangea.png`,
];

export function fondoAleatorio() {
    const index = Math.floor(Math.random() * fondosMapa.length);
    return fondosMapa[index];
}






