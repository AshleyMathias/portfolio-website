"use client";

import { LivingArchitectureCanvas } from "@/components/canvas/LivingArchitectureCanvas";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ArchitectureGallerySection } from "@/components/sections/ArchitectureGallerySection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function HomePage() {
  const scrollProgress = useScrollProgress();

  return (
    <>
      <div className="grid-pattern fixed inset-0 z-0 opacity-20" aria-hidden="true" />
      <LivingArchitectureCanvas scrollProgress={scrollProgress} />

      <div className="relative z-10">
        <Navigation />
        <main>
          <HeroSection />
          <ArchitectureGallerySection />
          <ProjectsSection />
          <SkillsSection />
          <ExperienceSection />
          <AboutSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
