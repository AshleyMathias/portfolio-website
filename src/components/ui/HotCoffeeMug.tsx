"use client";

import { motion } from "framer-motion";

interface HotCoffeeMugProps {
  className?: string;
  compact?: boolean;
}

export function HotCoffeeMug({ className = "", compact = false }: HotCoffeeMugProps) {
  return (
    <motion.div
      className={`pointer-events-none select-none ${className}`}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    >
      <svg
        width="120"
        height="140"
        viewBox="0 0 120 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_8px_24px_rgba(249,115,22,0.12)]"
      >
        <defs>
          <linearGradient id="coffee-liquid" x1="30" y1="70" x2="90" y2="90">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id="mug-body" x1="25" y1="55" x2="95" y2="120">
            <stop offset="0%" stopColor="#27272a" />
            <stop offset="100%" stopColor="#18181b" />
          </linearGradient>
          <radialGradient id="coffee-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="60" cy="78" rx="28" ry="6" fill="url(#coffee-glow)">
          <animate
            attributeName="opacity"
            values="0.5;0.9;0.5"
            dur="3s"
            repeatCount="indefinite"
          />
        </ellipse>

        <path
          d="M28 62 L28 115 Q28 125 60 125 Q92 125 92 115 L92 62 Z"
          fill="url(#mug-body)"
          stroke="#3f3f46"
          strokeWidth="1.5"
        />
        <path
          d="M32 66 L32 112 Q32 118 60 118 Q88 118 88 112 L88 66 Z"
          fill="url(#coffee-liquid)"
        />
        <ellipse cx="60" cy="66" rx="28" ry="5" fill="#92400e" opacity="0.9" />
        <ellipse cx="60" cy="66" rx="22" ry="3.5" fill="#f97316" opacity="0.25">
          <animate
            attributeName="opacity"
            values="0.15;0.35;0.15"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </ellipse>

        <path
          d="M92 72 C108 72 112 82 112 92 C112 102 108 108 92 108"
          fill="none"
          stroke="#52525b"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <path
          className="coffee-steam coffee-steam-1"
          d="M48 48 C44 36 52 28 48 16"
          stroke="#a1a1aa"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
        <path
          className="coffee-steam coffee-steam-2"
          d="M60 44 C56 32 64 22 60 10"
          stroke="#d4d4d8"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
        <path
          className="coffee-steam coffee-steam-3"
          d="M72 48 C76 36 68 28 72 16"
          stroke="#a1a1aa"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </svg>

      <p
        className={`mt-2 text-center font-mono text-[10px] tracking-wider text-muted-foreground/60 ${compact ? "hidden" : ""}`}
      >
        brewing ideas
      </p>
    </motion.div>
  );
}
