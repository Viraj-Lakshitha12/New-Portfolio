import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function RevealText({ text, className = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  
  // Split text into words
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay * 0.3 },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 40,
      rotateX: -45,
    },
  };

  return (
    <motion.div
      ref={ref}
      style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3em', perspective: '1000px' }}
      className={className}
      variants={container}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ display: 'inline-block', transformOrigin: 'top center' }}
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
