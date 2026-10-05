import React, { useRef, useState } from 'react';
import { motion, useInView, useScroll } from 'framer-motion';
import { Briefcase, Calendar, ChevronRight, Code2, GitBranch, Layers, Server, Cpu } from 'lucide-react';

const roles = [
  {
    index: '01',
    title: 'Software Engineer',
    company: 'INTELLEON',
    period: 'Mar 2026 — Present',
    branch: 'main ← feat/senior-engineer',
    tag: 'Current',
    gradientClass: 'from-violet-500 to-indigo-500',
    gradientStyle: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    glowColor: 'rgba(139,92,246,0.2)',
    dotColor: '#8b5cf6',
    achievements: [
      { icon: Server, label: 'Microservices' },
      { icon: Layers, label: 'DB Optimization' },
      { icon: Briefcase, label: 'Team Lead' },
    ],
    points: [
      'Architecting scalable microservices with Spring Boot & Node.js',
      'Optimizing database performance and query throughput by 40%',
      'Mentoring engineers and driving code-review culture',
    ],
    skills: ['Java', 'Spring Boot', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
  },
  {
    index: '02',
    title: 'Associate Software Engineer',
    company: 'INTELLEON',
    period: 'Sep 2024 — Mar 2026',
    branch: 'feat/associate-role',
    tag: null,
    gradientClass: 'from-emerald-500 to-teal-500',
    gradientStyle: 'linear-gradient(135deg, #10b981, #14b8a6)',
    glowColor: 'rgba(16,185,129,0.2)',
    dotColor: '#10b981',
    achievements: [
      { icon: Code2, label: 'REST APIs' },
      { icon: Server, label: 'Redis Cache' },
      { icon: Cpu, label: 'Monitoring' },
    ],
    points: [
      'Built RESTful APIs and real-time WebSocket services',
      'Integrated Redis caching reducing DB load by 60%',
      'Implemented monitoring with Prometheus & Grafana',
    ],
    skills: ['React', 'TypeScript', 'MongoDB', 'Redis', 'WebSockets', 'Grafana'],
  },
  {
    index: '03',
    title: 'Software Engineer Intern',
    company: 'INTELLEON',
    period: 'Mar 2024 — Sep 2024',
    branch: 'feat/intern-onboarding',
    tag: null,
    gradientClass: 'from-amber-500 to-orange-500',
    gradientStyle: 'linear-gradient(135deg, #f59e0b, #f97316)',
    glowColor: 'rgba(245,158,11,0.2)',
    dotColor: '#f59e0b',
    achievements: [
      { icon: Code2, label: 'React UIs' },
      { icon: GitBranch, label: 'Git Workflows' },
      { icon: Layers, label: 'Unit Tests' },
    ],
    points: [
      'Developed React + TypeScript frontends from scratch',
      'Wrote comprehensive unit & integration test suites',
      'Collaborated via Git workflows and Swagger API docs',
    ],
    skills: ['React', 'TypeScript', 'Jest', 'Swagger', 'Git', 'Figma'],
  },
];

function RoleCard({ r, index: idx }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
    >
      {/* Card */}
      <div
        className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-black/8 dark:border-white/8 bg-white/55 dark:bg-zinc-900/55 backdrop-blur-xl transition-all duration-500"
        style={{
          boxShadow: hovered ? `0 24px 64px ${r.glowColor}, 0 0 0 1px ${r.dotColor}33` : '0 4px 24px rgba(0,0,0,0.06)',
        }}
      >
        {/* Gradient top bar */}
        <div className="h-1" style={{ background: r.gradientStyle }} />

        {/* Large watermark number */}
        <div
          className="absolute -right-4 -top-4 text-[120px] md:text-[160px] font-black leading-none select-none pointer-events-none opacity-[0.04]"
          style={{ background: r.gradientStyle, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          {r.index}
        </div>

        <div className="relative p-5 md:p-7">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {/* Gradient index chip */}
                <span
                  className="text-xs font-black font-mono px-2.5 py-1 rounded-full text-white"
                  style={{ background: r.gradientStyle }}
                >
                  {r.index}
                </span>
                {r.tag && (
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full text-white"
                    style={{ background: r.gradientStyle }}
                  >
                    ● {r.tag}
                  </motion.span>
                )}
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight">{r.title}</h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 font-semibold text-foreground/80">
                  <Briefcase size={12} /> {r.company}
                </span>
                <span className="hidden sm:block text-black/20 dark:text-white/20">·</span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} /> {r.period}
                </span>
              </div>
            </div>
          </div>

          {/* Achievement chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {r.achievements.map((ach, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.3 }}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-black/8 dark:border-white/8 bg-black/[0.03] dark:bg-white/[0.04]"
              >
                <ach.icon size={11} style={{ color: r.dotColor }} />
                {ach.label}
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px mb-5" style={{ background: `linear-gradient(to right, ${r.dotColor}30, transparent)` }} />

          {/* Bullet points */}
          <ul className="space-y-2.5 mb-5">
            {r.points.map((p, j) => (
              <motion.li
                key={j}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.25 + j * 0.08, duration: 0.35 }}
                className="flex items-start gap-2.5 text-sm text-foreground/75"
              >
                <ChevronRight size={13} className="flex-shrink-0 mt-0.5" style={{ color: r.dotColor }} />
                <span className="leading-relaxed">{p}</span>
              </motion.li>
            ))}
          </ul>

          {/* Skill tags */}
          <div className="flex flex-wrap gap-1.5">
            {r.skills.map((skill, k) => (
              <span
                key={k}
                className="font-mono text-[11px] px-2.5 py-1 rounded-lg border border-black/5 dark:border-white/5 bg-black/[0.03] dark:bg-white/[0.04] text-muted-foreground hover:text-foreground hover:border-black/20 dark:hover:border-white/20 transition-colors cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Git footer */}
        <div className="px-5 md:px-7 py-2.5 border-t border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] flex items-center gap-2">
          <GitBranch size={10} className="text-muted-foreground" />
          <span className="font-mono text-[10px] text-muted-foreground">{r.branch}</span>
        </div>
      </div>
    </motion.div>
  );
}

function TimelineColumn({ roles }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 20%'] });

  return (
    <div ref={ref} className="hidden md:flex flex-col items-center flex-shrink-0 pt-2" style={{ width: 40 }}>
      {roles.map((r, i) => {
        const isLast = i === roles.length - 1;
        return (
          <React.Fragment key={i}>
            {/* Dot */}
            <DotWithPulse color={r.dotColor} index={i} />
            {/* Connecting line segment */}
            {!isLast && (
              <motion.div
                className="w-0.5 flex-1 min-h-[80px] origin-top"
                initial={{ scaleY: 0, opacity: 0 }}
                whileInView={{ scaleY: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: 0.3, ease: 'easeInOut' }}
                style={{ background: `linear-gradient(to bottom, ${r.dotColor}, ${roles[i + 1].dotColor})` }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function DotWithPulse({ color, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: 24, height: 24 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: 'spring', stiffness: 350, damping: 18, delay: index * 0.12 }}
    >
      {/* Pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
        style={{ background: color }}
      />
      {/* Core */}
      <div
        className="relative w-3.5 h-3.5 rounded-full border-2 border-background"
        style={{ background: color, boxShadow: `0 0 12px ${color}` }}
      />
    </motion.div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="relative py-20 md:py-32 px-6">
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_2px,transparent_2px),linear-gradient(to_bottom,#80808012_2px,transparent_2px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Section header */}
      <motion.div
        className="text-center mb-14 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="font-mono text-sm tracking-[0.2em] uppercase text-[var(--accent)] mb-3 block">
          Career
        </span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Professional{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-foreground/50">
            Experience
          </span>
        </h2>
        <p className="text-muted-foreground text-lg">Career progression, versioned as commits.</p>
      </motion.div>

      {/* Timeline layout — flex row: [dot column] + [cards column] */}
      <div className="max-w-2xl mx-auto flex gap-4 md:gap-8">
        {/* Left: timeline column — desktop only */}
        <TimelineColumn roles={roles} />

        {/* Right: cards */}
        <div className="flex-1 min-w-0 space-y-6 md:space-y-8">
          {roles.map((r, i) => (
            <RoleCard key={i} r={r} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
