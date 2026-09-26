// Banco de pruebas de la visita SIN COBERTURA (27-sep-2026). Sirve una copia recién hecha
// de v2/dist bajo /Parque-Prehistoria/v2/ imitando a GitHub Pages (max-age=600, 206 con
// Range), maneja un Chrome sin ventana por CDP y corta la red de verdad (cierra sockets).
//
// Uso (desde esta carpeta, con la app ya compilada: cd ../../v2; npm run build):
//   node escenarios.mjs A   camino feliz: descargar la visita, cortar la red, escuchar
//   node escenarios.mjs B   primera visita con red lenta (se pulsa antes de que el SW mande)
//   node escenarios.mjs C   sin descargar: lo escuchado con red, ¿suena sin ella?
//   node escenarios.mjs D   cobertura colgada: el MP3 no llega (a los 5 s, voz del navegador)
//   node escenarios.mjs E   se cae la conexión a media descarga (debe dejar reintentar)
//   node escenarios.mjs F   audio regrabado tras descargar (debe decir «Actualizar»)
// Necesita Chrome en C:/Program Files/Google/Chrome. Las carpetas site/ y perfil/ son
// desechables (están en .gitignore).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawn } from "node:child_process";

const RAIZ = path.join(import.meta.dirname, "site");
// Copia limpia de la compilación en cada ejecución (el escenario F modifica la suya).
const DIST = path.join(import.meta.dirname, "../../v2/dist");
if (!fs.existsSync(DIST)) throw new Error("Falta v2/dist: compila antes (cd v2; npm run build)");
fs.rmSync(RAIZ, { recursive: true, force: true });
fs.cpSync(DIST, path.join(RAIZ, "Parque-Prehistoria/v2"), { recursive: true });
const PUERTO = 8765;
const BASE = `http://localhost:${PUERTO}/Parque-Prehistoria/v2/`;
const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "application/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".webmanifest": "application/manifest+json; charset=utf-8", ".mp3": "audio/mp3", ".webp": "image/webp", ".png": "image/png" };

export const srv = { modo: "online", retrasoSW: 0, colgar: null, fallar: null, log: [] };
const sockets = new Set();
const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  const p = decodeURIComponent(url.pathname);
  srv.log.push(`${srv.modo} ${req.headers.range ? "R[" + req.headers.range + "] " : ""}${p}`);
  if (srv.modo === "offline") return req.socket.destroy();
  if (srv.colgar && srv.colgar.test(p)) return; // mala cobertura: nunca responde
  if (srv.fallar && srv.fallar.test(p)) return req.socket.destroy();
  if (p === "/Parque-Prehistoria/v2") { res.writeHead(301, { Location: "/Parque-Prehistoria/v2/" }); return res.end(); }
  let f = path.join(RAIZ, p);
  if (p.endsWith("/")) f = path.join(f, "index.html");
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404, { "Content-Type": "text/html" }); return res.end("404"); }
  const enviar = () => {
    const datos = fs.readFileSync(f);
    const h = { "Content-Type": TIPOS[path.extname(f)] ?? "application/octet-stream", "Cache-Control": "max-age=600", "Accept-Ranges": "bytes", ETag: '"' + crypto.createHash("md5").update(datos).digest("hex").slice(0, 12) + '"' };
    const r = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
    if (r) {
      const ini = r[1] ? +r[1] : 0, fin = r[2] ? Math.min(+r[2], datos.length - 1) : datos.length - 1;
      res.writeHead(206, { ...h, "Content-Range": `bytes ${ini}-${fin}/${datos.length}`, "Content-Length": fin - ini + 1 });
      return res.end(datos.subarray(ini, fin + 1));
    }
    res.writeHead(200, { ...h, "Content-Length": datos.length });
    res.end(datos);
  };
  if (p.endsWith("/sw.js") && srv.retrasoSW) setTimeout(enviar, srv.retrasoSW); else enviar();
});
server.on("connection", (s) => { sockets.add(s); s.on("close", () => sockets.delete(s)); });
export function sinRed() { srv.modo = "offline"; for (const s of sockets) s.destroy(); }
export function conRed() { srv.modo = "online"; }

