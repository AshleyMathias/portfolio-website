"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { skillCategories, type SkillCategory } from "@/data/skills";

function skillsIn(category: SkillCategory) {
  const seen = new Set<string>();
  const skills: string[] = [];
  const push = (label: string) => {
    const key = label.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    skills.push(label);
  };
  category.highlights.forEach(push);
  category.all.forEach(push);
  category.groups?.forEach((group) => group.items.forEach(push));
  return skills;
}

function groupOf(category: SkillCategory, skill: string) {
  return category.groups?.find((group) => group.items.includes(skill))?.label;
}

export function SkillsSection() {
  const [categoryId, setCategoryId] = useState(skillCategories[0].id);
  const [index, setIndex] = useState(0);

  const category =
    skillCategories.find((item) => item.id === categoryId) ?? skillCategories[0];
  const skills = skillsIn(category);
  const skill = skills[Math.min(index, skills.length - 1)] ?? skills[0];
  const group = groupOf(category, skill);

  const chooseCategory = (id: string) => {
    setCategoryId(id);
    setIndex(0);
  };

  const step = (direction: number) => {
    setIndex((current) => {
      const next = current + direction;
      if (next < 0) return skills.length - 1;
      if (next >= skills.length) return 0;
      return next;
    });
  };

  return (
    <section id="skills" className="relative py-24">
      <div className="section-container">
        <SectionHeader
          label="Skills"
          title="Technical stack"
          description="Five disciplines. Tune one skill at a time — the rest of the discipline stays in the field around it."
        />

        <div
          className="mb-8 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Skill disciplines"
        >
          {skillCategories.map((item) => {
            const selected = item.id === category.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => chooseCategory(item.id)}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                  selected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: selected ? "currentColor" : item.accent }}
                  aria-hidden="true"
                />
                {item.title}
              </button>
            );
          })}
        </div>

        <div className="glass-panel relative overflow-hidden px-6 py-10 md:px-10 md:py-14">
          <div
            className="pointer-events-none absolute -top-20 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: category.accent }}
            aria-hidden="true"
          />

          <div className="relative flex items-center justify-between font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            <span style={{ color: category.accent }}>{category.title}</span>
            <span>
              {String(Math.min(index, skills.length - 1) + 1).padStart(2, "0")} /{" "}
              {String(skills.length).padStart(2, "0")}
            </span>
          </div>

          <div className="relative mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous skill"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              ←
            </button>

            <div className="min-w-0 flex-1 text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${category.id}-${skill}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {group && (
                    <p className="mb-3 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                      {group}
                    </p>
                  )}
                  <h3 className="text-3xl font-medium tracking-tight break-words sm:text-4xl md:text-6xl">
                    {skill}
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next skill"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              →
            </button>
          </div>

          <div className="relative mt-10 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {skills.map((item, skillIndex) => {
              const selected = item === skill;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setIndex(skillIndex)}
                  className={`font-mono text-[11px] transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                    selected ? "text-foreground" : "text-muted-foreground hover:text-muted"
                  }`}
                  aria-current={selected ? "true" : undefined}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
