"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GameWrapper } from "./GameWrapper";
import { GameState, GameProps, Direction } from "./types";
import { useKeyboardControls, useSwipeControls } from "./hooks/useControls";

const GRID_SIZE = 15;
const TICK_INTERVAL = 150;

interface Point {
  x: number;
  y: number;
}

export function Snake({ isActive }: GameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    if (typeof window === "undefined") return 0;
    const saved = localStorage.getItem("snake-best");
    return saved ? parseInt(saved) : 0;
  });

  const snakeRef = useRef<Point[]>([{ x: 7, y: 7 }]);
  const directionRef = useRef<Direction>("right");
  const nextDirectionRef = useRef<Direction>("right");
  const foodRef = useRef<Point>({ x: 10, y: 7 });
  const tickRef = useRef<NodeJS.Timeout | null>(null);

  const spawnFood = useCallback(() => {
    const snake = snakeRef.current;
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some((s) => s.x === newFood.x && s.y === newFood.y));
    foodRef.current = newFood;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = Math.min(container.clientWidth, container.clientHeight) - 16;
    canvas.width = size;
    canvas.height = size;

    const cellSize = size / GRID_SIZE;

    // Get CSS variable colors
    const styles = getComputedStyle(document.documentElement);
    const foreground = styles.getPropertyValue("--foreground").trim();

    // Clear
    ctx.fillStyle = styles.getPropertyValue("--secondary").trim();
    ctx.fillRect(0, 0, size, size);

    // Draw grid lines (subtle)
    ctx.strokeStyle = `color-mix(in srgb, ${foreground} 10%, transparent)`;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(size, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    ctx.fillStyle = foreground;
    snakeRef.current.forEach((segment, index) => {
      const padding = index === 0 ? 1 : 2;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
    });

    // Draw food
    ctx.fillStyle = "#3B82F6";
    const food = foodRef.current;
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }, []);

  const gameOver = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem("snake-best", score.toString());
    }
    setGameState("gameover");
  }, [score, bestScore]);

  const tick = useCallback(() => {
    const snake = snakeRef.current;
    const direction = nextDirectionRef.current;
    directionRef.current = direction;

    const head = { ...snake[0] };

    switch (direction) {
      case "up":
        head.y--;
        break;
      case "down":
        head.y++;
        break;
      case "left":
        head.x--;
        break;
      case "right":
        head.x++;
        break;
    }

    // Check wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      gameOver();
      return;
    }

    // Check self collision
    if (snake.some((s) => s.x === head.x && s.y === head.y)) {
      gameOver();
      return;
    }

    snake.unshift(head);

    // Check food collision
    const food = foodRef.current;
    if (head.x === food.x && head.y === food.y) {
      setScore((s) => s + 1);
      spawnFood();
    } else {
      snake.pop();
    }

    draw();
  }, [draw, gameOver, spawnFood]);

  const startGame = useCallback(() => {
    snakeRef.current = [{ x: 7, y: 7 }];
    directionRef.current = "right";
    nextDirectionRef.current = "right";
    spawnFood();
    setScore(0);
    setGameState("playing");

    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(tick, TICK_INTERVAL);
    draw();
  }, [tick, draw, spawnFood]);

  const handleDirection = useCallback((newDir: Direction) => {
    const current = directionRef.current;
    const opposites: Record<Direction, Direction> = {
      up: "down",
      down: "up",
      left: "right",
      right: "left",
    };
    if (newDir !== opposites[current]) {
      nextDirectionRef.current = newDir;
    }
  }, []);

  // Keyboard controls
  useKeyboardControls(
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"],
    (key) => {
      const map: Record<string, Direction> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      handleDirection(map[key]);
    },
    gameState === "playing" && isActive
  );

  // Swipe controls
  useSwipeControls(
    containerRef,
    { onSwipe: handleDirection },
    gameState === "playing" && isActive
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  // Pause when not active
  useEffect(() => {
    if (!isActive && gameState === "playing") {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      queueMicrotask(() => setGameState("paused"));
    }
  }, [isActive, gameState]);

  // Initial draw
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <GameWrapper
      gameName="Snake"
      instructions="Arrow keys or swipe to move"
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
