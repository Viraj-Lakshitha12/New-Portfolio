import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Backend',
    skills: ['Java', 'Spring Boot', 'Node.js', 'Express'],
  },
  {
    name: 'Frontend',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    name: 'Cloud & Data',
    skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Docker'],
  },
  {
    name: 'Tools',
    skills: ['Microservices', 'WebSockets', 'RESTful APIs', 'Git', 'Prometheus', 'Grafana', 'Web Scraping'],
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
        <p className="mt-3 text-muted-foreground">The tools I use to build production systems.</p>
      </motion.div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            className="glass rounded-3xl p-7"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <h3
              className="font-mono text-sm tracking-[0.2em] uppercase mb-5"
              style={{ color: 'var(--accent)' }}
            >
              {cat.name}
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {cat.skills.map((s) => (
                <span
                  key={s}
                  className="glass glass-pill px-4 py-2 rounded-full font-mono text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}