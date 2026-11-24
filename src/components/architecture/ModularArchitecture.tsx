"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { ArchitectureCaseStudy } from "@/data/architectures";

const LAYER_COLORS = ["#60a5fa", "#a78bfa", "#c4b5fd", "#67e8f9", "#6ee7b7"];
const GAP = 0.82;
const PLATE_WIDTH = 3.55;

function labelTexture(text: string, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let size = 46;
  ctx.font = `500 ${size}px Geist, Inter, sans-serif`;
  while (ctx.measureText(text).width > 480 && size > 22) {
    size -= 2;
    ctx.font = `500 ${size}px Geist, Inter, sans-serif`;
  }
  ctx.fillText(text, 256, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function Module({
  position,
  color,
  selected,
  onSelect,
  drag,
}: {
  position: [number, number, number];
  color: string;
  selected: boolean;
  onSelect: () => void;
  drag: React.MutableRefObject<{ moved: boolean }>;
}) {
  const group = useRef<THREE.Group>(null);
  const { gl, invalidate } = useThree();

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.position.z = THREE.MathUtils.damp(
      group.current.position.z,
      selected ? 0.7 : 0,
      7,
      delta
    );
  });

  return (
    <group position={position}>
      <mesh position={[0, 0, -0.08]}>
        <boxGeometry args={[0.96, 0.36, 0.06]} />
        <meshBasicMaterial color="#141416" />
      </mesh>
      <group ref={group}>
        <mesh
          onClick={(event) => {
            event.stopPropagation();
            if (drag.current.moved) {
              drag.current.moved = false;
              return;
            }
            onSelect();
            invalidate();
          }}
          onPointerOver={(event) => {
            event.stopPropagation();
            gl.domElement.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            gl.domElement.style.cursor = "";
          }}
        >
          <boxGeometry args={[0.84, 0.34, 0.62]} />
          <meshBasicMaterial color={selected ? "#f8fafc" : color} />
        </mesh>
      </group>
      <mesh position={[0, -0.2, 0.22]} visible={selected}>
        <boxGeometry args={[0.9, 0.012, 0.012]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function Rack({
  architecture,
  selected,
  onSelect,
  reduced,
}: {
  architecture: ArchitectureCaseStudy;
  selected: string;
  onSelect: (id: string) => void;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const signal = useRef<THREE.Mesh>(null);
  const yaw = useRef(0);
  const drag = useRef({ active: false, x: 0, moved: false, pauseUntil: 0 });
  const { camera, gl, invalidate } = useThree();
  const layers = architecture.layers;
  const span = Math.max(layers.length - 1, 1) * GAP;

  const textures = useMemo(() => {
    const maps = new Map<string, THREE.Texture>();
    layers.forEach((layer, index) => {
      const color = LAYER_COLORS[index % LAYER_COLORS.length];
      maps.set(layer.id, labelTexture(String(index + 1).padStart(2, "0"), color));
    });
    return maps;
  }, [layers]);

  useEffect(() => {
    return () => textures.forEach((texture) => texture.dispose());
  }, [textures]);

  useEffect(() => {
    camera.position.set(2.55, 1.85, 7.5);
    camera.lookAt(0, 0, 0);
    invalidate();
  }, [camera, invalidate, architecture.id]);

  useEffect(() => {
    const element = gl.domElement;
    const down = (event: PointerEvent) => {
      drag.current.active = true;
      drag.current.moved = false;
      drag.current.x = event.clientX;
    };
    const move = (event: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = event.clientX - drag.current.x;
      if (Math.abs(dx) > 3) drag.current.moved = true;
      yaw.current += dx * 0.007;
      drag.current.x = event.clientX;
      drag.current.pauseUntil = performance.now() + 2800;
      invalidate();
    };
    const up = () => {
      drag.current.active = false;
    };
    element.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      element.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      element.style.cursor = "";
    };
  }, [gl, invalidate]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    if (!drag.current.active && performance.now() > drag.current.pauseUntil) {
      yaw.current = THREE.MathUtils.damp(yaw.current, 0, 1.4, delta);
    }
    if (group.current) {
      const sway = reduced ? 0 : Math.sin(time * 0.35) * 0.08;
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        0.28 + yaw.current + sway,
        5,
        delta
      );
    }
    if (signal.current) {
      const phase = (Math.sin(time * 0.65) + 1) / 2;
      signal.current.position.y = span / 2 - phase * span;
    }
  });

  return (
    <group ref={group}>
      {[-1, 1].map((x) =>
        [-1, 1].map((z) => (
          <mesh key={`${x}${z}`} position={[x * 1.72, 0, z * 1.02]}>
            <boxGeometry args={[0.035, span + 0.7, 0.035]} />
            <meshBasicMaterial color="#3f3f46" />
          </mesh>
        ))
      )}
      <mesh position={[0, 0, 0.34]}>
        <boxGeometry args={[0.012, span, 0.012]} />
        <meshBasicMaterial color="#52525b" />
      </mesh>
      <mesh ref={signal} position={[0, 0, 0.34]}>
        <sphereGeometry args={[0.045, 12, 10]} />
        <meshBasicMaterial color="#f8fafc" />
      </mesh>

      {layers.map((layer, index) => {
        const y = span / 2 - index * GAP;
        const color = LAYER_COLORS[index % LAYER_COLORS.length];
        const count = layer.components.length;
        const pitch = 1.12;
        return (
          <group key={layer.id} position={[0, y, 0]}>
            <mesh>
              <boxGeometry args={[PLATE_WIDTH, 0.06, 2.05]} />
              <meshBasicMaterial color="#17171b" />
            </mesh>
            <mesh position={[0, 0.035, 0.8]}>
              <boxGeometry args={[PLATE_WIDTH, 0.018, 0.028]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <sprite position={[-1.95, 0.22, 0.7]} scale={[0.42, 0.16, 1]}>
              <spriteMaterial map={textures.get(layer.id)} transparent depthWrite={false} />
            </sprite>
            {layer.components.map((component, componentIndex) => {
              const id = `${layer.id}::${component}`;
              const x = (componentIndex - (count - 1) / 2) * pitch;
              return (
                <Module
                  key={id}
                  position={[x, 0.22, 0]}
                  color={color}
                  selected={selected === id}
                  onSelect={() => onSelect(id)}
                  drag={drag}
                />
              );
            })}
          </group>
        );
      })}
    </group>
  );
}

export function ModularArchitecture({
  architecture,
  selected,
  onSelect,
}: {
  architecture: ArchitectureCaseStudy;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(motion.matches);
    sync();
    motion.addEventListener("change", sync);
    const node = host.current;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (node) observer.observe(node);
    return () => {
      motion.removeEventListener("change", sync);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={host} className="h-full w-full">
      <Canvas
        frameloop={visible && !reduced ? "always" : "demand"}
        dpr={1}
        gl={{ alpha: false, antialias: true, powerPreference: "low-power" }}
        camera={{ position: [2.55, 1.85, 7.5], fov: 34, near: 0.1, far: 40 }}
      >
        <color attach="background" args={["#0c0c0e"]} />
        <Rack
          architecture={architecture}
          selected={selected}
          onSelect={onSelect}
          reduced={reduced}
        />
      </Canvas>
    </div>
  );
}
