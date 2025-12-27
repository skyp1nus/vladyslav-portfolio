"use client";

import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import { GameWrapper } from "./GameWrapper";
import { GameState, GameProps } from "./types";

const ICONS = [
  "mdi:cards-diamond",
  "mdi:cards-spade",
  "mdi:cards-club",
  "mdi:cards-heart",
  "mdi:star",
  "mdi:lightning-bolt",
  "mdi:fire",
  "mdi:moon-waning-crescent",
];

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function createDeck(): Card[] {
  const pairs = [...ICONS, ...ICONS];
  // Shuffle
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((symbol, index) => ({
    id: index,
    symbol,
    isFlipped: false,
    isMatched: false,
  }));
}

export function MemoryCards({ isActive }: GameProps) {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    if (typeof window === "undefined") return 0;
    const saved = localStorage.getItem("memory-best");
    return saved ? parseInt(saved) : 0;
  });
  const [isChecking, setIsChecking] = useState(false);

  const startGame = useCallback(() => {
    setCards(createDeck());
    setFlippedIds([]);
    setMoves(0);
    setGameState("playing");
  }, []);

  const handleCardClick = useCallback(
    (id: number) => {
      if (gameState !== "playing" || isChecking) return;

      const card = cards.find((c) => c.id === id);
      if (!card || card.isFlipped || card.isMatched) return;

      const newFlipped = [...flippedIds, id];
      setFlippedIds(newFlipped);

      // Flip the card
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
      );

      if (newFlipped.length === 2) {
        setIsChecking(true);
        setMoves((m) => m + 1);

        const [firstId, secondId] = newFlipped;
        const firstCard = cards.find((c) => c.id === firstId)!;
        const secondCard = cards.find((c) => c.id === secondId)!;

        if (firstCard.symbol === secondCard.symbol) {
          // Match found
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, isMatched: true }
                  : c
              )
            );
            setFlippedIds([]);
            setIsChecking(false);
          }, 500);
        } else {
          // No match - flip back
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, isFlipped: false }
                  : c
              )
            );
            setFlippedIds([]);
            setIsChecking(false);
          }, 1000);
        }
      }
    },
    [gameState, cards, flippedIds, isChecking]
  );

  // Check for win
  useEffect(() => {
    if (gameState !== "playing") return;
    if (cards.length > 0 && cards.every((c) => c.isMatched)) {
      const finalScore = moves;
      if (bestScore === 0 || finalScore < bestScore) {
        queueMicrotask(() => setBestScore(finalScore));
        localStorage.setItem("memory-best", finalScore.toString());
      }
      queueMicrotask(() => setGameState("gameover"));
    }
  }, [cards, gameState, moves, bestScore]);

  // Pause when not active
  useEffect(() => {
    if (!isActive && gameState === "playing") {
      queueMicrotask(() => setGameState("paused"));
    }
  }, [isActive, gameState]);

  return (
    <GameWrapper
      gameName="Memory"
      instructions="Find all matching pairs"
      gameState={gameState}
      score={moves}
      bestScore={bestScore}
      onStart={startGame}
      onRestart={startGame}
    >
      {gameState === "playing" && (
        <div className="absolute inset-0 p-2 sm:p-3">
          <div className="grid grid-cols-4 gap-1 sm:gap-2 w-full h-full pt-6">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`
                  relative w-full h-full rounded transition-all duration-300 transform-gpu flex items-center justify-center
                  ${card.isFlipped || card.isMatched
                    ? "bg-[var(--foreground)]"
                    : "bg-[var(--muted)]/30 hover:bg-[var(--muted)]/50"
                  }
                  ${card.isMatched ? "opacity-50" : "opacity-100"}
                `}
                disabled={card.isFlipped || card.isMatched || isChecking}
              >
                <Icon
                  icon={card.symbol}
                  className={`
                    w-8 h-8 sm:w-10 sm:h-10 transition-opacity duration-300
                    ${card.isFlipped || card.isMatched
                      ? "text-[var(--background)] opacity-100"
                      : "opacity-0"
                    }
                  `}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </GameWrapper>
  );
}
