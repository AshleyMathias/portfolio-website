"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { experienceStages } from "@/data/experience";

export function ExperienceSection() {
  return (
    <section id="experience" className="relative py-32">
      <div className="section-container">
        <SectionHeader
          label="Experience"
          title="System maturity evolution"
          description="From ML foundations to AI Engineer — how my work evolved from intern projects to production multi-agent systems."
        />

        <div className="relative">
          <div className="absolute top-0 bottom-0 left-[19px] w-px bg-gradient-to-b from-border via-accent/30 to-success/50 md:left-[23px]" />

          <div className="space-y-12">
            {experienceStages.map((stage, i) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-12 md:pl-16"
              >
                <div
                  className={`absolute top-1 left-0 flex h-10 w-10 items-center justify-center rounded-lg border font-mono text-xs ${
                    stage.maturity >= 4
                      ? "border-success/50 bg-success/10 text-success"
                      : stage.maturity >= 2
                        ? "border-accent/50 bg-accent/10 text-accent"
                        : "border-border bg-surface text-muted-foreground"
                  }`}
                >
                  v{stage.maturity}.0
                </div>

                <p className="mb-1 font-mono text-xs text-muted-foreground">
                  {stage.stage}
                </p>
                <h3 className="mb-2 text-xl font-medium">{stage.title}</h3>
                <p className="mb-4 max-w-xl leading-relaxed text-muted">
                  {stage.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {stage.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="rounded-md border border-border px-3 py-1 font-mono text-xs text-muted"
                    >
                      {cap}
                    </span>
                  ))}
                </div>

                <div className="mt-4 h-1 max-w-xs overflow-hidden rounded-full bg-border">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(stage.maturity / 5) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
