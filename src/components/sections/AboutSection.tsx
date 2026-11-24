"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";

const principles = [
  {
    title: "Architecture before implementation",
    description:
      "Every system starts with diagrams, data flows, and boundary definitions — whether it's a multi-agent OPS platform or an MCP context-building pattern.",
  },
  {
    title: "Agents with purpose",
    description:
      "Multi-agent systems need specialized roles — orchestrators, query agents, risk detectors, formatters — not generic LLM calls chained together.",
  },
  {
    title: "Incremental over bulk",
    description:
      "In MCP and RAG alike, context should grow intentionally. Tool calls, retrieval steps, and validation gates each add only what's needed.",
  },
  {
    title: "CPU-efficient production",
    description:
      "Fine-tuned Gemma and Phi-3 models on CPU, LoRA adapters, and modular pipelines — production AI doesn't always require GPU clusters.",
  },
];

export function AboutSection() {
  const [index, setIndex] = useState(0);
  const principle = principles[index];

  return (
    <section id="about" className="relative py-32">
      <div className="section-container">
        <div className="mb-16 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeader
            label="Philosophy"
            title="How I think about engineering"
            description="AI Engineer building RAG systems, agentic workflows, and fine-tuned LLMs — I design architectures first, then ship production code."
            className="mb-0"
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel shrink-0 p-4"
          >
            <ProfileAvatar size="md" showLabel />
          </motion.div>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <ol className="space-y-2">
            {principles.map((item, itemIndex) => {
              const selected = itemIndex === index;
              return (
                <li key={item.title}>
                  <button
                    type="button"
                    onClick={() => setIndex(itemIndex)}
                    aria-current={selected ? "true" : undefined}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                      selected
                        ? "bg-accent/10 text-foreground"
                        : "text-muted-foreground hover:text-muted"
                    }`}
                  >
                    <span className="mr-2 font-mono text-[10px] text-accent">
                      {String(itemIndex + 1).padStart(2, "0")}
                    </span>
                    {item.title}
                  </button>
                </li>
              );
            })}
          </ol>

          <article className="min-h-[16rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  belief {String(index + 1).padStart(2, "0")} / 04
                </p>
                <h3 className="mt-4 max-w-3xl text-3xl leading-tight font-medium tracking-tight md:text-5xl">
                  {principle.title}
                </h3>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
                  {principle.description}
                </p>
                <button
                  type="button"
                  onClick={() => setIndex((current) => (current + 1) % principles.length)}
                  className="mt-8 rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-accent/50 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                >
                  Next belief →
                </button>
              </motion.div>
            </AnimatePresence>
          </article>
        </div>
      </div>
    </section>
  );
}
