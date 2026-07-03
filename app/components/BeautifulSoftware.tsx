"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState, type ReactElement } from "react";
import { Icon } from "./Icons";
import { Reveal } from "./Reveal";

/* ---------- Stylized product mockups (illustrations, swap for real shots later) ---------- */

function TerminalMockup() {
  return (
    <div className="w-[80%] max-w-[300px] rounded-xl bg-[#1b1b20] ring-1 ring-white/10 shadow-2xl overflow-hidden">
      <div className="flex items-center gap-1.5 px-3.5 h-8 bg-white/[0.04] border-b border-white/5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
        <span className="ml-2 text-[9px] font-mono text-zinc-500">
          wayheart — claude
        </span>
      </div>
      <div className="p-4 font-mono text-[10px] leading-relaxed">
        <p>
          <span className="text-emerald-400">$</span>{" "}
          <span className="text-zinc-300">
            claude &quot;refactor SaveSystem.cs&quot;
          </span>
        </p>
        <p className="text-zinc-500 mt-1.5">
          ⏺ Reading Assets/Scripts/SaveSystem.cs…
        </p>
        <p className="mt-2">
          <span className="inline-flex items-center gap-1 rounded bg-orange-400/10 text-orange-300 px-1.5 py-0.5 text-[9px]">
            ⚙ mcp · project-kb
          </span>
        </p>
        <div className="mt-2.5 space-y-1.5">
          <div className="h-1.5 w-4/5 rounded-full bg-zinc-700/70" />
          <div className="h-1.5 w-3/5 rounded-full bg-zinc-700/70" />
          <div className="h-1.5 w-2/3 rounded-full bg-zinc-700/70" />
        </div>
        <p className="mt-2.5 flex items-center text-emerald-400">
          ✓<span className="ml-1.5 text-zinc-500">3 files changed</span>
          <span className="ml-1.5 inline-block w-1.5 h-3 bg-orange-400/90 animate-pulse" />
        </p>
      </div>
    </div>
  );
}

