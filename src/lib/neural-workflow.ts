/**
 * Neural Network → AI Workflow background engine.
 *
 * A persistent neural network runs continuously across the viewport. Every so
 * often a small local cluster of nodes smoothly reorganizes itself into a
 * production AI workflow (a DAG), executes it (with parallel branches, merges,
 * retries), then dissolves back into the network. Only one cluster is ever
 * active at a time; the rest of the network keeps behaving normally.
 *
 * The engine owns all simulation state and draws itself to a 2D canvas so the
 * React component can stay a thin lifecycle wrapper.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Phase = "idle" | "context" | "morph" | "execute" | "dissolve";

type NodeState =
  | "idle"
  | "queued"
  | "waiting"
  | "running"
  | "retrying"
  | "failed"
  | "completed"
  | "recovered";

type StepKind = "input" | "ai" | "tool" | "data" | "check" | "output" | "agent";

interface NeuralNode {
  homeX: number; // normalized 0..1 resting position
  homeY: number;
  depth: number; // 0.35..1 — layered parallax + size
  baseR: number;
  phase: number; // pulse / drift phase
  driftSpeed: number;
  driftAmpX: number;
  driftAmpY: number;
  wfStep: number; // index into active.steps, or -1
}

interface NeuralEdge {
  a: number;
  b: number;
}

interface WorkflowStepDef {
  key: string;
  label: string;
  kind: StepKind;
  deps: string[];
}

interface WorkflowTemplate {
  name: string;
  steps: WorkflowStepDef[];
}

interface ActiveStep {
  key: string;
  label: string;
  kind: StepKind;
  deps: number[]; // indices into steps
  nodeIndex: number; // neural node used for this step
  level: number;
  targetX: number; // normalized DAG target
  targetY: number;
  state: NodeState;
  arrived: number; // packets that have reached this step
  runStart: number;
  runDur: number;
  stateStart: number;
  willFail: boolean;
  retried: boolean;
}

interface ActiveWorkflow {
  steps: ActiveStep[];
  edges: Array<{ from: number; to: number }>;
  anchorX: number;
  anchorY: number;
  radius: number; // normalized highlight radius
}

interface Packet {
  active: boolean;
  exec: boolean; // execution packet vs ambient
  fromNode: number; // neural node index
  toNode: number;
  toStep: number; // step index to notify on arrival (exec only)
  progress: number;
  durMs: number;
}

// ---------------------------------------------------------------------------
// Palette (soft cyan / white / muted blue — no cyberpunk)
// ---------------------------------------------------------------------------

const C = {
  neural: "128, 168, 224",
  edge: "108, 146, 206",
  running: "72, 202, 224",
  completed: "78, 200, 158",
  waiting: "214, 178, 104",
  failed: "224, 120, 120",
  packet: "150, 220, 238",
  label: "198, 216, 240",
} as const;

const rgba = (rgb: string, a: number) => `rgba(${rgb}, ${a})`;

// ---------------------------------------------------------------------------
// Timing (ms)
// ---------------------------------------------------------------------------

const CONTEXT_MS = 2600;
const MORPH_MS = 2000;
const DISSOLVE_MS = 4200;
const EXEC_HOLD_MS = 1200;
const EXEC_MAX_MS = 16000;
const IDLE_MIN = 8000;
const IDLE_MAX = 12000;

const easeInOut = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ---------------------------------------------------------------------------
// Workflow templates
// ---------------------------------------------------------------------------

const TEMPLATES: WorkflowTemplate[] = [
  {
    name: "RAG Pipeline",
    steps: [
      { key: "q", label: "User Query", kind: "input", deps: [] },
      { key: "ret", label: "Retriever", kind: "tool", deps: ["q"] },
      { key: "vec", label: "Vector Search", kind: "data", deps: ["ret"] },
      { key: "ctx", label: "Context", kind: "ai", deps: ["vec"] },
      { key: "llm", label: "LLM", kind: "ai", deps: ["ctx"] },
      { key: "ans", label: "Answer", kind: "output", deps: ["llm"] },
    ],
  },
  {
    name: "Multi-Agent System",
    steps: [
      { key: "plan", label: "Planner", kind: "ai", deps: [] },
      { key: "research", label: "Research", kind: "agent", deps: ["plan"] },
      { key: "coding", label: "Coding", kind: "agent", deps: ["plan"] },
      { key: "memory", label: "Memory", kind: "data", deps: ["plan"] },
      { key: "tool", label: "Tool", kind: "tool", deps: ["plan"] },
      { key: "judge", label: "Judge", kind: "check", deps: ["research", "coding", "memory", "tool"] },
      { key: "resp", label: "Response", kind: "output", deps: ["judge"] },
    ],
  },
  {
    name: "MCP Flow",
    steps: [
      { key: "client", label: "Client", kind: "input", deps: [] },
      { key: "mcp", label: "MCP Server", kind: "ai", deps: ["client"] },
      { key: "tool", label: "Tool", kind: "tool", deps: ["mcp"] },
      { key: "api", label: "API", kind: "tool", deps: ["tool"] },
      { key: "res", label: "Result", kind: "output", deps: ["api"] },
    ],
  },
  {
    name: "Business Process",
    steps: [
      { key: "req", label: "Request", kind: "input", deps: [] },
      { key: "rules", label: "Rules Engine", kind: "check", deps: ["req"] },
      { key: "approve", label: "Approval", kind: "check", deps: ["rules"] },
      { key: "exec", label: "Execution", kind: "tool", deps: ["approve"] },
      { key: "audit", label: "Audit", kind: "data", deps: ["exec"] },
      { key: "done", label: "Done", kind: "output", deps: ["audit"] },
    ],
  },
  {
    name: "AI Agent Pipeline",
    steps: [
      { key: "in", label: "Input", kind: "input", deps: [] },
      { key: "intent", label: "Intent", kind: "ai", deps: ["in"] },
      { key: "plan", label: "Planner", kind: "ai", deps: ["intent"] },
      { key: "mem", label: "Memory", kind: "data", deps: ["plan"] },
      { key: "reason", label: "Reasoning", kind: "ai", deps: ["mem"] },
      { key: "tool", label: "Tool Call", kind: "tool", deps: ["reason"] },
      { key: "valid", label: "Validation", kind: "check", deps: ["tool"] },
      { key: "resp", label: "Response", kind: "output", deps: ["valid"] },
    ],
  },
  {
    name: "OCR Pipeline",
    steps: [
      { key: "up", label: "Upload", kind: "input", deps: [] },
      { key: "ocr", label: "OCR", kind: "ai", deps: ["up"] },
      { key: "parse", label: "Parser", kind: "tool", deps: ["ocr"] },
      { key: "valid", label: "Validation", kind: "check", deps: ["parse"] },
      { key: "db", label: "Database", kind: "data", deps: ["valid"] },
    ],
  },
];

const KIND_COLOR: Record<string, string> = {
  input: C.neural,
  ai: "150, 130, 236",
  tool: "72, 202, 224",
  data: "78, 200, 158",
  check: "214, 178, 104",
  output: C.completed,
  agent: "168, 150, 240",
};

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

export class NeuralWorkflowEngine {
  private width = 0;
  private height = 0;
  private nodes: NeuralNode[] = [];
  private edges: NeuralEdge[] = [];

  private phase: Phase = "idle";
  private phaseStart = 0;
  private idleDur = IDLE_MIN;
  private active: ActiveWorkflow | null = null;
  private execComplete = false;
  private execCompleteAt = 0;
  private execStartAt = 0;
  private lastAnchorX = -1;
  private lastAnchorY = -1;

  private packets: Packet[] = [];
  private lastAmbientSpawn = 0;

  // frame-scratch position buffers
  private px: Float32Array = new Float32Array(0);
  private py: Float32Array = new Float32Array(0);

  private mouseX = 0.5;
  private mouseY = 0.5;
  private scroll = 0;
  private started = false;

  resize(width: number, height: number) {
    const first = this.width === 0;
    this.width = width;
    this.height = height;
    if (first) this.build();
  }

  setMouse(x: number, y: number) {
    this.mouseX = x;
    this.mouseY = y;
  }

  setScroll(p: number) {
    this.scroll = p;
  }

  // -- network construction ------------------------------------------------

  private build() {
    const { width, height } = this;
    const area = width * height;
    const count = clamp(Math.round(area / 28000), 28, 64);

    // jittered grid for even coverage
    const aspect = width / height;
    const cols = Math.max(4, Math.round(Math.sqrt(count * aspect)));
    const rows = Math.max(3, Math.ceil(count / cols));

    const nodes: NeuralNode[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (nodes.length >= count) break;
        const jx = (Math.random() - 0.5) * 0.9;
        const jy = (Math.random() - 0.5) * 0.9;
        const homeX = clamp((c + 0.5 + jx) / cols, 0.02, 0.98);
        const homeY = clamp((r + 0.5 + jy) / rows, 0.03, 0.97);
        nodes.push({
          homeX,
          homeY,
          depth: 0.4 + Math.random() * 0.6,
          baseR: 1.4 + Math.random() * 1.8,
          phase: Math.random() * Math.PI * 2,
          driftSpeed: 0.00016 + Math.random() * 0.0002,
          driftAmpX: 0.003 + Math.random() * 0.004,
          driftAmpY: 0.003 + Math.random() * 0.004,
          wfStep: -1,
        });
      }
    }
    this.nodes = nodes;
    this.px = new Float32Array(nodes.length);
    this.py = new Float32Array(nodes.length);

    // k-nearest edges (k=2..3) using aspect-corrected distance
    const edges: NeuralEdge[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < nodes.length; i++) {
      const dists: Array<{ j: number; d: number }> = [];
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const dx = (nodes[i].homeX - nodes[j].homeX) * aspect;
        const dy = nodes[i].homeY - nodes[j].homeY;
        dists.push({ j, d: dx * dx + dy * dy });
      }
      dists.sort((a, b) => a.d - b.d);
      const k = 2 + (Math.random() < 0.4 ? 1 : 0);
      for (let n = 0; n < k && n < dists.length; n++) {
        const j = dists[n].j;
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) continue;
        seen.add(key);
        edges.push({ a: i, b: j });
      }
    }
    this.edges = edges;

    // seed ambient packet pool
    this.packets = [];
    for (let i = 0; i < 6; i++) this.spawnAmbient(0);
  }

  // -- workflow lifecycle --------------------------------------------------

  private buildWorkflow(): ActiveWorkflow | null {
    if (this.nodes.length < 12) return null;
    const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];

    // levels via longest path from roots
    const keyToDef = new Map(template.steps.map((s) => [s.key, s]));
    const levelCache = new Map<string, number>();
    const levelOf = (key: string): number => {
      if (levelCache.has(key)) return levelCache.get(key)!;
      const def = keyToDef.get(key)!;
      const lvl = def.deps.length === 0 ? 0 : Math.max(...def.deps.map(levelOf)) + 1;
      levelCache.set(key, lvl);
      return lvl;
    };
    template.steps.forEach((s) => levelOf(s.key));

    const maxLevel = Math.max(...template.steps.map((s) => levelCache.get(s.key)!));
    const byLevel = new Map<number, string[]>();
    template.steps.forEach((s) => {
      const l = levelCache.get(s.key)!;
      if (!byLevel.has(l)) byLevel.set(l, []);
      byLevel.get(l)!.push(s.key);
    });
    const maxWidth = Math.max(...[...byLevel.values()].map((a) => a.length));

    // DAG bounding box (normalized) — keep compact so it reads as one cluster
    const rowGap = 0.075;
    const colGap = 0.072;
    const boxH = maxLevel * rowGap;
    const boxW = (maxWidth - 1) * colGap;

    // choose anchor, avoiding the previous location
    let anchorX = 0.5;
    let anchorY = 0.5;
    const marginX = boxW / 2 + 0.1;
    const marginY = boxH / 2 + 0.12;
    for (let attempt = 0; attempt < 12; attempt++) {
      anchorX = lerp(marginX, 1 - marginX, Math.random());
      anchorY = lerp(marginY, 1 - marginY, Math.random());
      const dx = anchorX - this.lastAnchorX;
      const dy = anchorY - this.lastAnchorY;
      if (this.lastAnchorX < 0 || Math.hypot(dx, dy) > 0.34) break;
    }
    this.lastAnchorX = anchorX;
    this.lastAnchorY = anchorY;

    // step targets
    const keyToIndex = new Map<string, number>();
    template.steps.forEach((s, i) => keyToIndex.set(s.key, i));

    const steps: ActiveStep[] = template.steps.map((s) => ({
      key: s.key,
      label: s.label,
      kind: s.kind,
      deps: s.deps.map((d) => keyToIndex.get(d)!),
      nodeIndex: -1,
      level: levelCache.get(s.key)!,
      targetX: 0,
      targetY: 0,
      state: "idle",
      arrived: 0,
      runStart: 0,
      runDur: 0,
      stateStart: 0,
      willFail: false,
      retried: false,
    }));

    const levelCounter = new Map<number, number>();
    steps.forEach((s) => {
      const siblings = byLevel.get(s.level)!;
      const idx = levelCounter.get(s.level) ?? 0;
      levelCounter.set(s.level, idx + 1);
      const spread = siblings.length;
      s.targetX = anchorX + (idx - (spread - 1) / 2) * colGap;
      s.targetY = anchorY + (s.level - maxLevel / 2) * rowGap;
    });

    // assign nearest available neural node to each step target
    const aspect = this.width / this.height;
    const used = new Set<number>();
    for (const s of steps) {
      let best = -1;
      let bestD = Infinity;
      for (let i = 0; i < this.nodes.length; i++) {
        if (used.has(i)) continue;
        const dx = (this.nodes[i].homeX - s.targetX) * aspect;
        const dy = this.nodes[i].homeY - s.targetY;
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      if (best < 0) return null;
      used.add(best);
      s.nodeIndex = best;
      this.nodes[best].wfStep = steps.indexOf(s);
    }

    // occasional single failing step (rare) — never a root or terminal
    if (Math.random() < 0.4) {
      const candidates = steps.filter(
        (s) => s.deps.length > 0 && steps.some((t) => t.deps.includes(steps.indexOf(s)))
      );
      if (candidates.length > 0) {
        candidates[Math.floor(Math.random() * candidates.length)].willFail = true;
      }
    }

    const edges = steps.flatMap((s, i) => s.deps.map((d) => ({ from: d, to: i })));

    const radius = Math.max(boxW, boxH) / 2 + 0.12;
    return { steps, edges, anchorX, anchorY, radius };
  }

  private enterContext(now: number) {
    const wf = this.buildWorkflow();
    if (!wf) {
      this.phaseStart = now;
      this.idleDur = IDLE_MIN;
      return;
    }
    this.active = wf;
    this.phase = "context";
    this.phaseStart = now;
  }

  private enterMorph(now: number) {
    this.phase = "morph";
    this.phaseStart = now;
  }

  private enterExecute(now: number) {
    this.phase = "execute";
    this.phaseStart = now;
    this.execStartAt = now;
    this.execComplete = false;
    const wf = this.active!;
    for (const s of wf.steps) {
      s.arrived = 0;
      s.retried = false;
      if (s.deps.length === 0) {
        s.state = "running";
        s.runStart = now;
        s.runDur = 500 + Math.random() * 400;
      } else {
        s.state = "queued";
      }
      s.stateStart = now;
    }
  }

  private enterDissolve(now: number) {
    this.phase = "dissolve";
    this.phaseStart = now;
  }

  private enterIdle(now: number) {
    if (this.active) {
      for (const s of this.active.steps) this.nodes[s.nodeIndex].wfStep = -1;
    }
    this.active = null;
    this.phase = "idle";
    this.phaseStart = now;
    this.idleDur = IDLE_MIN + Math.random() * (IDLE_MAX - IDLE_MIN);
  }

  private completeStep(s: ActiveStep, now: number) {
    s.state = s.retried ? "recovered" : "completed";
    s.stateStart = now;
    const wf = this.active!;
    const si = wf.steps.indexOf(s);
    for (const e of wf.edges) {
      if (e.from === si) {
        this.spawnExec(s.nodeIndex, wf.steps[e.to].nodeIndex, e.to);
      }
    }
  }

  private updateExecution(now: number, dt: number) {
    const wf = this.active;
    if (!wf) return;

    for (const s of wf.steps) {
      switch (s.state) {
        case "queued":
        case "waiting":
          if (s.arrived >= s.deps.length) {
            s.state = "running";
            s.runStart = now;
            s.runDur = 480 + Math.random() * 460;
            s.stateStart = now;
          } else if (s.arrived > 0 && s.state === "queued") {
            s.state = "waiting";
          }
          break;
        case "running":
          if (now - s.runStart >= s.runDur) {
            if (s.willFail && !s.retried) {
              s.state = "failed";
              s.stateStart = now;
            } else {
              this.completeStep(s, now);
            }
          }
          break;
        case "failed":
          if (now - s.stateStart > 420) {
            s.state = "retrying";
            s.stateStart = now;
            s.retried = true;
            s.runStart = now;
            s.runDur = 360;
          }
          break;
        case "retrying":
          if (now - s.runStart >= s.runDur) this.completeStep(s, now);
          break;
      }
    }

    const allDone = wf.steps.every(
      (s) => s.state === "completed" || s.state === "recovered"
    );
    if ((allDone || now - this.execStartAt > EXEC_MAX_MS) && !this.execComplete) {
      this.execComplete = true;
      this.execCompleteAt = now;
    }
    void dt;
  }

  // -- packets -------------------------------------------------------------

  private getPacket(): Packet {
    for (const p of this.packets) if (!p.active) return p;
    const p: Packet = {
      active: false,
      exec: false,
      fromNode: 0,
      toNode: 0,
      toStep: -1,
      progress: 0,
      durMs: 1000,
    };
    this.packets.push(p);
    return p;
  }

  private spawnAmbient(now: number) {
    if (this.edges.length === 0) return;
    // pick an edge not touching an active workflow node
    let edge = this.edges[Math.floor(Math.random() * this.edges.length)];
    for (let i = 0; i < 5; i++) {
      if (this.nodes[edge.a].wfStep < 0 && this.nodes[edge.b].wfStep < 0) break;
      edge = this.edges[Math.floor(Math.random() * this.edges.length)];
    }
    const p = this.getPacket();
    p.active = true;
    p.exec = false;
    p.fromNode = Math.random() < 0.5 ? edge.a : edge.b;
    p.toNode = p.fromNode === edge.a ? edge.b : edge.a;
    p.toStep = -1;
    p.progress = 0;
    p.durMs = 2600 + Math.random() * 2200;
    this.lastAmbientSpawn = now;
  }

  private spawnExec(fromNode: number, toNode: number, toStep: number) {
    const p = this.getPacket();
    p.active = true;
    p.exec = true;
    p.fromNode = fromNode;
    p.toNode = toNode;
    p.toStep = toStep;
    p.progress = 0;
    p.durMs = 620 + Math.random() * 260;
  }

  private updatePackets(now: number, dt: number) {
    for (const p of this.packets) {
      if (!p.active) continue;
      p.progress += dt / p.durMs;
      if (p.progress >= 1) {
        if (p.exec && this.active && p.toStep >= 0) {
          this.active.steps[p.toStep].arrived++;
        }
        p.active = false;
      }
    }
    // keep ambient population up
    const ambientCount = this.packets.filter((p) => p.active && !p.exec).length;
    if (ambientCount < 6 && now - this.lastAmbientSpawn > 500) {
      this.spawnAmbient(now);
    }
  }

  // -- main step + render --------------------------------------------------

  private morphAmount(now: number): number {
    const e = now - this.phaseStart;
    switch (this.phase) {
      case "morph":
        return easeInOut(clamp(e / MORPH_MS, 0, 1));
      case "execute":
        return 1;
      case "dissolve":
        return 1 - easeInOut(clamp(e / DISSOLVE_MS, 0, 1));
      default:
        return 0;
    }
  }

  private activation(now: number): number {
    const e = now - this.phaseStart;
    switch (this.phase) {
      case "context":
        return smoothstep(0, CONTEXT_MS, e);
      case "morph":
      case "execute":
        return 1;
      case "dissolve":
        return 1 - easeInOut(clamp(e / DISSOLVE_MS, 0, 1));
      default:
        return 0;
    }
  }

  private tick(now: number) {
    const e = now - this.phaseStart;
    switch (this.phase) {
      case "idle":
        if (e > this.idleDur) this.enterContext(now);
        break;
      case "context":
        if (e > CONTEXT_MS) this.enterMorph(now);
        break;
      case "morph":
        if (e > MORPH_MS) this.enterExecute(now);
        break;
      case "execute":
        if (this.execComplete && now - this.execCompleteAt > EXEC_HOLD_MS) {
          this.enterDissolve(now);
        }
        break;
      case "dissolve":
        if (e > DISSOLVE_MS) this.enterIdle(now);
        break;
    }
  }

  /** Draws a single static frame (used for reduced-motion). */
  renderStatic(ctx: CanvasRenderingContext2D) {
    if (this.nodes.length === 0) return;
    this.computePositions(0, 0);
    this.drawEdges(ctx, 0);
    this.drawNodes(ctx, 0, 0);
  }

  render(ctx: CanvasRenderingContext2D, now: number, dt: number) {
    if (this.nodes.length === 0) return;
    if (!this.started) {
      this.phaseStart = now;
      this.idleDur = IDLE_MIN + Math.random() * (IDLE_MAX - IDLE_MIN);
      this.started = true;
    }

    this.tick(now);
    if (this.phase === "execute") this.updateExecution(now, dt);
    this.updatePackets(now, dt);

    const morph = this.morphAmount(now);
    const act = this.activation(now);
    this.computePositions(now, morph);

    ctx.clearRect(0, 0, this.width, this.height);
    this.drawEdges(ctx, act);
    if (this.active) this.drawWorkflowEdges(ctx, act, now);
    this.drawPackets(ctx, now);
    this.drawNodes(ctx, now, act);
    if (this.active) this.drawLabels(ctx, act);
  }

  private computePositions(now: number, morph: number) {
    const { width, height } = this;
    const mx = (this.mouseX - 0.5) * 16;
    const my = (this.mouseY - 0.5) * 10;
    const scrollShift = this.scroll * 14;

    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      const driftX = Math.sin(now * n.driftSpeed + n.phase) * n.driftAmpX;
      const driftY = Math.cos(now * n.driftSpeed * 0.8 + n.phase) * n.driftAmpY;
      let nx = n.homeX + driftX;
      let ny = n.homeY + driftY;

      if (n.wfStep >= 0 && this.active && morph > 0) {
        const s = this.active.steps[n.wfStep];
        nx = lerp(nx, s.targetX, morph);
        ny = lerp(ny, s.targetY, morph);
      }

      // depth-based parallax (subtle)
      this.px[i] = nx * width + mx * n.depth;
      this.py[i] = ny * height + my * n.depth + scrollShift * (n.depth - 0.6);
    }
  }

  private clusterGlow(i: number): number {
    if (!this.active) return 0;
    const aspect = this.width / this.height;
    const dx = (this.nodes[i].homeX - this.active.anchorX) * aspect;
    const dy = this.nodes[i].homeY - this.active.anchorY;
    const d = Math.hypot(dx, dy);
    return 1 - smoothstep(this.active.radius * 0.6, this.active.radius * 1.6, d);
  }

  private drawEdges(ctx: CanvasRenderingContext2D, act: number) {
    ctx.lineWidth = 1;
    for (const e of this.edges) {
      const aWf = this.nodes[e.a].wfStep >= 0;
      const bWf = this.nodes[e.b].wfStep >= 0;
      // fade neural edges incident to the active cluster as it organizes
      const fade = (aWf || bWf) ? 1 - act * 0.92 : 1;
      const alpha = 0.06 * fade;
      if (alpha < 0.004) continue;
      ctx.beginPath();
      ctx.moveTo(this.px[e.a], this.py[e.a]);
      ctx.lineTo(this.px[e.b], this.py[e.b]);
      ctx.strokeStyle = rgba(C.edge, alpha);
      ctx.stroke();
    }
  }

  private drawWorkflowEdges(ctx: CanvasRenderingContext2D, act: number, now: number) {
    const wf = this.active!;
    const appear = act;
    if (appear <= 0.01) return;
    const dash = (now * 0.02) % 14;
    for (const e of wf.edges) {
      const from = wf.steps[e.from];
      const to = wf.steps[e.to];
      const fx = this.px[from.nodeIndex];
      const fy = this.py[from.nodeIndex];
      const tx = this.px[to.nodeIndex];
      const ty = this.py[to.nodeIndex];

      const fromDone = from.state === "completed" || from.state === "recovered";
      const base = 0.12 + (fromDone ? 0.18 : 0);
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      // gentle curve for organic feel
      const mxp = (fx + tx) / 2;
      const myp = (fy + ty) / 2 + (tx - fx) * 0.06;
      ctx.quadraticCurveTo(mxp, myp, tx, ty);
      ctx.strokeStyle = rgba(C.running, base * appear);
      ctx.lineWidth = 1.1;
      ctx.setLineDash([3, 6]);
      ctx.lineDashOffset = -dash;
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  private drawPackets(ctx: CanvasRenderingContext2D, now: number) {
    void now;
    for (const p of this.packets) {
      if (!p.active) continue;
      const fx = this.px[p.fromNode];
      const fy = this.py[p.fromNode];
      const tx = this.px[p.toNode];
      const ty = this.py[p.toNode];
      const t = p.progress;
      let x = lerp(fx, tx, t);
      let y = lerp(fy, ty, t);

      // subtle curve around the cursor
      const cmx = this.mouseX * this.width;
      const cmy = this.mouseY * this.height;
      const ddx = x - cmx;
      const ddy = y - cmy;
      const dist = Math.hypot(ddx, ddy);
      if (dist < 120 && dist > 0.01) {
        const push = (1 - dist / 120) * 10;
        x += (ddx / dist) * push;
        y += (ddy / dist) * push;
      }

      const rgb = p.exec ? C.packet : C.neural;
      const r = p.exec ? 2.6 : 1.8;
      const glowAlpha = p.exec ? 0.5 : 0.28;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
      g.addColorStop(0, rgba(rgb, glowAlpha));
      g.addColorStop(1, rgba(rgb, 0));
      ctx.beginPath();
      ctx.arc(x, y, r * 3, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = rgba(rgb, p.exec ? 0.95 : 0.6);
      ctx.fill();
    }
  }

  private stateColor(s: ActiveStep): string {
    switch (s.state) {
      case "running":
        return C.running;
      case "completed":
      case "recovered":
        return C.completed;
      case "waiting":
      case "queued":
      case "retrying":
        return C.waiting;
      case "failed":
        return C.failed;
      default:
        return KIND_COLOR[s.kind] ?? C.neural;
    }
  }

  private drawNodes(ctx: CanvasRenderingContext2D, now: number, act: number) {
    const pulse = 0.5 + Math.sin(now * 0.0013) * 0.5;
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      const x = this.px[i];
      const y = this.py[i];

      const nearMouse = (() => {
        const dx = x - this.mouseX * this.width;
        const dy = y - this.mouseY * this.height;
        return 1 - smoothstep(60, 150, Math.hypot(dx, dy));
      })();

      const isWf = n.wfStep >= 0 && this.active;
      const glow = isWf ? act : this.clusterGlow(i) * act * 0.5;

      let rgb: string = C.neural;
      let running = false;
      let r = n.baseR * (0.9 + n.depth * 0.5);

      if (isWf) {
        const s = this.active!.steps[n.wfStep];
        rgb = this.stateColor(s);
        running = s.state === "running" || s.state === "retrying";
        r = (n.baseR + 1.4) * (0.9 + n.depth * 0.5);
      }

      const nodePulse = running ? 0.6 + pulse * 0.4 : 0.4 + n.depth * 0.2;
      const baseAlpha =
        (0.28 + nearMouse * 0.4 + glow * 0.5) * (isWf ? 1 : 0.9);

      // outer bloom
      const bloomR = r + (isWf ? 12 : 6) + glow * 6;
      const bg = ctx.createRadialGradient(x, y, 0, x, y, bloomR);
      bg.addColorStop(0, rgba(rgb, (0.16 + glow * 0.22) * (running ? nodePulse : 1)));
      bg.addColorStop(1, rgba(rgb, 0));
      ctx.beginPath();
      ctx.arc(x, y, bloomR, 0, Math.PI * 2);
      ctx.fillStyle = bg;
      ctx.fill();

      // glass core
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(14, 16, 22, ${0.55 + glow * 0.2})`;
      ctx.fill();
      ctx.lineWidth = isWf ? 1.4 : 1;
      ctx.strokeStyle = rgba(rgb, baseAlpha);
      ctx.stroke();

      // bright center dot
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.8, r * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = rgba(rgb, 0.5 + glow * 0.4 + nearMouse * 0.2);
      ctx.fill();
    }
  }

  private drawLabels(ctx: CanvasRenderingContext2D, act: number) {
    const wf = this.active!;
    const alpha = smoothstep(0.35, 1, act) * 0.72;
    if (alpha <= 0.02) return;
    ctx.font =
      "500 9px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    for (const s of wf.steps) {
      const x = this.px[s.nodeIndex];
      const y = this.py[s.nodeIndex];
      const label = s.label.toLowerCase();
      const tw = ctx.measureText(label).width;
      const lx = x + 9;
      const ly = y - 9;
      // subtle glass chip behind label
      ctx.fillStyle = rgba("10, 14, 20", 0.4 * alpha);
      ctx.beginPath();
      const pad = 3;
      const h = 12;
      const rr = 3;
      const bx = lx - pad;
      const by = ly - h / 2;
      const bw = tw + pad * 2;
      ctx.moveTo(bx + rr, by);
      ctx.arcTo(bx + bw, by, bx + bw, by + h, rr);
      ctx.arcTo(bx + bw, by + h, bx, by + h, rr);
      ctx.arcTo(bx, by + h, bx, by, rr);
      ctx.arcTo(bx, by, bx + bw, by, rr);
      ctx.fill();
      ctx.fillStyle = rgba(C.label, alpha);
      ctx.fillText(label, lx, ly + 0.5);
    }
  }
}
