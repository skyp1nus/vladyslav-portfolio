import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-24 pointer-events-none">
      <div className="relative w-full h-full">
        {/* Blurred background fading out toward the bottom */}
        <div
          className="absolute inset-0 backdrop-blur-md"
          style={{
            background: `linear-gradient(to bottom,
              var(--background) 0%,
              color-mix(in srgb, var(--background) 75%, transparent) 55%,
              transparent 100%
            )`,
            maskImage: `linear-gradient(to bottom, black 0%, black 50%, transparent 100%)`,
            WebkitMaskImage: `linear-gradient(to bottom, black 0%, black 50%, transparent 100%)`,
          }}
        />

        {/* Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <Link href="/" className="block hover:opacity-70 transition-opacity">
            <span className="text-[28px] font-semibold tracking-tight text-[var(--foreground)] lowercase font-heading">
              yeromenko.dev
            </span>
          </Link>
        </div>

        {/* Theme toggle */}
        <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 pointer-events-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
