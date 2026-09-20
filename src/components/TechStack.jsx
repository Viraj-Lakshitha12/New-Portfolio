import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Blocks, Code2, Database, Layers3, Server, Wrench } from 'lucide-react';
import {
  siDocker,
  siExpress,
  siOpenjdk,
  siNodedotjs,
  siPostgresql,
  siReact,
  siSpring,
  siTailwindcss,
  siTypescript,
} from 'simple-icons';

const categories = [
  {
    name: 'Backend Engineering', number: '01', icon: Server, span: 'md:col-span-7',
    skills: [
      { name: 'Java', icon: siOpenjdk, color: '#f89820', level: 'Core' },
      { name: 'Spring Boot', icon: siSpring, color: '#6db33f', level: 'Core' },
      { name: 'Node.js', icon: siNodedotjs, color: '#83cd29', level: 'Core' },
      { name: 'Express.js', icon: siExpress, color: '#b8c1c8', level: 'Core' },
    ],
  },
  {
    name: 'Frontend Systems', number: '02', icon: Layers3, span: 'md:col-span-5',
    skills: [
      { name: 'React', icon: siReact, color: '#61dafb', level: 'Core' },
      { name: 'TypeScript', icon: siTypescript, color: '#3178c6', level: 'Core' },
      { name: 'Tailwind CSS', icon: siTailwindcss, color: '#38bdf8', level: 'Core' },
    ],
  },
  {
    name: 'Data & Delivery', number: '03', icon: Database, span: 'md:col-span-5',
    skills: [
      { name: 'PostgreSQL', icon: siPostgresql, color: '#4169e1', level: 'Core' },
      { name: 'Docker', icon: siDocker, color: '#2496ed', level: 'Working' },
      { name: 'Query Optimisation', icon: Database, color: '#64d2ff', level: 'Core' },
    ],
  },
  {
    name: 'Architecture & Workflow', number: '04', icon: Wrench, span: 'md:col-span-7',
    skills: [
      { name: 'Microservices', icon: Blocks, color: '#a78bfa', level: 'Working' },
      { name: 'RESTful APIs', icon: Code2, color: '#64d2ff', level: 'Core' },
      { name: 'Git & Agile', icon: Wrench, color: '#f97316', level: 'Working' },
    ],
  },
];

function BrandIcon({ icon, color }) {
  if (icon.path) {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true" className="tech-brand-icon" style={{ color }}>
        <path d={icon.path} fill="currentColor" />
      </svg>
    );
  }
  const Icon = icon;
  return <Icon aria-hidden="true" className="tech-brand-icon" style={{ color }} />;
}

function StatusChip({ level }) {
  return (
    <span className={`tech-status tech-status-${level.toLowerCase()}`}>
      <span /> {level}
    </span>
  );
}

export default function TechStack() {
  return (
    <section id="stack" className="relative py-16 md:py-28 px-6">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mt-3">Tech <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-white/50 dark:to-white/80">Stack</span></h2>
        <p className="mt-3 text-muted-foreground">The tools behind production-ready systems.</p>
      </motion.div>

      <motion.div
        className="tech-overview max-w-6xl mx-auto mb-6 glass rounded-3xl p-6 md:p-7"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55 }}
      >
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
              <Code2 size={14} /> Core stack
            </p>
            <h3 className="text-xl md:text-2xl font-bold mt-2">Building reliable full-stack systems</h3>
            <p className="text-sm text-muted-foreground mt-1">A focused toolkit shaped by real production work.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[{ name: 'Java', icon: siOpenjdk, color: '#f89820' }, { name: 'React', icon: siReact, color: '#61dafb' }, { name: 'Node.js', icon: siNodedotjs, color: '#83cd29' }, { name: 'PostgreSQL', icon: siPostgresql, color: '#4169e1' }].map((skill) => (
              <span key={skill.name} className="tech-core-pill">
                <BrandIcon icon={skill.icon} color={skill.color} /> {skill.name}
              </span>
            ))}
          </div>
          <span className="tech-open-badge"><i /> OPEN TO BUILD <ArrowUpRight size={15} /></span>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-5">
        {categories.map((category, index) => {
          const CategoryIcon = category.icon;
          return (
            <motion.article
              key={category.name}
              className={`tech-bento-card glass ${category.span}`}
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <div className="relative z-10 flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="tech-category-icon"><CategoryIcon size={17} /></div>
                  <h3 className="font-mono text-xs md:text-sm tracking-[0.13em] uppercase" style={{ color: 'var(--accent)' }}>{category.name}</h3>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{category.number}</span>
              </div>
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {category.skills.map((skill) => (
                  <div key={skill.name} className="tech-skill-tile">
                    <BrandIcon icon={skill.icon} color={skill.color} />
                    <span className="min-w-0 flex-1 text-sm font-medium truncate">{skill.name}</span>
                    <StatusChip level={skill.level} />
                  </div>
                ))}
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Infinite Marquee Section */}
      <div className="mt-24 mb-8 overflow-hidden relative w-full flex items-center">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10"></div>
        
        <motion.div
          className="flex gap-12 items-center whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity }}
        >
          {/* Double the array for seamless loop */}
          {[...categories.flatMap(c => c.skills), ...categories.flatMap(c => c.skills)].map((skill, index) => (
            <div key={`${skill.name}-${index}`} className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
              <BrandIcon icon={skill.icon} color={skill.color} />
              <span className="text-xl font-bold font-mono tracking-tight text-foreground/80">{skill.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
