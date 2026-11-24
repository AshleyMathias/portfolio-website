"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { projects, type Project } from "@/data/projects";

const CHAPTERS = [
  "Problem",
  "Architecture",
  "System Design",
  "Technologies",
  "Challenges",
  "Results",
] as const;

function chapterBody(project: Project, chapter: (typeof CHAPTERS)[number]) {
  if (chapter === "Problem") return project.problem;
  if (chapter === "Architecture") return project.architecture;
  if (chapter === "System Design") return project.systemDesign;
  return null;
}

export function ProjectsSection() {
  const [projectId, setProjectId] = useState(projects[0].id);
  const [chapter, setChapter] = useState(0);
  const project = projects.find((item) => item.id === projectId) ?? projects[0];
  const step = CHAPTERS[chapter];
  const prose = chapterBody(project, step);

  const openProject = (id: string) => {
    setProjectId(id);
    setChapter(0);
  };

  return (
    <section id="projects" className="relative py-32">
      <div className="section-container">
        <SectionHeader
          label="Projects"
          title="Engineered systems, not just features"
          description="Open a system, then walk it one chapter at a time — from the problem through to what shipped."
        />

        <div className="mb-8">
          <Link
            href="/github"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 font-mono text-xs text-muted transition-colors hover:border-[#F97316]/40 hover:text-foreground"
          >
            <span className="text-[#F97316]">→</span>
            View GitHub projects & research
          </Link>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {projects.map((item, index) => {
            const selected = item.id === project.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => openProject(item.id)}
                className={`shrink-0 rounded-lg border px-4 py-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                  selected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                <span className="block font-mono text-[10px] tracking-widest uppercase opacity-70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 block text-sm font-medium">{item.title}</span>
              </button>
            );
          })}
        </div>

        <article className="glass-panel relative min-h-[22rem] overflow-hidden p-6 md:p-10">
          <p className="font-mono text-xs tracking-widest text-accent uppercase">
            {project.tagline}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${project.id}-${step}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8"
            >
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                chapter {String(chapter + 1).padStart(2, "0")} / 06
              </p>
              <h3 className="mt-3 text-3xl font-medium tracking-tight md:text-5xl">
                {step}
              </h3>

              {prose && (
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{prose}</p>
              )}

              {step === "Technologies" && (
                <ul className="mt-6 flex max-w-2xl flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-md border border-border px-3 py-1 font-mono text-xs text-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              )}

              {step === "Challenges" && (
                <ul className="mt-6 max-w-2xl space-y-3">
                  {project.challenges.map((item) => (
                    <li key={item} className="flex gap-3 text-muted">
                      <span className="text-warning">△</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {step === "Results" && (
                <ul className="mt-6 max-w-2xl space-y-3">
                  {project.results.map((item) => (
                    <li key={item} className="flex gap-3 text-muted">
                      <span className="text-success">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Case chapters">
              {CHAPTERS.map((name, index) => (
                <button
                  key={name}
                  type="button"
                  role="tab"
                  aria-selected={index === chapter}
                  onClick={() => setChapter(index)}
                  className={`rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-wide uppercase transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                    index === chapter
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setChapter((current) => (current + 1) % CHAPTERS.length)}
              className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              {chapter === CHAPTERS.length - 1 ? "Back to the problem" : "Next chapter"} →
            </button>
          </div>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              className="mt-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              View on GitHub →
            </a>
          )}
        </article>
      </div>
    </section>
  );
}
