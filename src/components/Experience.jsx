import React from 'react';
import { motion } from 'framer-motion';

const roles = [
  {
    title: 'Software Engineer',
    company: 'INTELLEON',
    period: 'Mar 2026 — Present',
    branch: 'main ← feat/senior-engineer',
    points: [
      'Architecting scalable microservices with Spring Boot & Node.js',
      'Optimizing database performance and query throughput',
      'Mentoring engineers and driving code-review culture',
    ],
  },
  {
    title: 'Associate Software Engineer',
    company: 'INTELLEON',
    period: 'Sep 2024 — Mar 2026',
    branch: 'feat/associate-role',
    points: [
      'Built RESTful APIs and real-time WebSocket services',
      'Integrated Redis caching and MongoDB data layers',
      'Implemented monitoring with Prometheus & Grafana',
    ],
  },
  {
    title: 'Software Engineer Intern',
    company: 'INTELLEON',
    period: 'Mar 2024 — Sep 2024',
    branch: 'feat/intern-onboarding',
    points: [
      'Developed React + TypeScript frontends',
      'Wrote unit & integration tests',
      'Collaborated via Git workflows and Swagger docs',
    ],
  },
];

function RoleCard({ r, align }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === 'left' ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-6"
    >
      <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>
        {r.branch}
      </span>
      <h3 className="text-xl font-bold mt-2">{r.title}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        @ {r.company} · {r.period}
      </p>
      <ul className="mt-4 space-y-1.5">
        {r.points.map((p, j) => (
          <li key={j} className="font-mono text-xs text-muted-foreground flex gap-2">
            <span className="text-green-500">+</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="relative py-16 md:py-28 px-6">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-white/50 dark:to-white/80">Experience</span></h2>
        <p className="mt-3 text-muted-foreground">Career progression, versioned as commits.</p>
      </motion.div>

      <div className="max-w-3xl mx-auto relative">
        <div
          className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--accent), transparent)' }}
        />
        <div className="space-y-12">
          {roles.map((r, i) => {
            const left = i % 2 === 1;
            return (
              <div key={i} className="relative md:grid md:grid-cols-2 md:gap-12 items-start">
                <div
                  className="absolute left-4 md:left-1/2 top-7 -translate-x-1/2 w-4 h-4 rounded-full z-10"
                  style={{ background: 'var(--accent)', boxShadow: '0 0 16px var(--glow)' }}
                />
                {left ? (
                  <div className="pl-12 md:pl-0">
                    <RoleCard r={r} align="left" />
                  </div>
                ) : (
                  <>
                    <div className="hidden md:block" />
                    <div className="pl-12 md:pl-0">
                      <RoleCard r={r} align="right" />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
