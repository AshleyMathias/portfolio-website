export type StepKind =
  | "bean"
  | "grind"
  | "extract"
  | "milk"
  | "water"
  | "mix"
  | "finish"
  | "serve";

export interface BrewStep {
  id: string;
  label: string;
  detail?: string;
  kind: StepKind;
  deps: string[];
}

export interface CoffeeResult {
  liquid: string; // main liquid color
  crema: string; // crema / foam color
  foam: number; // 0..1 fraction of cup that is foam/crema
  temp: "hot" | "iced";
  strength: number; // 1..5
  caffeine: string;
  volume: string;
  notes: string[];
}

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  time: string;
  steps: BrewStep[];
  result: CoffeeResult;
}

export const KIND_COLORS: Record<StepKind, string> = {
  bean: "#b98a4b",
  grind: "#e0913f",
  extract: "#e06a4a",
  milk: "#c9d4e6",
  water: "#4cc9d8",
  mix: "#9a86ec",
  finish: "#4ec89e",
  serve: "#4ade80",
};

export const recipes: Recipe[] = [
  {
    id: "espresso",
    name: "Espresso",
    emoji: "☕",
    tagline: "The atomic unit of coffee. Short, dense, uncompromising.",
    time: "~30s",
    steps: [
      { id: "beans", label: "Beans", detail: "18g dark roast", kind: "bean", deps: [] },
      { id: "grind", label: "Grind", detail: "fine", kind: "grind", deps: ["beans"] },
      { id: "tamp", label: "Dose & Tamp", detail: "30 lb", kind: "mix", deps: ["grind"] },
      { id: "extract", label: "Extract", detail: "9 bar · 25s", kind: "extract", deps: ["tamp"] },
      { id: "shot", label: "Espresso", detail: "36ml", kind: "mix", deps: ["extract"] },
      { id: "serve", label: "Serve", kind: "serve", deps: ["shot"] },
    ],
    result: {
      liquid: "#3a2114",
      crema: "#b5732f",
      foam: 0.16,
      temp: "hot",
      strength: 5,
      caffeine: "~80mg",
      volume: "36ml",
      notes: ["dark chocolate", "intense", "thick crema"],
    },
  },
  {
    id: "latte",
    name: "Latte",
    emoji: "🥛",
    tagline: "Espresso meets silky microfoam. Parallel branches, one pour.",
    time: "~2m",
    steps: [
      { id: "beans", label: "Beans", detail: "18g", kind: "bean", deps: [] },
      { id: "grind", label: "Grind", detail: "fine", kind: "grind", deps: ["beans"] },
      { id: "extract", label: "Extract", detail: "double shot", kind: "extract", deps: ["grind"] },
      { id: "espresso", label: "Espresso", kind: "mix", deps: ["extract"] },
      { id: "milk", label: "Milk", detail: "180ml", kind: "milk", deps: [] },
      { id: "steam", label: "Steam", detail: "65°C", kind: "milk", deps: ["milk"] },
      { id: "microfoam", label: "Microfoam", kind: "milk", deps: ["steam"] },
      { id: "pour", label: "Pour", kind: "mix", deps: ["espresso", "microfoam"] },
      { id: "art", label: "Latte Art", kind: "finish", deps: ["pour"] },
      { id: "serve", label: "Serve", kind: "serve", deps: ["art"] },
    ],
    result: {
      liquid: "#6f4a2f",
      crema: "#e7d9c4",
      foam: 0.34,
      temp: "hot",
      strength: 2,
      caffeine: "~120mg",
      volume: "240ml",
      notes: ["creamy", "smooth", "rosetta art"],
    },
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    emoji: "☕",
    tagline: "Equal thirds — espresso, steamed milk, and a crown of foam.",
    time: "~2m",
    steps: [
      { id: "beans", label: "Beans", kind: "bean", deps: [] },
      { id: "grind", label: "Grind", detail: "fine", kind: "grind", deps: ["beans"] },
      { id: "extract", label: "Extract", kind: "extract", deps: ["grind"] },
      { id: "espresso", label: "Espresso", kind: "mix", deps: ["extract"] },
      { id: "milk", label: "Milk", kind: "milk", deps: [] },
      { id: "steam", label: "Steam", kind: "milk", deps: ["milk"] },
      { id: "foam", label: "Thick Foam", kind: "milk", deps: ["steam"] },
      { id: "combine", label: "Combine", detail: "1:1:1", kind: "mix", deps: ["espresso", "foam"] },
      { id: "cocoa", label: "Cocoa Dust", kind: "finish", deps: ["combine"] },
      { id: "serve", label: "Serve", kind: "serve", deps: ["cocoa"] },
    ],
    result: {
      liquid: "#5b3a24",
      crema: "#efe4d4",
      foam: 0.46,
      temp: "hot",
      strength: 3,
      caffeine: "~120mg",
      volume: "180ml",
      notes: ["airy foam", "balanced", "cocoa"],
    },
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    emoji: "🧊",
    tagline: "Patience over pressure. 16 hours of slow, cold extraction.",
    time: "~16h",
    steps: [
      { id: "beans", label: "Beans", detail: "100g", kind: "bean", deps: [] },
      { id: "grind", label: "Grind", detail: "coarse", kind: "grind", deps: ["beans"] },
      { id: "steep", label: "Steep", detail: "16h · cold", kind: "extract", deps: ["grind"] },
      { id: "filter", label: "Filter", kind: "mix", deps: ["steep"] },
      { id: "water", label: "Dilute", detail: "1:1 water", kind: "water", deps: ["filter"] },
      { id: "ice", label: "Ice", kind: "finish", deps: ["water"] },
      { id: "serve", label: "Serve", kind: "serve", deps: ["ice"] },
    ],
    result: {
      liquid: "#2a1a12",
      crema: "#6b4a34",
      foam: 0.06,
      temp: "iced",
      strength: 4,
      caffeine: "~200mg",
      volume: "300ml",
      notes: ["smooth", "low acid", "chilled"],
    },
  },
  {
    id: "mocha",
    name: "Mocha",
    emoji: "🍫",
    tagline: "Where espresso, chocolate, and steamed milk converge.",
    time: "~3m",
    steps: [
      { id: "beans", label: "Beans", kind: "bean", deps: [] },
      { id: "grind", label: "Grind", kind: "grind", deps: ["beans"] },
      { id: "extract", label: "Extract", kind: "extract", deps: ["grind"] },
      { id: "espresso", label: "Espresso", kind: "mix", deps: ["extract"] },
      { id: "choc", label: "Chocolate", detail: "30g", kind: "finish", deps: [] },
      { id: "milk", label: "Milk", kind: "milk", deps: [] },
      { id: "steam", label: "Steam", kind: "milk", deps: ["milk"] },
      { id: "combine", label: "Combine", kind: "mix", deps: ["espresso", "choc"] },
      { id: "blend", label: "Blend", kind: "mix", deps: ["combine", "steam"] },
      { id: "serve", label: "Serve", kind: "serve", deps: ["blend"] },
    ],
    result: {
      liquid: "#4a2c1c",
      crema: "#d8b48c",
      foam: 0.3,
      temp: "hot",
      strength: 3,
      caffeine: "~140mg",
      volume: "300ml",
      notes: ["chocolate", "indulgent", "sweet"],
    },
  },
];

/** Longest-path level for each step id (for column layout). */
export function computeLevels(steps: BrewStep[]): Map<string, number> {
  const byId = new Map(steps.map((s) => [s.id, s]));
  const cache = new Map<string, number>();
  const level = (id: string): number => {
    if (cache.has(id)) return cache.get(id)!;
    const step = byId.get(id)!;
    const lvl =
      step.deps.length === 0 ? 0 : Math.max(...step.deps.map(level)) + 1;
    cache.set(id, lvl);
    return lvl;
  };
  steps.forEach((s) => level(s.id));
  return cache;
}