// ------------------------------------------------------------------ Chrome + CDP
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
let ws, id = 0;
const pendientes = new Map();
const eventos = [];
function cdp(method, params = {}, sessionId) {
  return new Promise((ok, mal) => {
    const n = ++id;
    pendientes.set(n, { ok, mal, method });
    ws.send(JSON.stringify({ id: n, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
}

export async function arrancar() {
  await new Promise((r) => server.listen(PUERTO, r));
  const perfil = path.join(import.meta.dirname, "perfil");
  fs.rmSync(perfil, { recursive: true, force: true });
  const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new", "--remote-debugging-port=9333", `--user-data-dir=${perfil}`, "--autoplay-policy=no-user-gesture-required", "--no-first-run", "--no-default-browser-check", "--disable-extensions", "--mute-audio", "about:blank"], { stdio: "ignore" });
  let info;
  for (let i = 0; i < 50 && !info; i++) {
    await espera(200);
    info = await fetch("http://127.0.0.1:9333/json/version").then((r) => r.json()).catch(() => null);
  }
  ws = new WebSocket(info.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pendientes.has(d.id)) {
      const { ok, mal, method } = pendientes.get(d.id);
      pendientes.delete(d.id);
      d.error ? mal(new Error(method + ": " + JSON.stringify(d.error))) : ok(d.result);
    } else if (d.method) eventos.push(d);
  };
  return { chrome, version: info.Browser };
}

const SONDA = `
window.__log = [];
const t0 = performance.now(); const ms = () => Math.round(performance.now() - t0);
const play = HTMLMediaElement.prototype.play;
HTMLMediaElement.prototype.play = function () {
  const src = this.src.split('/').pop(); window.__audio = this;
  __log.push([ms(), 'play', src]);
  this.addEventListener('error', () => __log.push([ms(), 'media-error', src, this.error && this.error.code]));
  const p = play.call(this);
  p.then(() => __log.push([ms(), 'play-ok', src]), (e) => __log.push([ms(), 'play-rechazado', src, e.name]));
  return p;
};
if (window.speechSynthesis) {
  const hablar = speechSynthesis.speak.bind(speechSynthesis);
  speechSynthesis.speak = (u) => { __log.push([ms(), 'voz-navegador', u.text.slice(0, 30)]); hablar(u); };
}
const f = window.fetch;
window.fetch = function (i) {
  const u = String((i && i.url) || i).split('/').slice(-2).join('/');
  const p = f.apply(this, arguments);
  p.then((r) => __log.push([ms(), 'fetch', u, r.status]), (e) => __log.push([ms(), 'fetch-falla', u, String(e)]));
  return p;
};`;

export async function pestana() {
  const { browserContextId } = await cdp("Target.createBrowserContext");
  const { targetId } = await cdp("Target.createTarget", { url: "about:blank", browserContextId });
  const { sessionId } = await cdp("Target.attachToTarget", { targetId, flatten: true });
  const s = (m, p) => cdp(m, p, sessionId);
  await s("Page.enable"); await s("Runtime.enable"); await s("Network.enable");
  await s("Page.addScriptToEvaluateOnNewDocument", { source: SONDA });
  const ev = async (expression) => {
    const r = await s("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) return "EXCEPCION: " + (r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
    return r.result.value;
  };
  const cargar = async (url) => {
    const antes = eventos.length;
    await s("Page.navigate", { url });
    for (let i = 0; i < 150; i++) {
      if (eventos.slice(antes).some((e) => e.sessionId === sessionId && e.method === "Page.loadEventFired")) break;
      await espera(100);
    }
    await espera(300);
  };
  const recargar = async () => {
    const antes = eventos.length;
    await s("Page.reload", { ignoreCache: false });
    for (let i = 0; i < 150; i++) {
      if (eventos.slice(antes).some((e) => e.sessionId === sessionId && e.method === "Page.loadEventFired")) break;
      await espera(100);
    }
    await espera(500);
  };
  const hasta = async (expr, ms = 20000) => {
    for (let t = 0; t < ms; t += 200) {
      if (await ev(expr)) return true;
      await espera(200);
    }
    return false;
  };
  const cachesInfo = () => ev(`(async () => { const o = {}; for (const k of await caches.keys()) { const ks = await (await caches.open(k)).keys(); o[k] = { n: ks.length, json: ks.map(r => r.url).filter(u => u.endsWith('.json')).map(u => u.split('/').slice(-2).join('/')) }; } return o; })()`);
  return { s, ev, cargar, recargar, hasta, cachesInfo, cerrar: () => cdp("Target.disposeBrowserContext", { browserContextId }) };
}

export { BASE, espera, cdp, server };
