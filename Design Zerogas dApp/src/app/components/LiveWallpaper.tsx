import { useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';

function MatrixCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    c.width = window.innerWidth; c.height = window.innerHeight;
    const cols = Math.floor(c.width / 18);
    const drops = Array(cols).fill(1);
    const chars = 'アイウエオカキクケコ0123456789ABCDEF</>{}[]';
    let raf: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(8,11,20,0.04)';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.font = '13px monospace';
      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.96 ? '#fff' : (Math.random() > 0.5 ? '#7C3AED' : '#06B6D4');
        ctx.fillText(ch, i * 18, drops[i] * 18);
        if (drops[i] * 18 > c.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-35" />;
}

function ParticlesCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    c.width = window.innerWidth; c.height = window.innerHeight;
    const pts = Array.from({ length: 100 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      color: Math.random() > 0.5 ? '#7C3AED' : '#06B6D4',
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(124,58,237,${0.12 * (1 - d / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > c.width) p.vx *= -1;
        if (p.y < 0 || p.y > c.height) p.vy *= -1;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-55" />;
}

function NebulaBg() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 50%,rgba(124,58,237,0.28) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(6,182,212,0.22) 0%,transparent 60%),radial-gradient(ellipse at 60% 80%,rgba(168,85,247,0.22) 0%,transparent 60%)', animation: 'nebulaPulse 8s ease-in-out infinite alternate' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 40%,rgba(236,72,153,0.14) 0%,transparent 50%)', animation: 'nebulaPulse 12s ease-in-out infinite alternate-reverse' }} />
      <style>{`@keyframes nebulaPulse{0%{transform:scale(1) rotate(0deg);opacity:.6}100%{transform:scale(1.15) rotate(3deg);opacity:1}}`}</style>
    </div>
  );
}

function GridBg() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(124,58,237,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.15) 1px,transparent 1px)', backgroundSize: '60px 60px', animation: 'gridScroll 18s linear infinite', maskImage: 'linear-gradient(to bottom,transparent 0%,black 20%,black 80%,transparent 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%,rgba(124,58,237,0.08) 0%,transparent 70%)' }} />
      <style>{`@keyframes gridScroll{0%{background-position:0 0}100%{background-position:0 60px}}`}</style>
    </div>
  );
}

function WavesBg() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[0,1,2,3].map(i => (
        <div key={i} className="absolute w-[200%] h-[200%]" style={{ bottom:`${-60+i*15}%`, left:'-50%', borderRadius:'40%', background: i%2===0 ? `rgba(124,58,237,${0.04+i*0.02})` : `rgba(6,182,212,${0.03+i*0.015})`, animation:`waveRotate ${18+i*4}s linear infinite ${i%2===0?'':'reverse'}`, transformOrigin:'50% 48%' }} />
      ))}
      <style>{`@keyframes waveRotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// NEW: Fireflies — glowing dots that drift and pulse
function FirefliesBg() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    c.width = window.innerWidth; c.height = window.innerHeight;
    const flies = Array.from({ length: 60 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 3 + 1,
      phase: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.03,
      hue: Math.random() > 0.5 ? 270 : 180, // purple or cyan
    }));
    let t = 0, raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      t += 0.016;
      for (const f of flies) {
        const pulse = (Math.sin(t * f.speed * 60 + f.phase) + 1) / 2;
        const alpha = 0.3 + pulse * 0.7;
        const radius = f.r * (0.8 + pulse * 0.6);
        // Glow
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, radius * 6);
        grad.addColorStop(0, `hsla(${f.hue},80%,65%,${alpha * 0.8})`);
        grad.addColorStop(1, `hsla(${f.hue},80%,65%,0)`);
        ctx.beginPath(); ctx.arc(f.x, f.y, radius * 6, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
        // Core dot
        ctx.beginPath(); ctx.arc(f.x, f.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${f.hue},90%,80%,${alpha})`; ctx.fill();
        // Drift with slight curve
        f.vx += (Math.random() - 0.5) * 0.01;
        f.vy += (Math.random() - 0.5) * 0.01;
        f.vx = Math.max(-0.5, Math.min(0.5, f.vx));
        f.vy = Math.max(-0.5, Math.min(0.5, f.vy));
        f.x += f.vx; f.y += f.vy;
        if (f.x < 0) f.x = c.width; if (f.x > c.width) f.x = 0;
        if (f.y < 0) f.y = c.height; if (f.y > c.height) f.y = 0;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
}

