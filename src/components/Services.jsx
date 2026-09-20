import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { Code2, Server, Database, Layers, Layout, Cpu, Workflow } from 'lucide-react';

const SpotlightCard = ({ title, description, icon: Icon, tags, delay, isLarge }) => {
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 50 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 50 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`group relative rounded-[2rem] p-[1px] cursor-pointer shadow-2xl shadow-black/10 dark:shadow-none ${isLarge ? 'md:col-span-2' : ''}`}
    >
      {/* Animated Border Gradient Spotlight */}
      <motion.div
        className="absolute inset-0 rounded-[2rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              var(--accent),
              transparent 40%
            )
          `,
        }}
      />
      {/* Default Subtle Border */}
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-black/10 to-black/5 dark:from-white/15 dark:to-white/5 group-hover:opacity-0 transition-opacity duration-500" />

      {/* Card Content Container */}
      <div className="relative h-full min-h-[280px] md:min-h-[380px] rounded-[31px] bg-white/60 dark:bg-zinc-950/60 backdrop-blur-2xl p-6 md:p-10 flex flex-col justify-between overflow-hidden">
        
        {/* Inner Glow */}
        <motion.div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-20"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                400px circle at ${mouseX}px ${mouseY}px,
                var(--accent),
                transparent 50%
              )
            `,
          }}
        />

        <div style={{ transform: "translateZ(50px)" }} className="relative z-10">
          <div className="flex items-center justify-between mb-5 md:mb-8">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-transparent flex items-center justify-center text-[var(--accent)] ring-1 ring-[var(--accent)]/30 group-hover:ring-[var(--accent)]/60 transition-all duration-500 group-hover:shadow-[0_0_30px_var(--glow)] group-hover:-translate-y-1">
              <Icon size={22} strokeWidth={2} className="md:hidden" />
              <Icon size={28} strokeWidth={2} className="hidden md:block" />
            </div>
            <div className="text-[var(--accent)]/30 font-mono text-xs tracking-widest uppercase">
              Service 0{delay / 0.15 + 1}
            </div>
          </div>
          <h3 className="text-xl md:text-3xl font-extrabold mb-3 md:mb-4 tracking-tight text-foreground/90 group-hover:text-[var(--accent)] transition-colors duration-300">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base max-w-md">
            {description}
          </p>
        </div>

        <div style={{ transform: "translateZ(40px)" }} className="relative z-10 flex flex-wrap gap-2 mt-5 md:mt-10">
          {tags.map((tag, i) => (
            <span key={i} className="px-4 py-2 text-xs font-mono font-medium rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground/80 group-hover:border-[var(--accent)]/30 group-hover:bg-[var(--accent)]/5 transition-all duration-300 hover:scale-105">
              {tag}
            </span>
          ))}
        </div>

        {/* Decorative Background Element */}
        <div className="absolute -bottom-10 -right-10 text-[var(--accent)] opacity-[0.02] group-hover:opacity-[0.08] transition-all duration-1000 transform group-hover:scale-125 group-hover:-rotate-12 pointer-events-none blur-[2px] group-hover:blur-none">
           <Icon size={240} strokeWidth={1} />
        </div>
      </div>
    </motion.div>
  );
};

export default function Services() {
  const services = [
    {
      title: "Frontend Engineering",
      description: "Crafting beautiful, responsive, and highly interactive user interfaces. I build performant web applications focusing on seamless user experiences, micro-interactions, and modern aesthetics.",
      icon: Layout,
      tags: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "UI/UX"],
      isLarge: true // Makes this card span 2 columns on desktop
    },
    {
      title: "Backend Architecture",
      description: "Building robust, scalable APIs and microservices that power complex business logic with high availability.",
      icon: Server,
      tags: ["Java Spring Boot", "Node.js", "Express"],
      isLarge: false
    },
    {
      title: "Database Management",
      description: "Designing efficient schemas, optimizing complex queries, and managing data integrity for high-performance applications.",
      icon: Database,
      tags: ["PostgreSQL", "MongoDB", "Redis"],
      isLarge: false
    },
    {
      title: "System Integration",
      description: "Seamlessly connecting third-party APIs, payment gateways, and cloud services to create unified, end-to-end digital solutions.",
      icon: Workflow,
      tags: ["AWS", "REST APIs", "Stripe", "OAuth"],
      isLarge: true
    }
  ];

  return (
    <section id="services" className="relative py-32 px-6 overflow-hidden">
      {/* Background Decor - Modern Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] bg-[var(--accent)]/10 blur-[150px] rounded-[100%] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-8 mb-12 md:mb-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-xs font-mono tracking-widest uppercase mb-6"
            >
              <Cpu size={14} /> Technical Expertise
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]"            >
              Specialized <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-white/50 dark:to-white/80">Services</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-lg max-w-sm"
          >
            Delivering end-to-end solutions from pixel-perfect interfaces to robust scalable architectures.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 perspective-[1200px]">
          {services.map((service, index) => (
            <SpotlightCard 
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              tags={service.tags}
              delay={index * 0.15}
              isLarge={service.isLarge}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
