"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EnterpriseLayerDiagram } from "@/components/architecture/EnterpriseLayerDiagram";
import { architectureCaseStudies } from "@/data/architectures";

export function ArchitectureGallerySection() {
  const [activeId, setActiveId] = useState(architectureCaseStudies[0].id);
  const active = architectureCaseStudies.find((a) => a.id === activeId)!;

  return (
    <section id="architecture" className="relative py-24">
      <div className="section-container">
        <SectionHeader
          label="System Architecture"
          title="Enterprise system design"
          description="Layered architecture views for production systems I've built — structured the way enterprise teams document platforms."
        />

        <div className="mb-6 flex flex-wrap gap-2">
          {architectureCaseStudies.map((arch) => (
            <button
              key={arch.id}
              type="button"
              onClick={() => setActiveId(arch.id)}
              className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                activeId === arch.id
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-border text-muted hover:border-muted hover:text-foreground"
              }`}
            >
              {arch.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-md bg-surface-elevated px-2 py-1 font-mono text-xs text-accent">
                {active.category}
              </span>
              {active.metrics?.map((metric) => (
                <span
                  key={metric}
                  className="rounded-md border border-border px-2 py-1 font-mono text-[10px] text-muted"
                >
                  {metric}
                </span>
              ))}
            </div>

            <EnterpriseLayerDiagram architecture={active} />

            {active.drawioSrc && (
              <div className="mt-3">
                <a
                  href={active.drawioSrc}
                  download
                  className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  ↓ Download full diagram (.drawio)
                </a>
              </div>
            )}

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  Overview
                </h3>
                <p className="leading-relaxed text-muted">{active.description}</p>

                <h3 className="mt-6 mb-3 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  Technologies
                </h3>
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
              </div>

              <div>
                <h3 className="mb-3 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  Design Decisions
                </h3>
                <ul className="space-y-2">
                  {active.designDecisions.map((decision) => (
                    <li
                      key={decision}
                      className="flex gap-2 text-sm leading-relaxed text-muted"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {decision}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
