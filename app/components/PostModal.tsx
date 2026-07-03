"use client";

import { useEffect, useRef } from "react";
import { Icon } from "./Icons";
import { Markdown } from "./Markdown";
import type { Post } from "../content/hello-world";

export function PostModal({
  post,
  onClose,
}: {
  post: Post;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
      className="fixed inset-0 z-[100] overflow-y-auto bg-[var(--background)] animate-fade-in"
    >
      {/* Top bar */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-8 h-16"
        style={{
          background:
            "linear-gradient(to bottom, var(--background) 60%, transparent)",
        }}
      >
        <span className="font-mono text-xs text-[var(--muted-foreground)]">
          yeromenko.dev / writing
        </span>
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close post"
          className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors cursor-pointer"
        >
          <Icon name="close" size={20} />
        </button>
      </div>

      <article className="max-w-[720px] mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-28 animate-slide-up">
        <header className="mb-12">
          <div className="flex items-center gap-3 font-mono text-[13px] text-[var(--muted-foreground)]">
            <time dateTime={post.date}>{post.dateLabel}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight leading-[1.05] text-[var(--foreground)]">
            {post.title}
          </h1>
        </header>
        <div className="prose-post">
          <Markdown source={post.markdown} />
        </div>
      </article>
    </div>
  );
}
