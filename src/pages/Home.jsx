import React, { useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/lib/theme-context';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import TechStack from '@/components/TechStack';
import GithubStats from '@/components/GithubStats';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Education from '@/components/Education';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/ui/CustomCursor';
import ScrollProgress from '@/components/ui/ScrollProgress';
import ThemeCustomizer from '@/components/ThemeCustomizer';
import CommandPalette from '@/components/CommandPalette';
import ContextMenu from '@/components/ui/ContextMenu';
import InfiniteMarquee from '@/components/ui/InfiniteMarquee';
import KineticMarquee from '@/components/ui/KineticMarquee';

// Lazy load heavy components
const MeshBackground = lazy(() => import('@/components/MeshBackground'));
const Terminal = lazy(() => import('@/components/Terminal'));
const Guestbook = lazy(() => import('@/components/Guestbook'));
const Chatbot = lazy(() => import('@/components/Chatbot'));
const SpotifyWidget = lazy(() => import('@/components/SpotifyWidget'));

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Dynamic Title 
  useEffect(() => {
    let originalTitle = document.title;
    let intervalId = null;
    let isOriginal = false;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "💔 Hey, come back!";
        intervalId = setInterval(() => {
          document.title = isOriginal ? "💔 Hey, come back!" : originalTitle;
          isOriginal = !isOriginal;
        }, 2000);
      } else {
        if (intervalId) clearInterval(intervalId);
        document.title = originalTitle;
        isOriginal = false;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <ThemeProvider>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#333', color: '#fff', borderRadius: '10px' } }} />
      <Preloader />
      <CustomCursor />
      <ScrollProgress />
      <ThemeCustomizer />
      <CommandPalette />
      <ContextMenu />
      <Suspense fallback={null}>
        <MeshBackground />
      </Suspense>
      <Navbar />
      <main className="relative">
        <div className="absolute top-[20vh] w-full z-0 overflow-hidden" style={{ opacity: 0.5 }}>
           <KineticMarquee baseVelocity={-5}>VIRAJ LAKSHITHA FULL STACK</KineticMarquee>
        </div>
        <Hero />
        <About />
        <Services />
        <TechStack />
        <GithubStats />
        <Suspense fallback={null}>
          <Terminal />
        </Suspense>
        <Experience />
        <InfiniteMarquee text="AVAILABLE FOR FREELANCE • LET'S TALK" speed={1.5} />
        <Projects />
        <Education />
        <Suspense fallback={null}>
          <Guestbook />
        </Suspense>
        <Contact />
        <Footer />
      </main>
      <Suspense fallback={null}>
        <Chatbot />
      </Suspense>
      <Suspense fallback={null}>
        <SpotifyWidget />
      </Suspense>
    </ThemeProvider>
  );
}
