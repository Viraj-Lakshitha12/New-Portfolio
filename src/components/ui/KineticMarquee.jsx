import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity, useAnimationFrame, useMotionValue } from 'framer-motion';

const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export default function KineticMarquee({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  
  // Transform velocity into a skew effect for that ultra-premium feel
  const skew = useTransform(smoothVelocity, [-1000, 1000], [-3, 3]);
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [1, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    
    // Change direction based on scroll direction
    if (scrollVelocity.get() < 0) {
      directionFactor.current = -1;
    } else if (scrollVelocity.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden m-0 flex whitespace-nowrap flex-nowrap pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
      <motion.div 
        className="flex whitespace-nowrap flex-nowrap font-black uppercase text-[15vw] leading-none" 
        style={{ x, skewX: skew }}
      >
        <span className="block mr-10">{children} </span>
        <span className="block mr-10">{children} </span>
        <span className="block mr-10">{children} </span>
        <span className="block mr-10">{children} </span>
      </motion.div>
    </div>
  );
}
