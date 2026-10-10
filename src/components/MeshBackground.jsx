import React, { useEffect, useRef } from 'react';
import WebGLFluid from 'webgl-fluid';
import { useTheme } from '@/lib/theme-context';

export default function MeshBackground() {
  const canvasRef = useRef(null);
  const initializedRef = useRef(false);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skip on reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const initFluid = () => {
      // Prevent double-init
      if (initializedRef.current) return;
      initializedRef.current = true;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      WebGLFluid(canvas, {
        IMMEDIATE: true,
        TRIGGER: 'hover',
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 2.5,
        VELOCITY_DISSIPATION: 0.4,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 30,
        SPLAT_RADIUS: 0.25,
        SPLAT_FORCE: 6000,
        SPLAT_COUNT: 5,
        SHADING: true,
        COLORFUL: true,
        COLOR_UPDATE_SPEED: 10,
        PAUSED: false,
        TRANSPARENT: false,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.8,
        BLOOM_THRESHOLD: 0.6,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: true,
        SUNRAYS_RESOLUTION: 196,
        SUNRAYS_WEIGHT: 1.0,
      });
    };

    const handlePreloaderDone = () => {
      setTimeout(initFluid, 400);
    };

    window.addEventListener('preloader-finished', handlePreloaderDone);

    if (document.body.style.overflow !== 'hidden') {
      setTimeout(initFluid, 200);
    }
    const handleVisibility = () => {
      if (canvas) canvas.style.display = document.hidden ? 'none' : 'block';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('preloader-finished', handlePreloaderDone);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background transition-colors duration-700">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          opacity: theme === 'dark' ? 0.55 : 0.08,
          transition: 'opacity 0.7s ease',
          mixBlendMode: theme === 'dark' ? 'screen' : 'multiply',
        }}
      />
    </div>
  );
}