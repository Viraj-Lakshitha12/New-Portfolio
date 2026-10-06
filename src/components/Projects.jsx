import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { ArrowUpRight, Github, ExternalLink, X, Database, Shield, Zap, Layout } from 'lucide-react';
import { uiAudio } from '@/lib/audio';
import FloatingElements from '@/components/FloatingElements';

const PROJECT1 = 'https://media.base44.com/images/public/6aa78c30735eca22a9da0edd/36cff83c8_generated_e864fc7a.jpg';
const PROJECT2 = 'https://media.base44.com/images/public/6aa78c30735eca22a9da0edd/4263eb89b_generated_image.png';
const PROJECT3 = 'https://media.base44.com/images/public/6aa78c30735eca22a9da0edd/0d528147c_generated_image.png';
const PROJECT4 = 'https://media.base44.com/images/public/6aa78c30735eca22a9da0edd/ceeda6524_generated_image.png';
const PROJECT5 = 'https://media.base44.com/images/public/6aa78c30735eca22a9da0edd/3a77b3232_generated_image.png';

const projects = [
  {
    title: 'Real-time DB Query Analyzer',
    description: 'A real-time observability platform that monitors, analyzes, and visualizes database query performance — surfacing slow queries and bottlenecks.',
    tags: ['Spring Boot', 'PostgreSQL', 'Redis', 'WebSockets', 'Grafana'],
    image: PROJECT1,
    details: {
      challenge: "Processing thousands of queries per second without adding significant overhead to the primary database while maintaining real-time UI updates.",
      solution: "Implemented a non-blocking ingestion pipeline using WebSockets and buffered Redis streams. The data is batched and asynchronously persisted, ensuring the core DB isn't taxed.",
      metrics: [
        { icon: Zap, label: "Throughput", value: "10k+ QPS" },
        { icon: Shield, label: "Overhead", value: "< 2%" },
        { icon: Database, label: "Storage", value: "Redis + PG" }
      ]
    }
  },
  {
    title: 'Food Ordering System',
    description: 'A user-friendly ordering app letting customers browse menus, place orders, and manage accounts with real-time updates.',
    tags: ['React', 'Node.js', 'Express.js', 'MongoDB'],
    image: PROJECT2,
    details: {
      challenge: "Handling real-time state synchronization between restaurant dashboards, delivery drivers, and customer apps seamlessly.",
      solution: "Built a centralized event-driven architecture using Socket.io and Redis pub/sub to instantly fan-out status updates to all connected clients.",
      metrics: [
        { icon: Zap, label: "Latency", value: "< 50ms" },
        { icon: Shield, label: "Auth", value: "JWT + OAuth" },
        { icon: Database, label: "Schema", value: "Document" }
      ]
    }
  },
  {
    title: 'SC Graphic Store',
    description: 'An e-commerce site with an admin product dashboard, synced with the client Daraz store so customers view on-site and purchase via Daraz.',
    tags: ['React', 'Spring Boot', 'MySQL'],
    image: PROJECT3,
    details: {
      challenge: "Keeping inventory perfectly synced with Daraz APIs to prevent overselling while maintaining fast local page loads.",
      solution: "Implemented a background CRON sync job in Spring Boot with aggressive local caching using Redis for instant catalog browsing.",
      metrics: [
        { icon: Zap, label: "Load Time", value: "0.8s" },
        { icon: Layout, label: "Sync", value: "Event-driven" },
        { icon: Database, label: "Cache", value: "Redis" }
      ]
    }
  },
  {
    title: 'E-Commerce Backend API',
    description: 'A microservices-style backend powering core e-commerce operations — REST APIs over PostgreSQL, with Docker Compose setup.',
    tags: ['Spring Boot', 'PostgreSQL', 'Docker'],
    image: PROJECT4,
    details: {
      challenge: "Onboarding new developers took days due to complex local dependency setups for databases and message brokers.",
      solution: "Containerized the entire local development environment with Docker Compose, reducing onboarding time by 25%.",
      metrics: [
        { icon: Zap, label: "Onboarding", value: "-25% Time" },
        { icon: Shield, label: "Coverage", value: "85% Tests" },
        { icon: Layout, label: "Scaling", value: "Docker Swarm" }
      ]
    }
  },
  {
    title: 'Travel Planning System',
    description: 'A dynamic travel itinerary planning app built on Spring Boot and Hibernate — designed to scale into larger travel platforms.',
    tags: ['Spring Boot', 'MySQL', 'Hibernate'],
    image: PROJECT5,
    details: {
      challenge: "Modeling complex graph-like relationships for multi-city itineraries and nested activities in a relational database.",
      solution: "Optimized Hibernate mappings and utilized materialized paths and CTEs (Common Table Expressions) for blazing fast itinerary retrieval.",
      metrics: [
        { icon: Zap, label: "Query Perf", value: "3x Faster" },
        { icon: Shield, label: "Security", value: "Spring Sec" },
        { icon: Database, label: "ORM", value: "Hibernate" }
      ]
    }
  },
];

