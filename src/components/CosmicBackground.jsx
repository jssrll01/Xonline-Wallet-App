import { useEffect, useRef } from 'react';
import './CosmicBackground.css';

export default function CosmicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skip canvas animations entirely for users who prefer reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let raf;
    let last = performance.now();
    const FRAME_MS = 1000 / 40; // cap to 40fps for battery/perf

    const shootingStars = [];
    const stars = [];

    const STAR_COUNT = Math.min(90, Math.floor((w * h) / 16000));
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.2,
        baseAlpha: Math.random() * 0.4 + 0.4,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.01,
      });
    }

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize, { passive: true });

    const spawn = () => {
      const startX = Math.random() * w * 0.7;
      const startY = Math.random() * h * 0.3;
      const angle = (Math.random() * 20 + 35) * (Math.PI / 180);
      const speed = Math.random() * 8 + 8;
      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        len: Math.random() * 100 + 80,
      });
    };

    const spawnTimer = setInterval(spawn, 4200);

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (now - last < FRAME_MS) return;
      last = now;

      ctx.clearRect(0, 0, w, h);

      // Stars
      for (const s of stars) {
        s.twinkle += s.speed;
        const a = s.baseAlpha + Math.sin(s.twinkle) * 0.3;
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0.1, a)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= 0.012;

        if (ss.life <= 0 || ss.x > w + 200 || ss.y > h + 200) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - ss.vx * (ss.len / 15);
        const tailY = ss.y - ss.vy * (ss.len / 15);

        const grad = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
        grad.addColorStop(0, `rgba(180,240,255,${ss.life})`);
        grad.addColorStop(0.4, `rgba(0,217,255,${ss.life * 0.6})`);
        grad.addColorStop(1, 'rgba(0,217,255,0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(spawnTimer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="cosmic-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="cosmic-canvas" />
      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />
      <div className="satellite-orbit">
        <div className="satellite">
          <div className="satellite-body">
            <div className="satellite-panel satellite-panel-left" />
            <div className="satellite-core">
              <div className="satellite-antenna" />
            </div>
            <div className="satellite-panel satellite-panel-right" />
          </div>
          <div className="satellite-glow" />
        </div>
      </div>
    </div>
  );
}
