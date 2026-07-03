# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website at yeromenko.dev for a .NET / Fullstack / AI Agent engineer. Built with Next.js 16 (static export) and React 19. Single-page site: hero, product gallery carousel, experience, featured game, blog post modal, contact.

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
│                           #   reveal animations, .prose-post typography
├── icon.svg / favicon.ico  # ">_" mark favicon
├── content/
│   └── hello-world.ts      # Blog post: metadata + markdown source
└── components/
    ├── Header.tsx           # Fixed header: logo + ThemeToggle
    ├── ThemeToggle.tsx      # Sets data-theme + localStorage; icon swap is pure CSS
    ├── Reveal.tsx           # IntersectionObserver scroll-reveal wrapper
    ├── Icons.tsx            # Inline MDI SVG paths (no runtime icon fetching)
    ├── WhoAmI.tsx           # Hero (h1, availability pill, CSS-only entrance animation)
    ├── BeautifulSoftware.tsx# Product gallery carousel; cards are hand-built CSS/SVG
    │                        #   mockups (terminal, dashboard, film frame, node graph…)
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
- Gallery cards are stylized illustrations of real products (placeholders until real screenshots exist) — keep them looking like product shots, not gradients.
- CV file is `public/Vladyslav_Yeromenko_CV.pdf`; the Contact button must point to that exact path.
- OG image is a pre-generated static `public/og.png` (GitHub Pages can't set content-type for extensionless routes, so no `opengraph-image.tsx`).

### Build Configuration

- `next.config.ts`: `output: "export"`, images unoptimized, Turbopack
- TypeScript path alias: `@/*` maps to project root
- `public/CNAME` → yeromenko.dev
