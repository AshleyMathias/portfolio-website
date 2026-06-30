export interface GitHubProject {
  id: string;
  title: string;
  description: string;
  stack: string[];
  githubUrl: string;
  section: "featured" | "research";
  problemSolved?: string;
  coreIdea?: string;
}

/** Projects from GitHub profile README — featured & deep-dive repos. */
export const githubProjects: GitHubProject[] = [
  {
    id: "securefix-ai",
    title: "SecureFix AI",
    description:
      "AutoFix DevSecOps — automated vulnerability detection & AI-powered remediation.",
    stack: ["Python", "LangChain", "LangGraph", "FastAPI", "Anthropic"],
    githubUrl: "https://github.com/AshleyMathias/SecureFix-AI",
    section: "featured",
  },
  {
    id: "openclaw-bot",
    title: "OpenClaw Bot",
    description:
      "Enterprise AI assistant: policy RAG, support ticketing, notifications & session chat.",
    stack: ["FastAPI", "LangGraph", "ChromaDB", "OpenAI"],
    githubUrl: "https://github.com/AshleyMathias/OpenClaw---Bot",
    section: "featured",
  },
  {
    id: "agentic-node",
    title: "Agentic Node",
    description:
      "Enterprise AI hub: policy RAG, HR analytics & intelligent session conversations.",
    stack: ["FastAPI", "LangGraph", "ChromaDB", "OpenAI"],
    githubUrl: "https://github.com/AshleyMathias/Agentic-Node",
    section: "featured",
  },
  {
    id: "codexcli",
    title: "CodeXCLI",
    description:
      "Voice/text prompts → runnable code via an LLM-powered CLI tool.",
    stack: ["Python", "LangGraph", "LangChain"],
    githubUrl: "https://github.com/AshleyMathias/CodeXCLI-CursorAI-",
    section: "featured",
  },
  {
    id: "genai-architectural-model",
    title: "GenAI Architectural Model",
    description:
      "Surgical Q&A over local PDFs via a LangChain RAG pipeline with GUI.",
    stack: ["Python", "LangChain", "RAG", "Tkinter"],
    githubUrl: "https://github.com/AshleyMathias/GenAI-Architectural-Model",
    section: "featured",
  },
  {
    id: "fine-tuning-lora",
    title: "Fine-Tuning With LoRA",
    description:
      "BERT fine-tuning with LoRA adapters and an interactive Streamlit UI.",
    stack: ["Python", "Streamlit", "LoRA", "PEFT"],
    githubUrl: "https://github.com/AshleyMathias/fine_tuning_with_lora-main-",
    section: "featured",
  },
  {
    id: "speculative-decoding",
    title: "Speculative Decoding",
    description: "Draft-model token prediction with parallel large-model validation.",
    problemSolved: "High LLM inference latency",
    coreIdea:
      "Small draft model predicts tokens; large model validates in parallel.",
    stack: ["Python", "LLM Inference"],
    githubUrl: "https://github.com/AshleyMathias/Speculative-Decoding",
    section: "research",
  },
  {
    id: "pii-masking",
    title: "PII Masking (Presidio)",
    description: "NLP-based PII detection & anonymization before LLM ingestion.",
    problemSolved: "Sensitive data leaking into LLM context",
    coreIdea:
      "Presidio-based PII detection and anonymization pipeline for safe LLM prompts.",
    stack: ["Python", "Presidio", "NLP"],
    githubUrl: "https://github.com/AshleyMathias/PII-Masking---Presidio",
    section: "research",
  },
  {
    id: "deep-agent-todo",
    title: "Deep Agent Todo Planner",
    description:
      "Autonomous LangChain agents break goals → tasks → roadmaps via Streamlit.",
    problemSolved: "Manual goal-to-task decomposition overhead",
    coreIdea:
      "Deep agents decompose goals into tasks and roadmaps with a Streamlit interface.",
    stack: ["Python", "LangChain", "Streamlit"],
    githubUrl: "https://github.com/AshleyMathias/Deep-Agents-LangChain",
    section: "research",
  },
  {
    id: "incremental-context-mcp",
    title: "Incremental Context Builder MCP",
    description:
      "Educational demo for understanding incremental context building in MCP.",
    problemSolved: "Context building in MCP",
    coreIdea:
      "MCP client/server demo showing how context grows through sequential tool calls.",
    stack: ["Python", "MCP", "OpenAI"],
    githubUrl: "https://github.com/AshleyMathias/Incremental-Context-Building-MCP",
    section: "research",
  },
];

export const featuredProjects = githubProjects.filter(
  (p) => p.section === "featured"
);
export const researchProjects = githubProjects.filter(
  (p) => p.section === "research"
);
