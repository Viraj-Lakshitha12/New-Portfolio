import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Floating Elements Component
 * Optimized with useMemo to prevent recalculations
 */
export default function FloatingElements({ count = 5 }) {
  const colors = ['#64d2ff', '#a855f7', '#ec4899', '#10b981', '#f59e0b'];

  const elements = useMemo(() => {
    return Array.from({ length: count }).map((_, index) => ({
      id: index,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      size: Math.random() * 20 + 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 3,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute rounded-full blur-xl"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            width: `${el.size}px`,
            height: `${el.size}px`,
            background: el.color,
            willChange: 'transform, opacity',
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: el.delay,
          }}
        />
      ))}
    </div>
  );
}