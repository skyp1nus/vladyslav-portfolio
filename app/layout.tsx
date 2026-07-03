import type { Metadata, Viewport } from "next";
import { Inter, Azeret_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const azeretMono = Azeret_Mono({
  variable: "--font-azeret-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl = "https://yeromenko.dev";
const title = "Vladyslav Yeromenko — .NET / Fullstack / AI Agent Engineer";
const description =
  ".NET backend, Angular/Next.js frontend and AI agents on the Anthropic stack. 4+ years shipping features end-to-end — from database schema to UI and deployment.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    ".NET",
    "C#",
    "AI agents",
    "Claude API",
    "MCP",
    "ASP.NET Core",
    "Next.js",
    "Angular",
    "Unity",
  ],
  authors: [{ name: "Vladyslav Yeromenko", url: siteUrl }],
  creator: "Vladyslav Yeromenko",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "yeromenko.dev",
    title,
    description,
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e4e4e7" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
  ],
};

/* Applies the saved theme before first paint to avoid a flash */
const themeInit = `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${azeretMono.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
