import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Building2, Activity, ExternalLink, Compass } from 'lucide-react';
import { uiAudio } from '@/lib/audio';
import { useCountUp } from '@/lib/useCountUp';

const GITHUB_USERNAME = 'Viraj-Lakshitha12';

const VIEW_ANGLES = [
  { id: 'iso', label: '3D Isometric', rotateX: 20, rotateZ: 0 },
  { id: '2d', label: '2D Skyline', rotateX: 0, rotateZ: 0 },
  { id: 'drone', label: '3D Orbit', rotateX: 36, rotateZ: 0 },
];

export default function GitHubCity() {
  const [weeks, setWeeks] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('iso');
  const [isLive, setIsLive] = useState(false);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Fetch real GitHub contribution data
  useEffect(() => {
    let mounted = true;

    async function loadCityData() {
      try {
        const res = await fetch(`https://gh-calendar.rschristian.dev/user/${GITHUB_USERNAME}`);
        if (!res.ok) throw new Error('Calendar source error');
        const data = await res.json();
        const raw = data.contributions || [];

        let grouped = [];

        // When contributions is a 2D array of weeks
        if (Array.isArray(raw) && raw.length > 0 && Array.isArray(raw[0])) {
          grouped = raw.map((weekDays, idx) => {
            const total = weekDays.reduce((sum, d) => sum + (Number(d.count) || 0), 0);
            const topDay = weekDays.reduce(
              (max, d) => ((Number(d.count) || 0) > (Number(max.count) || 0) ? d : max),
              weekDays[0] || { date: '—', count: 0 }
            );
            return {
              weekIdx: idx + 1,
              total,
              days: weekDays,
              topDay,
              startDate: weekDays[0]?.date || '',
              endDate: weekDays[weekDays.length - 1]?.date || '',
            };
          });
        } else if (Array.isArray(raw) && raw.length > 0) {
          // Flat array fallback
          for (let i = 0; i < raw.length; i += 7) {
            const chunk = raw.slice(i, i + 7);
            const total = chunk.reduce((sum, d) => sum + (Number(d.count) || 0), 0);
            const topDay = chunk.reduce(
              (max, d) => ((Number(d.count) || 0) > (Number(max.count) || 0) ? d : max),
              chunk[0] || { date: '—', count: 0 }
            );
            grouped.push({
              weekIdx: grouped.length + 1,
              total,
              days: chunk,
              topDay,
              startDate: chunk[0]?.date || '',
              endDate: chunk[chunk.length - 1]?.date || '',
            });
          }
        }

        if (mounted && grouped.length > 0) {
          setWeeks(grouped.slice(-52));
          setIsLive(true);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Live GitHub fetch fallback:', err);
      }

      // Procedural fallback
      if (mounted) {
        const procedural = Array.from({ length: 52 }, (_, i) => {
          const wave = Math.sin((i / 52) * Math.PI * 4);
          const noise = Math.random();
          const base = wave > 0 ? wave * 16 : 2;
          const total = Math.max(0, Math.round(base + noise * 12));
          const date = new Date(Date.now() - (52 - i) * 7 * 86400000)
            .toISOString()
            .split('T')[0];
          return {
            weekIdx: i + 1,
            total,
            days: [],
            topDay: { date, count: Math.ceil(total / 3) },
            startDate: date,
            endDate: date,
          };
        });
        setWeeks(procedural);
        setIsLive(false);
        setLoading(false);
      }
    }

    loadCityData();
    return () => {
      mounted = false;
    };
  }, []);

  const maxTotal = useMemo(() => Math.max(...weeks.map((w) => w.total), 1), [weeks]);
  const totalCommits = useMemo(() => weeks.reduce((acc, w) => acc + w.total, 0), [weeks]);
  const activeWeeks = useMemo(() => weeks.filter((w) => w.total > 0).length, [weeks]);

  const animTotal = useCountUp(totalCommits, isInView && !loading);
  const animActive = useCountUp(activeWeeks, isInView && !loading);
  const animPeak = useCountUp(maxTotal, isInView && !loading);

  const activeViewConfig = VIEW_ANGLES.find((v) => v.id === viewMode) || VIEW_ANGLES[0];
  const activeFocus = hovered !== null ? weeks[hovered] : selectedWeek;

  return (
    <section id="githubcity" ref={sectionRef} className="relative py-16 md:py-24 px-4 sm:px-6 select-none">
      {/* Consistent Portfolio Matrix Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_2px,transparent_2px),linear-gradient(to_bottom,#80808012_2px,transparent_2px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Consistent Section Header */}
      <motion.div
        className="text-center mb-12 md:mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="font-mono text-sm tracking-[0.2em] uppercase text-[var(--accent)] mb-3 block">
          3D Architecture
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
          The{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-foreground/50">
            City I Built
          </span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
          Every building is a week of code shipped. Taller spires represent high-velocity sprints.
        </p>
      </motion.div>

      {/* Main Glass Card Container */}
      <motion.div
        className="glass rounded-3xl p-4 sm:p-6 md:p-10 border border-black/10 dark:border-white/10 relative overflow-hidden max-w-5xl mx-auto shadow-2xl no-scrollbar"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {/* Ambient Glow Orbs tied to var(--glow) */}
        <div
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[110px] pointer-events-none opacity-25"
          style={{ background: 'var(--glow)' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20"
          style={{ background: 'var(--glow)' }}
        />

        {/* Header Controls Bar inside Card */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: isLive ? '#22c55e' : '#eab308' }}
            />
            <span className="font-mono text-xs text-muted-foreground">
              {isLive ? 'GitHub Sync: Live' : 'Procedural Data'} · 52 Weeks Timeline
            </span>
          </div>

          {/* Perspective View Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            <span className="text-[10px] font-mono text-muted-foreground uppercase px-1.5 hidden sm:flex items-center gap-1">
              <Compass size={12} /> View:
            </span>
            {VIEW_ANGLES.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  uiAudio.playClick();
                  setViewMode(v.id);
                }}
                className={`text-xs font-mono px-2.5 sm:px-3 py-1 rounded-lg transition-all ${
                  viewMode === v.id
                    ? 'bg-[var(--accent)] text-black font-bold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hover / Selected Week Tooltip Card */}
        <div className="relative min-h-[36px] mb-4">
          <AnimatePresence mode="wait">
            {activeFocus ? (
              <motion.div
                key={activeFocus.weekIdx}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="inline-flex items-center gap-2.5 px-3 py-1 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-xs font-mono flex-wrap"
              >
                <span className="font-bold" style={{ color: 'var(--accent)' }}>
                  Week {activeFocus.weekIdx}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-foreground font-semibold">
                  {activeFocus.total} {activeFocus.total === 1 ? 'commit' : 'commits'}
                </span>
                {activeFocus.total > 0 && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground text-[11px]">
                      Top: {activeFocus.topDay?.count || 0} ({activeFocus.topDay?.date || '—'})
                    </span>
                  </>
                )}
              </motion.div>
            ) : (
              <p className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                <Activity size={13} style={{ color: 'var(--accent)' }} />
                <span>Hover over any building to inspect weekly commits</span>
              </p>
            )}
          </AnimatePresence>
        </div>

        {/* 3D City Skyline Stage — 100% Responsive & Zero Scrollbars */}
        {loading ? (
          <div className="h-60 flex items-end justify-center gap-1.5 pb-6 no-scrollbar">
            {Array.from({ length: 36 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 max-w-[12px] bg-black/10 dark:bg-white/10 rounded-t animate-pulse"
                style={{
                  height: `${25 + ((i * 7) % 60)}%`,
                  animationDelay: `${i * 0.04}s`,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="relative pt-2 pb-1 overflow-hidden no-scrollbar">
            {/* Stage wrapper with fixed vertical breathing room and hidden scrollbars */}
            <div
              className="w-full h-[240px] sm:h-[260px] md:h-[280px] flex items-end justify-center overflow-hidden no-scrollbar touch-manipulation select-none"
              style={{ perspective: '1200px' }}
            >
              {/* 3D Skyline Grid Container — 100% width, items fit seamlessly */}
              <motion.div
                className="w-full flex items-end justify-between gap-[1.5px] sm:gap-[2px] md:gap-[3.5px] px-1 sm:px-2 no-scrollbar"
                animate={{
                  rotateX: activeViewConfig.rotateX,
                  rotateZ: activeViewConfig.rotateZ,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                style={{
                  transformOrigin: 'bottom center',
                  transformStyle: 'preserve-3d',
                }}
              >
                {weeks.map((week, idx) => {
                  const isHov = hovered === idx;
                  const isPeak = week.total === maxTotal && maxTotal > 0;
                  const ratio = week.total / maxTotal;

                  // Balanced height formula: 18px base to 180px peak
                  const height =
                    week.total === 0
                      ? 18 + ((idx * 4) % 12)
                      : 36 + Math.round(ratio * 144);

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => {
                        uiAudio.playHover();
                        setHovered(idx);
                      }}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => {
                        uiAudio.playClick();
                        setSelectedWeek(week);
                      }}
                      onTouchStart={() => {
                        uiAudio.playHover();
                        setHovered(idx);
                        setSelectedWeek(week);
                      }}
                      className="relative flex-1 min-w-[2.5px] max-w-[14px] cursor-pointer transition-transform duration-200"
                      style={{
                        transform: isHov ? 'scaleY(1.06)' : 'none',
                        transformOrigin: 'bottom center',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {/* Peak / Hover Vertical Light Beam */}
                      {(isHov || isPeak) && week.total > 0 && (
                        <div
                          className="absolute bottom-full left-1/2 -translate-x-1/2 w-[1.5px] pointer-events-none z-10"
                          style={{
                            height: 80,
                            background:
                              'linear-gradient(to top, var(--accent), transparent)',
                            boxShadow: '0 0 10px var(--accent)',
                          }}
                        />
                      )}

                      {/* Blinking Roof Warning Light for High Activity */}
                      {week.total > 4 && (
                        <div
                          className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full z-10"
                          style={{
                            backgroundColor: isPeak ? '#ef4444' : 'var(--accent)',
                            boxShadow: isPeak
                              ? '0 0 6px #ef4444'
                              : '0 0 6px var(--accent)',
                          }}
                        />
                      )}

                      {/* Building Facade */}
                      <div
                        className="rounded-t-[2px] sm:rounded-t-[3px] transition-all duration-200 w-full"
                        style={{
                          height,
                          background: isHov
                            ? 'var(--accent)'
                            : isPeak
                            ? 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, var(--accent) 100%)'
                            : week.total > 0
                            ? `linear-gradient(to top, rgba(0,0,0,0.5) 10%, var(--accent) ${Math.round(
                                30 + ratio * 60
                              )}%, rgba(255,255,255,0.2) 100%)`
                            : 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(128,128,128,0.2) 100%)',
                          boxShadow: isHov
                            ? '0 0 16px var(--glow), inset 0 1px 0 rgba(255,255,255,0.7)'
                            : isPeak
                            ? '0 0 16px var(--glow)'
                            : week.total > 0
                            ? '0 0 6px var(--glow)'
                            : 'none',
                          border: isHov
                            ? '1px solid var(--accent)'
                            : isPeak
                            ? '1px solid rgba(255,255,255,0.5)'
                            : week.total > 0
                            ? '1px solid rgba(255,255,255,0.2)'
                            : '1px solid rgba(128,128,128,0.12)',
                          borderBottom: 'none',
                        }}
                      >
                        {/* Micro-Window Dots on Building */}
                        {week.total > 0 && (
                          <div
                            className="w-full h-full opacity-35 overflow-hidden pointer-events-none rounded-t-[2px]"
                            style={{
                              backgroundImage:
                                'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                              backgroundSize: '3px 6px',
                              backgroundPosition: '1px 2px',
                            }}
                          />
                        )}

                        {/* Roof Cap Line */}
                        <div
                          className="h-[1.5px] w-full rounded-t-sm"
                          style={{
                            backgroundColor: isHov ? '#ffffff' : 'var(--accent)',
                            opacity: isHov ? 1 : week.total > 0 ? 0.9 : 0.35,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Ground Line Plane */}
            <div
              className="h-[2px] w-full rounded-full mt-0"
              style={{
                background:
                  'linear-gradient(90deg, transparent, var(--accent), transparent)',
                boxShadow: '0 0 12px var(--accent)',
              }}
            />

            {/* Ground Reflection — Responsive & Seamless */}
            <div
              className="overflow-hidden flex items-start justify-between gap-[1.5px] sm:gap-[2px] md:gap-[3.5px] w-full px-1 sm:px-2 opacity-20 pointer-events-none"
              style={{
                height: 24,
                transform: 'rotateX(180deg)',
                filter: 'blur(1.5px)',
                maskImage: 'linear-gradient(to top, transparent, black)',
              }}
            >
              {weeks.map((week, idx) => {
                const ratio = week.total / maxTotal;
                const height =
                  week.total === 0 ? 6 : Math.min(20, Math.round(ratio * 20));
                return (
                  <div
                    key={idx}
                    className="flex-1 min-w-[2.5px] max-w-[14px]"
                    style={{
                      height,
                      backgroundColor:
                        week.total > 0 ? 'var(--accent)' : 'rgba(128,128,128,0.3)',
                      borderRadius: '0 0 2px 2px',
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Telemetry Metrics Row (Matching GithubStats.jsx styling) */}
        <div className="relative z-10 mt-6 pt-5 border-t border-black/5 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
          <div className="p-3 sm:p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-sm">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
              Total Commits
            </span>
            <span
              className="text-xl sm:text-2xl md:text-3xl font-bold"
              style={{ color: 'var(--accent)' }}
            >
              {animTotal.toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground block mt-0.5">
              Code Shipped
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-sm">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
              Active Weeks
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              {animActive}{' '}
              <span className="text-xs font-normal text-muted-foreground">/ 52</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-500 dark:text-emerald-400 block mt-0.5">
              {Math.round((activeWeeks / 52) * 100)}% Consistency
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-sm">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
              Apex Tower
            </span>
            <span
              className="text-xl sm:text-2xl md:text-3xl font-bold"
              style={{ color: 'var(--accent)' }}
            >
              {animPeak}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground block mt-0.5">
              Commits in Peak Week
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-sm flex flex-col justify-center items-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
              Verified GitHub
            </span>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-all font-mono text-xs font-bold mt-0.5"
            >
              <span>@{GITHUB_USERNAME}</span>
              <ExternalLink size={12} />
            </a>
            <span className="text-[10px] font-mono text-muted-foreground mt-0.5">
              View Profile
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
