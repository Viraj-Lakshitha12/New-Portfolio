import React, { useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/lib/theme-context';

export default function ParticleText({ text, className = '' }) {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  const stateRef = useRef({
    particles: [],
    mouse: { x: null, y: null, radius: 90 },
    animationId: null,
  });

  const buildParticles = useCallback((canvas) => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;

    const isDark = document.documentElement.classList.contains('dark');
    const baseColor = isDark ? '255,255,255' : '15,15,15';
    const accentColor = isDark ? '#64d2ff' : '#0369a1';
    const accentColor2 = isDark ? '#a855f7' : '#7c3aed';

    const fontSize = window.innerWidth < 768 ? 36 : 66;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `900 ${fontSize}px "Inter","Segoe UI",sans-serif`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, W / 2, H / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const step = window.innerWidth < 768 ? 4 : 5;
    const particles = [];

    class Particle {
      constructor(x, y, color) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.size = Math.random() * 1.5 + 0.6;
        this.color = color;
        this.density = Math.random() * 20 + 8;
        this.vx = 0;
        this.vy = 0;
      }

      draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      update(mouse) {
        if (mouse.x != null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.vx -= (dx / dist) * force * this.density * 0.7;
            this.vy -= (dy / dist) * force * this.density * 0.7;
          }
        }
        this.vx += (this.baseX - this.x) * 0.08;
        this.vy += (this.baseY - this.y) * 0.08;
        // Friction
        this.vx *= 0.80;
        this.vy *= 0.80;
        this.x += this.vx;
        this.y += this.vy;
      }
    }

    for (let py = 0; py < imageData.height; py += step) {
      for (let px = 0; px < imageData.width; px += step) {
        if (imageData.data[(py * 4 * imageData.width) + (px * 4) + 3] > 128) {
          const r = Math.random();
          const color = r > 0.92
            ? accentColor2
            : r > 0.82
              ? accentColor
              : `rgba(${baseColor},${(Math.random() * 0.45 + 0.55).toFixed(2)})`;
          particles.push(new Particle(px / dpr, py / dpr, color));
        }
      }
    }

    stateRef.current.particles = particles;
  }, [text]);

  const startLoop = useCallback((canvas) => {
    if (stateRef.current.animationId) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { particles, mouse } = stateRef.current;
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mouse);
        particles[i].draw(ctx);
      }
      stateRef.current.animationId = requestAnimationFrame(loop);
    };
    stateRef.current.animationId = requestAnimationFrame(loop);
  }, []);

  // Size canvas
  const sizeCanvas = useCallback((canvas) => {
    const dpr = window.devicePixelRatio || 1;
    const container = canvas.parentElement;
    if (!container) return;
    canvas.width = container.clientWidth * dpr;
    canvas.height = (window.innerWidth < 768 ? 80 : 120) * dpr;
    canvas.style.width = `${container.clientWidth}px`;
    canvas.style.height = `${canvas.height / dpr}px`;
  }, []);

  // Mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    sizeCanvas(canvas);
    buildParticles(canvas);
    startLoop(canvas);

    // Throttled mouse move
    let lastMove = 0;
    const onMove = (e) => {
      const now = Date.now();
      if (now - lastMove < 16) return;
      lastMove = now;
      const rect = canvas.getBoundingClientRect();
      stateRef.current.mouse.x = e.clientX - rect.left;
      stateRef.current.mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      stateRef.current.mouse.x = null;
      stateRef.current.mouse.y = null;
    };

    window.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    // Debounced resize
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(stateRef.current.animationId);
        stateRef.current.animationId = null;
        sizeCanvas(canvas);
        buildParticles(canvas);
        startLoop(canvas);
      }, 200);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimer);
      cancelAnimationFrame(stateRef.current.animationId);
      stateRef.current.animationId = null;
    };
  }, [sizeCanvas, buildParticles, startLoop]);

  // Rebuild on theme change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || stateRef.current.particles.length === 0) return;
    buildParticles(canvas);
  }, [theme, buildParticles]);

  return (
    <div className={`relative flex items-center justify-center w-full ${className}`}>
      <canvas ref={canvasRef} className="block w-full max-w-full touch-none" />
    </div>
  );
}
