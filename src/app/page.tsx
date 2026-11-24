"use client";

import dynamic from "next/dynamic";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ArchitectureGallerySection } from "@/components/sections/ArchitectureGallerySection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";
import { BackToTop } from "@/components/ui/BackToTop";

const Scene3D = dynamic(
  () => import("@/components/canvas/Scene3D").then((mod) => mod.Scene3D),
  { ssr: false }
);

export default function HomePage() {
  return (
    <>
      <ScrollProgressBar />
      <div className="grid-pattern fixed inset-0 z-0 opacity-20" aria-hidden="true" />
      <Scene3D />

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

      <BackToTop />
    </>
  );
}
