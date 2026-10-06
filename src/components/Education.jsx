import React, { lazy, Suspense, useRef, useState } from 'react';
import { motion, useInView, useScroll } from 'framer-motion';
import { GraduationCap, MapPin, Building2, ChevronRight, Award } from 'lucide-react';
import RevealText from './ui/RevealText';

const WireframeOrb = lazy(() => import('./WireframeOrb'));

const education = [
  {
    year: '2026',
    title: 'BSc (Hons) in Computing',
    institution: 'Wrexham University, UK',
    detail: 'Londontec City Campus · Nugegoda',
    period: 'Completed',
    current: false,
    color: 'from-violet-500 to-indigo-500',
    gradientStyle: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    glow: 'rgba(139,92,246,0.15)',
    dotColor: '#8b5cf6',
    highlights: [
      'Advanced Software Engineering',
      'Distributed Systems & Cloud Computing',
      'Dissertation: Scalable Microservices',
    ]
  },
  {
    year: '2022 — 2023',
    title: 'Graduate Diploma in Software Engineering.',
    institution: 'Institute of Software Engineering',
    detail: 'Panadura, Sri Lanka',
    period: 'Completed',
    current: false,
    color: 'from-emerald-500 to-teal-500',
    gradientStyle: 'linear-gradient(135deg, #10b981, #14b8a6)',
    glow: 'rgba(16,185,129,0.15)',
    dotColor: '#10b981',
    highlights: [
      'Object-Oriented Programming (Java)',
      'Enterprise Application Architecture',
      'Full-Stack Web Development',
    ]
  },
  {
    year: '2020',
    title: 'G.C.E. Advanced Level',
    institution: 'Vidyarthna University College',
    detail: 'Mathematics Stream · Horana',
    period: 'Completed',
    current: false,
    color: 'from-amber-500 to-orange-500',
    gradientStyle: 'linear-gradient(135deg, #f59e0b, #f97316)',
    glow: 'rgba(245,158,11,0.15)',
    dotColor: '#f59e0b',
    highlights: [
      'Combined Mathematics',
      'Physics',
      'Chemistry',
    ]
  },
];

function EduCard({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group pl-8 md:pl-10 mb-6 md:mb-8 last:mb-0"
    >
      {/* Premium Sci-Fi Node */}
      <div className="absolute left-[-11px] top-[22px] md:top-[24px] z-10 flex items-center justify-center" style={{ width: 24, height: 24 }}>
        {/* Glass outer ring */}
        <div className="absolute inset-0 rounded-full border border-white/20 bg-white/10 dark:bg-zinc-900/40 backdrop-blur-md shadow-lg" />

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 2.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
          style={{ background: item.dotColor }}
        />

        {/* Core glowing dot */}
        <div
          className="w-2.5 h-2.5 rounded-full border border-white/40 z-10"
          style={{ background: item.dotColor, boxShadow: `0 0 16px ${item.dotColor}, 0 0 32px ${item.dotColor}` }}
        />
      </div>

      {/* Card Body */}
      <div
        className="relative rounded-2xl overflow-hidden border border-black/8 dark:border-white/8 bg-white/55 dark:bg-zinc-900/55 backdrop-blur-xl transition-all duration-500"
        style={{
          boxShadow: hovered ? `0 20px 40px ${item.glow}, 0 0 0 1px ${item.dotColor}33` : '0 4px 20px rgba(0,0,0,0.04)',
        }}
      >
        {/* Top gradient accent bar */}
        <div className="h-1" style={{ background: item.gradientStyle }} />

        {/* Large watermark year */}
        <div
          className="absolute -right-4 -bottom-4 text-[60px] md:text-[80px] font-black leading-none select-none pointer-events-none opacity-[0.03]"
          style={{ background: item.gradientStyle, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          {item.year.split(' ')[0]}
        </div>

        <div className="p-4 md:p-5 relative z-10">
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <span
              className="text-xs font-black font-mono px-2.5 py-1 rounded-full text-white"
              style={{ background: item.gradientStyle }}
            >
              {item.year}
            </span>
            {item.period === 'Completed' && (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-black/5 dark:bg-white/5 text-foreground/70 border border-black/10 dark:border-white/10">
                <Award size={10} style={{ color: item.dotColor }} /> {item.period}
              </span>
            )}
          </div>

          <h3 className="text-lg md:text-xl font-bold tracking-tight mb-2">{item.title}</h3>

          <div className="space-y-1 mb-3 md:mb-4 text-xs md:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Building2 size={13} className="flex-shrink-0" />
              <span className="font-semibold text-foreground/80">{item.institution}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={13} className="flex-shrink-0" />
              <span>{item.detail}</span>
            </div>
          </div>

          <div className="h-px mb-3 md:mb-4" style={{ background: `linear-gradient(to right, ${item.dotColor}30, transparent)` }} />

          <ul className="space-y-1.5">
            {item.highlights.map((highlight, j) => (
              <li key={j} className="flex items-start gap-2 text-sm text-foreground/75">
                <ChevronRight size={14} className="flex-shrink-0 mt-0.5" style={{ color: item.dotColor }} />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default function Education() {
  const lineRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: lineRef, offset: ['start 85%', 'end 25%'] });

  return (
    <section id="education" className="relative py-20 md:py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_2px,transparent_2px),linear-gradient(to_bottom,#80808012_2px,transparent_2px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div
        className="text-center mb-16 max-w-3xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="font-mono text-sm tracking-[0.2em] uppercase text-[var(--accent)] mb-3 block">
          Academic
        </span>
        <div className="mb-4">
          <RevealText text="Education Background" className="text-4xl md:text-5xl font-bold tracking-tight justify-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-foreground/50 pb-2" />
        </div>
        <p className="text-muted-foreground text-lg">
          The academic foundation behind the work.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">

          {/* Left: Timeline & Cards */}
          <div className="relative">
            {/* Scroll-driven Neon Timeline Line */}
            <div ref={lineRef} className="absolute left-0 top-8 bottom-4 w-[2px] bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 right-0 origin-top rounded-full"
                style={{
                  scaleY: scrollYProgress,
                  background: `linear-gradient(to bottom, ${education.map(e => e.dotColor).join(', ')})`,
                  boxShadow: '0 0 15px var(--glow), 0 0 30px var(--glow)',
                  height: '100%',
                }}
              />
            </div>

            <div className="relative z-10">
              {education.map((item, index) => (
                <EduCard key={index} item={item} index={index} />
              ))}
            </div>
          </div>

          {/* Right: 3D Orb Animation */}
          <motion.div
            className="relative h-72 md:h-96 lg:h-[500px]"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-56 h-56 lg:w-72 lg:h-72 rounded-full blur-3xl glow-pulse opacity-50" style={{ background: 'var(--glow)' }} />
            </div>
            <Suspense fallback={null}>
              <WireframeOrb />
            </Suspense>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
