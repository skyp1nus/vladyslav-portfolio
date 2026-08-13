"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Icon } from "./Icons";
import { CountUp } from "./CountUp";
import {
  buildModel,
  fetchContributions,
  formatFull,
  formatNumber,
  readCache,
  writeCache,
  type GraphModel,
} from "../lib/contributions";

const WAVE_COL_MS = 17;
const WAVE_MS = 700;
const SKELETON_COLUMNS = 53;
const IDLE_MODES = ["breathe", "twinkle", "drift"] as const;

/** Deterministic 0–1 from the cell index — a real Math.random() here would
 *  differ between the prerender and hydration. */
const seed = (i: number) => (((i * 1103515245 + 12345) >>> 0) % 1000) / 1000;
const TIP_HALF = 160; // half of .gh-tip's width — keeps the clamp exact
const TIP_FLIP_BELOW = 44;

type State =
  | { status: "loading" }
  | { status: "ready"; model: GraphModel }
  | { status: "error" };

type Armed = "false" | "true" | "done";

interface Tip {
  x: number;
  y: number;
  flip: boolean;
  date: string;
  count: number;
}

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function useInView<T extends Element>(rootMargin: string) {
  const ref = useRef<T>(null);
  // No observer (ancient browser, prerender) ⇒ treat everything as visible.
  // Nothing in the tree renders differently either way, so no hydration risk.
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === "undefined"
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return [ref, inView] as const;
}

