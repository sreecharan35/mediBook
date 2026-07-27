import { useEffect, useRef } from 'react';

function mkRand(seed) {
  let s = (seed ^ 0xdeadbeef) >>> 0;
  return () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return (s >>> 0) / 0xffffffff;
  };
}

const DNABackground = () => {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, SCALE = 1;

    const resize = () => {
      const parent = canvas.parentElement;
      W = canvas.width  = parent ? parent.offsetWidth  : window.innerWidth;
      H = canvas.height = parent ? parent.offsetHeight : window.innerHeight;
      SCALE = Math.min(W, H) / 900;
    };
    resize();
    window.addEventListener('resize', resize);

    /* ─── Pre-render sphere textures for N depth levels ────────────
       Each is a 64×64 offscreen canvas with the correct luminance.
       drawImage is ~10× faster than createRadialGradient per frame. */
    const DEPTH_STEPS = 16;
    const TEX = 64; // texture size in px

    const sphereTex = Array.from({ length: DEPTH_STEPS }, (_, di) => {
      const depth = di / (DEPTH_STEPS - 1);
      const oc  = document.createElement('canvas');
      oc.width  = oc.height = TEX;
      const oc2 = oc.getContext('2d');
      const r   = TEX / 2;
      const L   = Math.round(20 + depth * 215);
      const L2  = Math.round(L  * 0.28);
      const g   = oc2.createRadialGradient(
        TEX * 0.32, TEX * 0.32, TEX * 0.02,
        r, r, r
      );
      g.addColorStop(0,    'rgba(255,255,255,1)');
      g.addColorStop(0.26, `rgba(${L},${L},${L},1)`);
      g.addColorStop(0.65, `rgba(${L2},${L2},${L2},0.65)`);
      g.addColorStop(1,    'rgba(0,0,0,0)');
      oc2.beginPath();
      oc2.arc(r, r, r, 0, Math.PI * 2);
      oc2.fillStyle = g;
      oc2.fill();
      return oc;
    });

    /* ─── DNA parameters (kept lean for stable 60 fps) ─── */
    const NODES  = 28;   // nodes along helix axis
    const N_SPH  = 18;   // cluster spheres per strand-node  (28×2×18 = 1008)
    const RUNG_N = 5;    // rung spheres between strands     (28×5   =  140)
                         // Total per frame: ~1148 drawImage calls
    const TURNS  = 4;
    const TILT   = -32 * Math.PI / 180;
    const SPEED  = 0.005;

    /* ─── Pre-build cluster offsets (seeded → fixed during rotation) ─── */
    const clusters = Array.from({ length: NODES }, (_, i) =>
      [0, 1].map(strand => {
        const rng = mkRand(i * 7919 + strand * 3701 + 424242);
        return Array.from({ length: N_SPH }, () => {
          const big  = rng() < 0.15;
          const dist = big
            ? 22 + rng() * 28          // occasional large outlier (22–50 unit-px)
            : Math.pow(rng(), 2.5) * 20; // tight core (0–20 unit-px)
          const az = rng() * Math.PI * 2;
          const el = (rng() - 0.5) * Math.PI * 0.9;
          return {
            lPerp : Math.cos(el) * Math.cos(az) * dist,
            lAxis : Math.sin(el) * dist * 0.5,
            lDepth: Math.cos(el) * Math.sin(az) * dist * 0.42,
            r     : big
              ? 6  + rng() * 12          // 6–18 unit-px
              : 2  + Math.pow(1 - rng(), 2.8) * 10, // 2–12 unit-px
          };
        });
      })
    );

    /* ─── Fast sphere draw using pre-rendered texture ─── */
    function drawSphere(x, y, r, depth) {
      if (r < 0.4) return;
      const di = Math.min(DEPTH_STEPS - 1, Math.floor(depth * DEPTH_STEPS));
      ctx.globalAlpha = 0.38 + depth * 0.62;
      ctx.drawImage(sphereTex[di], x - r, y - r, r * 2, r * 2);
    }

    let angle = 0;

    function frame() {
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, W, H);

      const axDx =  Math.cos(TILT);
      const axDy =  Math.sin(TILT);
      const pDx  = -axDy;
      const pDy  =  axDx;
      const cx   = W * 0.5;
      const cy   = H * 0.5;
      const SL   = Math.hypot(W, H) * 0.96;
      const amp  = Math.min(W, H) * 0.18;
      const sc   = SCALE;

      const all = [];

      for (let i = 0; i < NODES; i++) {
        const t    = i / (NODES - 1);
        const bx   = cx + (t - 0.5) * SL * axDx;
        const by   = cy + (t - 0.5) * SL * axDy;
        const hPh  = t * Math.PI * 2 * TURNS;

        const nd = [null, null];

        for (let s = 0; s < 2; s++) {
          const theta = hPh + angle + (s === 0 ? 0 : Math.PI);
          const cosT  = Math.cos(theta);
          const sinT  = Math.sin(theta);
          const nx    = bx + cosT * amp * pDx;
          const ny    = by + cosT * amp * pDy;
          const depth = (sinT + 1) * 0.5;     // 0 = back, 1 = front

          nd[s] = { x: nx, y: ny, depth };

          for (const sp of clusters[i][s]) {
            const sx = nx + sp.lPerp * sc * pDx + sp.lAxis * sc * axDx;
            const sy = ny + sp.lPerp * sc * pDy + sp.lAxis * sc * axDy;
            const d  = Math.max(0, Math.min(0.999,
              depth + sp.lDepth * sc / 90
            ));
            all.push({ x: sx, y: sy, r: sp.r * sc * (0.45 + d * 0.55), depth: d });
          }
        }

        /* Rung cross-bar between the two strands */
        const n0 = nd[0], n1 = nd[1];
        if (n0 && n1) {
          for (let k = 1; k < RUNG_N + 1; k++) {
            const f = k / (RUNG_N + 1);
            const d = Math.max(0, Math.min(0.999,
              n0.depth + (n1.depth - n0.depth) * f
            ));
            all.push({
              x: n0.x + (n1.x - n0.x) * f,
              y: n0.y + (n1.y - n0.y) * f,
              r: (1.5 + d * 3) * sc,
              depth: d,
            });
          }
        }
      }

      /* Sort back-to-front then draw */
      all.sort((a, b) => a.depth - b.depth);
      for (const sp of all) drawSphere(sp.x, sp.y, sp.r, sp.depth);

      ctx.globalAlpha = 1;
      angle += SPEED;
      animRef.current = requestAnimationFrame(frame);
    }

    frame();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
        opacity: 0.55,
      }}
    />
  );
};

export default DNABackground;
