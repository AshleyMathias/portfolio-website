"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";

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
  return (
    <section id="about" className="relative py-32">
      <div className="section-container">
        <SectionHeader
          label="Philosophy"
          title="How I think about engineering"
          description="AI Engineer building RAG systems, agentic workflows, and fine-tuned LLMs — I design architectures first, then ship production code."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {principles.map((principle, i) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-panel p-6"
            >
              <h3 className="mb-3 text-lg font-medium">{principle.title}</h3>
              <p className="leading-relaxed text-muted">{principle.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
