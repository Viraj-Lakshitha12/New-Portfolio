import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { Code2, Server, Database, Layers, Layout, Cpu } from 'lucide-react';

const SpotlightCard = ({ title, description, icon: Icon, tags, delay }) => {
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    x.set(currentX / width - 0.5);
    y.set(currentY / height - 0.5);
    mouseX.set(currentX);
    mouseY.set(currentY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    mouseX.set(-1000);
    mouseY.set(-1000);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      className="group relative w-full rounded-3xl p-[1px] cursor-pointer shadow-xl shadow-black/5 dark:shadow-none"
    >
      {/* Animated Border Gradient Spotlight */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              var(--accent),
              transparent 40%
            )
          `,
        }}
      />
      {/* Default Subtle Border (when not hovered) */}
      <div className="absolute inset-0 rounded-3xl bg-black/10 dark:bg-white/10 group-hover:opacity-0 transition-opacity duration-500" />

      {/* Card Content Container */}
      <div className="relative h-full min-h-[380px] rounded-[23px] bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl p-8 flex flex-col justify-between overflow-hidden">
        
        {/* Inner Spotlight Glow (subtle) */}
        <motion.div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                350px circle at ${mouseX}px ${mouseY}px,
                var(--accent),
                transparent 50%
              )
            `,
          }}
        />

        <div style={{ transform: "translateZ(40px)" }} className="relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] mb-6 ring-1 ring-[var(--accent)]/30 group-hover:ring-[var(--accent)]/60 transition-all duration-300 group-hover:shadow-[0_0_20px_var(--glow)]">
            <Icon size={26} strokeWidth={2.2} />
          </div>
          <h3 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-[var(--accent)] transition-colors duration-300">{title}</h3>
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            {description}
          </p>
        </div>

        <div style={{ transform: "translateZ(30px)" }} className="relative z-10 flex flex-wrap gap-2 mt-8">
          {tags.map((tag, i) => (
            <span key={i} className="px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-foreground/70 group-hover:border-[var(--accent)]/20 transition-colors duration-300">
              {tag}
            </span>
          ))}
        </div>

        {/* Huge Decorative Background Icon */}
        <div className="absolute -bottom-8 -right-8 text-[var(--accent)] opacity-0 group-hover:opacity-[0.05] transition-all duration-700 transform group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
           <Icon size={180} />
        </div>
      </div>
    </motion.div>
  );
};

export default function Services() {
  const services = [
    {
      title: "Frontend Engineering",
      description: "Crafting beautiful, responsive, and highly interactive user interfaces with a focus on seamless user experiences and modern aesthetics.",
      icon: Layout,
      tags: ["React", "Tailwind CSS", "Framer Motion", "UI/UX"]
    },
    {
      title: "Backend Architecture",
      description: "Building robust, scalable, and secure APIs and microservices that power complex business logic and ensure high availability.",
      icon: Server,
      tags: ["Java Spring Boot", "Node.js", "Express", "REST APIs"]
    },
    {
      title: "Database Management",
      description: "Designing efficient schemas, optimizing complex queries, and managing data integrity for high-performance applications.",
      icon: Database,
      tags: ["PostgreSQL", "MongoDB", "Redis", "Prisma"]
    }
  ];

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-[var(--accent)]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-sm font-mono tracking-widest uppercase mb-4"
          >
            <Cpu size={14} /> Expertise
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            Specialized Services
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-[1200px]">
          {services.map((service, index) => (
            <SpotlightCard 
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              tags={service.tags}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
