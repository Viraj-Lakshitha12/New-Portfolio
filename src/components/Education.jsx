import React from 'react';
import { motion } from 'framer-motion';
import WireframeOrb from './WireframeOrb';

const education = [
  {
    year: '2026',
    title: 'BSc (Hons) in Computing',
    desc: 'Bachelor of Science (Honours) in Computing.',
  },
  {
    year: '2022 — 2023',
    title: 'Graduate Diploma in Software Engineering',
    desc: 'Institute of Software Engineering (IJSE).',
  },
  {
    year: '2020',
    title: 'G.C.E. A/L — Maths Stream',
    desc: 'Vidyarthna University College, Horana.',
  },
];

export default function Education() {
  return (
    <section id="education" className="relative py-28 px-6">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Orbital Foundation</h2>
        <p className="mt-3 text-muted-foreground">Academic history, balanced by vision.</p>
      </motion.div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="relative pl-8">
          <div
            className="absolute left-2 top-2 bottom-2 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, var(--accent), transparent)' }}
          />
          <div className="space-y-10">
            {education.map((e, i) => (
              <motion.div
                key={i}
                className="relative"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div
                  className="absolute -left-[1.45rem] top-1.5 w-3 h-3 rounded-full"
                  style={{ background: 'var(--accent)', boxShadow: '0 0 12px var(--glow)' }}
                />
                <span className="font-mono text-sm font-bold" style={{ color: 'var(--accent)' }}>
                  {e.year}
                </span>
                <h3 className="text-lg font-bold mt-1">{e.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{e.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative h-72 md:h-96">
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div
              className="w-56 h-56 rounded-full blur-3xl glow-pulse"
              style={{ background: 'var(--glow)' }}
            />
          </div>
          <WireframeOrb />
        </div>
      </div>
    </section>
  );
}