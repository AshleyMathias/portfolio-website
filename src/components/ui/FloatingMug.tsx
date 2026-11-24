"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
function DemandClock({ active }: { active: boolean }) {
  const { invalidate } = useThree();
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let last = 0;
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (document.hidden || now - last < 40) return;
      last = now;
      invalidate();
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [active, invalidate]);
  return null;
}

function Steam({ reduced }: { reduced: boolean }) {
  const points = useRef<THREE.Points>(null);
  const count = 28;
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 0.28,
        z: (Math.random() - 0.5) * 0.22,
        speed: 0.12 + Math.random() * 0.18,
        phase: Math.random(),
        sway: 0.4 + Math.random() * 0.8,
      })),
    []
  );
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const attribute = geometry.getAttribute("position") as THREE.BufferAttribute;
    const t = state.clock.elapsedTime;
    seeds.forEach((seed, index) => {
      const life = reduced ? seed.phase * 0.4 : (t * seed.speed + seed.phase) % 1;
      attribute.setXYZ(
        index,
        seed.x + Math.sin(t * seed.sway + seed.phase) * 0.05 * life,
        0.62 + life * 1.05,
        seed.z + Math.cos(t * 0.7 + seed.phase) * 0.03
      );
    });
    attribute.needsUpdate = true;
    const material = points.current?.material as THREE.PointsMaterial | undefined;
    if (material) material.opacity = reduced ? 0.22 : 0.28 + Math.sin(t * 1.4) * 0.06;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        color="#f4f4f5"
        size={0.055}
        transparent
        opacity={0.3}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function Cup({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const handle = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0.42, 0.34, 0),
        new THREE.Vector3(0.86, 0.42, 0),
        new THREE.Vector3(1.12, 0.12, 0),
        new THREE.Vector3(1.08, -0.24, 0),
        new THREE.Vector3(0.74, -0.4, 0),
        new THREE.Vector3(0.42, -0.16, 0),
      ],
      false,
      "catmullrom",
      0.45
    );
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const floatY = reduced ? 0 : Math.sin(t * 0.85) * 0.07;
    const tiltY = reduced ? -0.35 : state.pointer.x * 0.55;
    const tiltX = reduced ? 0.08 : -state.pointer.y * 0.22;
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, floatY, 2.2, delta);
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      -0.2 + tiltY * 0.45,
      2.4,
      delta
    );
    group.current.rotation.z = THREE.MathUtils.damp(
      group.current.rotation.z,
      reduced ? 0 : Math.sin(t * 0.7) * 0.03,
      2,
      delta
    );
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, tiltX, 2.4, delta);
  });

  return (
    <group ref={group} position={[-0.22, 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, 0]}>
        <circleGeometry args={[0.72, 40]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.28} />
      </mesh>

      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.58, 0.48, 1.05, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#e7e2da"
          roughness={0.42}
          metalness={0.02}
          clearcoat={0.45}
          clearcoatRoughness={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, -0.52, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.48, 48]} />
        <meshStandardMaterial color="#cfc8be" roughness={0.55} />
      </mesh>

      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.52, 0.46, 0.62, 48, 1, true]} />
        <meshStandardMaterial color="#1c1410" roughness={0.8} side={THREE.BackSide} />
      </mesh>

      <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.52, 48]} />
        <meshPhysicalMaterial
          color="#6f3412"
          roughness={0.18}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>
      <mesh position={[0.08, 0.425, 0.04]} rotation={[-Math.PI / 2, 0, 0.4]}>
        <circleGeometry args={[0.16, 24]} />
        <meshBasicMaterial color="#d4924a" transparent opacity={0.28} />
      </mesh>

      <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.57, 0.028, 16, 64]} />
        <meshStandardMaterial color="#f5f1ea" metalness={0.2} roughness={0.25} />
      </mesh>

      <mesh>
        <tubeGeometry args={[handle, 48, 0.062, 18, false]} />
        <meshPhysicalMaterial
          color="#ddd6cc"
          roughness={0.3}
          metalness={0.18}
          clearcoat={0.55}
        />
      </mesh>

      <pointLight position={[0, 0.7, 0.2]} color="#fb923c" intensity={1.4} distance={2.2} />
      <Steam reduced={reduced} />
    </group>
  );
}

export function FloatingMug() {
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReady(true);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(motion.matches);
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "120px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ready]);

  if (!ready) {
    return <div className="h-[250px] w-[280px]" aria-hidden="true" />;
  }

  return (
    <div ref={stage} className="h-[250px] w-[280px]" aria-hidden="true">
      <Canvas
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
        dpr={1}
        frameloop="demand"
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        camera={{ position: [0.35, 0.62, 4.35], fov: 30, near: 0.1, far: 20 }}
        onCreated={({ camera }) => camera.lookAt(0.05, 0.02, 0)}
      >
        <DemandClock active={onScreen && !reduced} />
        <ambientLight intensity={0.45} />
        <hemisphereLight args={["#dbe7ff", "#1c140e", 0.55]} />
        <directionalLight position={[2.5, 3.2, 2.4]} intensity={3.2} color="#fff7ed" />
        <directionalLight position={[-2.2, 1.2, -1.5]} intensity={1.1} color="#93c5fd" />
        <Cup reduced={reduced} />
      </Canvas>
    </div>
  );
}
