# yeromenko.dev

Personal portfolio — Next.js 16 static export, deployed to GitHub Pages.

## Stack

- Next.js 16 (App Router, `output: "export"`) + React 19
- Tailwind CSS v4
- Embla carousel

## Development

```bash
npm run dev      # dev server at localhost:3000
npm run build    # static export to ./out/
npm run lint     # eslint
```

Push to `main` triggers the GitHub Actions workflow that builds with Bun and deploys `./out/` to GitHub Pages.
