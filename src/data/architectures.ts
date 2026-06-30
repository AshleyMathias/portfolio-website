export interface ArchitectureLayer {
  id: string;
  name: string;
  components: string[];
}

export interface ArchitectureCaseStudy {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  designDecisions: string[];
  metrics?: string[];
  layers: ArchitectureLayer[];
  drawioSrc?: string;
}

/** System architectures aligned with resume projects. */
export const architectureCaseStudies: ArchitectureCaseStudy[] = [
  {
    id: "workflow-automation-platform",
    title: "AIP — Workflow Automation Platform",
    category: "Enterprise AI Platform",
    description:
      "Enterprise workflow automation platform combining RAG, intelligent agents, and orchestration to accelerate AI solution delivery across business functions.",
    technologies: ["LangChain", "LangGraph", "MCP", "FastAPI", "RAG"],
    designDecisions: [
      "Reusable automation frameworks reduce per-project setup time",
      "RAG layer connects enterprise knowledge to agent workflows",
      "API-first deployment for production integration",
    ],
    metrics: ["~60% reduction in development effort", "Scalable multi-function automation"],
    layers: [
      {
        id: "ingress",
        name: "Ingress & Triggers",
        components: ["Scheduled Jobs", "REST API", "Event Webhooks"],
      },
      {
        id: "orchestration",
        name: "Workflow Orchestration",
        components: ["LangGraph Router", "Agent Coordinator", "Guardrails"],
      },
      {
        id: "agents",
        name: "Intelligent Agents",
        components: ["RAG Agent", "Task Agent", "Validation Agent"],
      },
      {
        id: "data",
        name: "Data & Knowledge",
        components: ["Vector Store", "Enterprise DB", "Document Store"],
      },
      {
        id: "delivery",
        name: "Delivery Layer",
        components: ["FastAPI Services", "Workflow Output", "Audit Logs"],
      },
    ],
    drawioSrc: "/architectures/ops-agent-data-flow.drawio",
  },
  {
    id: "fixation-bot",
    title: "Fixation Bot — Incident Resolution",
    category: "Enterprise Support AI",
    description:
      "Intelligent incident resolution assistant using enterprise knowledge retrieval and AI-driven reasoning for root cause analysis and fix recommendations.",
    technologies: ["LangChain", "LangGraph", "RAG", "Embeddings", "FastAPI"],
    designDecisions: [
      "Knowledge retrieval scoped to incident context and runbooks",
      "Reasoning chain produces root cause before fix suggestions",
      "Human review gate for high-severity recommendations",
    ],
    metrics: ["Reduced manual troubleshooting", "Faster incident resolution"],
    layers: [
      {
        id: "ingress",
        name: "Incident Intake",
        components: ["Alert Ingestion", "Ticket API", "Chat Interface"],
      },
      {
        id: "retrieval",
        name: "Knowledge Retrieval",
        components: ["Runbook RAG", "Incident History", "Semantic Search"],
      },
      {
        id: "reasoning",
        name: "AI Reasoning",
        components: ["Root Cause Agent", "Fix Recommender", "Confidence Scorer"],
      },
      {
        id: "data",
        name: "Enterprise Data",
        components: ["Knowledge Base", "Incident DB", "Embedding Index"],
      },
      {
        id: "delivery",
        name: "Resolution Output",
        components: ["Fix Playbook", "Support Dashboard", "Escalation Path"],
      },
    ],
  },
  {
    id: "genai-testing",
    title: "GenAI Pipeline & Testing Automation",
    category: "Quality Engineering AI",
    description:
      "End-to-end GenAI testing platform using RAG and prompt engineering to automate enterprise test case generation with IFRS-aligned metadata modeling.",
    technologies: ["LangChain", "RAG", "ChromaDB", "Prompt Engineering"],
    designDecisions: [
      "IFRS-aligned metadata enriches generation context",
      "Modular prompt blocks with one-shot / few-shot strategies",
      "Validation guardrails before test case acceptance",
    ],
    metrics: ["~70% less manual testing", "~80% accuracy improvement"],
    layers: [
      {
        id: "ingress",
        name: "Test Request Layer",
        components: ["Workflow Input", "Metadata Schema", "Domain Context"],
      },
      {
        id: "retrieval",
        name: "RAG & Context",
        components: ["Vector Retrieval", "IFRS Metadata", "Few-shot Examples"],
      },
      {
        id: "generation",
        name: "Generation Engine",
        components: ["Prompt Compiler", "LLM Generator", "Output Validator"],
      },
      {
        id: "data",
        name: "Knowledge Store",
        components: ["Test Corpus", "ChromaDB", "Requirements DB"],
      },
      {
        id: "delivery",
        name: "Test Output",
        components: ["Test Cases", "Coverage Report", "Review Queue"],
      },
    ],
  },
  {
    id: "nlp-to-sql",
    title: "NLP-to-SQL Analytics Assistant",
    category: "Manufacturing Analytics",
    description:
      "Natural language interface for manufacturing operations teams to query plant data — production lines, machines, shifts, downtime, and yield metrics.",
    technologies: ["LangChain", "SQL", "FastAPI", "Schema-aware NLU"],
    designDecisions: [
      "Schema-aware SQL generation with manufacturing domain context",
      "Read-only execution with query safety checks",
      "Time-based filtering and accurate multi-table joins",
    ],
    metrics: ["Self-serve operational insights", "Reduced analyst dependency"],
    layers: [
      {
        id: "ingress",
        name: "User Interface",
        components: ["Natural Language Input", "Session Context", "Query History"],
      },
      {
        id: "understanding",
        name: "NL Understanding",
        components: ["Intent Classifier", "Schema Mapper", "Filter Parser"],
      },
      {
        id: "execution",
        name: "Query Engine",
        components: ["SQL Generator", "Read-only Executor", "Result Formatter"],
      },
      {
        id: "data",
        name: "Manufacturing Data",
        components: ["Plants & Lines", "Machines & Shifts", "Downtime & Yield"],
      },
      {
        id: "delivery",
        name: "Insights Output",
        components: ["Tables & Charts", "Export API", "Audit Trail"],
      },
    ],
  },
  {
    id: "invoice-parsing",
    title: "Invoice & Financial Document Parsing",
    category: "Document Intelligence",
    description:
      "Scalable financial document extraction pipeline for IFRS-driven invoices with OCR, fuzzy matching, and transformer benchmarking.",
    technologies: ["PaddleOCR", "Python", "Regex", "Fuzzy Logic", "Donut OCR"],
    designDecisions: [
      "Multi-stage extraction: OCR → field rules → validation",
      "Fuzzy logic handles layout variation without retraining",
      "Donut benchmarked for future document understanding upgrades",
    ],
    metrics: ["50% → 80% extraction accuracy", "Demo-ready enterprise parser"],
    layers: [
      {
        id: "ingress",
        name: "Document Intake",
        components: ["PDF / Image Upload", "Batch Processor", "Format Detector"],
      },
      {
        id: "extraction",
        name: "OCR & Extraction",
        components: ["PaddleOCR", "Field Parser", "Regex Validator"],
      },
      {
        id: "matching",
        name: "Field Matching",
        components: ["Fuzzy Logic", "IFRS Field Map", "Confidence Score"],
      },
      {
        id: "data",
        name: "Output Store",
        components: ["Structured Records", "Validation Log", "Error Queue"],
      },
      {
        id: "delivery",
        name: "Downstream API",
        components: ["REST Export", "Client Dashboard", "Retry Pipeline"],
      },
    ],
  },
];
