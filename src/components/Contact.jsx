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
          className="glass rounded-3xl overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31699.989790721247!2d79.96687584142953!3d6.708823020350504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2496ac4ce5535%3A0xd2ed928760ec3c50!2sBandaragama!5e0!3m2!1sen!2slk!4v1789400399477!5m2!1sen!2slk"
            width="100%"
            height="420"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          <div className="p-4 text-center">
            <a
              href="https://www.google.com/maps/place/Bandaragama/@6.708823,79.966876,13z/data=!3m1!4b1!4m6!3m5!1s0x3ae2496ac4ce5535:0xd2ed928760ec3c50!8m2!3d6.708823!4d79.966876!16s%2Fg%2F1225884f?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
              className="glass inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ color: 'var(--accent)' }}
            >
              <MapPin className="w-4 h-4" />
              Get Directions
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}