export interface Project {
  id: string;
  title: string;
  tagline: string;
  problem: string;
  architecture: string;
  systemDesign: string;
  technologies: string[];
  challenges: string[];
  results: string[];
  githubUrl?: string;
}

/** Projects from Ashley Mathias resume (AI Engineer). */
export const projects: Project[] = [
  {
    id: "workflow-automation-platform",
    title: "AIP",
    tagline: "Workflow Automation Platform",
    problem:
      "Business teams needed faster delivery of AI-powered workflows across functions — without rebuilding RAG pipelines, agents, and orchestration from scratch every time.",
    architecture:
      "Enterprise AI workflow automation platform: reusable automation frameworks → RAG-powered knowledge retrieval → intelligent agents → workflow orchestration across business functions.",
    systemDesign:
      "Modular platform integrating LangChain, LangGraph, MCP, embeddings, and prompt engineering with API-driven deployment. Built for scalable, production-ready AI workflows with guardrails and optimized inference.",
    technologies: [
      "Python",
      "LangChain",
      "LangGraph",
      "MCP",
      "RAG",
      "FastAPI",
      "REST APIs",
    ],
    challenges: [
      "Designing reusable frameworks that accelerate solution delivery",
      "Integrating enterprise data sources into unified AI workflows",
      "Maintaining robust orchestration and guardrails at scale",
    ],
    results: [
      "Reduced development effort by ~60% across business functions",
      "Improved operational efficiency with reusable automation frameworks",
      "Delivered API-driven, production-ready AI workflow platform",
    ],
  },
  {
    id: "fixation-bot",
    title: "Fixation Bot",
    tagline: "Incident Resolution Assistant",
    problem:
      "Operational incidents required heavy manual troubleshooting — support teams spent significant time on root cause analysis and fix recommendations from scattered enterprise knowledge.",
    architecture:
      "Intelligent incident resolution flow: enterprise knowledge retrieval → AI-driven reasoning → root cause analysis → automated fix recommendations.",
    systemDesign:
      "RAG-backed assistant combining enterprise documentation, incident context, and LLM reasoning to guide resolution paths. Designed to reduce manual troubleshooting and accelerate support workflows.",
    technologies: [
      "Python",
      "LangChain",
      "LangGraph",
      "RAG",
      "Embeddings",
      "FastAPI",
    ],
    challenges: [
      "Retrieving relevant knowledge from large enterprise document stores",
      "Generating accurate root cause analysis from incomplete incident data",
      "Balancing automation with trust in fix recommendations",
    ],
    results: [
      "Reduced manual troubleshooting effort for operational incidents",
      "Improved support productivity across resolution workflows",
      "Accelerated incident resolution times with AI-driven recommendations",
    ],
  },
  {
    id: "invoice-parsing",
    title: "Invoice & Financial Document Parsing",
    tagline: "IFRS-driven document extraction",
    problem:
      "Financial document extraction for IFRS-driven invoices had only ~50% accuracy, requiring heavy manual correction before downstream processing.",
    architecture:
      "Scalable extraction pipeline: PaddleOCR / document ingestion → regex & fuzzy matching → field validation → structured output for enterprise deployment.",
    systemDesign:
      "Modular parser with OCR layer, IFRS-aligned field rules, and confidence scoring. Evaluated transformer-based document understanding (Donut) alongside classical OCR approaches.",
    technologies: ["Python", "PaddleOCR", "Regex", "Fuzzy Matching", "Donut OCR"],
    challenges: [
      "Handling varied invoice layouts and scan quality",
      "Improving extraction accuracy on IFRS-driven financial documents",
      "Benchmarking OCR vs. transformer-based document understanding",
    ],
    results: [
      "Improved extraction accuracy from ~50% to ~80%",
      "Delivered demo-ready, extensible enterprise solution",
      "Evaluated Donut for future document understanding upgrades",
    ],
  },
  {
    id: "genai-testing",
    title: "GenAI Pipeline & Testing Automation",
    tagline: "Enterprise test case generation",
    problem:
      "Manual test case generation for enterprise workflows was slow, inconsistent, and required deep domain expertise for every release cycle.",
    architecture:
      "End-to-end GenAI testing platform: IFRS-aligned metadata modeling → RAG retrieval → one-shot / few-shot prompting → modular prompt blocks → validation guardrails.",
    systemDesign:
      "LangChain RAG pipelines with metadata enrichment and modular generation blocks. Prompt engineering strategies tuned for test accuracy and coverage across enterprise workflows.",
    technologies: [
      "Python",
      "LangChain",
      "RAG",
      "Prompt Engineering",
      "ChromaDB",
    ],
    challenges: [
      "Aligning metadata models with IFRS-driven enterprise requirements",
      "Improving test accuracy with few-shot and modular prompt design",
      "Scaling generation across diverse workflow domains",
    ],
    results: [
      "Reduced manual testing effort by ~70%",
      "Improved test accuracy and coverage by ~80%",
      "Architected end-to-end GenAI testing platform for enterprise use",
    ],
  },
  {
    id: "nlp-to-sql",
    title: "NLP-to-SQL Analytics Assistant",
    tagline: "Manufacturing domain — conversational analytics",
    problem:
      "Operations teams needed self-serve insights from manufacturing plant data without writing SQL or navigating complex database schemas.",
    architecture:
      "Natural language interface → schema-aware SQL generation → safe read-only execution → time-based filtering → joined operational results.",
    systemDesign:
      "Analytics assistant over manufacturing data (plants, production lines, machines, shifts, downtime, yield). Schema-aware generation with accurate joins and conversational query handling.",
    technologies: ["Python", "LangChain", "SQL", "FastAPI", "REST APIs"],
    challenges: [
      "Generating accurate SQL from ambiguous natural language queries",
      "Enforcing safe read-only execution on production databases",
      "Handling time-based filters and multi-table joins reliably",
    ],
    results: [
      "Enabled self-serve operational insights for manufacturing teams",
      "Delivered reliable conversational access to plant analytics data",
      "Reduced dependency on analysts for routine operational queries",
    ],
  },
];
