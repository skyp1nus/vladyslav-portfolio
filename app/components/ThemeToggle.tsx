"use client";

import { Icon } from "./Icons";

export function ThemeToggle() {
  const toggle = () => {
    const el = document.documentElement;
    const explicit = el.dataset.theme;
    const isDark = explicit
      ? explicit === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = isDark ? "light" : "dark";
    el.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      className="w-10 h-10 flex items-center justify-center rounded-full text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors cursor-pointer"
    >
      {/* which icon shows is driven by CSS, so no hydration flash */}
      <span className="theme-icon-moon">
        <Icon name="moon" size={20} />
      </span>
      <span className="theme-icon-sun">
        <Icon name="sun" size={20} />
      </span>
    </button>
  );
}
