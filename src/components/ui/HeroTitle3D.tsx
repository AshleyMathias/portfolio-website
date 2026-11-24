"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { parse, type Font, type Path } from "opentype.js";

interface HeroTitle3DProps {
  onReady: () => void;
}

const FONT_SIZE = 100;
const LINE_GAP = 118;

const LINES: Array<Array<{ text: string; color: string }>> = [
  [
    { text: "Hi, I'm ", color: "#fafafa" },
    { text: "Ashley Mathias", color: "#c8c8d0" },
  ],
  [{ text: "I design AI systems.", color: "#fafafa" }],
];

function shapesFromPath(path: Path) {
  const contours: THREE.Shape[] = [];
  let shape: THREE.Shape | null = null;

  const close = () => {
    if (!shape) return;
    contours.push(shape);
    shape = null;
  };

  path.commands.forEach((command) => {
    if (command.type === "M") {
      close();
      shape = new THREE.Shape();
      shape.moveTo(command.x, -command.y);
      return;
    }
    if (!shape) return;
    if (command.type === "L") shape.lineTo(command.x, -command.y);
    if (command.type === "C") {
      shape.bezierCurveTo(
        command.x1,
        -command.y1,
        command.x2,
        -command.y2,
        command.x,
        -command.y
      );
    }
    if (command.type === "Q") {
      shape.quadraticCurveTo(command.x1, -command.y1, command.x, -command.y);
    }
    if (command.type === "Z") close();
  });
  close();

  const items = contours.map((contour) => {
    const points = contour.getPoints();
    return {
      contour,
      points,
      box: new THREE.Box2().setFromPoints(points),
      area: Math.abs(THREE.ShapeUtils.area(points)),
    };
  });
  items.sort((a, b) => b.area - a.area);

  const roots: typeof items = [];
  items.forEach((item) => {
    const parent = roots.find((root) => root.box.containsBox(item.box));
    if (parent) parent.contour.holes.push(new THREE.Path(item.points));
    else roots.push(item);
  });

  return roots.map((item) => item.contour);
}

function buildTitle(font: Font) {
  const lines = LINES.map((parts) => {
    let cursor = 0;
    const meshes = parts.map((part) => {
      const path = font.getPath(part.text, cursor, 0, FONT_SIZE);
      const geometry = new THREE.ExtrudeGeometry(shapesFromPath(path), {
        depth: 16,
        bevelEnabled: true,
        bevelThickness: 1.4,
        bevelSize: 1.1,
        bevelOffset: 0,
        bevelSegments: 1,
        curveSegments: 3,
      });
      cursor += font.getAdvanceWidth(part.text, FONT_SIZE);
      return { geometry, color: part.color };
    });
    return { meshes, width: cursor };
  });

  const box = new THREE.Box3();
  lines.forEach((line, index) => {
    line.meshes.forEach((mesh) => {
      mesh.geometry.computeBoundingBox();
      if (!mesh.geometry.boundingBox) return;
      const shifted = mesh.geometry.boundingBox.clone();
      shifted.translate(new THREE.Vector3(0, -index * LINE_GAP, 0));
      box.union(shifted);
    });
  });

  const size = box.getSize(new THREE.Vector3());
  return {
    lines,
    width: Math.max(size.x, 1),
    height: Math.max(size.y, 1),
    depth: Math.max(size.z, 1),
    center: box.getCenter(new THREE.Vector3()),
  };
}

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

function ExtrudedTitle({
  font,
  reduced,
  onReady,
}: {
  font: Font;
  reduced: boolean;
  onReady: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const notified = useRef(false);
  const intro = useRef(reduced ? 1 : 0);
  const { size } = useThree();
  const title = useMemo(() => {
    try {
      return buildTitle(font);
    } catch {
      return null;
    }
  }, [font]);

  useEffect(() => {
    if (!title || notified.current) return;
    notified.current = true;
    onReady();
  }, [title, onReady]);

  useEffect(() => {
    if (!title) return;
    return () => {
      title.lines.forEach((line) => {
        line.meshes.forEach((mesh) => mesh.geometry.dispose());
      });
    };
  }, [title]);

  const tiltY = 0.22;
  const tiltX = 0.1;
  const projectedW = title
    ? title.width * Math.cos(tiltY) + title.depth * Math.sin(tiltY)
    : 1;
  const projectedH = title
    ? title.height * Math.cos(tiltX) + title.depth * Math.sin(tiltX)
    : 1;
  const scale = title
    ? Math.min((size.width * 0.9) / projectedW, (size.height * 0.86) / projectedH)
    : 1;

  useFrame((state, delta) => {
    if (!group.current || !title) return;
    if (!reduced) intro.current = Math.min(1, intro.current + delta / 1.25);
    const ease = reduced ? 1 : 1 - (1 - intro.current) ** 3;
    const settled = scale * (0.965 + 0.035 * ease);
    group.current.scale.setScalar(settled);
    group.current.position.set(
      title.center.x * -settled,
      title.center.y * -settled - (1 - ease) * 10,
      (1 - ease) * -36
    );
    const targetY = (reduced ? tiltY : tiltY + state.pointer.x * 0.1) * ease;
    const targetX = (reduced ? -tiltX : -tiltX - state.pointer.y * 0.05) * ease;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 2.4, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 2.4, delta);
  });

  if (!title) return null;

  return (
    <group ref={group} scale={scale * 0.965} position={[title.center.x * -scale, title.center.y * -scale - 10, -36]}>
      {title.lines.map((line, lineIndex) => (
        <group key={lineIndex} position={[0, -lineIndex * LINE_GAP, 0]}>
          {line.meshes.map((mesh, meshIndex) => (
            <mesh key={meshIndex} geometry={mesh.geometry}>
              <meshStandardMaterial
                color={mesh.color}
                roughness={0.38}
                metalness={0.12}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

export function HeroTitle3D({ onReady }: HeroTitle3DProps) {
  const [font, setFont] = useState<Font | null>(null);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const stage = useRef<HTMLDivElement>(null);
  const reveal = () => {
    setVisible(true);
    onReady();
  };
  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "120px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [font]);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(motion.matches);
    sync();
    motion.addEventListener("change", sync);

    let active = true;
    fetch("/fonts/Roboto-Medium.ttf")
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        if (active) setFont(parse(buffer));
      })
      .catch(() => undefined);

    return () => {
      active = false;
      motion.removeEventListener("change", sync);
    };
  }, []);

  if (!font) return null;

  return (
    <motion.div
      ref={stage}
      className="h-full w-full"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{
        duration: reduced ? 0.2 : 0.9,
        delay: visible && !reduced ? 0.28 : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Canvas
        orthographic
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
        dpr={1}
        frameloop="demand"
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 500], zoom: 1, near: 0.1, far: 1200 }}
      >
        <DemandClock active={onScreen && !reduced} />
        <ambientLight intensity={0.72} />
        <directionalLight position={[40, 80, 180]} intensity={2.4} color="#fffaf5" />
        <directionalLight position={[-90, -30, 120]} intensity={0.55} color="#93c5fd" />
        <ExtrudedTitle font={font} reduced={reduced} onReady={reveal} />
      </Canvas>
    </motion.div>
  );
}
