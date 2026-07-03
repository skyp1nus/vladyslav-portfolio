import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vladyslav Yeromenko — .NET / Fullstack / AI Agent Engineer",
    short_name: "yeromenko.dev",
    description:
      ".NET backend, Angular/Next.js frontend and AI agents on the Anthropic stack.",
    start_url: "/",
    display: "browser",
    background_color: "#18181b",
    theme_color: "#18181b",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
  };
}
