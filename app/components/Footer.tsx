export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-4">
      <div className="max-w-[1280px] mx-auto py-5 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[12px] font-light text-[var(--muted-foreground)]">
        <span>© 2026 Vladyslav Yeromenko</span>
        <span className="font-mono">Next.js · Tailwind · GitHub Pages</span>
      </div>
    </footer>
  );
}
