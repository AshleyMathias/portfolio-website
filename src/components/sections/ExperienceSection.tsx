"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { experienceStages } from "@/data/experience";

function tone(maturity: number) {
  if (maturity >= 4) return "text-success border-success/40 bg-success/10";
  if (maturity >= 2) return "text-accent border-accent/40 bg-accent/10";
  return "text-muted-foreground border-border bg-surface";
}

export function ExperienceSection() {
  const [index, setIndex] = useState(experienceStages.length - 1);
  const stage = experienceStages[index];
  const progress = (stage.maturity / experienceStages.length) * 100;

  const step = (direction: number) => {
    setIndex((current) => {
      const next = current + direction;
      if (next < 0) return experienceStages.length - 1;
      if (next >= experienceStages.length) return 0;
      return next;
    });
  };

  return (
    <section id="experience" className="relative py-32">
      <div className="section-container">
        <SectionHeader
          label="Experience"
          title="System maturity evolution"
          description="From ML foundations to AI Engineer. Check out a build on the release line — each version is a step toward production systems."
        />

        <div className="mb-8">
          <div className="relative">
            <div className="absolute top-5 right-5 left-5 h-px bg-border" aria-hidden="true" />
            <div
              className="absolute top-5 left-5 h-px bg-accent transition-[width] duration-500"
              style={{ width: `calc((100% - 2.5rem) * ${index / Math.max(experienceStages.length - 1, 1)})` }}
              aria-hidden="true"
            />
            <ol className="relative grid grid-cols-5 gap-2">
              {experienceStages.map((item, itemIndex) => {
                const selected = itemIndex === index;
                return (
                  <li key={item.id} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setIndex(itemIndex)}
                      aria-current={selected ? "true" : undefined}
                      title={item.title}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border font-mono text-[10px] transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none sm:w-14 sm:text-xs ${
                        selected ? tone(item.maturity) : "border-border bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      v{item.maturity}.0
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className="glass-panel overflow-hidden px-6 py-10 md:px-10 md:py-14">
          <div className="mb-8 flex items-center justify-between gap-4 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            <span>{stage.stage}</span>
            <span>
              build {index + 1} / {experienceStages.length}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="max-w-3xl text-3xl font-medium tracking-tight break-words sm:text-4xl md:text-6xl">
                {stage.title}
              </h3>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{stage.description}</p>

              <ul className="mt-8 grid gap-2 sm:grid-cols-2">
                {stage.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background/50 px-3 py-2 font-mono text-xs text-foreground"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
                    {capability}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 h-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => step(-1)}
              className="rounded-lg border border-border px-4 py-2 text-sm text-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              ← Earlier build
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              Promote build →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