function ProjectModal({ project, onClose }) {
  // Prevent ALL scrolling when modal is open
  React.useEffect(() => {
    // Stop Lenis smooth scroll
    const lenisInstance = document.querySelector('[data-lenis-prevent]');
    document.documentElement.setAttribute('data-lenis-prevent', '');

    // Also lock native scroll as fallback
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.documentElement.removeAttribute('data-lenis-prevent');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.scrollTo(0, scrollY);
    }
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-xl"
        onClick={onClose}
        onWheel={(e) => e.stopPropagation()}
      />
      <div
        className="fixed inset-0 z-[111] flex items-center justify-center p-4 md:p-10 pointer-events-none"
        onWheel={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-[85vh] md:h-[90vh] max-w-5xl bg-background rounded-3xl overflow-hidden shadow-2xl relative flex flex-col pointer-events-auto border border-white/10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-[var(--accent)] transition-colors z-20"
          >
            <X size={20} />
          </button>

          {/* Immersive Header (Fixed Height) */}
          <div className="relative w-full h-[40vh] md:h-[45vh] shrink-0 overflow-hidden">
            <div className="absolute inset-0">
              <Image src={project.image} alt={project.title} className="w-full h-full object-cover" />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute bottom-0 left-0 w-full p-6 md:p-10"
            >
              <h3 className="text-3xl md:text-5xl font-black text-foreground mb-4 leading-tight">
                {project.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span key={t} className="px-3 py-1.5 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-xs font-mono font-semibold">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Deep Dive Content (Scrollable internally) */}
          <div className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar p-6 md:p-10">
            <div className="grid md:grid-cols-3 gap-10">

              {/* Left Column: Description & Links */}
              <div className="md:col-span-1 space-y-8">
                <div>
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-3">Overview</span>
                  <p className="text-foreground text-sm leading-relaxed">{project.description}</p>
                </div>

                <div className="flex flex-col gap-3">
                  <a href="#" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--accent)] text-white font-bold text-sm hover:shadow-[0_0_20px_var(--glow)] transition-all">
                    <ExternalLink size={16} /> View Live App
                  </a>
                  <a href="#" className="flex items-center justify-center gap-2 py-3 rounded-xl glass border border-black/10 dark:border-white/10 hover:border-foreground/30 transition-all font-semibold text-sm">
                    <Github size={16} /> Source Code
                  </a>
                </div>
              </div>

              {/* Right Column: Case Study */}
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> The Challenge
                  </h4>
                  <div className="bg-black/5 dark:bg-white/5 p-5 rounded-2xl border border-black/5 dark:border-white/5">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.details.challenge}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> The Solution
                  </h4>
                  <div className="bg-black/5 dark:bg-white/5 p-5 rounded-2xl border border-black/5 dark:border-white/5">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.details.solution}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-4">Key Metrics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {project.details.metrics.map((m, i) => {
                      const Icon = m.icon;
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + (i * 0.1) }}
                          key={i}
                          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5"
                        >
                          <Icon size={24} className="text-[var(--accent)] mb-3" />
                          <span className="font-black text-sm md:text-base">{m.value}</span>
                          <span className="text-[10px] text-muted-foreground font-mono uppercase mt-1 tracking-wider">{m.label}</span>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

