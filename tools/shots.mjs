// Screenshot sink for browser QA when the browser pane is hidden (its screenshots then fail): the page renders a frame itself and POSTs
// it as a data URL (text/plain, so no CORS preflight) to  http://127.0.0.1:8766/shot?name=<name>  and this server writes
// tools/shots/<name>.jpg. Usage: node tools/shots.mjs [port]   (from the bayit1 folder). In the page (after the model loaded):
//   window.__look = (p, t) => { const c = __TM_CTX; c.camera.position.set(...p); c.controls.target.set(...t); c.controls.update(); };
//   window.__shot = (name, w = 960, h = 720) => { const c = __TM_CTX, r = c.renderer, el = r.domElement, W = el.clientWidth, H = el.clientHeight;
//     r.setPixelRatio(1); r.setSize(w, h, false); c.camera.aspect = w / h; c.camera.updateProjectionMatrix();
//     for (const fn of c.animated) { try { fn(performance.now()); } catch (e) {} } r.render(c.scene, c.camera);
//     const d = el.toDataURL('image/jpeg', 0.85); r.setSize(W, H, false); c.camera.aspect = W / H; c.camera.updateProjectionMatrix();
//     return fetch('http://127.0.0.1:8766/shot?name=' + name, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: d }).then((x) => x.text()); };
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const port = +(process.argv[2] || 8766);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), 'shots');
fs.mkdirSync(root, { recursive: true });
http.createServer((req, res) => {
  const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); res.end(); return; }
  const u = new URL(req.url, 'http://x');
  if (req.method === 'POST' && u.pathname === '/shot') {
    const name = (u.searchParams.get('name') || 'shot').replace(/[^\w.-]/g, '_');
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');
      const m = /^data:image\/(png|jpeg);base64,(.*)$/s.exec(body);
      if (!m) { res.writeHead(400, cors); res.end('no data url'); return; }
      const file = path.join(root, name + (m[1] === 'png' ? '.png' : '.jpg'));
      fs.writeFileSync(file, Buffer.from(m[2], 'base64'));
      res.writeHead(200, cors); res.end('saved ' + file + ' ' + m[2].length);
    });
    return;
  }
  res.writeHead(404, cors); res.end('not found');
}).listen(port, '127.0.0.1', () => console.log('shots server on http://127.0.0.1:' + port + ' -> ' + root));
