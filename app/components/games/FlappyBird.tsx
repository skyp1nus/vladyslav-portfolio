"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GameWrapper } from "./GameWrapper";
import { GameState, GameProps } from "./types";
import { useGameLoop } from "./hooks/useGameLoop";
import { useKeyboardControls, useClickControl } from "./hooks/useControls";

const GRAVITY = 0.4;
const FLAP_STRENGTH = -7;
const PIPE_WIDTH = 50;
const PIPE_GAP = 120;
const PIPE_SPEED = 2.5;
const BIRD_SIZE = 20;

interface Pipe {
  x: number;
  gapY: number;
  passed: boolean;
}

export function FlappyBird({ isActive }: GameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    if (typeof window === "undefined") return 0;
    const saved = localStorage.getItem("flappy-best");
    return saved ? parseInt(saved) : 0;
  });

  const birdRef = useRef({ y: 0, velocity: 0 });
  const pipesRef = useRef<Pipe[]>([]);
  const sizeRef = useRef({ width: 0, height: 0 });
  const frameRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = Math.min(container.clientWidth, container.clientHeight) - 16;
    canvas.width = size;
    canvas.height = size;
    sizeRef.current = { width: size, height: size };

    const styles = getComputedStyle(document.documentElement);
    const foreground = styles.getPropertyValue("--foreground").trim();
    const secondary = styles.getPropertyValue("--secondary").trim();
    const muted = styles.getPropertyValue("--muted").trim();

    // Clear
    ctx.fillStyle = secondary;
    ctx.fillRect(0, 0, size, size);

    // Draw pipes
    ctx.fillStyle = muted;
    pipesRef.current.forEach((pipe) => {
      // Top pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY - PIPE_GAP / 2);
      // Bottom pipe
      ctx.fillRect(
        pipe.x,
        pipe.gapY + PIPE_GAP / 2,
        PIPE_WIDTH,
        size - (pipe.gapY + PIPE_GAP / 2)
      );
    });

    // Draw bird
    const bird = birdRef.current;
    ctx.fillStyle = foreground;
    ctx.save();
    ctx.translate(size * 0.25, bird.y);
    ctx.rotate(Math.min(Math.max(bird.velocity * 0.05, -0.5), 0.5));
    ctx.fillRect(-BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
    ctx.restore();

    // Draw ground line
    ctx.strokeStyle = foreground;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, size - 20);
    ctx.lineTo(size, size - 20);
    ctx.stroke();
  }, []);

  const flap = useCallback(() => {
    if (gameState === "playing") {
      birdRef.current.velocity = FLAP_STRENGTH;
    }
  }, [gameState]);

  const gameLoop = useCallback(
    (deltaTime: number) => {
      const { width, height } = sizeRef.current;
      if (width === 0) return;

      const speed = deltaTime / 16;
      const bird = birdRef.current;

      // Update bird
      bird.velocity += GRAVITY * speed;
      bird.y += bird.velocity * speed;

      // Ground/ceiling collision
      if (bird.y < BIRD_SIZE / 2 || bird.y > height - 20 - BIRD_SIZE / 2) {
        if (score > bestScore) {
          setBestScore(score);
          localStorage.setItem("flappy-best", score.toString());
        }
        setGameState("gameover");
        return;
      }

      // Update pipes
      frameRef.current++;
      if (frameRef.current % 100 === 0) {
        const gapY = 80 + Math.random() * (height - 200);
        pipesRef.current.push({ x: width, gapY, passed: false });
      }

      const birdX = width * 0.25;

      pipesRef.current = pipesRef.current.filter((pipe) => {
        pipe.x -= PIPE_SPEED * speed;

        // Check collision
        if (pipe.x < birdX + BIRD_SIZE / 2 && pipe.x + PIPE_WIDTH > birdX - BIRD_SIZE / 2) {
          if (
            bird.y - BIRD_SIZE / 2 < pipe.gapY - PIPE_GAP / 2 ||
            bird.y + BIRD_SIZE / 2 > pipe.gapY + PIPE_GAP / 2
          ) {
            if (score > bestScore) {
              setBestScore(score);
              localStorage.setItem("flappy-best", score.toString());
            }
            setGameState("gameover");
            return true;
          }
        }

        // Score
        if (!pipe.passed && pipe.x + PIPE_WIDTH < birdX) {
          pipe.passed = true;
          setScore((s) => s + 1);
        }

        return pipe.x > -PIPE_WIDTH;
      });

      draw();
    },
    [draw, score, bestScore]
  );

  useGameLoop(gameLoop, gameState === "playing" && isActive);

  const startGame = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const size = Math.min(container.clientWidth, container.clientHeight) - 16;
    sizeRef.current = { width: size, height: size };

    birdRef.current = { y: size / 2, velocity: 0 };
    pipesRef.current = [];
    frameRef.current = 0;
    setScore(0);
    setGameState("playing");
    draw();
  }, [draw]);

  // Controls
  useKeyboardControls([" "], flap, gameState === "playing" && isActive);
  useClickControl(containerRef, flap, gameState === "playing" && isActive);

  // Pause when not active
  useEffect(() => {
    if (!isActive && gameState === "playing") {
      queueMicrotask(() => setGameState("paused"));
    }
  }, [isActive, gameState]);

  // Initial draw
  useEffect(() => {
    if (containerRef.current) {
      const size =
        Math.min(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        ) - 16;
      sizeRef.current = { width: size, height: size };
      birdRef.current = { y: size / 2, velocity: 0 };
      draw();
    }
  }, [draw]);

  return (
    <GameWrapper
      gameName="Flappy"
      instructions="Click or press Space to fly"
      gameState={gameState}
      score={score}
      bestScore={bestScore}
      onStart={startGame}
      onRestart={startGame}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center p-2"
      >
        <canvas ref={canvasRef} className="rounded" />
      </div>
    </GameWrapper>
  );
}
