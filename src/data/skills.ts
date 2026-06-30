export interface SkillGroup {
  label: string;
  items: string[];
}

export interface SkillCategory {
  id: string;
  title: string;
  accent: string;
  /** Shown by default — core skills only, no duplicates across categories. */
  highlights: string[];
  /** Full resume list — revealed on expand. */
  all: string[];
  groups?: SkillGroup[];
}

/** From Ashley Mathias resume (AI Engineer PDF). */
export const skillCategories: SkillCategory[] = [
  {
    id: "rag-finetuning",
    title: "RAG & Fine-Tuning",
    accent: "#3b82f6",
    highlights: ["RAG", "Agentic AI", "LoRA / PEFT", "Chroma · FAISS · Qdrant"],
    all: [
      "RAG",
      "Agentic AI",
      "Fine-tune LLMs",
      "Transfer Learning",
      "Model Quantization",
      "LoRA / PEFT for fine-tuning",
      "Embeddings (Chroma, FAISS, Qdrant Vector)",
      "CPU-only training",
      "JSONL formatting",
    ],
  },
  {
    id: "nlp-llms",
    title: "NLP & LLMs",
    accent: "#8b5cf6",
    highlights: ["LangChain", "LangGraph", "GPT-4 · Gemma · Phi-3", "MCP"],
    all: [
      "Large Language Models (GPT-4, Gemma, Phi-3)",
      "Conversational AI",
      "Prompt Engineering",
      "Hugging Face",
      "LangChain",
      "LangGraph",
      "LLM Inferencing",
      "MCP",
      "Text classification",
      "Topic modelling",
      "Clustering",
      "ChatML",
      "YAML / JSON-based prompt formatting",
    ],
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    accent: "#10b981",
    highlights: ["XGBoost · LightGBM", "Random Forest · SVM", "K-Means · DBSCAN"],
    all: [],
    groups: [
      {
        label: "Regression",
        items: ["Linear", "Non-Linear", "Polynomial"],
      },
      {
        label: "Classification",
        items: [
          "Logistic Regression",
          "SVM",
          "KNN",
          "Decision Tree",
          "Random Forest",
        ],
      },
      {
        label: "Clustering & Boosting",
        items: [
          "K-Means",
          "Hierarchical",
          "DBSCAN",
          "GBM",
          "XGBoost",
          "LightGBM",
          "CatBoost",
        ],
      },
    ],
  },
  {
    id: "ai-ops",
    title: "AI Ops & Deployment",
    accent: "#f59e0b",
    highlights: ["FastAPI", "Microsoft Azure", "CI/CD · GitHub Actions", "Inference optimization"],
    all: [
      "Model Deployment (FastAPI, REST APIs)",
      "Microsoft Azure",
      "Model Monitoring (Logging, Metrics)",
      "CI/CD (GitHub Actions)",
      "Inference Optimization",
      "Scalable AI Applications",
    ],
  },
  {
    id: "automation-tools",
    title: "Automation & Tools",
    accent: "#06b6d4",
    highlights: ["Python", "n8n", "PaddleOCR · Donut", "GitHub Copilot"],
    all: [
      "Python",
      "Git",
      "GitHub Copilot",
      "n8n",
      "PaddleOCR",
      "Donut OCR",
      "Excel",
      "Graph API",
      "REST APIs",
    ],
  },
];
