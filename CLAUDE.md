# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website at yeromenko.dev for a .NET / Fullstack / AI Agent engineer. Built with Next.js 16 (static export) and React 19. Single-page site: hero, GitHub contribution heatmap, experience, featured game, blog post modal, contact.

## Commands

```bash
npm run dev      # Development server at localhost:3000 DONT USE THIS!!!
npm run build    # Static export to ./out/
npm run lint     # ESLint check
```

Deployment: Push to `main` branch triggers GitHub Actions workflow that builds with Bun and deploys `./out/` to GitHub Pages. Both `package-lock.json` (local npm) and `bun.lock` (CI) exist — keep them in sync when changing dependencies.

## Architecture (App Router)

```
app/
├── layout.tsx              # Fonts, full metadata (OG/Twitter → /og.png), theme init script
├── page.tsx                # Single-page composition
├── globals.css             # Theme vars (light/dark via data-theme + prefers-color-scheme),
│                           #   reveal animations, .gh-* heatmap, .prose-post typography
├── icon.svg / favicon.ico  # ">_" mark favicon
├── content/
│   └── hello-world.ts      # Blog post: metadata + markdown source
├── lib/
│   └── contributions.ts    # GitHub calendar: fetch + sessionStorage cache, week
│                           #   bucketing, month labels, streak stats (no React)
└── components/
    ├── Header.tsx           # Fixed header: logo + ThemeToggle
    ├── ThemeToggle.tsx      # Sets data-theme + localStorage; icon swap is pure CSS
    ├── Reveal.tsx           # IntersectionObserver scroll-reveal wrapper
    ├── Icons.tsx            # Inline MDI SVG paths (no runtime icon fetching)
    ├── WhoAmI.tsx           # Hero (h1, availability pill, CSS-only entrance animation)
    ├── Contributions.tsx    # Section shell (server): heading + copy
    ├── ContributionGraph.tsx# Client: bare heatmap grid, wave-in, tooltip, skeleton, error
    ├── CountUp.tsx          # rAF number animation, isolated so it can't re-render the grid
    ├── Teams.tsx            # Experience list
    ├── Apps.tsx             # Featured game card (Artman)
    ├── Blog.tsx             # Post list; opens PostModal
    ├── PostModal.tsx        # Fullscreen post dialog (ESC, scroll lock, focus restore)
    ├── Markdown.tsx         # Minimal MD renderer (h2/h3, code fences, lists, quotes…)
    ├── Contact.tsx          # Copy-email button, CV download, socials
    └── Footer.tsx
```

### Theming

- CSS variables in `globals.css`; dark applies via `:root[data-theme="dark"]` OR `prefers-color-scheme` when no explicit choice (`:root:not([data-theme="light"])`).
- Inline script in `layout.tsx` restores saved theme before first paint (no FOUC). Don't render theme state in React — the toggle icon visibility is CSS-driven to avoid hydration mismatch.

### Content notes

- Blog posts live as markdown template literals in `app/content/`; `Markdown.tsx` supports only the syntax used there — extend it if a new post needs more.
- CV file is `public/Vladyslav_Yeromenko_CV.pdf`; the Contact button must point to that exact path.
- OG image is a pre-generated static `public/og.png` (GitHub Pages can't set content-type for extensionless routes, so no `opengraph-image.tsx`).

### Contribution heatmap

- Data comes client-side from `github-contributions-api.jogruber.de` (GitHub's own calendar is authenticated-GraphQL only). No secrets, no CI step. If that mirror dies, fetch it in Actions with a `read:user` PAT and bake JSON into `public/`.
- Cell colors are pure CSS (`data-level` + `--heat-0..4` vars in all three theme scopes) — never JS-computed, per the theming rule above. Tailwind v4 also can't generate runtime-built class strings.
- Deliberately minimal: no card, no border, no stat tiles, no legend, no weekday rail — just the count, month labels and the grid on the page background. Details live in the hover tooltip, not on screen.
- The wave fades in column by column (oldest day → today) via one inline `--d` delay per cell; `data-armed` goes `false → true → done`. The `done` state matters: a filled animation outranks `:hover` in the cascade, so hover stays dead until it flips.

### Build Configuration

- `next.config.ts`: `output: "export"`, images unoptimized, Turbopack
- TypeScript path alias: `@/*` maps to project root
- `public/CNAME` → yeromenko.dev
