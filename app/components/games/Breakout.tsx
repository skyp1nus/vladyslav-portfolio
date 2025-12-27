"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GameWrapper } from "./GameWrapper";
import { GameState, GameProps } from "./types";
import { useGameLoop } from "./hooks/useGameLoop";
import { useMousePosition, useClickControl } from "./hooks/useControls";

const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;
const BALL_RADIUS = 6;
const BRICK_ROWS = 4;
const BRICK_COLS = 7;
const BRICK_HEIGHT = 15;
const BRICK_GAP = 4;

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  alive: boolean;
  color: string;
}

const BRICK_COLORS = [
  "#8B5CF6", // purple
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // yellow
];

export function Breakout({ isActive }: GameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    if (typeof window === "undefined") return 0;
    const saved = localStorage.getItem("breakout-best");
    return saved ? parseInt(saved) : 0;
  });

  const ballRef = useRef({ x: 0, y: 0, vx: 4, vy: -4 });
  const paddleXRef = useRef(0);
  const bricksRef = useRef<Brick[]>([]);
  const gameStartedRef = useRef(false);
  const sizeRef = useRef({ width: 0, height: 0 });

  const getMousePosition = useMousePosition(
    containerRef,
    gameState === "playing" && isActive
  );

  const initBricks = useCallback((canvasWidth: number) => {
    const bricks: Brick[] = [];
    const brickWidth =
      (canvasWidth - BRICK_GAP * (BRICK_COLS + 1)) / BRICK_COLS;

    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks.push({
          x: BRICK_GAP + col * (brickWidth + BRICK_GAP),
          y: 40 + row * (BRICK_HEIGHT + BRICK_GAP),
          width: brickWidth,
          height: BRICK_HEIGHT,
          alive: true,
          color: BRICK_COLORS[row % BRICK_COLORS.length],
        });
      }
    }
    return bricks;
  }, []);

  const resetBall = useCallback(() => {
    const { width, height } = sizeRef.current;
    ballRef.current = {
      x: width / 2,
      y: height - 60,
      vx: (Math.random() > 0.5 ? 1 : -1) * 4,
      vy: -4,
    };
    gameStartedRef.current = false;
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
    sizeRef.current = { width: size, height: size };

    const styles = getComputedStyle(document.documentElement);
    const foreground = styles.getPropertyValue("--foreground").trim();

    // Clear
    ctx.fillStyle = styles.getPropertyValue("--secondary").trim();
    ctx.fillRect(0, 0, size, size);

    // Draw bricks
    bricksRef.current.forEach((brick) => {
      if (brick.alive) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      }
    });

    // Draw paddle
    const paddleX = Math.max(
      0,
      Math.min(paddleXRef.current - PADDLE_WIDTH / 2, size - PADDLE_WIDTH)
    );
    ctx.fillStyle = foreground;
    ctx.fillRect(paddleX, size - 30, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    const ball = ballRef.current;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = foreground;
    ctx.fill();
  }, []);

  const gameLoop = useCallback(
    (deltaTime: number) => {
      const { width, height } = sizeRef.current;
      if (width === 0) return;

      // Update paddle position
      const mousePos = getMousePosition();
      paddleXRef.current = mousePos.x;

      if (!gameStartedRef.current) {
        // Ball follows paddle before launch
        ballRef.current.x = Math.max(
          BALL_RADIUS,
          Math.min(mousePos.x, width - BALL_RADIUS)
        );
        ballRef.current.y = height - 60;
        draw();
        return;
      }

      const ball = ballRef.current;
      const speed = deltaTime / 16; // Normalize to ~60fps

      // Update ball position
      ball.x += ball.vx * speed;
      ball.y += ball.vy * speed;

      // Wall collisions
      if (ball.x - BALL_RADIUS <= 0 || ball.x + BALL_RADIUS >= width) {
        ball.vx = -ball.vx;
        ball.x = Math.max(BALL_RADIUS, Math.min(ball.x, width - BALL_RADIUS));
      }
      if (ball.y - BALL_RADIUS <= 0) {
        ball.vy = -ball.vy;
        ball.y = BALL_RADIUS;
      }

      // Paddle collision
      const paddleX = Math.max(
        0,
        Math.min(paddleXRef.current - PADDLE_WIDTH / 2, width - PADDLE_WIDTH)
      );
      if (
        ball.y + BALL_RADIUS >= height - 30 &&
        ball.y + BALL_RADIUS <= height - 30 + PADDLE_HEIGHT &&
        ball.x >= paddleX &&
        ball.x <= paddleX + PADDLE_WIDTH
      ) {
        ball.vy = -Math.abs(ball.vy);
        // Add some angle based on where it hit the paddle
        const hitPos = (ball.x - paddleX) / PADDLE_WIDTH;
        ball.vx = (hitPos - 0.5) * 8;
      }

      // Ball fell below
      if (ball.y > height) {
        if (score > bestScore) {
          setBestScore(score);
          localStorage.setItem("breakout-best", score.toString());
        }
        setGameState("gameover");
        return;
      }

      // Brick collisions
      let hitBrick = false;
      bricksRef.current.forEach((brick) => {
        if (!brick.alive) return;
        if (
          ball.x + BALL_RADIUS > brick.x &&
          ball.x - BALL_RADIUS < brick.x + brick.width &&
          ball.y + BALL_RADIUS > brick.y &&
          ball.y - BALL_RADIUS < brick.y + brick.height
        ) {
          brick.alive = false;
          hitBrick = true;
          setScore((s) => s + 10);
        }
      });

      if (hitBrick) {
        ball.vy = -ball.vy;
      }

      // Check win
      if (bricksRef.current.every((b) => !b.alive)) {
        if (score > bestScore) {
          setBestScore(score);
          localStorage.setItem("breakout-best", score.toString());
        }
        setGameState("gameover");
        return;
      }

      draw();
    },
    [draw, getMousePosition, score, bestScore]
  );

  useGameLoop(gameLoop, gameState === "playing" && isActive);

  const startGame = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const size = Math.min(container.clientWidth, container.clientHeight) - 16;
    sizeRef.current = { width: size, height: size };

    bricksRef.current = initBricks(size);
    paddleXRef.current = size / 2;
    resetBall();
    setScore(0);
    setGameState("playing");
    draw();
  }, [initBricks, resetBall, draw]);

  // Launch ball on click
  useClickControl(
    containerRef,
    () => {
      if (!gameStartedRef.current && gameState === "playing") {
        gameStartedRef.current = true;
      }
    },
    gameState === "playing" && isActive
  );

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
      bricksRef.current = initBricks(size);
      resetBall();
      draw();
    }
  }, [initBricks, resetBall, draw]);

  return (
    <GameWrapper
      gameName="Breakout"
      instructions="Move mouse/finger to control paddle"
      gameState={gameState}
      score={score}
      bestScore={bestScore}
      onStart={startGame}
      onRestart={startGame}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center p-2 cursor-none"
      >
        <canvas ref={canvasRef} className="rounded" />
      </div>
    </GameWrapper>
  );
}
