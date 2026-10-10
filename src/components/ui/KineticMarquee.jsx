import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
} from 'framer-motion';

/**
 * KineticMarquee - Velocity-driven scrolling text.
 * Performance notes:
 * - Uses Framer Motion MotionValues (no React re-renders on every frame)
 * - useAnimationFrame only drives 1 MotionValue; Framer handles the DOM update
 * - CSS `will-change: transform` is set implicitly by Framer for GPU compositing
 */

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

export default function KineticMarquee({ children, baseVelocity = 60 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });

  // Skew the text based on scroll speed
  const skewX = useTransform(smoothVelocity, [-2000, 2000], [-6, 6]);

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [1, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    if (scrollVelocity.get() < -1) directionFactor.current = -1;
    else if (scrollVelocity.get() > 1) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * (vf - 1);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap pointer-events-none">
      <motion.div
        className="flex whitespace-nowrap flex-nowrap font-black uppercase text-[14vw] leading-none tracking-tighter select-none"
        style={{ x, skewX }}
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="block mr-[0.15em]">{children}&nbsp;</span>
        ))}
      </motion.div>
    </div>
  );
}
