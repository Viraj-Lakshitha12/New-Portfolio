import React from 'react';
import { ThemeProvider } from '@/lib/theme-context';
import MeshBackground from '@/components/MeshBackground';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TechStack from '@/components/TechStack';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Education from '@/components/Education';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <ThemeProvider>
      <Preloader />
      <MeshBackground />
      <Navbar />
      <main className="relative">
        <Hero />
        <TechStack />
        <Experience />
        <Projects />
        <Education />
        <Contact />
        <Footer />
      </main>
    </ThemeProvider>
  );
}