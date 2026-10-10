import React, { useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/lib/theme-context';

// ── Always-needed above-the-fold components (eager) ──
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CustomCursor from '@/components/ui/CustomCursor';
import ScrollProgress from '@/components/ui/ScrollProgress';

const MeshBackground = lazy(() => import('@/components/MeshBackground'));
const About = lazy(() => import('@/components/About'));
const Services = lazy(() => import('@/components/Services'));
const TechStack = lazy(() => import('@/components/TechStack'));
const GithubStats = lazy(() => import('@/components/GithubStats'));
const Terminal = lazy(() => import('@/components/Terminal'));
const Experience = lazy(() => import('@/components/Experience'));
const InfiniteMarquee = lazy(() => import('@/components/ui/InfiniteMarquee'));
const Projects = lazy(() => import('@/components/Projects'));
const Education = lazy(() => import('@/components/Education'));
const Guestbook = lazy(() => import('@/components/Guestbook'));
const Contact = lazy(() => import('@/components/Contact'));
const Footer = lazy(() => import('@/components/Footer'));
const ThemeCustomizer = lazy(() => import('@/components/ThemeCustomizer'));
const CommandPalette = lazy(() => import('@/components/CommandPalette'));
const ContextMenu = lazy(() => import('@/components/ui/ContextMenu'));
const Chatbot = lazy(() => import('@/components/Chatbot'));
const SpotifyWidget = lazy(() => import('@/components/SpotifyWidget'));

const SectionFallback = () => (
  <div className="w-full py-24 flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)] animate-spin" />
  </div>
);

export default function Home() {
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.1,
    });

    let rafId;
    let lastTime = 0;
    const fps = 60;
    const interval = 1000 / fps;

    function raf(time) {
      const delta = time - lastTime;
      if (delta > interval) {
        lastTime = time - (delta % interval);
        lenis.raf(time);
      }
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
  // Dynamic Title 
  useEffect(() => {
    const originalTitle = document.title;
    let intervalId = null;
    let toggled = false;

    const onVisibility = () => {
      if (document.hidden) {
        intervalId = setInterval(() => {
          document.title = toggled ? '💔 Hey, come back!' : originalTitle;
          toggled = !toggled;
        }, 2000);
      } else {
        clearInterval(intervalId);
        document.title = originalTitle;
        toggled = false;
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <ThemeProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{ style: { background: '#333', color: '#fff', borderRadius: '10px' } }}
      />

      {/* Above-the-fold — eager */}
      <Preloader />
      <CustomCursor />
      <ScrollProgress />

      {/* Lazy UI chrome */}
      <Suspense fallback={null}><ThemeCustomizer /></Suspense>
      <Suspense fallback={null}><CommandPalette /></Suspense>
      <Suspense fallback={null}><ContextMenu /></Suspense>

      {/* WebGL background — lazy, no visible fallback */}
      <Suspense fallback={null}><MeshBackground /></Suspense>

      <Navbar />

      <main className="relative">
        =        <Hero />
        {/* Everything below is lazy + wrapped in Suspense */}
        <Suspense fallback={<SectionFallback />}><About /></Suspense>
        <Suspense fallback={<SectionFallback />}><Services /></Suspense>
        <Suspense fallback={<SectionFallback />}><TechStack /></Suspense>
        <Suspense fallback={<SectionFallback />}><GithubStats /></Suspense>
        <Suspense fallback={null}><Terminal /></Suspense>
        <Suspense fallback={<SectionFallback />}><Experience /></Suspense>
        <Suspense fallback={null}>
          <InfiniteMarquee text="AVAILABLE FOR FREELANCE • LET'S TALK" speed={1.5} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}><Projects /></Suspense>
        <Suspense fallback={<SectionFallback />}><Education /></Suspense>
        <Suspense fallback={<SectionFallback />}><Guestbook /></Suspense>
        <Suspense fallback={<SectionFallback />}><Contact /></Suspense>
        <Suspense fallback={null}><Footer /></Suspense>
      </main>

      {/* Floating widgets*/}
      <Suspense fallback={null}><Chatbot /></Suspense>
      <Suspense fallback={null}><SpotifyWidget /></Suspense>
    </ThemeProvider>
  );
}
