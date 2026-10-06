import React, { useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { ArrowRight, Mail, Sparkles } from 'lucide-react';
import Magnetic from '@/components/ui/Magnetic';
import AnimatedGradientText from '@/components/AnimatedGradientText';
import FloatingElements from '@/components/FloatingElements';
import { TypeAnimation } from 'react-type-animation';
import { useI18n } from '@/lib/i18n-context';

const PROFILE_URL = '/profile.png';

export default function Hero() {
  const { t } = useI18n();
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 18 });

  // Global mouse parallax for layered depth
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Different speed layers
  const headingX = useTransform(springX, [-1, 1], [-12, 12]);
  const headingY = useTransform(springY, [-1, 1], [-8, 8]);
  const subtitleX = useTransform(springX, [-1, 1], [8, -8]);
  const subtitleY = useTransform(springY, [-1, 1], [5, -5]);
  const orbX = useTransform(springX, [-1, 1], [-20, 20]);
  const orbY = useTransform(springY, [-1, 1], [-15, 15]);

  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const { innerWidth, innerHeight } = window;
          mouseX.set((e.clientX / innerWidth - 0.5) * 2);
          mouseY.set((e.clientY / innerHeight - 0.5) * 2);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }, []);

  const handleLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-4 md:pb-8 overflow-hidden text-center"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_2px,transparent_2px),linear-gradient(to_bottom,#80808012_2px,transparent_2px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <FloatingElements count={3} />
      
      {/* Parallax background orb */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ x: orbX, y: orbY, background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)', opacity: 0.25, willChange: 'transform' }}
      />

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
        <TypeAnimation
          sequence={[
            t('hero.title'),
            2000,
            'Problem Solver',
            2000,
            'Tech Enthusiast',
            2000,
          ]}
          wrapper="span"
          speed={50}
          repeat={Infinity}
        />
      </motion.span>

      <motion.h1
        className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.7 }}
        style={{ x: headingX, y: headingY }}
      >
        <AnimatedGradientText>Viraj Lakshitha</AnimatedGradientText>
      </motion.h1>

      <motion.p
        className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.7, duration: 0.6 }}
        style={{ x: subtitleX, y: subtitleY }}
      >
        {t('hero.subtitle')}
      </motion.p>

      <motion.div
        className="flex flex-wrap gap-3 md:gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.9, duration: 0.6 }}
      >
        <Magnetic>
          <a
            href="#projects"
            className="hero-cta hero-cta-primary"
          >
            <span>View Projects</span>
            <ArrowRight className="hero-cta-icon" size={17} />
          </a>
        </Magnetic>
        <Magnetic>
          <a href="#contact" className="hero-cta hero-cta-secondary">
            <Mail size={16} />
            <span>Get in Touch</span>
          </a>
        </Magnetic>
      </motion.div>
    </section>
  );
}