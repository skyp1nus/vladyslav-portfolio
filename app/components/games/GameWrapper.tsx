"use client";

import { GameState } from "./types";

interface GameWrapperProps {
  gameName: string;
  instructions: string;
  gameState: GameState;
  score: number;
  bestScore: number;
  onStart: () => void;
  onRestart: () => void;
  children: React.ReactNode;
}

export function GameWrapper({
  gameName,
  instructions,
  gameState,
  score,
  bestScore,
  onStart,
  onRestart,
  children,
}: GameWrapperProps) {
  return (
    <div className="relative w-full h-full bg-[var(--secondary)] rounded-lg overflow-hidden">
      {children}

      {/* Start Screen */}
      {gameState === "idle" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--secondary)] cursor-pointer"
          onClick={onStart}
        >
          <h4 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
            {gameName}
          </h4>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-2 text-center px-4">
            {instructions}
          </p>
          <button className="mt-4 px-4 sm:px-6 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-md text-xs sm:text-sm font-medium hover:opacity-80 transition-opacity">
            Play
          </button>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === "gameover" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--secondary)]/95 backdrop-blur-sm">
          <h4 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
            Game Over
          </h4>
          <p className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mt-2 font-mono">
            {score}
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted)]">
            Best: {bestScore}
          </p>
          <button
            onClick={onRestart}
            className="mt-4 px-4 sm:px-6 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-md text-xs sm:text-sm font-medium hover:opacity-80 transition-opacity"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Score Display during gameplay */}
      {gameState === "playing" && (
        <div className="absolute top-2 right-2 text-xs sm:text-sm font-mono text-[var(--muted)]">
          {score}
        </div>
      )}
    </div>
  );
}
