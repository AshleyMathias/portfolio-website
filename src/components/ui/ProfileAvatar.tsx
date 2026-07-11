import Image from "next/image";

interface ProfileAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
}

const SIZES = {
  sm: { px: 40, className: "h-10 w-10" },
  md: { px: 96, className: "h-24 w-24" },
  lg: { px: 128, className: "h-32 w-32" },
} as const;

export function ProfileAvatar({
  size = "md",
  className = "",
  showLabel = false,
}: ProfileAvatarProps) {
  const { px, className: sizeClass } = SIZES[size];

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div
        className={`relative shrink-0 overflow-hidden rounded-full border border-border bg-surface shadow-[0_0_0_1px_rgba(39,39,42,0.6)] ${sizeClass}`}
      >
        {/* Soft dark vignette so studio grey blends into page background */}
        <Image
          src="/profile.png"
          alt="Ashley Mathias"
          width={px}
          height={px}
          className="h-full w-full object-cover object-[center_20%] brightness-[0.92] contrast-[1.05]"
          priority={size === "sm"}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/5"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>

      {showLabel && (
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            identity
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            Ashley Mathias
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            AI Engineer · Pune
          </p>
        </div>
      )}
    </div>
  );
}
