  // Conservative broad phase for the camera's exact ray tests. Large merged meshes and
  // widely spread instances have loose bounding spheres; testing their world boxes first
  // avoids visiting their triangles/instances when the ray cannot possibly hit them.
  // Bounds follow geometry edits, instance edits/counts, and parent/world transforms.
  // Keep Three.js's raycast as the final test (materials, sides, layers, near/far, hit order).
  function ent_makeRaycast() {
    const geometryBounds = new WeakMap(), objectBounds = new WeakMap();
    const instanceMatrix = new Matrix4(), instanceBox = new Box3();
    const version = (a) => a && (a.isInterleavedBufferAttribute ? a.data.version : a.version);
    const finite = (b) => Number.isFinite(b.min.x + b.min.y + b.min.z + b.max.x + b.max.y + b.max.z);
    const bounds = (o) => {
      const g = o.geometry, p = g && g.attributes && g.attributes.position;
      // A custom/deformed raycast may hit outside the ordinary vertex box. Let it run.
      if (!o.isMesh || o.isSkinnedMesh || o.isBatchedMesh || !p || p.isGLBufferAttribute ||
          (g.morphAttributes.position && g.morphAttributes.position.length) ||
          o.raycast !== (o.isInstancedMesh ? InstancedMesh.prototype.raycast : Mesh.prototype.raycast)) return null;
      let gb = geometryBounds.get(g);
      if (!gb) { gb = { box: new Box3(), position: null, version: -1, revision: 0 }; geometryBounds.set(g, gb); }
      const pv = version(p);
      if (gb.position !== p || gb.version !== pv) {
        gb.box.setFromBufferAttribute(p);
        gb.position = p;
        gb.version = pv;
        gb.revision++;
      }
      if (!finite(gb.box)) return null;
      let b = objectBounds.get(o);
      if (!b) {
        b = { local: new Box3(), world: new Box3(), matrix: new Float64Array(16), geometry: null,
          revision: -1, instances: null, version: -1, count: -1 };
        objectBounds.set(o, b);
      }
      const im = o.isInstancedMesh ? o.instanceMatrix : null, iv = version(im), count = im ? o.count : 0;
      let dirty = b.geometry !== g || b.revision !== gb.revision || b.instances !== im || b.version !== iv || b.count !== count;
      if (dirty) {
        if (im) {
          b.local.makeEmpty();
          for (let i = 0; i < count; i++) {
            o.getMatrixAt(i, instanceMatrix);
            b.local.union(instanceBox.copy(gb.box).applyMatrix4(instanceMatrix));
          }
        } else b.local.copy(gb.box);
        b.geometry = g;
        b.revision = gb.revision;
        b.instances = im;
        b.version = iv;
        b.count = count;
      }
      const e = o.matrixWorld.elements;
      for (let i = 0; i < 16; i++) if (b.matrix[i] !== e[i]) { b.matrix[i] = e[i]; dirty = true; }
      if (dirty) b.world.copy(b.local).applyMatrix4(o.matrixWorld).expandByScalar(1e-7);
      return finite(b.world) ? b.world : null;
    };
    const intersect = (ray, objects, hits = []) => {
      const candidates = [];
      for (const o of objects) {
        const box = bounds(o);
        if (!box || ray.ray.intersectsBox(box)) candidates.push(o);
      }
      return ray.intersectObjects(candidates, false, hits);
    };
    // Floor/roof/zoom queries need only the nearest hit. A floor should not pay for
    // the 96,800 terrain triangles underneath it. Visit boxes near-to-far and stop
    // only once their conservative entry distance exceeds the nearest exact hit.
    // Tied hits retain the input object's order, exactly as Raycaster's stable sort.
    const entry = new Vector3();
    intersect.first = (ray, objects) => {
      const candidates = [];
      for (let i = 0; i < objects.length; i++) {
        const o = objects[i], box = bounds(o);
        let distance = -Infinity;   // no conservative bound: this object must be tested
        if (box) {
          if (box.containsPoint(ray.ray.origin)) distance = 0;
          else {
            if (!ray.ray.intersectBox(box, entry)) continue;
            distance = ray.ray.origin.distanceTo(entry);
            if (distance > ray.far) continue;
          }
        }
        candidates.push({ o, distance, order: i });
      }
      candidates.sort((a, b) => a.distance - b.distance || a.order - b.order);
      let best = null, order = Infinity;
      const hits = [];
      for (const c of candidates) {
        if (best && c.distance > best.distance) break;
        ray.intersectObject(c.o, false, hits);
        const h = hits[0];
        if (h && (!best || h.distance < best.distance || h.distance === best.distance && c.order < order)) {
          best = h;
          order = c.order;
        }
        hits.length = 0;
      }
      return best;
    };
    return intersect;
  }
  var ent_intersect = ent_makeRaycast();

  // Match the zoom anchor's original post-hit filter, in the same depth-first order.
  // Prune whole hidden/label subtrees before their thousands of detail meshes are tested.
  function ent_pickable(root) {
    const out = [];
    const visit = (o) => {
      if (!o.visible || o.name === "labels") return;
      if (o.isMesh && !o.isSprite && !(o.userData && o.userData.noPick)) {
        const m = Array.isArray(o.material) ? o.material[0] : o.material;
        if (m && !(m.uniforms && m.uniforms.sunPosition) && !(m.transparent && m.opacity < 0.5) && m.visible !== false) out.push(o);
      }
      for (const c of o.children) visit(c);
    };
    visit(root);
    return out;
  }
