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

  const inputClasses =
    'w-full rounded-xl px-4 py-3 outline-none glass-input bg-white/50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40 transition-colors duration-300';

  return (
    <section id="contact" className="relative py-28 px-6">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
          Get in Touch
        </h2>
        <p className="mt-3 text-muted-foreground">Let&apos;s build something together.</p>
      </motion.div>

      <motion.div
        className="max-w-6xl mx-auto grid md:grid-cols-2 rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 bg-white/60 dark:bg-neutral-900/50 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {/* Form side */}
        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-5">
          <div>
            <label className="block text-sm font-mono mb-2 text-gray-700 dark:text-white/70">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClasses}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-mono mb-2 text-gray-700 dark:text-white/70">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClasses}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-mono mb-2 text-gray-700 dark:text-white/70">Message</label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={`${inputClasses} resize-none`}
              placeholder="Your message"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl py-3 font-medium flex items-center justify-center gap-2 btn-glow bg-white/70 dark:bg-white/10 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
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
        </form>

        {/* Map side */}
        <div className="relative min-h-[320px] md:min-h-full border-t md:border-t-0 md:border-l border-white/20 dark:border-white/10">
          <div className="absolute top-4 left-4 z-10 rounded-xl px-3 py-2 flex items-center gap-2 text-sm font-mono bg-white/70 dark:bg-black/40 backdrop-blur-md border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white pointer-events-none">
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
        </div>
      </motion.div>
    </section>
  );
}