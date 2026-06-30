export type NodeType = "api" | "ai" | "data" | "queue" | "db" | "gateway" | "agent";

export interface ArchNode {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
  tier: number;
}

export interface ArchEdge {
  id: string;
  source: string;
  target: string;
}

export interface ArchTier {
  tier: number;
  label: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
}

/** Neural-network style layers — grows left-to-right as the user scrolls. */
const layerX = [0.1, 0.3, 0.52, 0.74, 0.92];

function layerNodes(
  layer: number,
  count: number,
  type: NodeType,
  tier: number
): ArchNode[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `l${layer}n${i}`,
    label: "",
    type,
    x: layerX[layer],
    y: count === 1 ? 0.5 : 0.22 + (i / (count - 1)) * 0.56,
    tier,
  }));
}

function connectLayers(
  from: ArchNode[],
  to: ArchNode[],
  prefix: string
): ArchEdge[] {
  const edges: ArchEdge[] = [];
  from.forEach((s, si) => {
    to.forEach((t, ti) => {
      edges.push({ id: `${prefix}-${si}-${ti}`, source: s.id, target: t.id });
    });
  });
  return edges;
}

const l0 = layerNodes(0, 2, "gateway", 0);
const l1 = layerNodes(1, 3, "api", 1);
const l2 = layerNodes(2, 4, "ai", 2);
const l3 = layerNodes(3, 3, "agent", 3);
const l4 = layerNodes(4, 2, "db", 3);

const e01 = connectLayers(l0, l1, "e01");
const e12 = connectLayers(l1, l2, "e12");
const e23 = connectLayers(l2, l3, "e23");
const e34 = connectLayers(l3, l4, "e34");

export const architectureTiers: ArchTier[] = [
  {
    tier: 0,
    label: "Input Layer",
    nodes: l0,
    edges: e01.slice(0, 3),
  },
  {
    tier: 1,
    label: "Hidden Layer",
    nodes: [...l0, ...l1],
    edges: [...e01.slice(0, 4), ...e12.slice(0, 4)],
  },
  {
    tier: 2,
    label: "Inference Layer",
    nodes: [...l0, ...l1, ...l2],
    edges: [...e01, ...e12.slice(0, 8)],
  },
  {
    tier: 3,
    label: "Agent Network",
    nodes: [...l0, ...l1, ...l2, ...l3, ...l4],
    edges: [...e01, ...e12, ...e23, ...e34],
  },
];

export function getTierForProgress(progress: number): ArchTier {
  const index = Math.min(
    Math.floor(progress * architectureTiers.length),
    architectureTiers.length - 1
  );
  return architectureTiers[Math.max(0, index)];
}

export function interpolateTiers(
  from: ArchTier,
  to: ArchTier,
  t: number
): ArchTier {
  const eased = t * t * (3 - 2 * t);
  const nodeMap = new Map<string, ArchNode>();

  for (const node of from.nodes) nodeMap.set(node.id, node);
  for (const node of to.nodes) nodeMap.set(node.id, node);

  const nodes: ArchNode[] = [];
  for (const [id, target] of nodeMap) {
    const source = from.nodes.find((n) => n.id === id);
    if (source && to.nodes.find((n) => n.id === id)) {
      nodes.push({
        ...target,
        x: source.x + (target.x - source.x) * eased,
        y: source.y + (target.y - source.y) * eased,
      });
    } else if (to.nodes.find((n) => n.id === id)) {
      nodes.push({ ...target, x: target.x, y: target.y * eased + 0.5 * (1 - eased) });
    } else if (source) {
      nodes.push({ ...source, x: source.x, y: source.y });
    }
  }

  const edgeIds = new Set([
    ...from.edges.map((e) => e.id),
    ...to.edges.map((e) => e.id),
  ]);
  const edges = [...edgeIds]
    .map((id) => to.edges.find((e) => e.id === id) ?? from.edges.find((e) => e.id === id))
    .filter((e): e is ArchEdge => !!e);

  return {
    tier: to.tier,
    label: to.label,
    nodes,
    edges,
  };
}

export function getInterpolatedTier(progress: number): ArchTier {
  const scaled = progress * architectureTiers.length;
  const index = Math.min(Math.floor(scaled), architectureTiers.length - 1);
  const next = Math.min(index + 1, architectureTiers.length - 1);
  const localT = scaled - index;
  if (localT < 0.001 || index === next) return architectureTiers[index];
  return interpolateTiers(architectureTiers[index], architectureTiers[next], localT);
}
