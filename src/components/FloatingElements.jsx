import React, { useMemo } from 'react';

/**
 * FloatingElements — Pure CSS animations, zero JS overhead.
 */
export default function FloatingElements({ count = 3 }) {
  const colors = ['#64d2ff', '#a855f7', '#ec4899', '#10b981', '#f59e0b'];

  const elements = useMemo(() =>
    Array.from({ length: Math.min(count, 3) }).map((_, i) => ({
      id: i,
      x: 15 + i * 30 + Math.random() * 15,
      y: 10 + i * 20 + Math.random() * 20,
      size: 16 + Math.random() * 18,
      color: colors[i % colors.length],
      delay: i * 1.1,
      duration: 5 + i * 1.5,
    })),
    [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute rounded-full blur-2xl"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            width: el.size,
            height: el.size,
            background: el.color,
            opacity: 0.18,
            animation: `floatOrb ${el.duration}s ease-in-out ${el.delay}s infinite`,
            willChange: 'transform',
          }}
        />
      ))}

      <style>{`
        @keyframes floatOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(8px, -14px) scale(1.15); }
          66%       { transform: translate(-6px, 8px) scale(0.92); }
        }
      `}</style>
    </div>
  );
}