export function ContributionGraph({ username }: { username: string }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [armed, setArmed] = useState<Armed>("false");
  const [idle, setIdle] = useState<string | null>(null);
  // Tip keeps its last position while hidden, so leaving doesn't fade it toward 0,0
  const [tip, setTip] = useState<Tip | null>(null);
  const [tipShown, setTipShown] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const loadedRef = useRef(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const [rootRef, rootInView] = useInView<HTMLDivElement>("400px 0px");
  const [cellsRef, cellsInView] = useInView<HTMLDivElement>("0px 0px -120px 0px");

  const profileUrl = `https://github.com/${username}`;

  useEffect(() => {
    if (!rootInView || loadedRef.current) return;
    let cancelled = false;

    // A warm cache resolves in a microtask — a return visit never sees the skeleton.
    const cached = readCache(username);
    const source = cached
      ? Promise.resolve(cached)
      : fetchContributions(username);

    source
      .then((raw) => {
        if (cancelled) return;
        loadedRef.current = true;
        if (!cached) writeCache(username, raw);
        setState({ status: "ready", model: buildModel(raw) });
      })
      .catch(() => {
        if (cancelled) return;
        loadedRef.current = true;
        setState({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [rootInView, username, attempt]);

  // Wait out the section's own 700ms reveal before starting the wave.
  useEffect(() => {
    if (state.status !== "ready" || !cellsInView || armed !== "false") return;
    const t = setTimeout(() => setArmed("true"), 280);
    return () => clearTimeout(t);
  }, [state.status, cellsInView, armed]);

  useEffect(() => {
    if (armed !== "true") return;
    const columns =
      state.status === "ready" ? state.model.columns : SKELETON_COLUMNS;
    const total = (columns - 1) * WAVE_COL_MS + WAVE_MS + 60;
    const t = setTimeout(() => {
      setArmed("done");
      // Picked here, not in render — a fresh mode per visit with no mismatch
      setIdle(IDLE_MODES[Math.floor(Math.random() * IDLE_MODES.length)]);
    }, total);
    return () => clearTimeout(t);
  }, [armed, state]);

  // scrollLeft only — scrollIntoView/focus would walk up and yank the page.
  useIsoLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth;
  }, [state.status]);

  const onPointerOver = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>("[data-date]");
    const frame = frameRef.current;
    if (!cell || !frame) {
      setTipShown(false);
      return;
    }
    // Both reads happen before the write — no forced synchronous layout.
    const cr = cell.getBoundingClientRect();
    const fr = frame.getBoundingClientRect();
    const x = cr.left - fr.left + cr.width / 2;
    const y = cr.top - fr.top;

    // On a frame narrower than the tooltip, half collapses to the centre
    const half = Math.min(TIP_HALF, fr.width / 2);

    setTip({
      x: Math.min(Math.max(x, half), fr.width - half),
      y,
      flip: y < TIP_FLIP_BELOW,
      date: cell.dataset.date!,
      count: Number(cell.dataset.count) || 0,
    });
    setTipShown(true);
  }, []);

  const retry = useCallback(() => {
    loadedRef.current = false;
    setState({ status: "loading" });
    setAttempt((a) => a + 1);
  }, []);

  const model = state.status === "ready" ? state.model : null;
  const total = model?.stats.total ?? 0;

  return (
    <div ref={rootRef} className="gh-graph">
      <p
        aria-label={`${
          model ? formatNumber(total) : "Unknown number of"
        } contributions in the last year`}
      >
        <span aria-hidden="true">
          <CountUp
            value={total}
            start={state.status === "ready" && cellsInView}
            className="text-[38px] sm:text-[46px] font-extrabold leading-none tracking-tight text-[var(--foreground)]"
          />
        </span>
        <span className="block mt-2 text-[14px] font-light tracking-wide text-[var(--muted)]">
          contributions in the last year
        </span>
      </p>

      {state.status === "error" ? (
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <p className="text-[13px] font-light text-[var(--muted)]">
            Couldn&apos;t reach the GitHub contributions API.
          </p>
          <button
            onClick={retry}
            className="inline-flex items-center gap-1.5 text-[13px] text-[var(--foreground)] hover:text-[var(--accent)] transition-colors cursor-pointer"
          >
            <Icon name="refresh" size={14} />
            Retry
          </button>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
          >
            <Icon name="github" size={14} />
            View on GitHub
          </a>
        </div>
      ) : (
        <div ref={frameRef} className="relative mt-9">
          <div
            ref={scrollerRef}
            tabIndex={0}
            role="group"
            aria-label="Contribution graph — scroll horizontally to see the full year"
            onPointerOver={onPointerOver}
            onPointerLeave={() => setTipShown(false)}
            // padding + pulled-back margin so a hovered edge cell can grow
            // past the grid without the scroller clipping it
            className="overflow-x-auto overflow-y-hidden -mx-2 px-2 py-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--accent)]"
          >
            <div className="w-max">
              <div className="gh-months mb-2">
                {model?.months.map((m) => (
                  <span
                    key={m.col}
                    style={{ gridColumnStart: m.col + 1 }}
                    className="justify-self-start text-[10px] font-mono leading-none text-[var(--muted-foreground)]"
                  >
                    {m.label}
                  </span>
                ))}
              </div>

              <div
                ref={cellsRef}
                role="img"
                aria-label={model?.summary ?? "Loading contribution graph"}
                data-armed={armed}
                data-idle={idle ?? undefined}
                className="gh-cells"
              >
                {model
                  ? model.cells.map((cell, i) => {
                      const day = cell.day;
                      return (
                        <div
                          key={i}
                          className="gh-cell"
                          data-level={day ? day.level : "pad"}
                          data-date={day?.date}
                          data-count={day?.count}
                          style={
                            {
                              "--d": `${((i / 7) | 0) * WAVE_COL_MS}ms`,
                              "--r": seed(i),
                            } as CSSProperties
                          }
                        />
                      );
                    })
                  : Array.from({ length: SKELETON_COLUMNS * 7 }, (_, i) => (
                      <div key={i} className="gh-cell" />
                    ))}
              </div>
            </div>
          </div>

          <div
            className="gh-tip"
            data-visible={tipShown ? "true" : "false"}
            data-flip={tip?.flip ? "true" : "false"}
            aria-hidden="true"
            style={{
              transform: tip
                ? `translate3d(${tip.x}px, ${tip.y}px, 0) translate(-50%, ${
                    tip.flip ? "calc(100% + 20px)" : "calc(-100% - 8px)"
                  })`
                : undefined,
            }}
          >
            <span className="inline-block rounded-lg px-2.5 py-1.5 text-[11px] font-mono leading-tight bg-[var(--foreground)] text-[var(--background)]">
              {tip
                ? `${tip.count || "No"} contribution${
                    tip.count === 1 ? "" : "s"
                  } on ${formatFull(tip.date)}`
                : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
