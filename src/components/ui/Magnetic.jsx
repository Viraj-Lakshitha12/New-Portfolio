import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { uiAudio } from '@/lib/audio';

export default function Magnetic({ children }) {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 150, damping: 15, mass: 0.1 });
  const y = useSpring(rawY, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e) => {
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - (left + width / 2)) * 0.2);
    rawY.set((e.clientY - (top + height / 2)) * 0.2);
  };

  const reset = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onMouseEnter={() => uiAudio.playHover()}
      onMouseDown={() => uiAudio.playClick()}
      style={{ x, y }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
