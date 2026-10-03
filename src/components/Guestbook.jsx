import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, Send, User, Trash2, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { uiAudio } from '@/lib/audio';
import { unlockAchievement } from '@/lib/achievements';

const STORAGE_KEY = 'vldev_guestbook_messages';

// Generate a gradient based on the name (consistent per person)
function nameToGradient(name) {
  const gradients = [
    'from-violet-500 to-purple-600',
    'from-cyan-500 to-blue-600',
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-indigo-500 to-violet-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return gradients[hash % gradients.length];
}

// Generate initials
function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// Relative time
function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Guestbook() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [focused, setFocused] = useState(null);
  const [messagesMaxH, setMessagesMaxH] = useState(420);
  const messagesRef = React.useRef(null);
  const formCardRef = React.useRef(null);

  // Sync messages list height to form card height (ResizeObserver for accuracy)
  useEffect(() => {
    if (!formCardRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setMessagesMaxH(entry.contentRect.height + 2);
      }
    });
    ro.observe(formCardRef.current);
    return () => ro.disconnect();
  }, []);

  const handleWheel = (e) => {
    const el = messagesRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const isScrollable = scrollHeight > clientHeight;
    if (!isScrollable) return;
    const atTop = scrollTop <= 0 && e.deltaY < 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;
    if (!atTop && !atBottom) {
      e.stopPropagation();
    }
  };

  // Konami Code listener
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKeyDown = (e) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setIsAdmin(true);
          toast.success('Admin Mode Unlocked 🔓', { icon: '🧑‍💻' });
          unlockAchievement('gamer');
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setMessages(JSON.parse(saved)); } catch (e) { }
    } else {
      setMessages([
        { id: 1, name: 'Kasun Peiris', message: 'Awesome portfolio! Love the 3D skyline.', date: new Date(Date.now() - 86400000).toISOString() },
        { id: 2, name: 'Sarah Jenkins', message: 'Really clean code architecture. Impressive work.', date: new Date(Date.now() - 172800000).toISOString() },
      ]);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    uiAudio.playClick();
    setIsSubmitting(true);
    setTimeout(() => {
      const newMsg = { id: Date.now(), name: name.trim(), message: message.trim(), date: new Date().toISOString() };
      const updated = [newMsg, ...messages];
      setMessages(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setName(''); setMessage('');
      setIsSubmitting(false);
      toast.success('Message posted!');
      uiAudio.playSuccess();
      unlockAchievement('socialite');
      setTimeout(() => {
        messagesRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }, 600);
  };

  const handleInitiateDelete = (id) => { setDeletingId(id); setDeletePassword(''); };

  const confirmDelete = (e) => {
    e.preventDefault();
    const adminPassword = import.meta.env.VITE_GUESTBOOK_ADMIN_PASSWORD || 'your_admin_password';
    if (deletePassword === adminPassword) {
      const updated = messages.filter(msg => msg.id !== deletingId);
      setMessages(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      toast.success('Message deleted');
      setDeletingId(null);
    } else {
      toast.error('Incorrect password');
      setDeletePassword('');
    }
  };

  return (
    <section id="guestbook" className="relative py-24 px-6 border-t border-black/5 dark:border-white/5">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-sm tracking-[0.2em] uppercase text-[var(--accent)] mb-3 block">
            Community
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Visitor <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-foreground/50">Guestbook</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Leave a mark! Say hello, share feedback, or just drop a random thought.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-[420px_1fr] gap-6 lg:gap-8 items-start">
          {/* ── FORM ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div ref={formCardRef} className="relative rounded-3xl overflow-hidden border border-black/8 dark:border-white/8 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-black/30">
              {/* Top accent stripe */}
              <div className="h-1 bg-gradient-to-r from-[var(--accent)] via-emerald-400 to-[var(--accent)]" />

              <div className="p-6 md:p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                    <Sparkles size={18} className="text-[var(--accent)]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold leading-tight">Sign the Guestbook</h3>
                    <p className="text-xs text-muted-foreground">Your message stays on this device</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="relative">
                    <label className={`absolute left-4 transition-all duration-200 pointer-events-none text-muted-foreground ${focused === 'name' || name ? 'top-1 text-[10px] text-[var(--accent)] font-semibold' : 'top-3.5 text-sm'}`}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                      onChange={(e) => { setName(e.target.value); uiAudio.playTyping(); }}
                      maxLength={30}
                      required
                      className={`w-full pt-5 pb-2 px-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border transition-all duration-200 outline-none text-sm ${focused === 'name' ? 'border-[var(--accent)] shadow-sm shadow-[var(--accent)]/20' : 'border-black/10 dark:border-white/10'}`}
                    />
                    <span className="absolute right-3 top-3.5 text-[10px] font-mono text-muted-foreground">{name.length}/30</span>
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <label className={`absolute left-4 transition-all duration-200 pointer-events-none text-muted-foreground ${focused === 'message' || message ? 'top-1 text-[10px] text-[var(--accent)] font-semibold' : 'top-3.5 text-sm'}`}>
                      Message
                    </label>
                    <textarea
                      value={message}
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused(null)}
                      onChange={(e) => { setMessage(e.target.value); uiAudio.playTyping(); }}
                      rows={4}
                      maxLength={200}
                      required
                      className={`w-full pt-6 pb-3 px-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border transition-all duration-200 outline-none resize-none text-sm custom-scrollbar ${focused === 'message' ? 'border-[var(--accent)] shadow-sm shadow-[var(--accent)]/20' : 'border-black/10 dark:border-white/10'}`}
                    />
                    <span className="absolute right-3 bottom-3 text-[10px] font-mono text-muted-foreground">{message.length}/200</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !name.trim() || !message.trim()}
                    className="w-full py-3.5 rounded-xl bg-foreground text-background font-bold text-sm flex items-center justify-center gap-2 hover:bg-[var(--accent)] hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed group shadow-lg shadow-black/10"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-background/40 border-t-background rounded-full animate-spin" />
                        Posting...
                      </span>
                    ) : (
                      <>
                        Post Message
                        <Send size={15} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>

          {/* ── MESSAGES ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-3"
          >
            {/* Header row */}
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Recent Entries</span>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                {messages.length} {messages.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>

            {/* Scrollable list — exactly same height as form card */}
            <div
              ref={messagesRef}
              onWheel={handleWheel}
              className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1"
              style={{ maxHeight: `${messagesMaxH}px` }}
            >

              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: -16, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, height: 0 }}
                    transition={{ duration: 0.3, delay: i < 5 ? i * 0.05 : 0 }}
                    layout
                    className="group relative rounded-2xl border border-black/5 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-4 hover:border-[var(--accent)]/30 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${nameToGradient(msg.name)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
                        {getInitials(msg.name)}
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-bold truncate">{msg.name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground flex-shrink-0">{timeAgo(msg.date)}</span>
                        </div>
                        <p className="text-sm text-foreground/75 leading-relaxed break-words">{msg.message}</p>
                      </div>
                      {/* Delete */}
                      {isAdmin && (
                        <button
                          onClick={() => handleInitiateDelete(msg.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 text-muted-foreground"
                          aria-label="Delete message"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground opacity-50">
                  <MessageSquarePlus size={40} className="mb-3" />
                  <p className="text-sm">No messages yet. Be the first!</p>
                </div>
              )}
            </div>{/* end scrollable list */}
          </motion.div>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deletingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-background border border-black/10 dark:border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full"
            >
              <h3 className="text-xl font-bold mb-2">Admin Authorization</h3>
              <p className="text-sm text-muted-foreground mb-4">Enter the admin password to delete this message.</p>
              <form onSubmit={confirmDelete}>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-colors mb-4 text-sm"
                  autoFocus
                />
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setDeletingId(null)} className="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">
                    Delete
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
