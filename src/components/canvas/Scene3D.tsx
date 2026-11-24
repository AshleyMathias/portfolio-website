"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { subscribeScrollProgress } from "@/lib/scroll-signal";

const RINGS = [
  { label: "RAG", radius: 1.45, y: 0.9, count: 6, color: "#9ec1ff", speed: 0.18 },
  { label: "Agents", radius: 2.15, y: 0.05, count: 3, color: "#c4b5fd", speed: -0.12 },
  { label: "MCP", radius: 2.85, y: -0.8, count: 4, color: "#7dd3fc", speed: 0.1 },
] as const;

function labelTexture(text: string, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "500 28px Geist, Inter, sans-serif";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 128, 32);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function Spoke({
  x2,
  y2,
  z2,
  color,
}: {
  x2: number;
  y2: number;
  z2: number;
  color: string;
}) {
  const line = useMemo(() => {
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, x2, y2, z2], 3));
    return new THREE.Line(
      buffer,
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.28 })
    );
  }, [x2, y2, z2, color]);

  useEffect(() => {
    return () => {
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    };
  }, [line]);

  return <primitive object={line} />;
}

function Practice({
  scrollRef,
  reduced,
}: {
  scrollRef: React.MutableRefObject<number>;
  reduced: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const rings = useRef<Array<THREE.Group | null>>([]);
  const packet = useRef<THREE.Mesh>(null);
  const sparks = useRef<Array<THREE.Mesh | null>>([]);
  const trail = useRef<Array<THREE.Mesh | null>>([]);
  const cards = useRef<Array<THREE.Mesh | null>>([]);
  const agents = useRef<Array<THREE.Mesh | null>>([]);
  const tools = useRef<Array<THREE.Mesh | null>>([]);
  const trailPoints = useMemo(
    () => Array.from({ length: 12 }, () => new THREE.Vector3()),
    []
  );
  const trailCursor = useRef(0);
  const labels = useMemo(
    () => RINGS.map((ring) => labelTexture(ring.label, ring.color)),
    []
  );

  useEffect(() => {
    return () => labels.forEach((texture) => texture.dispose());
  }, [labels]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (root.current) {
      root.current.rotation.y = reduced ? 0.4 : t * 0.16;
      root.current.rotation.x = reduced ? 0.15 : 0.18 + Math.sin(t * 0.25) * 0.04;
      root.current.position.y = THREE.MathUtils.damp(
        root.current.position.y,
        0.15 - scrollRef.current * 0.8,
        1.2,
        delta
      );
    }
    if (core.current) {
      core.current.rotation.y = t * 0.7;
      core.current.rotation.x = t * 0.35;
      const pulse = reduced ? 1 : 1 + Math.sin(t * 2.4) * 0.08;
      core.current.scale.setScalar(pulse);
    }
    if (!reduced) {
      rings.current.forEach((ring, index) => {
        if (ring) ring.rotation.y = t * RINGS[index].speed;
      });
      cards.current.forEach((card, index) => {
        if (card) card.rotation.y = t * 0.9 + index * 0.7;
      });
      agents.current.forEach((agent, index) => {
        if (agent) agent.position.y = Math.sin(t * 1.6 + index * 1.4) * 0.07;
      });
      tools.current.forEach((tool, index) => {
        if (!tool) return;
        tool.rotation.x = t * 0.55 + index;
        tool.rotation.y = t * 0.8;
      });

      const place = (time: number, offset: number, target: THREE.Vector3) => {
        const phase = (time * 0.22 + offset) % 1;
        const radius = 0.32 + phase * 2.6;
        const angle = time * 1.05 + offset * Math.PI * 2;
        target.set(Math.cos(angle) * radius, 0.95 - phase * 1.75, Math.sin(angle) * radius);
      };

      const head = trailPoints[trailCursor.current];
      place(t, 0, head);
      if (packet.current) packet.current.position.copy(head);
      trail.current.forEach((mesh, index) => {
        if (!mesh) return;
        const point = trailPoints[(trailCursor.current - index + trailPoints.length) % trailPoints.length];
        mesh.position.copy(point);
        const fade = 1 - index / trail.current.length;
        mesh.scale.setScalar(0.35 + fade * 0.65);
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = 0.08 + fade * 0.7;
      });
      trailCursor.current = (trailCursor.current + 1) % trailPoints.length;

      sparks.current.forEach((spark, index) => {
        if (!spark) return;
        place(t, (index + 1) * 0.33, spark.position);
      });
    }
    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      0.4 + state.pointer.x * 0.25,
      1.4,
      delta
    );
  });

  return (
    <group ref={root} position={[2.55, 1.15, 0]} scale={0.78}>
      <mesh ref={core}>
        <octahedronGeometry args={[0.28, 0]} />
        <meshBasicMaterial color="#f4f7ff" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.46, 16, 12]} />
        <meshBasicMaterial color="#8eb4ff" transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0.2, 0]}>
        <torusGeometry args={[0.5, 0.01, 8, 48]} />
        <meshBasicMaterial color="#dbeafe" transparent opacity={0.8} />
      </mesh>

      {RINGS.map((ring, ringIndex) => (
        <group
          key={ring.label}
          ref={(node) => {
            rings.current[ringIndex] = node;
          }}
        >
          <mesh position={[0, ring.y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[ring.radius, 0.008, 6, 64]} />
            <meshBasicMaterial color={ring.color} transparent opacity={0.35} />
          </mesh>
          {Array.from({ length: ring.count }, (_, index) => {
            const angle = (index / ring.count) * Math.PI * 2;
            const x = Math.cos(angle) * ring.radius;
            const z = Math.sin(angle) * ring.radius;
            return (
              <group key={index}>
                <group position={[x, ring.y, z]}>
                  {ring.label === "RAG" && (
                    <mesh
                      ref={(node) => {
                        cards.current[index] = node;
                      }}
                    >
                      <boxGeometry args={[0.16, 0.22, 0.04]} />
                      <meshBasicMaterial color={ring.color} />
                    </mesh>
                  )}
                  {ring.label === "Agents" && (
                    <mesh
                      ref={(node) => {
                        agents.current[index] = node;
                      }}
                    >
                      <sphereGeometry args={[0.11, 16, 12]} />
                      <meshBasicMaterial color={ring.color} />
                    </mesh>
                  )}
                  {ring.label === "MCP" && (
                    <mesh
                      ref={(node) => {
                        tools.current[index] = node;
                      }}
                    >
                      <boxGeometry args={[0.14, 0.14, 0.14]} />
                      <meshBasicMaterial color={ring.color} />
                    </mesh>
                  )}
                </group>
                <Spoke x2={x} y2={ring.y} z2={z} color={ring.color} />
              </group>
            );
          })}
          <sprite position={[ring.radius + 0.15, ring.y + 0.28, 0]} scale={[1.15, 0.3, 1]}>
            <spriteMaterial map={labels[ringIndex]} transparent depthWrite={false} />
          </sprite>
        </group>
      ))}

      {trailPoints.map((_, index) => (
        <mesh
          key={index}
          ref={(node) => {
            trail.current[index] = node;
          }}
        >
          <sphereGeometry args={[0.035, 8, 6]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.55 - index * 0.04}
            depthWrite={false}
          />
        </mesh>
      ))}
      <mesh ref={packet}>
        <sphereGeometry args={[0.055, 12, 10]} />
        <meshBasicMaterial color="#ffffff" />
        <mesh>
          <sphereGeometry args={[0.16, 10, 8]} />
          <meshBasicMaterial color="#dbeafe" transparent opacity={0.28} depthWrite={false} />
        </mesh>
      </mesh>
      {[0, 1].map((index) => (
        <mesh
          key={index}
          ref={(node) => {
            sparks.current[index] = node;
          }}
        >
          <sphereGeometry args={[0.04, 8, 6]} />
          <meshBasicMaterial color={index === 0 ? "#c4b5fd" : "#7dd3fc"} />
        </mesh>
      ))}
    </group>
  );
}

export function Scene3D() {
  const scrollRef = useRef(0);
  const [reduced, setReduced] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => subscribeScrollProgress((progress) => {
    scrollRef.current = progress;
  }), []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(motion.matches);
    sync();
    motion.addEventListener("change", sync);
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (hidden) return null;

  return (
    <Canvas
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.62,
      }}
      dpr={1}
      frameloop={reduced ? "demand" : "always"}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      camera={{ position: [0.4, 0.45, 8.2], fov: 38, near: 0.1, far: 30 }}
      aria-hidden
    >
      <fog attach="fog" args={["#09090b", 7, 16]} />
      <Practice scrollRef={scrollRef} reduced={reduced} />
    </Canvas>
  );
}
