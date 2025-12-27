"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GameWrapper } from "./GameWrapper";
import { GameState, GameProps } from "./types";
import { useGameLoop } from "./hooks/useGameLoop";
import { useKeyboardControls, useClickControl } from "./hooks/useControls";

const GRAVITY = 0.6;
const JUMP_STRENGTH = -12;
const DINO_WIDTH = 30;
const DINO_HEIGHT = 40;
const GROUND_HEIGHT = 30;
const INITIAL_SPEED = 5;
const SPEED_INCREMENT = 0.001;

interface Obstacle {
  x: number;
  width: number;
  height: number;
}

export function DinoRun({ isActive }: GameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    if (typeof window === "undefined") return 0;
    const saved = localStorage.getItem("dino-best");
    return saved ? parseInt(saved) : 0;
  });

  const dinoRef = useRef({ y: 0, velocity: 0, isJumping: false });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const speedRef = useRef(INITIAL_SPEED);
  const sizeRef = useRef({ width: 0, height: 0 });
  const distanceRef = useRef(0);
  const lastObstacleRef = useRef(0);

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

    const groundY = size - GROUND_HEIGHT;

    // Clear
    ctx.fillStyle = secondary;
    ctx.fillRect(0, 0, size, size);

    // Draw ground
    ctx.strokeStyle = foreground;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(size, groundY);
    ctx.stroke();

    // Draw dino
    const dino = dinoRef.current;
    ctx.fillStyle = foreground;
    ctx.fillRect(
      50,
      groundY - DINO_HEIGHT - dino.y,
      DINO_WIDTH,
      DINO_HEIGHT
    );

    // Draw obstacles
    obstaclesRef.current.forEach((obstacle) => {
      ctx.fillRect(
        obstacle.x,
        groundY - obstacle.height,
        obstacle.width,
        obstacle.height
      );
    });
  }, []);

  const jump = useCallback(() => {
    const dino = dinoRef.current;
    if (!dino.isJumping && gameState === "playing") {
      dino.velocity = JUMP_STRENGTH;
      dino.isJumping = true;
    }
  }, [gameState]);

  const gameLoop = useCallback(
    (deltaTime: number) => {
      const { width, height } = sizeRef.current;
      if (width === 0) return;

      const speed = deltaTime / 16;
      const dino = dinoRef.current;
      const groundY = height - GROUND_HEIGHT;

      // Update dino physics
      if (dino.isJumping) {
        dino.velocity += GRAVITY * speed;
        dino.y -= dino.velocity * speed;

        if (dino.y <= 0) {
          dino.y = 0;
          dino.velocity = 0;
          dino.isJumping = false;
        }
      }

      // Update speed
      speedRef.current += SPEED_INCREMENT * speed;

      // Spawn obstacles
      distanceRef.current += speedRef.current * speed;
      const minGap = 150 + Math.random() * 150;

      if (distanceRef.current - lastObstacleRef.current > minGap) {
        const height = 20 + Math.random() * 30;
        obstaclesRef.current.push({
          x: width,
          width: 15 + Math.random() * 15,
          height,
        });
        lastObstacleRef.current = distanceRef.current;
      }

      // Update obstacles and check collision
      const dinoLeft = 50;
      const dinoRight = 50 + DINO_WIDTH;
      const dinoBottom = groundY - dino.y;

      obstaclesRef.current = obstaclesRef.current.filter((obstacle) => {
        obstacle.x -= speedRef.current * speed;

        // Collision detection
        const obstacleLeft = obstacle.x;
        const obstacleRight = obstacle.x + obstacle.width;
        const obstacleTop = groundY - obstacle.height;

        if (
          dinoRight > obstacleLeft &&
          dinoLeft < obstacleRight &&
          dinoBottom > obstacleTop
        ) {
          const finalScore = Math.floor(distanceRef.current / 10);
          setScore(finalScore);
          if (finalScore > bestScore) {
            setBestScore(finalScore);
            localStorage.setItem("dino-best", finalScore.toString());
          }
          setGameState("gameover");
          return true;
        }

        return obstacle.x > -obstacle.width;
      });

      // Update score display
      setScore(Math.floor(distanceRef.current / 10));

      draw();
    },
    [draw, bestScore]
  );

  useGameLoop(gameLoop, gameState === "playing" && isActive);

  const startGame = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const size = Math.min(container.clientWidth, container.clientHeight) - 16;
    sizeRef.current = { width: size, height: size };

    dinoRef.current = { y: 0, velocity: 0, isJumping: false };
    obstaclesRef.current = [];
    speedRef.current = INITIAL_SPEED;
    distanceRef.current = 0;
    lastObstacleRef.current = 0;
    setScore(0);
    setGameState("playing");
    draw();
  }, [draw]);

  // Controls
  useKeyboardControls([" ", "ArrowUp"], jump, gameState === "playing" && isActive);
  useClickControl(containerRef, jump, gameState === "playing" && isActive);

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
      draw();
    }
  }, [draw]);

  return (
    <GameWrapper
      gameName="Dino Run"
      instructions="Click or press Space to jump"
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
