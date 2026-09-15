import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { ArrowUpRight } from 'lucide-react';

const PROJECT1 = 'https://media.base44.com/images/public/6aa78c30735eca22a9da0edd/36cff83c8_generated_e864fc7a.jpg';

const PROJECT2 = 'https://media.base44.com/images/public/6aa78c30735eca22a9da0edd/4263eb89b_generated_image.png';
const PROJECT3 = 'https://media.base44.com/images/public/6aa78c30735eca22a9da0edd/0d528147c_generated_image.png';
const PROJECT4 = 'https://media.base44.com/images/public/6aa78c30735eca22a9da0edd/ceeda6524_generated_image.png';
const PROJECT5 = 'https://media.base44.com/images/public/6aa78c30735eca22a9da0edd/3a77b3232_generated_image.png';

const projects = [
  {
    title: 'Real-time DB Query Performance Analyzer',
    description:
      'A real-time observability platform that monitors, analyzes, and visualizes database query performance — surfacing slow queries, execution plans, and throughput bottlenecks the moment they happen.',
    tags: ['Spring Boot', 'PostgreSQL', 'Redis', 'WebSockets', 'Grafana'],
    image: PROJECT1,
  },
  {
    title: 'Food Ordering System',
    description:
      'A user-friendly ordering app letting customers browse menus, place orders, and manage accounts — with real-time order updates, Express APIs, and a scalable foundation for growth.',
    tags: ['React', 'Node.js', 'Express.js', 'MongoDB'],
    image: PROJECT2,
  },
  {
    title: 'SC Graphic Store',
    description:
      'An e-commerce site with an admin product dashboard, synced with the client Daraz store so customers view on-site and purchase via Daraz — serving 100+ daily visits with on-site payments planned next.',
    tags: ['React', 'Spring Boot', 'MySQL'],
    image: PROJECT3,
  },
  {
    title: 'E-Commerce Backend API',
    description:
      'A microservices-style backend powering core e-commerce operations — REST APIs over PostgreSQL, with Docker Compose setup that cut local onboarding time by ~25% for the team.',
    tags: ['Spring Boot', 'PostgreSQL', 'Docker'],
    image: PROJECT4,
  },
  {
    title: 'Travel Planning System',
    description:
      'A dynamic travel itinerary planning app built on Spring Boot and Hibernate — designed to scale into larger travel platforms with flexible, data-driven trip scheduling.',
    tags: ['Spring Boot', 'MySQL', 'Hibernate'],
    image: PROJECT5,
  },
];

function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 15 });

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const flip = index % 2 === 1;

  return (
    <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d', perspective: 1200 }}
        className={flip ? 'md:order-2' : ''}
      >
        <div className="float-anim">
          <div className="glass rounded-2xl p-3 shadow-2xl">
            <div className="flex gap-1.5 mb-3 px-2 pt-1">
              <span className="w-3 h-3 rounded-full bg-red-400/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <span className="w-3 h-3 rounded-full bg-green-400/80" />
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-video">
              <Image src={project.image} alt={project.title} fittingType="fill" className="w-full h-full" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className={flip ? 'md:order-1' : ''}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="font-mono text-xs tracking-[0.3em] uppercase"
            style={{ color: 'var(--accent)' }}
          >
            Project 0{index + 1}
          </span>
          <h3 className="text-2xl md:text-3xl font-bold mt-3 leading-tight">{project.title}</h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-5">
            {project.tags.map((t) => (
              <span key={t} className="glass glass-pill px-3 py-1.5 rounded-full font-mono text-xs">
                {t}
              </span>
            ))}
          </div>
          <div
            className="mt-6 inline-flex items-center gap-2 font-mono text-sm"
            style={{ color: 'var(--accent)' }}
          >
            <span>explore</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative py-28 px-6">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight">The Perspective Gallery</h2>
        <p className="mt-3 text-muted-foreground">Systems engineered with depth and dimension.</p>
      </motion.div>
      <div className="max-w-5xl mx-auto space-y-24">
        {projects.map((p, i) => (
          <ProjectCard key={i} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}