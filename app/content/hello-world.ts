export interface Post {
  slug: string;
  title: string;
  date: string;
  dateLabel: string;
  readingTime: string;
  excerpt: string;
  markdown: string;
}

export const helloWorldPost: Post = {
  slug: "hello-world",
  title: "Hello, World",
  date: "2026-07-03",
  dateLabel: "July 3, 2026",
  readingTime: "3 min read",
  excerpt:
    "Every codebase starts with the same two words. So does this blog — a few notes on why it exists and what I'll be writing about.",
  markdown: `Every programming language greets you the same way. C# does it politely:

\`\`\`csharp
Console.WriteLine("Hello, World!");
\`\`\`

Two words, one line, and suddenly the machine speaks. Decades of industry evolution — containers, LLMs, serverless — and we still initialize everything the same way: by saying hello. There's something comforting about that.

So: hello. This is my corner of the internet.

## Why write at all

For the last two years my day job has quietly shifted from *writing code* to *teaching machines to write code* — building AI agents on the Anthropic stack, wiring MCP servers into dev workflows, automating the boring 40% of a developer's week. The field moves fast enough that anything I learned three months ago is already half folklore, half changelog.

Writing is how I slow that down. If I can't explain a system in plain words, I don't actually understand it — I just have it working. This blog is me checking which one it is.

## What to expect here

A few themes I keep coming back to:

- **AI agents in production** — what actually works when the demo ends: tool design, context budgets, failure modes, when an agent beats a script (and when it embarrassingly doesn't).
- **.NET without ceremony** — ASP.NET Core, EF Core and the unglamorous parts of backend work that hold everything else up.
- **Building a game solo** — Wayheart is my Unity startup of one. Expect honest notes on gameplay systems, save-file archaeology and the economics of shipping alone.

No release-note commentary, no hot takes on framework wars. Just things I've built, broken and understood slightly better afterwards.

## The obligatory meta note

This site is a static Next.js export deployed by a GitHub Action nobody supervises. The post you're reading is markdown rendered by a parser small enough to read over coffee. It felt wrong to bolt a CMS onto a site with one article.

> First rule of side projects: the infrastructure must never be more interesting than the thing it serves.

If any of this sounds like your kind of thing — the contact section is one scroll away. Otherwise: thanks for reading the first one. The next post will have actual code in it.

— Vladyslav`,
};
