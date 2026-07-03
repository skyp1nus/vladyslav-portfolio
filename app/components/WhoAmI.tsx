import { Icon } from "./Icons";

export function WhoAmI() {
  return (
    <section id="about" className="relative min-h-[100svh] px-4 pt-28 pb-12 flex flex-col">
      <div className="max-w-[1280px] mx-auto w-full flex-1 flex flex-col items-center justify-center text-center">
        <div className="hero-in">
          <a
            href="#contact"
            className="inline-flex items-center gap-2.5 rounded-full border border-[var(--border)] px-4 py-1.5 mb-9 text-[12px] tracking-wide text-[var(--muted)] hover:border-[var(--muted-foreground)] transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Open to AI agent &amp; .NET roles
          </a>
        </div>

        <div className="hero-in" style={{ animationDelay: "120ms" }}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-[var(--foreground)]">
            <span className="block font-black">
              .NET Developer <span className="font-light">&amp;</span> Fullstack
            </span>
            <span className="block font-black">
              AI <span className="text-[var(--accent)]">Agent</span> Engineer
            </span>
          </h1>
        </div>

        <div className="hero-in" style={{ animationDelay: "240ms" }}>
          <p className="mt-8 text-lg md:text-xl font-extralight text-[var(--muted)]">
            Shipping features end-to-end — from backend to AI agents.
          </p>
        </div>
      </div>

      {/* Short bio pinned to the bottom right */}
      <div className="max-w-[1280px] mx-auto w-full">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-start-10 md:col-span-3">
            <div className="hero-in" style={{ animationDelay: "360ms" }}>
              <p className="text-[12px] font-light leading-[1.7] tracking-wide text-[var(--muted)]">
                Fullstack generalist comfortable owning a feature end-to-end —
                from database schema and C# services to UI and deployment. The
                last two years shifted toward building AI agents and automation
                that save real engineering hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block text-[var(--muted-foreground)]"
      >
        <Icon name="chevronDown" size={22} className="animate-float-down" />
      </div>
    </section>
  );
}
