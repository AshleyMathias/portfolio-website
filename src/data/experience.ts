export interface ExperienceStage {
  id: string;
  stage: string;
  title: string;
  description: string;
  capabilities: string[];
  maturity: number;
}

export const experienceStages: ExperienceStage[] = [
  {
    id: "fundamentals",
    stage: "Stage 0",
    title: "ML & NLP Foundations",
    description:
      "Built foundations in machine learning, NLP, and Python — regression, classification, clustering, and classical ML from linear models to gradient boosting.",
    capabilities: ["Python", "Scikit-learn", "NLP basics", "Model evaluation"],
    maturity: 1,
  },
  {
    id: "genai-skills",
    stage: "Stage 1",
    title: "GenAI & RAG Development",
    description:
      "Moved into LLM systems — RAG pipelines with LangChain, LoRA fine-tuning on Gemma and Phi-3 (CPU), and OCR-based invoice parsers with PaddleOCR.",
    capabilities: ["RAG pipelines", "LoRA fine-tuning", "Prompt engineering", "OCR extraction"],
    maturity: 2,
  },
  {
    id: "intern",
    stage: "Stage 2",
    title: "AI Intern",
    description:
      "Joined as AI Intern in Pune. Built GenAI test pipelines, LangGraph agents with 13+ nodes, invoice parsing (50% → 80% accuracy), and CPU-based model fine-tuning for client projects.",
    capabilities: ["LangGraph agents", "Enterprise RAG", "Test automation", "Invoice parsing"],
    maturity: 3,
  },
  {
    id: "ai-engineer",
    stage: "Stage 3",
    title: "AI Engineer",
    description:
      "Current role — AI Engineer in Pune. Building workflow automation platforms, incident resolution assistants, GenAI testing pipelines, NLP-to-SQL analytics, and financial document parsing systems.",
    capabilities: ["Workflow automation", "Incident resolution AI", "RAG systems", "NLP-to-SQL"],
    maturity: 4,
  },
  {
    id: "production-systems",
    stage: "Stage 4",
    title: "Production-Ready Systems",
    description:
      "Shipping open-source agent systems (SecureFix AI, Agentic Node, CodeXCLI) alongside enterprise platforms with human-in-the-loop gates, LLM validation, and multi-channel delivery.",
    capabilities: ["DevSecOps agents", "Human-in-the-loop", "Open-source projects", "System architecture"],
    maturity: 5,
  },
];
