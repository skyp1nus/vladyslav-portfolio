export type GameState = "idle" | "playing" | "paused" | "gameover";

export interface GameProps {
  isActive: boolean;
}

export interface GameScore {
  current: number;
  best: number;
}

export type Direction = "up" | "down" | "left" | "right";
