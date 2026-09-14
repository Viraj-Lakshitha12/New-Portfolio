import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <section id="contact" className="relative py-28 px-6">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Get in Touch</h2>
        <p className="mt-3 text-muted-foreground">Let&apos;s build something together.</p>
      </motion.div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 items-stretch">
        <motion.form
          onSubmit={handleSubmit}
          className="glass rounded-3xl p-7 space-y-5"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <label className="block text-sm font-mono mb-2 text-muted-foreground">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full glass rounded-xl px-4 py-3 outline-none glass-input"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-mono mb-2 text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full glass rounded-xl px-4 py-3 outline-none glass-input"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-mono mb-2 text-muted-foreground">Message</label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full glass rounded-xl px-4 py-3 outline-none glass-input resize-none"
              placeholder="Your message"
            />
          </div>
          <button
            type="submit"
            className="w-full glass btn-glow rounded-xl py-3 font-medium flex items-center justify-center gap-2"
            style={{ color: 'var(--accent)' }}
          >
            {sent ? (
              'Sent ✓'
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Message
              </>
            )}
          </button>
        </motion.form>

        <motion.div
          className="glass rounded-3xl relative h-[420px] overflow-hidden flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="radar-ping" />
            <span className="radar-ping" style={{ animationDelay: '1s' }} />
            <span className="radar-ping" style={{ animationDelay: '2s' }} />
          </div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="relative">
              <div
                className="absolute -inset-5 rounded-full blur-2xl glow-pulse"
                style={{ background: 'var(--glow)' }}
              />
              <MapPin className="w-24 h-24 relative" style={{ color: 'var(--accent)' }} strokeWidth={1.2} />
              <span className="particle p1" />
              <span className="particle p2" />
              <span className="particle p3" />
              <span className="particle p4" />
            </div>
            <h3 className="mt-7 text-xl font-bold glow-text">Based in Bandaragama</h3>
            <p className="text-muted-foreground mt-1 font-mono text-sm glow-text">Sri Lanka</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}