function ProjectCard({ project, index, onOpen, isAnotherHovered, onHoverStart, onHoverEnd }) {
  const flip = index % 2 === 1;

  const handleHoverStart = useCallback(() => {
    onHoverStart(project.image);
  }, [project.image, onHoverStart]);

  const handleHoverEnd = useCallback(() => {
    onHoverEnd();
  }, [onHoverEnd]);

  return (
    <div 
      className={`grid md:grid-cols-2 gap-10 md:gap-14 items-center group transition-[opacity,transform] duration-500 ${isAnotherHovered ? 'opacity-25 scale-[0.98]' : 'opacity-100 scale-100'}`}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      <div className={flip ? 'md:order-2' : ''}>
        <div
          className="float-anim cursor-pointer"
          onClick={() => { uiAudio.playClick(); onOpen(); }}
        >
          <div
            className="glass rounded-3xl p-3 shadow-2xl transition-shadow duration-500 group-hover:shadow-[0_0_40px_var(--glow)] group-hover:border-[var(--accent)]/30 bg-white/40 dark:bg-zinc-950/40"
          >
            <div className="flex gap-1.5 mb-3 px-3 pt-1">
              <span className="w-3 h-3 rounded-full bg-red-400/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <span className="w-3 h-3 rounded-full bg-green-400/80" />
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/10">
              <Image src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="px-6 py-3 rounded-full bg-black/70 text-white font-semibold border border-white/10 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
                  <ExternalLink size={16} /> Explore Case Study
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
          <h3 className="text-2xl md:text-4xl font-bold mt-3 leading-tight group-hover:text-[var(--accent)] transition-colors duration-300">{project.title}</h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {project.tags.map((t) => (
              <span key={t} className="glass px-3 py-1.5 rounded-lg font-mono text-[11px] border-black/5 dark:border-white/5">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={() => { uiAudio.playClick(); onOpen(); }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Case Study <ArrowUpRight className="w-4 h-4" />
            </button>
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 p-3 rounded-xl glass hover:border-[var(--accent)]/50 transition-colors text-muted-foreground hover:text-foreground hover:shadow-[0_0_15px_var(--glow)]"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


export default function Projects() {
  const [activeProject, setActiveProject] = useState(null);
  const [hoveredProjectImage, setHoveredProjectImage] = useState(null);

  const handleHoverStart = useCallback((img) => setHoveredProjectImage(img), []);
  const handleHoverEnd = useCallback(() => setHoveredProjectImage(null), []);

  return (
    <section id="projects" className="relative py-20 md:py-32 px-6 overflow-hidden">
      
      {/* Immersive Hover Background — CSS transition, GPU composited */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: hoveredProjectImage ? `url(${hoveredProjectImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(80px) saturate(180%)',
          opacity: hoveredProjectImage ? 0.25 : 0,
          transition: 'opacity 0.6s ease',
          willChange: 'opacity',
          transform: 'scale(1.1)',
        }}
      />

      <FloatingElements count={3} />
      
      <motion.div
        className="text-center mb-24 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="font-mono text-sm tracking-[0.2em] uppercase text-[var(--accent)] mb-3 block">
          Case Studies
        </span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          The Perspective{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-foreground/50">Gallery</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Engineering scalable systems with depth, dimension, and performance in mind.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto space-y-32 relative z-10">
        {projects.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <ProjectCard
              project={p} 
              index={i} 
              onOpen={() => setActiveProject({ ...p, index: i })} 
              isAnotherHovered={hoveredProjectImage !== null && hoveredProjectImage !== p.image}
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeProject && (
          <ProjectModal project={activeProject} onClose={() => { uiAudio.playClick(); setActiveProject(null); }} />
        )}
      </AnimatePresence>
    </section>
  );
}