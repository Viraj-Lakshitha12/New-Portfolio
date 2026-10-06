import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useVelocity, useAnimationFrame, useSpring, useMotionValue } from 'framer-motion';
import { Star } from 'lucide-react';

export default function InfiniteMarquee({ text = "OPEN FOR FREELANCE WORK", speed = 2 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * speed * (delta / 1000);

    // Add velocity to the movement
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="py-3 md:py-4 bg-[var(--accent)] border-y border-black/10 dark:border-white/10 overflow-hidden flex whitespace-nowrap">
      <motion.div className="flex items-center gap-6 md:gap-10" style={{ x }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <React.Fragment key={i}>
            <span className="text-sm md:text-base lg:text-lg font-black uppercase tracking-[0.2em] text-white dark:text-black">
              {text}
            </span>
            <Star className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0 fill-white text-white dark:fill-black dark:text-black" />
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

// Wrap function to loop the value between min and max
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};
