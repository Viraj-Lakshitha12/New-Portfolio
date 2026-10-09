import React, { useEffect, useRef } from 'react';
import WebGLFluid from 'webgl-fluid';
import { useTheme } from '@/lib/theme-context';

export default function MeshBackground() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (canvasRef.current) {
      WebGLFluid(canvasRef.current, {
        IMMEDIATE: true,
        TRIGGER: 'hover',
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 1.5,
        VELOCITY_DISSIPATION: 0.5,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 30,
        SPLAT_RADIUS: 0.25,
        SPLAT_FORCE: 6000,
        SPLAT_COUNT: 3,
        SHADING: true,
        COLORFUL: true,
        COLOR_UPDATE_SPEED: 10,
        PAUSED: false,
        TRANSPARENT: true,
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.4,
        BLOOM_THRESHOLD: 0.6,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: true,
        SUNRAYS_RESOLUTION: 196,
        SUNRAYS_WEIGHT: 0.5,
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background transition-colors duration-700">
      {/* 
        The canvas opacity is lowered in light mode so it doesn't overpower the white UI, 
        but remains vibrant in dark mode. 
      */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          opacity: theme === 'dark' ? 0.7 : 0.2,
          transition: 'opacity 0.7s ease'
        }}
      />
    </div>
  );
}