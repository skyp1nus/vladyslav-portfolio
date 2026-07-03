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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/* Schema.org structured data for rich results */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Vladyslav Yeromenko",
      url: siteUrl,
      email: "mailto:yeromenko.dev@gmail.com",
      image: `${siteUrl}/og.png`,
      jobTitle: ".NET / Fullstack / AI Agent Engineer",
      sameAs: [
        "https://github.com/skyp1nus",
        "https://www.linkedin.com/in/skyp1nus/",
        "https://t.me/skyp1nus",
      ],
      knowsAbout: [
        "C#",
        ".NET",
        "ASP.NET Core",
        "AI agents",
        "Claude API",
        "Model Context Protocol",
        "Next.js",
        "Angular",
        "TypeScript",
        "Unity",
        "PostgreSQL",
      ],
      worksFor: { "@type": "Organization", name: "Wayheart" },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Zaporizhzhia National University",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "yeromenko.dev",
      description,
      publisher: { "@id": `${siteUrl}/#person` },
      inLanguage: "en",
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
