import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, Clock3, Mail, MapPin, Phone, Send, X } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\nReply to: ${form.email}`);
    window.location.href = `mailto:viraj.lakshitha.22222@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: '', email: '', message: '' });
    }, 3000);
  };

  const inputClasses =
    'w-full rounded-xl px-4 py-3 outline-none glass-input bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground placeholder:text-muted-foreground transition-colors duration-300';

  return (
    <section id="contact" className="relative py-16 md:py-28 px-6">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mt-3">
          Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-white/50 dark:to-white/80">Touch</span>
        </h2>
        <p className="mt-3 text-muted-foreground">Have a project, idea, or opportunity? Let&apos;s make it useful.</p>
      </motion.div>

      <motion.div
        className="contact-shell max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-white/45 dark:bg-neutral-900/45 backdrop-blur-2xl"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="contact-intro p-8 md:p-10 flex flex-col justify-between gap-10">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              Available for selected projects
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mt-5">Let&apos;s turn a rough idea into a working system.</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mt-4">Whether you need a polished interface, a dependable API, or help shaping the architecture, send a note and I&apos;ll get back to you.</p>
            <button type="button" onClick={() => setShowForm(true)} className="contact-open-form mt-7">
              <Send size={16} /> Start a conversation <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="space-y-3">
            <a href="mailto:viraj.lakshitha.22222@gmail.com" className="contact-detail">
              <Mail size={17} style={{ color: 'var(--accent)' }} />
              <span>viraj.lakshitha.22222@gmail.com</span>
              <ArrowUpRight size={15} className="ml-auto" />
            </a>
            <a href="tel:+94769291462" className="contact-detail">
              <Phone size={17} style={{ color: 'var(--accent)' }} />
              <span>+94 769 291 462</span>
              <ArrowUpRight size={15} className="ml-auto" />
            </a>
            <div className="contact-detail">
              <Clock3 size={17} style={{ color: 'var(--accent)' }} />
              <span>Usually replies within 24 hours</span>
            </div>
          </div>
        </div>

        <div className="contact-map relative min-h-[300px] lg:min-h-[540px] border-t lg:border-t-0 lg:border-l border-black/10 dark:border-white/10">
          <div className="absolute top-5 left-5 z-10 rounded-xl px-3 py-2 flex items-center gap-2 text-sm font-mono bg-white/75 dark:bg-black/50 backdrop-blur-md border border-black/10 dark:border-white/10 text-foreground pointer-events-none">
            <MapPin className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            Bandaragama, Sri Lanka
          </div>
          <iframe
            title="Bandaragama, Sri Lanka"
            src="https://www.google.com/maps?q=Bandaragama,Sri%20Lanka&output=embed"
            className="absolute inset-0 w-full h-full dark:[filter:invert(90%)_hue-rotate(180deg)]"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a
            href="https://www.google.com/maps/search/?api=1&query=Bandaragama%2C%20Sri%20Lanka"
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-5 left-5 right-5 z-10 flex items-center justify-between rounded-xl px-3 py-2 text-xs font-mono bg-white/80 dark:bg-black/55 backdrop-blur-md border border-black/10 dark:border-white/10 text-foreground hover:text-[var(--accent)] transition-colors"
          >
            Open in Google Maps <ArrowUpRight size={14} />
          </a>
        </div>
      </motion.div>

      {showForm && (
        <div className="contact-modal-backdrop" role="presentation" onMouseDown={() => setShowForm(false)}>
          <motion.div
            className="contact-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-form-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button type="button" onClick={() => setShowForm(false)} className="contact-modal-close" aria-label="Close contact form">
              <X size={18} />
            </button>
            <form onSubmit={handleSubmit} className="contact-form p-7 md:p-9 space-y-5">
              <div className="flex items-end justify-between gap-4 mb-2">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--accent)' }}>Start a conversation</p>
                  <h3 id="contact-form-title" className="text-xl font-bold mt-2">Tell me what you&apos;re building.</h3>
                </div>
              </div>
              <div>
                <label className="block text-sm font-mono mb-2 text-foreground/70">Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClasses} placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-mono mb-2 text-foreground/70">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClasses} placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-mono mb-2 text-foreground/70">Message</label>
                <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputClasses} resize-none`} placeholder="Your message" />
              </div>
              <button type="submit" className="contact-submit w-full rounded-xl py-3 font-medium flex items-center justify-center gap-2 btn-glow">
                {sent ? <><CheckCircle2 className="w-4 h-4" /> Draft opened in your mail app</> : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
}