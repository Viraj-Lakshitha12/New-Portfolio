import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated Gradient Text Component
 * Creates a smooth animated gradient text effect
 */
export default function AnimatedGradientText({ 
  children, 
  className = '', 
  colors = ['#64d2ff', '#a855f7', '#ec4899'],
  speed = 3 
}) {
  return (
    <motion.span
      className={className}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        background: `linear-gradient(90deg, ${colors.join(', ')})`,
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </motion.span>
  );
}