// NEW: Starfield — 3D warp speed stars
function StarfieldBg() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    c.width = window.innerWidth; c.height = window.innerHeight;
    const cx = c.width / 2, cy = c.height / 2;
    const stars = Array.from({ length: 200 }, () => ({
      x: (Math.random() - 0.5) * c.width,
      y: (Math.random() - 0.5) * c.height,
      z: Math.random() * c.width,
      pz: 0,
    }));
    let raf: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(8,11,20,0.2)';
      ctx.fillRect(0, 0, c.width, c.height);
      for (const s of stars) {
        s.pz = s.z;
        s.z -= 4;
        if (s.z <= 0) { s.x = (Math.random() - 0.5) * c.width; s.y = (Math.random() - 0.5) * c.height; s.z = c.width; s.pz = s.z; }
        const sx = (s.x / s.z) * c.width + cx;
        const sy = (s.y / s.z) * c.height + cy;
        const px = (s.x / s.pz) * c.width + cx;
        const py = (s.y / s.pz) * c.height + cy;
        const size = Math.max(0.1, (1 - s.z / c.width) * 3);
        const alpha = 1 - s.z / c.width;
        ctx.beginPath();
        ctx.moveTo(px, py); ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(180,160,255,${alpha * 0.8})`;
        ctx.lineWidth = size;
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-70" />;
}

// NEW: Lava Lamp — morphing blobs
function LavaBg() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[
        { color: 'rgba(124,58,237,0.18)', size: '60vw', x: '10%', y: '20%', dur: '12s' },
        { color: 'rgba(6,182,212,0.15)',  size: '50vw', x: '60%', y: '60%', dur: '15s' },
        { color: 'rgba(168,85,247,0.14)', size: '45vw', x: '30%', y: '70%', dur: '10s' },
        { color: 'rgba(236,72,153,0.12)', size: '40vw', x: '70%', y: '10%', dur: '18s' },
        { color: 'rgba(16,185,129,0.10)', size: '35vw', x: '50%', y: '40%', dur: '14s' },
      ].map((b, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: b.size, height: b.size,
            left: b.x, top: b.y,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
            filter: 'blur(40px)',
            animation: `lavaFloat${i} ${b.dur} ease-in-out infinite alternate`,
            transform: 'translate(-50%,-50%)',
          }} />
      ))}
      <style>{`
        @keyframes lavaFloat0{0%{transform:translate(-50%,-50%) scale(1) rotate(0deg)}100%{transform:translate(-30%,-60%) scale(1.3) rotate(120deg)}}
        @keyframes lavaFloat1{0%{transform:translate(-50%,-50%) scale(1.2) rotate(0deg)}100%{transform:translate(-70%,-40%) scale(0.8) rotate(-90deg)}}
        @keyframes lavaFloat2{0%{transform:translate(-50%,-50%) scale(0.9)}100%{transform:translate(-40%,-70%) scale(1.4) rotate(60deg)}}
        @keyframes lavaFloat3{0%{transform:translate(-50%,-50%) scale(1.1) rotate(0deg)}100%{transform:translate(-60%,-30%) scale(0.7) rotate(180deg)}}
        @keyframes lavaFloat4{0%{transform:translate(-50%,-50%) scale(1)}100%{transform:translate(-45%,-55%) scale(1.5) rotate(-120deg)}}
      `}</style>
    </div>
  );
}

export function LiveWallpaper() {
  const { user } = useUser();
  const w = user.settings.wallpaper;
  if (w === 'none')       return null;
  if (w === 'matrix')     return <MatrixCanvas />;
  if (w === 'particles')  return <ParticlesCanvas />;
  if (w === 'nebula')     return <NebulaBg />;
  if (w === 'grid')       return <GridBg />;
  if (w === 'waves')      return <WavesBg />;
  if (w === 'fireflies')  return <FirefliesBg />;
  if (w === 'starfield')  return <StarfieldBg />;
  if (w === 'lava')       return <LavaBg />;
  return null;
}
