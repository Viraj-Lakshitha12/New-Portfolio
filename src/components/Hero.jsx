import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { ArrowRight, Mail, Sparkles } from 'lucide-react';

const PROFILE_URL = '/profile.png';

export default function Hero() {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 18 });

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      id="home"
      className="relative h-screen flex flex-col items-center justify-center px-6 pt-20 pb-8 overflow-hidden text-center"
    >

      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d', perspective: 1000 }}
        className="relative mb-6"
      >
        <div className="float-anim">
          <div
            className="absolute -inset-5 rounded-full blur-3xl glow-pulse"
            style={{ background: 'var(--glow)' }}
          />
          <div className="relative glass rounded-full p-3 w-44 h-44 md:w-52 md:h-52">
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src={PROFILE_URL}
                alt="Viraj Lakshitha"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <motion.div
            className="absolute -top-2 -right-2 glass rounded-2xl w-11 h-11 flex items-center justify-center font-mono text-sm font-bold gradient-text"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            &lt;/&gt;
          </motion.div>
        </div>
      </motion.div>

      <motion.span
        className="glass inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.6 }}
      >
        <Sparkles className="w-4 h-4" style={{ color: 'var(--accent)' }} />
        Full Stack Software Engineer
      </motion.span>

      <motion.h1
        className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.7 }}
      >
        <span className="gradient-text-anim">Viraj Lakshitha</span>
      </motion.h1>

      <motion.p
        className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.7, duration: 0.6 }}
      >
        Full Stack Software Engineer. 2+ years of experience building scalable,
        production-ready web systems from database to pixel.
      </motion.p>

      <motion.div
        className="flex gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.9, duration: 0.6 }}
      >
        <a
          href="#projects"
          className="hero-cta hero-cta-primary"
        >
          <span>View Projects</span>
          <ArrowRight className="hero-cta-icon" size={17} />
        </a>
        <a href="#contact" className="hero-cta hero-cta-secondary">
          <Mail size={16} />
          <span>Get in Touch</span>
        </a>
      </motion.div>
    </section>
  );
}