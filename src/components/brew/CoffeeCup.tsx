"use client";

import { motion } from "framer-motion";
import type { Recipe } from "@/data/coffee-recipes";

interface CoffeeCupProps {
  recipe: Recipe;
  progress: number; // 0..1
  done: boolean;
}

const TOP = 80;
const BOTTOM = 176;
const RANGE = BOTTOM - TOP;

export function CoffeeCup({ recipe, progress, done }: CoffeeCupProps) {
  const { result } = recipe;
  const liquidHeight = progress * RANGE;
  const liquidY = BOTTOM - liquidHeight;
  const foamHeight = Math.min(liquidHeight, result.foam * RANGE * progress);
  const hot = result.temp === "hot";
  const showSteam = hot && progress > 0.45;
  const showIce = result.temp === "iced" && progress > 0.35;

  return (
    <div className="relative flex flex-col items-center">
      <svg
        width="200"
        height="230"
        viewBox="0 0 200 230"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <clipPath id="cup-interior">
            <path d="M56 74 L56 168 Q56 180 72 180 L128 180 Q144 180 144 168 L144 74 Z" />
          </clipPath>
          <radialGradient id="cup-aroma" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={result.crema} stopOpacity="0.25" />
            <stop offset="100%" stopColor={result.crema} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ambient glow when finished */}
        {done && (
          <motion.ellipse
            cx="100"
            cy="120"
            rx="70"
            ry="70"
            fill="url(#cup-aroma)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}

        {/* steam (hot drinks) */}
        {showSteam && (
          <g>
            <path
              className="coffee-steam coffee-steam-1"
              d="M78 66 C72 52 84 42 78 26"
              stroke="#cbd5e1"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
            <path
              className="coffee-steam coffee-steam-2"
              d="M100 62 C94 46 106 34 100 18"
              stroke="#e2e8f0"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
            <path
              className="coffee-steam coffee-steam-3"
              d="M122 66 C128 52 116 42 122 26"
              stroke="#cbd5e1"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
          </g>
        )}

        {/* handle */}
        <path
          d="M144 92 C168 92 172 108 172 122 C172 138 166 152 144 152"
          fill="none"
          stroke="#3f3f46"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* cup body */}
        <path
          d="M52 70 L52 168 Q52 186 74 186 L126 186 Q148 186 148 168 L148 70 Z"
          fill="#18181b"
          stroke="#3f3f46"
          strokeWidth="2"
        />

        {/* liquid + foam (clipped to interior) */}
        <g clipPath="url(#cup-interior)">
          <motion.rect
            x="56"
            width="88"
            animate={{ y: liquidY, height: liquidHeight }}
            transition={{ type: "spring", stiffness: 60, damping: 16 }}
            fill={result.liquid}
          />
          {/* crema / foam layer sits at the surface */}
          {foamHeight > 1 && (
            <motion.rect
              x="56"
              width="88"
              animate={{ y: liquidY, height: foamHeight }}
              transition={{ type: "spring", stiffness: 60, damping: 16 }}
              fill={result.crema}
              opacity={0.92}
            />
          )}
          {/* surface shimmer */}
          {progress > 0.05 && (
            <motion.ellipse
              cx="100"
              rx="42"
              ry="3"
              fill="#ffffff"
              opacity={0.12}
              animate={{ cy: liquidY + 1.5 }}
              transition={{ type: "spring", stiffness: 60, damping: 16 }}
            />
          )}

          {/* ice cubes (cold drinks) */}
          {showIce && (
            <g>
              {[
                { x: 72, y: 4, r: -12 },
                { x: 104, y: 10, r: 18 },
                { x: 88, y: 20, r: 6 },
              ].map((ice, idx) => (
                <motion.rect
                  key={idx}
                  x={ice.x}
                  width="20"
                  height="20"
                  rx="3"
                  fill="#dbeafe"
                  opacity={0.55}
                  stroke="#eff6ff"
                  strokeWidth="1"
                  animate={{ y: liquidY + ice.y }}
                  transition={{ type: "spring", stiffness: 50, damping: 14 }}
                  style={{ transformOrigin: "center", rotate: `${ice.r}deg` }}
                />
              ))}
            </g>
          )}
        </g>

        {/* rim */}
        <ellipse
          cx="100"
          cy="72"
          rx="48"
          ry="7"
          fill="none"
          stroke="#52525b"
          strokeWidth="2"
        />

        {/* saucer */}
        <ellipse cx="100" cy="196" rx="66" ry="9" fill="#111113" stroke="#27272a" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
