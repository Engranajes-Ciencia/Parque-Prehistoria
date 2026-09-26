import { arrancar, pestana, BASE, espera, srv, sinRed, conRed, server } from "./prueba.mjs";

const cual = process.argv[2] ?? "A";
const { chrome, version } = await arrancar();
console.log("Navegador:", version, "| escenario", cual);
const out = (...a) => console.log(...a);
const botonTexto = (t) => `(() => { const b = [...document.querySelectorAll('button')].find(b => b.textContent.includes(${JSON.stringify(t)})); if (b) { b.click(); return true; } return false; })()`;
const texto = (t) => `document.body.innerText.includes(${JSON.stringify(t)})`;
const controlada = `!!navigator.serviceWorker.controller`;

async function paradaYEscuchar(t, espera_ms = 2500) {
  await t.ev(`location.hash = '#/parada/7'`);
  await espera(800);
  const sinGrabar = await t.ev(texto("aún no tiene audio grabado"));
  await t.ev(`document.querySelector('.boton-reproducir').click()`);
  await espera(espera_ms);
  const tiempo = await t.ev(`window.__audio ? Math.round(__audio.currentTime*10)/10 : null`);
  return { avisoSinAudio: sinGrabar, currentTime: tiempo, log: await t.ev(`JSON.stringify(__log)`) };
}

async function offlineYRecargar(t, borrarHttp = true) {
  sinRed();
  if (borrarHttp) await t.s("Network.clearBrowserCache"); // = han pasado más de 10 min (max-age=600)
  await t.recargar();
  return { app: await t.ev(`document.querySelector('#raiz')?.children.length > 0`), controlada: await t.ev(controlada) };
}

