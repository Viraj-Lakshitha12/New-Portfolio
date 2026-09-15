import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Github, Linkedin, Mail, FileText } from 'lucide-react';

function DockIcon({ href, label, children }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 14 });
  const sy = useSpring(y, { stiffness: 250, damping: 14 });

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.5);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.5);
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
      className="relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:scale-125 hover:-translate-y-1.5 transition-transform duration-300 ease-out group"
    >
      <span
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
        style={{ background: 'var(--glow)' }}
      />
      <span
        className="relative group-hover:scale-110 transition-transform duration-300"
        style={{ color: 'var(--accent)' }}
      >
        {children}
      </span>
    </motion.a>
  );
}

export default function Footer() {
  return (
    <footer className="relative pt-24 pb-10 px-6 overflow-hidden">
      {/* Aurora ambient glow at bottom edge */}
      <div className="aurora" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        <motion.h2
          className="text-4xl md:text-6xl font-bold tracking-tight gradient-text-anim leading-[1.1]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Let&apos;s build something extraordinary.
        </motion.h2>

        <motion.p
          className="mt-5 text-muted-foreground max-w-md"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          Open to Full Stack engineering opportunities — let&apos;s create what comes next.
        </motion.p>

        {/* macOS dock-style floating pill */}
        <motion.div
          className="glass rounded-full px-3 py-3 inline-flex items-center gap-1 mt-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <DockIcon href="https://github.com" label="GitHub">
            <Github className="w-6 h-6 md:w-7 md:h-7" />
          </DockIcon>
          <DockIcon href="https://linkedin.com" label="LinkedIn">
            <Linkedin className="w-6 h-6 md:w-7 md:h-7" />
          </DockIcon>
          <DockIcon href="mailto:virajadhikari@gmail.com" label="Email">
            <Mail className="w-6 h-6 md:w-7 md:h-7" />
          </DockIcon>
          <DockIcon href="#" label="Resume">
            <FileText className="w-6 h-6 md:w-7 md:h-7" />
          </DockIcon>
        </motion.div>
      </div>

      {/* Subtle bottom border line + copyright */}
      <div className="relative z-10 max-w-5xl mx-auto mt-16 pt-6 border-t border-border/30">
        <p className="text-center font-mono text-xs text-muted-foreground tracking-wide">
          © 2026 Viraj Lakshitha Adhikari. All rights reserved.
        </p>
      </div>
    </footer>
  );
}