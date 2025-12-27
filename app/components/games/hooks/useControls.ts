import { useEffect, useRef, useCallback } from "react";
import { Direction } from "../types";

interface SwipeCallbacks {
  onSwipe?: (direction: Direction) => void;
  onTap?: () => void;
}

export function useSwipeControls(
  containerRef: React.RefObject<HTMLElement | null>,
  callbacks: SwipeCallbacks,
  isActive: boolean
) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const threshold = 30;

    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;

      if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
        callbacks.onTap?.();
      } else if (Math.abs(dx) > Math.abs(dy)) {
        callbacks.onSwipe?.(dx > 0 ? "right" : "left");
      } else {
        callbacks.onSwipe?.(dy > 0 ? "down" : "up");
      }

      touchStart.current = null;
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isActive, callbacks, containerRef]);
}

export function useKeyboardControls(
  keys: string[],
  callback: (key: string) => void,
  isActive: boolean
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (keys.includes(e.key)) {
        e.preventDefault();
        callbackRef.current(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, keys]);
}

export function useClickControl(
  containerRef: React.RefObject<HTMLElement | null>,
  callback: () => void,
  isActive: boolean
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    const handleClick = () => {
      callbackRef.current();
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [isActive, containerRef]);
}

export function useMousePosition(
  containerRef: React.RefObject<HTMLElement | null>,
  isActive: boolean
) {
  const position = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      position.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = container.getBoundingClientRect();
      position.current = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchmove", handleTouchMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isActive, containerRef]);

  return useCallback(() => position.current, []);
}
