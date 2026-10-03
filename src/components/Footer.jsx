import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';
import { Github, Linkedin, Mail, FileText, Trophy } from 'lucide-react';
import { unlockAchievement } from '@/lib/achievements';
import AchievementsModal from '@/components/AchievementsModal';

function DockIcon({ href = null, onClick = null, label, children }) {
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
    <motion.div
      ref={ref}
      onClick={href ? () => window.open(href, '_blank') : onClick}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      aria-label={label}
      className="relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:scale-125 hover:-translate-y-1.5 transition-transform duration-300 ease-out group cursor-pointer"
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
      {/* Tooltip */}
      <span className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none text-xs font-mono px-3 py-1.5 rounded-lg bg-foreground text-background shadow-xl whitespace-nowrap translate-y-2 group-hover:translate-y-0">
        {label}
      </span>
    </motion.div>
  );
}

export default function Footer() {
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      unlockAchievement('explorer');
    }
  }, [isInView]);

  return (
    <footer ref={footerRef} className="relative pt-24 pb-10 px-6 overflow-hidden">
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
          <DockIcon href="https://github.com/Viraj-Lakshitha12" label="GitHub">
            <Github className="w-6 h-6 md:w-7 md:h-7" />
          </DockIcon>
          <DockIcon href="https://www.linkedin.com/in/viraj-lakshitha01/" label="LinkedIn">
            <Linkedin className="w-6 h-6 md:w-7 md:h-7" />
          </DockIcon>
          <DockIcon href="mailto:viraj.lakshitha.22222@gmail.com" label="Email">
            <Mail className="w-6 h-6 md:w-7 md:h-7" />
          </DockIcon>
          <DockIcon href="/Viraj_Lakshitha_CV.pdf" label="Resume">
            <FileText className="w-6 h-6 md:w-7 md:h-7" />
          </DockIcon>
          {/* Divider */}
          <div className="w-px h-8 bg-black/10 dark:bg-white/10 mx-2" />
          {/* Achievements Trophy */}
          <DockIcon onClick={() => setAchievementsOpen(true)} label="Achievements 🏆">
            <Trophy className="w-6 h-6 md:w-7 md:h-7" />
          </DockIcon>
        </motion.div>
      </div>

      {/* Subtle bottom border line + copyright */}
      <div className="relative z-10 max-w-5xl mx-auto mt-16 pt-6 border-t border-border/30">
        <p className="text-center font-mono text-xs text-muted-foreground tracking-wide">
          © 2026 Viraj Lakshitha Adhikari. All rights reserved.
        </p>
      </div>
      <AchievementsModal isOpen={achievementsOpen} onClose={() => setAchievementsOpen(false)} />
    </footer>
  );
}