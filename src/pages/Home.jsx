import React from 'react';
import { ThemeProvider } from '@/lib/theme-context';
import MeshBackground from '@/components/MeshBackground';
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
import Terminal from '@/components/Terminal';
import CustomCursor from '@/components/ui/CustomCursor';
import ScrollProgress from '@/components/ui/ScrollProgress';

export default function Home() {
  return (
    <ThemeProvider>
      <Preloader />
      <CustomCursor />
      <ScrollProgress />
      <MeshBackground />
      <Navbar />
      <main className="relative">
        <Hero />
        <About />
        <Services />
        <TechStack />
        <GithubStats />
        <Experience />
        <Projects />
        <Education />
        <Terminal />
        <Contact />
        <Footer />
      </main>
    </ThemeProvider>
  );
}