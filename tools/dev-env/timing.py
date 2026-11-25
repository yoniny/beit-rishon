import sys
p=sys.argv[1]; s=open(p,encoding='utf8').read()
a=s.index("    if (cam.decideAt && t >= cam.decideAt) cam_decide();   // 1.2.0: after a wheel burst or a lift")
b=s.index("    ent_renderFrame();\n  });",a)+len("    ent_renderFrame();\n")
lines=s[a:b].split("\n")
out=["    const PH = window.__PH || (window.__PH = {}); const RN = () => new Event(\"x\").timeStamp; let T0 = RN(), T1; const M = (k) => { T1 = RN(); PH[k] = (PH[k] || 0) + T1 - T0; T0 = T1; };"]
marks={"ent_damp(":"damp","ent_zoomStep();":"zoom","ent_liftStep();":"lift","ent_walkStep();":"walk","cam_update();":"camupd","guardCamera();":"guard","try { tm_waterTick":"water","//@@slot after-guardCamera":"animated","cam_nearStep();":"near","ent_renderFrame();":"render"}
for ln in lines:
    out.append(ln); st=ln.strip()
    for k,v in marks.items():
        if st.startswith(k): out.append("    M('%s');"%v)
s=s[:a]+"\n".join(out)+s[b:]
old="""        fn(t);
      } catch (_) {
      }
    }
    //@@slot after-guardCamera"""
new="""        const tq = new Event("x").timeStamp; fn(t); const dq = new Event("x").timeStamp - tq; const AN = window.__AN || (window.__AN = new Map()); const st = AN.get(fn) || { s: 0, mx: 0, n1: 0, n3: 0 }; st.s += dq; if (dq > st.mx) st.mx = dq; if (dq > 1) st.n1++; if (dq > 3) st.n3++; AN.set(fn, st);
      } catch (_) {
      }
    }
    //@@slot after-guardCamera"""
assert s.count(old)==1; s=s.replace(old,new,1)
open(p,'w',encoding='utf8').write(s)
