"use client";

interface GamePreviewCardProps {
  name: string;
  description: string;
  onPlay: () => void;
}

const GAME_ICONS: Record<string, string> = {
  Memory: "🎴",
  Snake: "🐍",
  Breakout: "🧱",
  Flappy: "🐦",
  "Dino Run": "🦖",
};

export function GamePreviewCard({ name, description, onPlay }: GamePreviewCardProps) {
  const icon = GAME_ICONS[name] || "🎮";

  return (
    <div className="w-full h-full rounded-lg bg-[var(--secondary)] overflow-hidden flex flex-col items-center justify-center gap-4 p-6 group cursor-pointer hover:bg-[var(--secondary)]/80 transition-colors"
      onClick={onPlay}
    >
      {/* Icon */}
      <span className="text-5xl sm:text-6xl md:text-7xl group-hover:scale-110 transition-transform">
        {icon}
      </span>

      {/* Name */}
      <h4 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
        {name}
      </h4>

      {/* Description */}
      <p className="text-xs sm:text-sm text-[var(--muted)] text-center">
        {description}
      </p>

      {/* Play button */}
      <button
        className="mt-2 px-6 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-md text-sm font-medium hover:opacity-80 transition-opacity"
      >
        Play
      </button>
    </div>
  );
}
