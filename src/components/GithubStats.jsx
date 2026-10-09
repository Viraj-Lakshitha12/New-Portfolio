import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, BookOpen, Star, Activity } from 'lucide-react';
import { uiAudio } from '@/lib/audio';
import { useCountUp } from '@/lib/useCountUp';

export default function GithubStats() {
  const [viewMode, setViewMode] = useState('2d');
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const [data, setData] = useState({
    contributions: [],
    totalContributions: 0,
    stars: 0,
    repos: 0,
    loading: true,
  });

  const username = "Viraj-Lakshitha12";

  const scrollContainerRef = useRef(null);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  // Animated counters
  const animContributions = useCountUp(data.totalContributions, statsInView && !data.loading);
  const animRepos = useCountUp(data.repos, statsInView && !data.loading);
  const animStars = useCountUp(data.stars, statsInView && !data.loading);

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        const graphRes = await fetch(`https://gh-calendar.rschristian.dev/user/${username}`);
        const graphData = await graphRes.json();

        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        const reposData = await reposRes.json();

        const stars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);

        setData({
          contributions: graphData.contributions || [],
          totalContributions: graphData.total || 0,
          stars: stars,
          repos: reposData.length || 0,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
        setData((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchGitHubData();
  }, [username]);

  // Auto-scroll to the right side (most recent) on mobile
  useEffect(() => {
    if (!data.loading && scrollContainerRef.current) {
      // Small delay to ensure render is complete
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        }
      }, 100);
    }
  }, [data.loading]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getLevelColor = (level) => {
    switch (String(level)) {
      case '4': return 'bg-green-500 dark:bg-[#39d353] shadow-[0_0_8px_rgba(57,211,83,0.6)]';
      case '3': return 'bg-green-400 dark:bg-[#26a641] shadow-[0_0_6px_rgba(38,166,65,0.4)]';
      case '2': return 'bg-green-300 dark:bg-[#006d32]';
      case '1': return 'bg-green-200 dark:bg-[#0e4429]';
      default: return 'bg-zinc-200/50 dark:bg-zinc-800/40 border border-black/5 dark:border-white/5';
    }
  };

  return (
    <section ref={statsRef} className="relative py-20 md:py-32 px-6">
      <style>{`
        .iso-bar {
          transform-style: preserve-3d;
        }
        .iso-3d .iso-bar::before {
          content: '';
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          height: var(--bar-height, 0px);
          background: inherit;
          filter: brightness(0.7) contrast(1.2);
          transform-origin: top;
          transform: rotateX(-90deg);
        }
        .iso-3d .iso-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: 100%;
          width: var(--bar-height, 0px);
          height: 100%;
          background: inherit;
          filter: brightness(0.4) contrast(1.2);
          transform-origin: left;
          transform: rotateY(90deg);
        }
        @media (max-width: 768px) {
          .github-3d-grid {
            gap: 1px !important;
          }
          .github-3d-grid .iso-bar {
            width: 7px !important;
            height: 7px !important;
            border-radius: 1px !important;
          }
        }
      `}</style>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_2px,transparent_2px),linear-gradient(to_bottom,#80808012_2px,transparent_2px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="glass rounded-3xl p-8 md:p-10 border border-black/10 dark:border-white/10 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Decorative Background Glows */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500/0 dark:bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/0 dark:bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start justify-between mb-12">
            <div>
              <div className="font-mono text-sm tracking-[0.2em] uppercase text-[var(--accent)] mb-3 block flex items-center gap-2">
                <Github size={16} className="animate-pulse" />
                <span>GitHub Activity</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-foreground/50">
                  {data.loading ? "..." : animContributions.toLocaleString()}
                </span> Contributions
              </h2>
              <p className="text-muted-foreground max-w-2xl text-lg">in the last year</p>
            </div>

            <div className="flex flex-wrap gap-6 md:gap-10 text-center md:text-left bg-black/5 dark:bg-white/5 p-5 rounded-2xl border border-black/5 dark:border-white/5 backdrop-blur-sm">
              <div className="flex flex-col items-center md:items-start">
                <span className="flex items-center gap-1.5 text-muted-foreground font-mono text-sm mb-1.5"><Activity size={14} className="text-green-500" /> Total</span>
                <span className="text-2xl font-bold">{data.loading ? "-" : animContributions.toLocaleString()}</span>
              </div>
              <div className="w-[1px] bg-black/10 dark:bg-white/10 hidden md:block"></div>
              <div className="flex flex-col items-center md:items-start">
                <span className="flex items-center gap-1.5 text-muted-foreground font-mono text-sm mb-1.5"><BookOpen size={14} className="text-emerald-500" /> Repos</span>
                <span className="text-2xl font-bold">{data.loading ? "-" : animRepos}</span>
              </div>
              <div className="w-[1px] bg-black/10 dark:bg-white/10 hidden md:block"></div>
              <div className="flex flex-col items-center md:items-start">
                <span className="flex items-center gap-1.5 text-muted-foreground font-mono text-sm mb-1.5"><Star size={14} className="text-yellow-500" /> Stars</span>
                <span className="text-2xl font-bold">{data.loading ? "-" : animStars}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-10 mb-4 px-2">
            <h3 className="font-semibold text-lg">Contribution Matrix</h3>
            <button
              onClick={() => { uiAudio.playClick(); setViewMode(prev => prev === '2d' ? '3d' : '2d') }}
              className="px-4 py-1.5 rounded-full text-xs font-bold font-mono tracking-widest uppercase transition-all duration-300 border border-[var(--accent)]/30 hover:bg-[var(--accent)]/10 text-[var(--accent)]"
            >
              Toggle {viewMode === '2d' ? '3D' : '2D'}
            </button>
          </div>

          <div
            ref={scrollContainerRef}
            className={`github-3d-container relative z-10 w-full pb-6 custom-scrollbar flex items-center justify-center transition-all duration-1000 ${viewMode === '3d' ? 'h-[280px] md:h-[400px] overflow-hidden' : 'h-auto overflow-x-auto'}`}
            style={{ perspective: viewMode === '3d' ? (isMobile ? '600px' : '1200px') : 'none' }}
          >
            <motion.div
              className={`github-3d-grid flex justify-end gap-[2px] md:gap-1.5 p-1 md:p-4 rounded-xl transition-all duration-1000 origin-center ${viewMode === '3d' ? 'iso-3d' : ''}`}
              animate={{
                rotateX: viewMode === '3d' ? (isMobile ? 50 : 60) : 0,
                rotateZ: viewMode === '3d' ? (isMobile ? -30 : -45) : 0,
                scale: viewMode === '3d' ? (isMobile ? 0.75 : 0.8) : 1,
              }}
              style={{ transformStyle: 'preserve-3d' }}>
              {data.loading ? (
                <div className="w-[750px] h-[120px] flex items-center justify-center text-muted-foreground font-mono text-sm animate-pulse bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                  Fetching GitHub Data...
                </div>
              ) : (
                data.contributions.map((week, wIndex) => (
                  <div key={wIndex} className="flex flex-col gap-[2px] md:gap-1.5" style={{ transformStyle: 'preserve-3d' }}>
                    {week.map((day, dIndex) => {
                      const level = Number(day.intensity);
                      const baseZ = viewMode === '3d' ? level * (isMobile ? 8 : 15) : 0;

                      return (
                        <motion.div
                          key={dIndex}
                          title={`${day.count} contributions on ${day.date}`}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          whileHover={{
                            scale: 1.2,
                            z: baseZ + 20,
                            "--bar-height": `${baseZ + 20}px`,
                            boxShadow: `0 0 20px ${level > 0 ? 'rgba(57,211,83,0.8)' : 'rgba(255,255,255,0.2)'}`
                          }}
                          animate={{
                            z: baseZ,
                            "--bar-height": `${baseZ}px`
                          }}
                          viewport={{ once: true, margin: '-20px' }}
                          transition={{
                            opacity: { delay: (wIndex * 0.005) + (dIndex * 0.005), duration: 0.2 },
                            z: { type: "spring", stiffness: 100, damping: 12, delay: (wIndex * 0.005) },
                            "--bar-height": { type: "spring", stiffness: 100, damping: 12, delay: (wIndex * 0.005) }
                          }}
                          className={`w-[12px] h-[12px] rounded-sm ${getLevelColor(day.intensity)} relative cursor-crosshair transition-colors iso-bar`}
                          style={{
                            boxShadow: viewMode === '3d' && level > 0 ? `0 ${level * 4}px ${level * 4}px -2px rgba(0,0,0,0.5)` : 'none'
                          }}
                        />
                      );
                    })}
                  </div>
                ))
              )}
            </motion.div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
