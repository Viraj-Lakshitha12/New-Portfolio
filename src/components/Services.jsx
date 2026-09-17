import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Code2, Server, Database } from 'lucide-react';

const TiltCard = ({ title, description, icon: Icon, delay }) => {
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
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
      className="relative w-full h-[320px] rounded-3xl glass p-8 border border-black/5 dark:border-white/5 cursor-pointer hover:shadow-2xl hover:shadow-[var(--accent)]/10 transition-shadow"
    >
      <div style={{ transform: "translateZ(50px)" }} className="h-full flex flex-col justify-between">
        <div className="w-14 h-14 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] mb-6">
          <Icon size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-3">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function Services() {
  const services = [
    {
      title: "Frontend Development",
      description: "Crafting beautiful, responsive, and highly interactive user interfaces using modern React and Tailwind CSS.",
      icon: Code2
    },
    {
      title: "Backend Engineering",
      description: "Building robust, scalable, and secure APIs and microservices with Java, Spring Boot, and Node.js.",
      icon: Server
    },
    {
      title: "Database Architecture",
      description: "Designing efficient schemas, optimizing queries, and managing data integrity with PostgreSQL.",
      icon: Database
    }
  ];

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-sm tracking-[0.2em] uppercase text-[var(--accent)] mb-3"
          >
            What I Do
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight"
          >
            Specialized Services
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-[1000px]">
          {services.map((service, index) => (
            <TiltCard 
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
