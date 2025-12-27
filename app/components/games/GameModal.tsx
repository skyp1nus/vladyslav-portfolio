"use client";

import { useEffect, useCallback, useRef, ComponentType } from "react";
import { createPortal } from "react-dom";
import { animate } from "animejs";
import { GameProps } from "./types";

interface GameModalProps {
  game: {
    id: string;
    name: string;
    component: ComponentType<GameProps>;
  };
  onClose: () => void;
}

export function GameModal({ game, onClose }: GameModalProps) {
  const GameComponent = game.component;
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);

  // Animate close and then call onClose
  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    // Animate exit
    if (modalRef.current) {
      animate(modalRef.current, {
        scale: [1, 0.9],
        opacity: [1, 0],
        translateY: [0, 30],
        duration: 300,
        ease: "inQuart",
      });
    }

    if (backdropRef.current) {
      animate(backdropRef.current, {
        opacity: [1, 0],
        duration: 300,
        ease: "inQuart",
        onComplete: () => {
          onClose();
        },
      });
    }
  }, [onClose]);

  // Close on ESC
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    },
    [handleClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    // Animate entrance
    if (backdropRef.current) {
      animate(backdropRef.current, {
        opacity: [0, 1],
        duration: 400,
        ease: "outQuart",
      });
    }

    if (modalRef.current) {
      animate(modalRef.current, {
        scale: [0.85, 1],
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 700,
        ease: "outElastic(1, 0.7)",
      });
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  // Close when clicking backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return createPortal(
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      style={{ opacity: 0 }}
      onClick={handleBackdropClick}
    >
      {/* Modal content */}
      <div
        ref={modalRef}
        className="relative w-[90vw] h-[80vh] max-w-[800px] max-h-[800px]"
        style={{ opacity: 0 }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors text-sm flex items-center gap-2"
        >
          <span>ESC to close</span>
          <span className="text-xl">&times;</span>
        </button>

        {/* Game container */}
        <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl">
          <GameComponent isActive={true} />
        </div>
      </div>
    </div>,
    document.body
  );
}
