// Run inside the plugin page (browser pane javascript tool) after the model loaded.
// Cycles through every view and place button, collects console errors, reports label/mesh counts and the camera presets.
(async () => {
  const out = { errors: [], views: [], places: [], layers: {}, counts: {} };
  const ctx = window.__TM_CTX || window.__ctx;
  if (!ctx) return { fatal: 'no ctx' };
  const origErr = console.error;
  console.error = (...a) => { out.errors.push(a.map(String).join(' ').slice(0, 300)); origErr.apply(console, a); };
  let meshes = 0, tris = 0, inst = 0;
  ctx.root.traverse((o) => {
    if (o.isMesh) { meshes++; const g = o.geometry; const n = g && g.index ? g.index.count / 3 : (g && g.attributes && g.attributes.position ? g.attributes.position.count / 3 : 0); tris += n * (o.isInstancedMesh ? o.count : 1); if (o.isInstancedMesh) inst++; }
  });
  out.counts = { meshes, instanced: inst, triangles: Math.round(tris), labels: (ctx.labels || []).length, cutaway: (ctx.cutaway || []).length, animated: (ctx.animated || []).length };
  for (const k of Object.keys(ctx.layers || {})) out.layers[k] = { children: ctx.layers[k].children.length, visible: ctx.layers[k].visible };
  out.flyPoints = Object.keys((ctx.shared && ctx.shared.flyPoints) || {});
  out.shared = Object.keys(ctx.shared || {});
  const vb = [...document.querySelectorAll('#tm-views button')];
  for (const b of vb) { try { b.click(); await new Promise(r => setTimeout(r, 120)); out.views.push(b.textContent); } catch (e) { out.errors.push('view ' + b.textContent + ': ' + e.message); } }
  const pb = [...document.querySelectorAll('details.tm-pl button')];
  for (const b of pb) { try { b.click(); await new Promise(r => setTimeout(r, 60)); out.places.push(b.textContent); } catch (e) { out.errors.push('place ' + b.textContent + ': ' + e.message); } }
  const cf = document.querySelector('#tm-confirm .n'); if (cf) cf.click();
  return out;
})();
