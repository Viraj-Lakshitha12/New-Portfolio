import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Github, BookOpen, Star, Activity } from 'lucide-react';

export default function GithubStats() {
  const [data, setData] = useState({
    contributions: [],
    totalContributions: 0,
    stars: 0,
    repos: 0,
    loading: true,
  });

  const username = "Viraj-Lakshitha12";

  const scrollContainerRef = useRef(null);

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
    <section className="relative py-12 md:py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="glass rounded-3xl p-8 md:p-10 border border-black/10 dark:border-white/10 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Decorative Background Glows */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
                <Github size={16} className="animate-pulse" /> 
                <span className="font-semibold">GitHub Activity</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-br from-green-500 to-emerald-300 dark:from-green-400 dark:to-emerald-200">
                  {data.loading ? "..." : data.totalContributions.toLocaleString()}
                </span> Contributions
              </h2>
              <p className="text-muted-foreground/80 font-medium">in the last year</p>
            </div>
            
            <div className="flex flex-wrap gap-6 md:gap-10 text-center md:text-left bg-black/5 dark:bg-white/5 p-5 rounded-2xl border border-black/5 dark:border-white/5 backdrop-blur-sm">
              <div className="flex flex-col items-center md:items-start">
                <span className="flex items-center gap-1.5 text-muted-foreground font-mono text-sm mb-1.5"><Activity size={14} className="text-green-500" /> Total</span>
                <span className="text-2xl font-bold">{data.loading ? "-" : data.totalContributions.toLocaleString()}</span>
              </div>
              <div className="w-[1px] bg-black/10 dark:bg-white/10 hidden md:block"></div>
              <div className="flex flex-col items-center md:items-start">
                <span className="flex items-center gap-1.5 text-muted-foreground font-mono text-sm mb-1.5"><BookOpen size={14} className="text-emerald-500" /> Repos</span>
                <span className="text-2xl font-bold">{data.loading ? "-" : data.repos}</span>
              </div>
              <div className="w-[1px] bg-black/10 dark:bg-white/10 hidden md:block"></div>
              <div className="flex flex-col items-center md:items-start">
                <span className="flex items-center gap-1.5 text-muted-foreground font-mono text-sm mb-1.5"><Star size={14} className="text-yellow-500" /> Stars</span>
                <span className="text-2xl font-bold">{data.loading ? "-" : data.stars}</span>
              </div>
            </div>
          </div>

          <div 
            ref={scrollContainerRef}
            className="relative z-10 w-full overflow-x-auto pb-6 custom-scrollbar"
          >
            <div className="min-w-[750px] flex justify-end gap-1 items-end p-2 rounded-xl bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/5">
              {data.loading ? (
                <div className="w-full h-[120px] flex items-center justify-center text-muted-foreground font-mono text-sm animate-pulse">
                  Fetching GitHub Data...
                </div>
              ) : (
                data.contributions.map((week, wIndex) => (
                  <div key={wIndex} className="flex flex-col gap-1">
                    {week.map((day, dIndex) => (
                      <motion.div
                        key={dIndex}
                        title={`${day.count} contributions on ${day.date}`}
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.6, zIndex: 10, borderRadius: '4px' }}
                        viewport={{ once: true, margin: '-20px' }}
                        transition={{ delay: (wIndex * 0.005) + (dIndex * 0.005), duration: 0.2 }}
                        className={`w-[12px] h-[12px] rounded-[3px] ${getLevelColor(day.intensity)} relative cursor-crosshair hover:shadow-lg hover:shadow-green-500/50`}
                      />
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
          
        </motion.div>
      </div>
    </section>
  );
}