try {
  if (cual === "A") {
    // Camino feliz: el SW ya controla la página cuando se pulsa «Descargar la visita».
    const t = await pestana();
    await t.cargar(BASE);
    out("controla tras cargar:", await t.hasta(controlada, 15000));
    await t.ev(`location.hash = '#/recorrido'`);
    out("botón descargar visible:", await t.hasta(texto("Descargar la visita")), await t.ev(`document.querySelector('.descargar')?.innerText`));
    await t.ev(botonTexto("Descargar la visita"));
    out("descarga terminada:", await t.hasta(texto("La visita está guardada"), 120000));
    out("caches:", JSON.stringify(await t.cachesInfo()));
    out("estimate:", JSON.stringify(await t.ev(`navigator.storage.estimate().then(e => ({usageMB: Math.round(e.usage/1e6), quotaMB: Math.round(e.quota/1e6)}))`)), "persisted:", await t.ev(`navigator.storage.persisted()`));
    out("SIN RED:", JSON.stringify(await offlineYRecargar(t)));
    out("parada 7 sin red:", JSON.stringify(await paradaYEscuchar(t)));
    // Otra pista distinta, con los subtítulos avanzando
    out("peticiones al servidor tras cortar la red:", srv.log.filter((l) => l.startsWith("offline")).slice(0, 10));
  }

  if (cual === "B") {
    // Primera visita con red lenta: se pulsa «Descargar» antes de que el SW controle la página.
    srv.retrasoSW = 8000;
    const t = await pestana();
    await t.cargar(BASE);
    await t.ev(`location.hash = '#/recorrido'`);
    await t.hasta(texto("Descargar la visita"));
    out("controla al pulsar:", await t.ev(controlada));
    await t.ev(botonTexto("Descargar la visita"));
    out("descarga terminada:", await t.hasta(texto("La visita está guardada"), 120000));
    out("controla ya:", await t.hasta(controlada, 20000));
    out("caches:", JSON.stringify(await t.cachesInfo()));
    out("SIN RED:", JSON.stringify(await offlineYRecargar(t)));
    out("parada 7 sin red:", JSON.stringify(await paradaYEscuchar(t)));
    out("caches sin red:", JSON.stringify(await t.cachesInfo()));
  }

  if (cual === "C") {
    // Sin «Descargar»: escuchar con red; ¿se guarda el MP3 «al usarlo»? Luego, sin red.
    const t = await pestana();
    await t.cargar(BASE);
    out("controla:", await t.hasta(controlada, 15000));
    await t.recargar(); // segunda carga: el manifiesto ya pasa por el SW
    out("con red:", JSON.stringify(await paradaYEscuchar(t, 4000)));
    out("peticiones de audio al servidor:", srv.log.filter((l) => l.includes(".mp3")));
    out("caches:", JSON.stringify(await t.cachesInfo()));
    out("¿el MP3 escuchado está en «recursos»?", await t.ev(`caches.open('recursos').then(c => c.keys()).then(k => k.some(r => r.url.includes('p07-todos')))`));
    out("SIN RED:", JSON.stringify(await offlineYRecargar(t)));
    out("parada 7 sin red:", JSON.stringify(await paradaYEscuchar(t, 3000)));
  }

  if (cual === "D") {
    // Mala cobertura: la petición del MP3 no vuelve nunca.
    const t = await pestana();
    await t.cargar(BASE);
    out("controla:", await t.hasta(controlada, 15000));
    await t.recargar();
    srv.colgar = /\.mp3$/;
    out("cobertura colgada, 20 s después de pulsar:", JSON.stringify(await paradaYEscuchar(t, 20000)));
  }

  if (cual === "E") {
    // Se cae la conexión en un fichero a mitad de la descarga.
    const t = await pestana();
    await t.cargar(BASE);
    out("controla:", await t.hasta(controlada, 15000));
    await t.ev(`location.hash = '#/recorrido'`);
    await t.hasta(texto("Descargar la visita"));
    srv.fallar = /p09-peques/;
    await t.ev(botonTexto("Descargar la visita"));
    const fases = [];
    for (let i = 0; i < 100; i++) {
      const f = await t.ev(`document.querySelector('.descargar')?.innerText.split('\\n')[0].slice(0, 60)`);
      if (fases.at(-1) !== f) fases.push(f);
      await espera(250);
    }
    out("fases que ve el usuario:", fases);
    out("¿hay botón para reintentar?", await t.ev(`!!document.querySelector('.descargar button')`));
    out("caches:", JSON.stringify(await t.cachesInfo()));
  }

  if (cual === "F") {
    // Nueva versión de un audio (nueva huella): ¿se borra la vieja de la caché?
    const fs = await import("node:fs");
    const path = await import("node:path");
    const dir = path.join(import.meta.dirname, "site/Parque-Prehistoria/v2");
    const t = await pestana();
    await t.cargar(BASE);
    await t.hasta(controlada, 15000);
    await t.ev(`location.hash = '#/recorrido'`);
    await t.hasta(texto("Descargar la visita"));
    await t.ev(botonTexto("Descargar la visita"));
    await t.hasta(texto("La visita está guardada"), 120000);
    const antes = await t.cachesInfo();
    // «Despliegue» con p07-todos regrabado
    const viejo = JSON.parse(fs.readFileSync(path.join(dir, "recursos.json"), "utf8")).find((r) => r.url.startsWith("audio/p07-todos.")).url;
    const nuevo = "audio/p07-todos.00000000.mp3";
    fs.copyFileSync(path.join(dir, viejo), path.join(dir, nuevo));
    const rec = JSON.parse(fs.readFileSync(path.join(dir, "recursos.json"), "utf8")).map((r) => (r.url === viejo ? { ...r, url: nuevo } : r));
    fs.writeFileSync(path.join(dir, "recursos.json"), JSON.stringify(rec));
    await t.s("Network.clearBrowserCache");
    await t.recargar();
    await t.ev(`location.hash = '#/recorrido'`);
    await t.hasta(texto("Descargar la visita"));
    out("tras el despliegue la tarjeta dice:", await t.ev(`document.querySelector('.descargar')?.innerText`));
    await t.ev(`document.querySelector('.descargar button').click()`);
    await t.hasta(texto("La visita está guardada"), 60000); out("botón:", await t.ev(`document.querySelector(".descargar")?.innerText`));
    const despues = await t.cachesInfo();
    out("entradas en «recursos» antes/después:", antes.recursos.n, despues.recursos.n, "| ¿sigue el viejo?", await t.ev(`caches.open('recursos').then(c => c.match(new URL('${viejo}', location.href).href)).then(r => !!r)`));
  }
  if (cual === "G") {
    // Primera visita con la red colgada justo al pedir el manifiesto de audio (no falla, no
    // responde). A los 12 s la red se arregla sola, sin que el móvil note un «online».
    srv.colgar = /manifiesto\.json$/;
    const t = await pestana();
    await t.cargar(BASE);
    await espera(12000);
    srv.colgar = null;
    out("manifiesto pedido veces:", srv.log.filter((l) => l.includes("manifiesto.json")).length);
    await espera(28000); // el reintento llega a los 30 s del fallo (10 s de plazo + 30)
    out("tras arreglarse la red:", JSON.stringify(await paradaYEscuchar(t, 2500)));
  }
} catch (e) {
  console.error("ERROR", e);
} finally {
  chrome.kill();
  server.close();
  setTimeout(() => process.exit(0), 500);
}
