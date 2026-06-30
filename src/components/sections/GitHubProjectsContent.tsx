"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  featuredProjects,
  researchProjects,
} from "@/data/github-projects";

function ProjectCard({
  title,
  description,
  stack,
  githubUrl,
  problemSolved,
  coreIdea,
  index,
}: {
  title: string;
  description: string;
  stack: string[];
  githubUrl: string;
  problemSolved?: string;
  coreIdea?: string;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.05 }}
      className="glass-panel group relative overflow-hidden p-6 transition-colors hover:border-[#F97316]/30"
    >
      <div
        className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-[0.06] blur-2xl transition-opacity group-hover:opacity-10"
        style={{ backgroundColor: "#F97316" }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="mb-2 text-lg font-medium">{title}</h3>
          <p className="mb-4 leading-relaxed text-muted">{description}</p>

          {problemSolved && (
            <p className="mb-1 text-sm">
              <span className="font-mono text-xs text-[#238636]">problem →</span>{" "}
              <span className="text-muted">{problemSolved}</span>
            </p>
          )}
          {coreIdea && (
            <p className="text-sm">
              <span className="font-mono text-xs text-[#F97316]">idea →</span>{" "}
              <span className="text-muted">{coreIdea}</span>
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {stack.map((tech) => (
              <span
                key={tech}
                className="rounded border border-border bg-background/50 px-2.5 py-1 font-mono text-[11px] text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border px-4 py-2 font-mono text-xs transition-colors hover:border-[#F97316]/50 hover:text-[#F97316]"
        >
          View repo →
        </a>
      </div>
    </motion.article>
  );
}

export function GitHubProjectsContent() {
  return (
    <div className="section-container py-32">
      <div className="mb-16 max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-flex font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to portfolio
        </Link>
        <p className="mb-3 font-mono text-xs tracking-widest text-[#F97316] uppercase">
          github.com/AshleyMathias
        </p>
        <h1 className="mb-4 text-3xl font-medium tracking-tight md:text-4xl">
          Open-source & research
        </h1>
        <p className="leading-relaxed text-muted">
          Featured repositories and LLM research projects from my GitHub profile —
          production agents, RAG systems, fine-tuning experiments, and MCP explorations.
        </p>
      </div>

      <section className="mb-20">
        <div className="mb-8 flex items-center gap-3">
          <span className="font-mono text-xs text-[#238636]">$</span>
          <h2 className="text-xl font-medium">Featured Projects</h2>
        </div>
        <div className="grid gap-4">
          {featuredProjects.map((project, i) => (
            <ProjectCard key={project.id} {...project} index={i} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-3">
          <span className="font-mono text-xs text-[#238636]">$</span>
          <h2 className="text-xl font-medium">Deep Dive — LLM Research</h2>
        </div>
        <p className="mb-8 text-sm text-muted">
          Exploring real-world LLM constraints, performance boundaries & emerging techniques.
        </p>
        <div className="grid gap-4">
          {researchProjects.map((project, i) => (
            <ProjectCard key={project.id} {...project} index={i} />
          ))}
        </div>
      </section>

      <div className="mt-16 flex flex-wrap gap-4">
        <a
          href="https://github.com/AshleyMathias"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-[#F97316] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          View full GitHub profile
        </a>
        <Link
          href="/#projects"
          className="rounded-lg border border-border px-6 py-3 text-sm transition-colors hover:border-muted hover:bg-surface"
        >
          Resume projects
        </Link>
      </div>
    </div>
  );
}
