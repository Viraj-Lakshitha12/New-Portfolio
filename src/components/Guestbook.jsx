import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, Send, User, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { uiAudio } from '@/lib/audio';

const STORAGE_KEY = 'vldev_guestbook_messages';

export default function Guestbook() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletePassword, setDeletePassword] = useState('');

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
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse guestbook messages');
      }
    } else {
      // Mock initial messages
      setMessages([
        { id: 1, name: 'Kasun Peiris', message: 'Awesome portfolio! Love the 3D skyline.', date: new Date(Date.now() - 86400000).toISOString() },
        { id: 2, name: 'Sarah Jenkins', message: 'Really clean code architecture. Impressive work.', date: new Date(Date.now() - 172800000).toISOString() }
      ]);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    uiAudio.playClick();
    setIsSubmitting(true);

    // Simulate network request
    setTimeout(() => {
      const newMsg = {
        id: Date.now(),
        name: name.trim(),
        message: message.trim(),
        date: new Date().toISOString()
      };

      const updatedMessages = [newMsg, ...messages];
      setMessages(updatedMessages);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));

      setName('');
      setMessage('');
      setIsSubmitting(false);
      toast.success('Message posted to guestbook!');
      uiAudio.playSuccess();
    }, 600);
  };

  const handleInitiateDelete = (id) => {
    setDeletingId(id);
    setDeletePassword('');
  };

  const confirmDelete = (e) => {
    e.preventDefault();
    const adminPassword = import.meta.env.VITE_GUESTBOOK_ADMIN_PASSWORD || 'your_admin_password';
    if (deletePassword === adminPassword) {
      const updatedMessages = messages.filter(msg => msg.id !== deletingId);
      setMessages(updatedMessages);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
      toast.success('Message deleted securely');
      setDeletingId(null);
    } else {
      toast.error('Incorrect password');
      setDeletePassword('');
    }
  };

  return (
    <section id="guestbook" className="relative py-24 px-6 border-t border-black/5 dark:border-white/5">
      <div className="max-w-4xl mx-auto">
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

        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass p-6 md:p-8 rounded-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <MessageSquarePlus className="text-[var(--accent)]" size={24} />
              <h3 className="text-xl font-bold">Sign the Guestbook</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 ml-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  maxLength={30}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[var(--accent)] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 ml-1">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={4}
                  maxLength={200}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[var(--accent)] transition-colors resize-none"
                  required
                />
                <div className="text-right mt-1">
                  <span className="text-xs text-muted-foreground">{message.length}/200</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !message.trim()}
                className="w-full py-3.5 rounded-xl bg-foreground text-background font-bold flex items-center justify-center gap-2 hover:bg-[var(--accent)] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? 'Posting...' : 'Post Message'}
                {!isSubmitting && <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              </button>
            </form>
          </motion.div>

          {/* Messages List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col h-[400px] overflow-hidden rounded-3xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]"
          >
            <div className="p-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-black/5 dark:bg-white/5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Entries</span>
              <span className="text-xs font-bold px-2 py-1 rounded-md bg-[var(--accent)]/10 text-[var(--accent)]">{messages.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    layout
                    className="p-4 rounded-2xl glass border border-black/5 dark:border-white/5"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-emerald-400 flex items-center justify-center text-white flex-shrink-0 shadow-inner">
                          <User size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold leading-tight">{msg.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{new Date(msg.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleInitiateDelete(msg.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                          aria-label="Delete message"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed pl-11">{msg.message}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                  <MessageSquarePlus size={48} className="mb-4" />
                  <p>No messages yet. Be the first!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Password Modal */}
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
              <p className="text-sm text-muted-foreground mb-4">Please enter the admin password to delete this message.</p>
              <form onSubmit={confirmDelete}>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-colors mb-4"
                  autoFocus
                />
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setDeletingId(null)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                  >
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