function UnityMockup() {
  const hierarchy = [
    { label: "Main Camera", active: false },
    { label: "Directional Light", active: false },
    { label: "Player", active: true },
    { label: "Set_Cinema", active: false },
    { label: "UI_HUD", active: false },
  ];
  return (
    <div className="w-[84%] max-w-[310px] rounded-xl bg-[#1e1e22] ring-1 ring-white/10 shadow-2xl overflow-hidden">
      {/* Toolbar with play controls */}
      <div className="relative flex items-center h-7 px-2.5 bg-white/[0.04] border-b border-white/5">
        <span className="flex gap-1">
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
        </span>
        <span className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
          <span className="w-5 h-4 rounded-sm bg-sky-500/25 ring-1 ring-sky-400/40 flex items-center justify-center">
            <svg viewBox="0 0 8 8" className="w-2 h-2 text-sky-300" aria-hidden="true">
              <path fill="currentColor" d="M1 0l6 4-6 4z" />
            </svg>
          </span>
          <span className="w-5 h-4 rounded-sm bg-white/5 flex items-center justify-center gap-[2px]">
            <span className="w-[2px] h-2 bg-zinc-500" />
            <span className="w-[2px] h-2 bg-zinc-500" />
          </span>
        </span>
        <span className="ml-auto text-[7px] font-mono text-zinc-500">
          Artman.unity
        </span>
      </div>
      <div className="flex">
        {/* Hierarchy */}
        <div className="w-[27%] border-r border-white/5 py-1.5 px-1">
          <p className="text-[6.5px] font-mono text-zinc-500 px-1 pb-1 uppercase tracking-wider">
            Hierarchy
          </p>
          {hierarchy.map((row) => (
            <p
              key={row.label}
              className={`text-[6.5px] font-mono truncate rounded-sm px-1 py-[2.5px] ${
                row.active
                  ? "bg-sky-500/20 text-sky-200"
                  : "text-zinc-400"
              }`}
            >
              <span className="text-zinc-600">▸ </span>
              {row.label}
            </p>
          ))}
        </div>
        {/* Scene view */}
        <div className="relative flex-1 aspect-[16/11] bg-gradient-to-b from-indigo-950 via-purple-900 to-rose-900 overflow-hidden">
          {/* spotlight cone over the set */}
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 w-16 h-16 bg-amber-100/15"
            style={{ clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)" }}
          />
          {/* floor */}
          <div className="absolute bottom-0 inset-x-0 h-4 bg-black/50" />
          {/* player object with move gizmo */}
          <div className="absolute left-1/2 bottom-3 -translate-x-1/2 w-4 h-6 rounded-[3px] bg-zinc-300/85" />
          <svg
            viewBox="0 0 40 40"
            className="absolute left-1/2 bottom-6 -translate-x-1/2 w-9 h-9"
            aria-hidden="true"
          >
            <line x1="20" y1="20" x2="20" y2="4" stroke="#4ade80" strokeWidth="1.6" />
            <path d="M20 0l3 5h-6z" fill="#4ade80" />
            <line x1="20" y1="20" x2="36" y2="20" stroke="#f87171" strokeWidth="1.6" />
            <path d="M40 20l-5 3v-6z" fill="#f87171" />
            <line x1="20" y1="20" x2="9" y2="29" stroke="#60a5fa" strokeWidth="1.6" />
            <path d="M6 31.5l5.5-1-3.5-4z" fill="#60a5fa" />
          </svg>
          <span className="absolute top-1 right-1.5 text-[6.5px] font-mono text-zinc-300/80">
            Game · 60 fps
          </span>
        </div>
        {/* Inspector */}
        <div className="w-[27%] border-l border-white/5 py-1.5 px-1.5">
          <p className="text-[6.5px] font-mono text-zinc-500 pb-1 uppercase tracking-wider">
            Inspector
          </p>
          <p className="text-[6.5px] font-mono text-zinc-300">▾ Transform</p>
          <div className="grid grid-cols-3 gap-[3px] mt-1">
            {["X", "Y", "Z"].map((axis) => (
              <span
                key={axis}
                className="h-2.5 rounded-sm bg-white/5 ring-1 ring-white/10 text-[5.5px] font-mono text-zinc-500 flex items-center justify-center"
              >
                {axis}
              </span>
            ))}
          </div>
          <p className="text-[6.5px] font-mono text-zinc-300 mt-1.5">
            ▾ Animator
          </p>
          <div className="mt-1 h-1 rounded-full bg-white/10">
            <div className="h-full w-2/3 rounded-full bg-sky-400/70" />
          </div>
          <div className="mt-1.5 flex items-center gap-1">
            <span className="w-2 h-2 rounded-[2px] bg-sky-500/60 ring-1 ring-sky-300/50" />
            <span className="h-1 w-8 rounded-full bg-zinc-700" />
          </div>
        </div>
      </div>
      {/* Status bar */}
      <div className="flex items-center justify-between h-5 px-2.5 bg-white/[0.03] border-t border-white/5">
        <span className="text-[6.5px] font-mono text-zinc-500">
          Console · 0 errors · 2 warnings
        </span>
        <span className="text-[6.5px] font-mono text-emerald-400">
          ▶ Playing
        </span>
      </div>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="w-[80%] max-w-[300px] rounded-xl bg-[#1b1b20] ring-1 ring-white/10 shadow-2xl overflow-hidden flex">
      <div className="w-9 shrink-0 border-r border-white/5 bg-white/[0.03] py-3 flex flex-col items-center gap-2">
        <span className="w-4 h-4 rounded bg-blue-400/80" />
        <span className="w-4 h-4 rounded bg-zinc-700/70" />
        <span className="w-4 h-4 rounded bg-zinc-700/70" />
        <span className="w-4 h-4 rounded bg-zinc-700/70" />
      </div>
      <div className="flex-1 p-3.5">
        <div className="flex items-center justify-between">
          <div className="h-2 w-16 rounded-full bg-zinc-600/80" />
          <span className="rounded-full bg-red-400/15 text-red-300 text-[8px] font-mono px-1.5 py-0.5">
            2 alerts
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 mt-3">
          {["87%", "12", "3.4h"].map((v) => (
            <div key={v} className="rounded-md bg-white/[0.04] p-1.5">
              <div className="h-1 w-6 rounded-full bg-zinc-600/80" />
              <p className="mt-1.5 text-[11px] font-mono text-zinc-300">{v}</p>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 130 42" className="w-full mt-3" aria-hidden="true">
          <polyline
            points="0,34 18,28 36,31 54,18 72,22 90,10 108,14 130,6"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="0,38 18,36 36,37 54,32 72,34 90,28 108,30 130,26"
            fill="none"
            stroke="#3f3f46"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
        </svg>
      </div>
    </div>
  );
}

function FlowMockup() {
  return (
    <div className="w-[80%] max-w-[300px] rounded-xl bg-[#1b1b20] ring-1 ring-white/10 shadow-2xl p-4">
      <svg viewBox="0 0 250 130" className="w-full" aria-hidden="true">
        <path
          d="M62 65 H92"
          stroke="#3f3f46"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M152 55 C 168 40, 172 35, 184 32"
          stroke="#3f3f46"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M152 75 C 168 90, 172 95, 184 98"
          stroke="#3f3f46"
          strokeWidth="1.5"
          fill="none"
        />
        {[
          { x: 14, y: 47, label: "cron", active: false },
          { x: 92, y: 47, label: "triage", active: true },
        ].map((n) => (
          <g key={n.label}>
            <rect
              x={n.x}
              y={n.y}
              width="60"
              height="36"
              rx="9"
              fill="#26262c"
              stroke={n.active ? "rgba(52,211,153,0.5)" : "rgba(255,255,255,0.1)"}
            />
            <circle
              cx={n.x + 12}
              cy={n.y + 18}
              r="3"
              fill={n.active ? "#34d399" : "#52525c"}
            />
            <text
              x={n.x + 22}
              y={n.y + 21.5}
              fontSize="9"
              fontFamily="monospace"
              fill="#a1a1aa"
            >
              {n.label}
            </text>
          </g>
        ))}
        {[
          { x: 184, y: 14, label: "changelog" },
          { x: 184, y: 80, label: "post" },
        ].map((n) => (
          <g key={n.label}>
            <rect
              x={n.x}
              y={n.y}
              width="60"
              height="36"
              rx="9"
              fill="#26262c"
              stroke="rgba(255,255,255,0.1)"
            />
            <circle cx={n.x + 12} cy={n.y + 18} r="3" fill="#52525c" />
            <text
              x={n.x + 20}
              y={n.y + 21.5}
              fontSize="8"
              fontFamily="monospace"
              fill="#a1a1aa"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex items-center justify-between mt-2 text-[9px] font-mono">
        <span className="text-zinc-500">ops · 14 workflows</span>
        <span className="text-emerald-400">● running</span>
      </div>
    </div>
  );
}

function DesktopMockup() {
  return (
    <div className="w-[80%] max-w-[300px] rounded-xl bg-[#1e1e24] ring-1 ring-white/10 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-3.5 h-8 bg-white/[0.04] border-b border-white/5">
        <span className="text-[9px] font-mono text-zinc-400">
          KS Companion
        </span>
        <span className="flex items-center gap-2 text-zinc-500">
          <span className="w-2 h-[2px] bg-current" />
          <span className="w-2 h-2 border border-current" />
          <span className="text-[10px] leading-none">✕</span>
        </span>
      </div>
      <div className="flex">
        <div className="w-1/2 border-r border-white/5 py-2">
          {[false, true, false, false].map((active, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-3 py-2 ${
                active ? "bg-violet-400/10" : ""
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  active ? "bg-violet-400" : "bg-zinc-600"
                }`}
              />
              <span
                className={`h-1.5 rounded-full ${
                  active ? "w-14 bg-zinc-400" : "w-11 bg-zinc-700"
                }`}
              />
            </div>
          ))}
        </div>
        <div className="w-1/2 p-3">
          <div className="h-1.5 w-12 rounded-full bg-zinc-500" />
          {[true, false].map((on, i) => (
            <div key={i} className="flex items-center justify-between mt-3">
              <span className="h-1 w-10 rounded-full bg-zinc-700" />
              <span
                className={`w-6 h-3 rounded-full relative ${
                  on ? "bg-violet-500/80" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-2 h-2 rounded-full bg-zinc-200 ${
                    on ? "right-0.5" : "left-0.5"
                  }`}
                />
              </span>
            </div>
          ))}
          <div className="mt-4 h-5 rounded bg-violet-500/20 border border-violet-400/30 flex items-center justify-center">
            <span className="h-1 w-8 rounded-full bg-violet-300/80" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BrowserMockup() {
  return (
    <div className="w-[80%] max-w-[300px] rounded-xl bg-[#1b1b20] ring-1 ring-white/10 shadow-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-3.5 h-8 bg-white/[0.04] border-b border-white/5">
        <span className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
        </span>
        <span className="flex-1 flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[8px] font-mono text-zinc-400">
          <svg viewBox="0 0 24 24" className="w-2 h-2 text-emerald-400" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"
            />
          </svg>
          yeromenko.dev
        </span>
      </div>
      <div className="px-4 py-6 flex flex-col items-center gap-2.5">
        <span className="rounded-full border border-white/10 px-2 py-0.5 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-emerald-400" />
          <span className="h-1 w-10 rounded-full bg-zinc-700" />
        </span>
        <div className="h-2.5 w-32 rounded-full bg-zinc-200/90 mt-1.5" />
        <div className="h-2.5 w-24 rounded-full bg-zinc-200/90" />
        <div className="h-1.5 w-20 rounded-full bg-zinc-600 mt-1" />
        <div className="flex gap-2 mt-3">
          <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500/50 to-blue-600/50" />
          <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500/50 to-fuchsia-600/50" />
          <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/50 to-teal-600/50" />
        </div>
      </div>
    </div>
  );
}

/* ---------- Gallery data ---------- */

interface Product {
  id: string;
  name: string;
  tag: string;
  year: string;
  glow: string;
  mockup: ReactElement;
}

const products: Product[] = [
  {
    id: "artman",
    name: "Artman",
    tag: "Unity · C#",
    year: "2023 —",
    glow: "rgba(129, 140, 248, 0.16)",
    mockup: <UnityMockup />,
  },
  {
    id: "assistant",
    name: "AI Dev Assistant",
    tag: "Claude API · MCP",
    year: "2024 —",
    glow: "rgba(251, 146, 60, 0.14)",
    mockup: <TerminalMockup />,
  },
  {
    id: "ks",
    name: "KS Monitor",
    tag: "ASP.NET Core · Angular",
    year: "2020 — 22",
    glow: "rgba(96, 165, 250, 0.15)",
    mockup: <DashboardMockup />,
  },
  {
    id: "ops",
    name: "Ops Automation",
    tag: "n8n · Make · Zapier",
    year: "2024 —",
    glow: "rgba(52, 211, 153, 0.13)",
    mockup: <FlowMockup />,
  },
  {
    id: "companion",
    name: "KS Companion",
    tag: "WPF · MVVM",
    year: "2020 — 22",
    glow: "rgba(167, 139, 250, 0.15)",
    mockup: <DesktopMockup />,
  },
  {
    id: "site",
    name: "yeromenko.dev",
    tag: "Next.js · Tailwind",
    year: "2025 —",
    glow: "rgba(56, 189, 248, 0.14)",
    mockup: <BrowserMockup />,
  },
];

export function BeautifulSoftware() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const updateScrollState = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    requestAnimationFrame(updateScrollState);

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section id="work" className="flex flex-col gap-4 py-16">
      {/* Title and description */}
      <div className="px-4 max-w-[1248px] mx-auto w-full">
        <div className="md:ml-[17%]">
          <Reveal>
            <h3 className="text-3xl sm:text-4xl md:text-[45px] font-extrabold leading-[1.07] tracking-tight text-[var(--foreground)] max-w-[500px]">
              <span className="block">A gallery of work</span>
              <span className="block">worth remembering</span>
            </h3>
          </Reveal>
        </div>
        <div className="mt-16 md:mt-[128px] md:ml-[60%]">
          <Reveal>
            <p className="text-[15px] font-light leading-[1.74] tracking-wide text-[var(--muted)] max-w-[500px]">
              Every project tells a story. I believe that{" "}
              <span className="font-bold">craft and intention</span> turn good
              work into something that stays with people long after
              they&apos;ve moved on.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Carousel - extends beyond screen on the right */}
      <div className="w-full mt-8 overflow-hidden">
        <div
          className="embla"
          ref={emblaRef}
          style={{
            paddingLeft: "max(16px, calc((100vw - 1280px) / 2 + 16px))",
          }}
        >
          <div className="flex gap-4">
            {products.map((item, index) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-[300px] sm:w-[350px] md:w-[400px] aspect-square"
              >
                <figure className="relative w-full h-full rounded-2xl overflow-hidden bg-[var(--secondary)] border border-[var(--border)] select-none">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(120% 90% at 50% 0%, ${item.glow} 0%, transparent 60%)`,
                    }}
                  />
                  <span className="absolute top-4 right-5 text-[11px] font-mono text-[var(--muted-foreground)]">
                    0{index + 1}
                  </span>
                  <div className="absolute inset-x-0 top-0 bottom-16 flex items-center justify-center">
                    {item.mockup}
                  </div>
                  <figcaption className="absolute inset-x-0 bottom-0 p-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[var(--foreground)] text-lg font-semibold tracking-tight">
                          {item.name}
                        </p>
                        <p className="text-[11px] font-mono text-[var(--muted-foreground)] mt-0.5">
                          {item.tag}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-[var(--muted-foreground)]">
                        {item.year}
                      </span>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
            <div className="flex-shrink-0 w-4" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-end gap-3 px-4 max-w-[1280px] mx-auto mt-6">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous projects"
            className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] transition-all enabled:hover:border-[var(--muted-foreground)] enabled:cursor-pointer disabled:opacity-35"
          >
            <Icon name="arrowLeft" size={18} />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next projects"
            className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] transition-all enabled:hover:border-[var(--muted-foreground)] enabled:cursor-pointer disabled:opacity-35"
          >
            <Icon name="arrowRight" size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
