"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { skillCategories, type SkillCategory } from "@/data/skills";

function SkillPill({ label, accent }: { label: string; accent: string }) {
  return (
    <span
      className="rounded border border-border bg-background/50 px-2.5 py-1 font-mono text-[11px] text-muted"
      style={{ borderColor: `color-mix(in srgb, ${accent} 25%, var(--color-border))` }}
    >
      {label}
    </span>
  );
}

function CategoryRow({ category, index }: { category: SkillCategory; index: number }) {
  const [open, setOpen] = useState(false);
  const extraCount =
    category.groups?.reduce((n, g) => n + g.items.length, 0) ??
    category.all.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.04 }}
      className="rounded-lg border border-border bg-surface/50"
    >
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: category.accent }}
            />
            <h3 className="text-sm font-medium">{category.title}</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {category.highlights.map((skill) => (
              <SkillPill key={skill} label={skill} accent={category.accent} />
            ))}
          </div>
        </div>

        {extraCount > 0 && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-md border border-border px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-muted hover:text-foreground sm:self-center"
          >
            {open ? "Hide all" : `View all (${extraCount})`}
            <span
              className={`transition-transform ${open ? "rotate-180" : ""}`}
              aria-hidden="true"
            >
              ▾
            </span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-4 pb-4 pt-3">
              {category.all.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {category.all.map((skill) => (
                    <SkillPill key={skill} label={skill} accent={category.accent} />
                  ))}
                </div>
              )}
              {category.groups && (
                <div className="space-y-3">
                  {category.groups.map((group) => (
                    <div key={group.label}>
                      <p className="mb-1.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                        {group.label}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                          <SkillPill key={item} label={item} accent={category.accent} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function SkillsSection() {
  return (
    <section id="skills" className="relative py-24">
      <div className="section-container">
        <SectionHeader
          label="Skills"
          title="Technical stack"
          description="Core skills from my resume — expand any category to see the full list."
        />

        <div className="space-y-2">
          {skillCategories.map((category, i) => (
            <CategoryRow key={category.id} category={category} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
