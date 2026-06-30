"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { projects } from "@/data/projects";

const FLOW_STEPS = [
  "Problem",
  "Architecture",
  "System Design",
  "Technologies",
  "Challenges",
  "Results",
] as const;

export function ProjectsSection() {
  const [activeId, setActiveId] = useState(projects[0].id);
  const active = projects.find((p) => p.id === activeId)!;

  return (
    <section id="projects" className="relative py-32">
      <div className="section-container">
        <SectionHeader
          label="Projects"
          title="Engineered systems, not just features"
          description="Production systems from my resume — workflow automation, incident resolution, document parsing, test automation, and NLP-to-SQL analytics. Open-source repos on the GitHub page."
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

        <div className="mb-12 flex flex-wrap gap-2">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setActiveId(project.id)}
              className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                activeId === project.id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted hover:border-muted hover:text-foreground"
              }`}
            >
              {project.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-8 font-mono text-sm text-accent">{active.tagline}</p>

            <div className="relative">
              <div className="absolute top-0 bottom-0 left-4 w-px bg-border md:left-6" />

              <div className="space-y-8">
                <FlowStep step={FLOW_STEPS[0]} index={0}>
                  <p className="leading-relaxed text-muted">{active.problem}</p>
                </FlowStep>

                <FlowStep step={FLOW_STEPS[1]} index={1}>
                  <p className="leading-relaxed text-muted">{active.architecture}</p>
                </FlowStep>

                <FlowStep step={FLOW_STEPS[2]} index={2}>
                  <p className="leading-relaxed text-muted">{active.systemDesign}</p>
                </FlowStep>

                <FlowStep step={FLOW_STEPS[3]} index={3}>
                  <div className="flex flex-wrap gap-2">
                    {active.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-border px-3 py-1 font-mono text-xs text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </FlowStep>

                <FlowStep step={FLOW_STEPS[4]} index={4}>
                  <ul className="space-y-2">
                    {active.challenges.map((c) => (
                      <li key={c} className="flex gap-2 text-sm text-muted">
                        <span className="text-warning">△</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </FlowStep>

                <FlowStep step={FLOW_STEPS[5]} index={5}>
                  <ul className="space-y-2">
                    {active.results.map((r) => (
                      <li key={r} className="flex gap-2 text-sm text-muted">
                        <span className="text-success">✓</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </FlowStep>
              </div>
            </div>

            {active.githubUrl && (
              <div className="mt-10">
                <a
                  href={active.githubUrl}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm transition-colors hover:border-muted hover:bg-surface"
                >
                  View on GitHub →
                </a>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function FlowStep({
  step,
  index,
  children,
}: {
  step: string;
  index: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="relative pl-12 md:pl-16"
    >
      <div className="absolute top-1 left-2.5 flex h-3 w-3 items-center justify-center rounded-full border border-border bg-background md:left-4.5">
        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
      </div>
      <h3 className="mb-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
        {step}
      </h3>
      {children}
    </motion.div>
  );
}
