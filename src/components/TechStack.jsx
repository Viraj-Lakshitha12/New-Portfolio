import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';

const categories = [
  {
    name: 'Backend Engineering',
    number: '01',
    skills: [
      { name: 'Java & Spring Boot', level: 'Core' },
      { name: 'Node.js & Express.js', level: 'Core' },
      { name: 'RESTful APIs', level: 'Core' },
      { name: 'Microservices', level: 'Working' },
    ],
  },
  {
    name: 'Frontend Systems',
    number: '02',
    skills: [
      { name: 'React', level: 'Core' },
      { name: 'JavaScript & TypeScript', level: 'Core' },
      { name: 'Tailwind CSS', level: 'Core' },
      { name: 'Responsive UI', level: 'Working' },
    ],
  },
  {
    name: 'Data & Delivery',
    number: '03',
    skills: [
      { name: 'PostgreSQL & MySQL', level: 'Core' },
      { name: 'MongoDB & Redis', level: 'Working' },
      { name: 'Docker', level: 'Working' },
      { name: 'Query Optimisation', level: 'Core' },
    ],
  },
  {
    name: 'Tools & Workflow',
    number: '04',
    skills: [
      { name: 'Git & GitHub', level: 'Core' },
      { name: 'Swagger & Postman', level: 'Core' },
      { name: 'Jira & Agile', level: 'Working' },
      { name: 'VS Code & IntelliJ IDEA', level: 'Working' },
    ],
  },
];

export default function TechStack() {
  return (
    <section id="stack" className="relative py-28 px-6">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Tech Stack</h2>
        <p className="mt-3 text-muted-foreground">A practical toolkit shaped by real production work.</p>
      </motion.div>

      <div className="max-w-5xl mx-auto mb-8 glass rounded-3xl p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
            Current focus
          </p>
          <h3 className="text-xl md:text-2xl font-bold mt-2">Building reliable full-stack systems</h3>
          <p className="text-sm text-muted-foreground mt-1">From data models and APIs to polished client experiences.</p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs whitespace-nowrap" style={{ color: 'var(--accent)' }}>
          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          OPEN TO BUILD
          <ArrowUpRight size={16} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            className="glass tech-card rounded-3xl p-7"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-mono text-sm tracking-[0.16em] uppercase" style={{ color: 'var(--accent)' }}>
                {cat.name}
              </h3>
              <span className="font-mono text-xs text-muted-foreground">{cat.number}</span>
            </div>
            <div className="space-y-3">
              {cat.skills.map((skill) => (
                <div key={skill.name} className="flex items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-3 last:border-0 last:pb-0">
                  <span className="flex items-center gap-2 text-sm">
                    <Check size={14} style={{ color: 'var(--accent)' }} />
                    {skill.name}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{skill.level}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}