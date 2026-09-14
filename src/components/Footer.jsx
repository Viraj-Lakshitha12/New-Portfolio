import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Github, Linkedin, Mail, FileText } from 'lucide-react';

function MagneticButton({ href, label, children }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 12 });
  const sy = useSpring(y, { stiffness: 200, damping: 12 });

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.4);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.4);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="glass w-20 h-20 rounded-2xl flex items-center justify-center hover:scale-110 transition-transform group hover:shadow-[0_0_30px_rgba(100,210,255,0.5)]"
    >
      <span className="group-hover:scale-125 transition-transform duration-300" style={{ color: 'var(--accent)' }}>
        {children}
      </span>
    </motion.a>
  );
}

export default function Footer() {
  return (
    <footer className="relative py-20 px-6">
      <div className="max-w-3xl mx-auto relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-[1] overflow-hidden">
          <div
            className="rounded-full"
            style={{
              width: '300px',
              height: '300px',
              filter: 'blur(120px)',
              background: 'rgba(139, 92, 246, 0.15)',
              animation: 'orb-float 12s ease-in-out infinite',
            }}
          />
        </div>
        <motion.div
          className="glass rounded-3xl p-10 md:p-14 text-center relative"
          style={{
            backdropFilter: 'blur(60px) saturate(200%)',
            WebkitBackdropFilter: 'blur(60px) saturate(200%)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Let&apos;s build something{' '}
            <span className="gradient-text-anim">extraordinary</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Open to Full Stack engineering opportunities.
          </p>
          <div className="flex justify-center gap-5 mt-10">
            <MagneticButton href="https://github.com" label="GitHub">
              <Github className="w-8 h-8" />
            </MagneticButton>
            <MagneticButton href="https://linkedin.com" label="LinkedIn">
              <Linkedin className="w-8 h-8" />
            </MagneticButton>
            <MagneticButton href="mailto:virajadhikari@gmail.com" label="Email">
              <Mail className="w-8 h-8" />
            </MagneticButton>
            <MagneticButton href="#" label="Resume">
              <FileText className="w-8 h-8" />
            </MagneticButton>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 font-mono text-xs text-muted-foreground">
            © 2026 Viraj Lakshitha Adhikari · Crafted with glass &amp; light
          </div>
        </motion.div>
      </div>
    </footer>
  );
}