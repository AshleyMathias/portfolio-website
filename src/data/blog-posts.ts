export type BlogPlatform =
  | "medium"
  | "blogger"
  | "internal"
  | "github"
  | "devto";

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  platform: BlogPlatform;
  tags: string[];
  category: string;
  publishedDate: string;
  readTime: string;
  coverImage?: string;
  url: string;
  featured: boolean;
}

export const PLATFORM_LABELS: Record<BlogPlatform, string> = {
  medium: "Medium",
  blogger: "Blogger",
  internal: "Internal",
  github: "GitHub Articles",
  devto: "Dev.to",
};

/**
 * Real posts from Medium + Blogger (Prompt Architect).
 * Sorted newest → oldest. Featured: newest Medium + key MCP / production pieces.
 */
export const blogPosts: BlogPost[] = [
  {
    id: "ai-augmented-odc",
    title:
      "The Offshore Development Center is Dead. Long Live the AI-Augmented ODC!",
    description:
      "Traditional outsourcing sold headcount. In 2026, the winners sell AI-augmented delivery — faster onboarding, fixed-scope contracts, agentic deployments, and a stronger human coordination layer.",
    platform: "medium",
    tags: ["AI", "Outsourcing", "Agents", "Software Engineering"],
    category: "Industry",
    publishedDate: "2026-07-11",
    readTime: "2 min",
    url: "https://medium.com/@ashleymathias100/the-offshore-development-center-is-dead-long-live-the-ai-augmented-odc-49fd9ed5913f",
    featured: true,
  },
  {
    id: "protect-pii-from-llms",
    title: "How to Protect Personal Information (PII) From Being Sent to LLMs?",
    description:
      "LLMs should reason — systems should protect data. Detection, masking, keeping PII inside your boundary, and treating privacy as a system feature, not a hope.",
    platform: "blogger",
    tags: ["PII", "Privacy", "LLMs", "Security"],
    category: "Production AI",
    publishedDate: "2026-01-12",
    readTime: "7 min",
    url: "https://promptengineeringwithashley.blogspot.com/2026/01/how-to-protect-personal-information-pii.html",
    featured: true,
  },
  {
    id: "production-ready-checkpoints",
    title:
      "10 Checkpoints Which Are Must to Call Your Application Production Ready",
    description:
      "Working is not production-ready. Bad input, safe failure, clear boundaries, observability, access control, and graceful degradation — the enterprise checklist.",
    platform: "blogger",
    tags: ["Production", "Reliability", "Architecture", "Enterprise"],
    category: "Production AI",
    publishedDate: "2026-01-08",
    readTime: "6 min",
    url: "https://promptengineeringwithashley.blogspot.com/2026/01/10-checkpoints-which-are-must-to-call.html",
    featured: true,
  },
  {
    id: "mcp-in-practice",
    title:
      "How MCP Works in Practice: A Simple MCP Server, Client, and LLM Example",
    description:
      "A clear Python walkthrough: MCP server exposes a tool, client calls it, LLM uses the result — and never executes tools itself.",
    platform: "blogger",
    tags: ["MCP", "Python", "Tools", "LLMs"],
    category: "MCP",
    publishedDate: "2026-01-06",
    readTime: "8 min",
    url: "https://promptengineeringwithashley.blogspot.com/2026/01/how-mcp-works-in-practice-simple-mcp.html",
    featured: false,
  },
  {
    id: "what-is-mcp-server",
    title: "What Is an MCP Server?",
    description:
      "A simple mental model of Model Context Protocol — user request → client → LLM decides → MCP server executes → result flows back.",
    platform: "blogger",
    tags: ["MCP", "Tools", "Architecture", "LLMs"],
    category: "MCP",
    publishedDate: "2026-01-05",
    readTime: "5 min",
    url: "https://promptengineeringwithashley.blogspot.com/2026/01/what-is-mcp-server.html",
    featured: false,
  },
  {
    id: "prompt-iteration",
    title: "The Power of Iteration: Mastering the Art of Prompt Refinement",
    description:
      "Day 5 of the Prompt Architect series — analyze, refine, repeat. Fix long outputs, wrong focus, and unstructured answers through iterative prompting.",
    platform: "blogger",
    tags: ["Prompt Engineering", "Iteration", "LLMs"],
    category: "Prompt Engineering",
    publishedDate: "2025-05-21",
    readTime: "5 min",
    url: "https://promptengineeringwithashley.blogspot.com/2025/05/the-power-of-iteration-mastering-art-of.html",
    featured: false,
  },
  {
    id: "infer-transform-expand",
    title:
      "From Clues to Conversations: Inferring, Transforming & Expanding with AI Prompts",
    description:
      "Day 4 — read between the lines, reshape text on demand, and grow a seed prompt into a full context-rich response.",
    platform: "blogger",
    tags: ["Prompt Engineering", "Inference", "Transformation"],
    category: "Prompt Engineering",
    publishedDate: "2025-05-21",
    readTime: "5 min",
    url: "https://promptengineeringwithashley.blogspot.com/2025/05/from-clues-to-conversations-inferring.html",
    featured: false,
  },
  {
    id: "summarize-with-precision",
    title:
      "Summarize with Precision: The Hidden Power Behind Smarter AI Communication",
    description:
      "Day 3 — set limits, focus the audience, and know when to extract facts instead of summarizing into fluff.",
    platform: "blogger",
    tags: ["Prompt Engineering", "Summarization", "Extraction"],
    category: "Prompt Engineering",
    publishedDate: "2025-05-19",
    readTime: "4 min",
    url: "https://promptengineeringwithashley.blogspot.com/2025/05/summarize-with-precision-hidden-power.html",
    featured: false,
  },
  {
    id: "give-ai-time-to-think",
    title:
      "Unlocking AI's Hidden Intelligence: Why Slowing Down Gets Smarter Results",
    description:
      "Day 2 — specify steps, solve before answering, and cut hallucinations by letting the model think before it speaks.",
    platform: "blogger",
    tags: ["Prompt Engineering", "Reasoning", "Hallucination"],
    category: "Prompt Engineering",
    publishedDate: "2025-05-18",
    readTime: "5 min",
    url: "https://promptengineeringwithashley.blogspot.com/2025/05/unlocking-ais-hidden-intelligence-why.html",
    featured: false,
  },
  {
    id: "clear-specific-prompts",
    title: "Why Your Prompts Fail: The Urgent Need for Clarity",
    description:
      "Day 1 of the Prompt Architect series — clear ≠ short. Delimiters, structured output, condition checks, and few-shot prompting to stop vague answers and injection risk.",
    platform: "blogger",
    tags: ["Prompt Engineering", "Clarity", "Prompt Injection"],
    category: "Prompt Engineering",
    publishedDate: "2025-05-18",
    readTime: "6 min",
    url: "https://promptengineeringwithashley.blogspot.com/2025/05/why-your-prompts-fail-urgent-need-for.html",
    featured: false,
  },
];

export const featuredPosts = blogPosts.filter((p) => p.featured);

export const blogCategories = Array.from(
  new Set(blogPosts.map((p) => p.category))
).sort();

export function formatBlogDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
