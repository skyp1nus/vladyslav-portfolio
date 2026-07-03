"use client";

import { useState } from "react";
import { Icon } from "./Icons";
import { Reveal } from "./Reveal";

const EMAIL = "vy.skyp1nus@gmail.com";

const socials = [
  { name: "GitHub", href: "https://github.com/skyp1nus", icon: "github" },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/skyp1nus/",
    icon: "linkedin",
  },
  { name: "Telegram", href: "https://t.me/skyp1nus", icon: "telegram" },
] as const;

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section
      id="contact"
      className="py-24 px-4 min-h-[720px] flex flex-col justify-center"
    >
      <div className="max-w-[1280px] mx-auto w-full">
        <Reveal>
          {/* Title */}
          <div className="flex justify-center mb-8">
            <h2 className="text-5xl sm:text-6xl md:text-[63px] font-black leading-[0.95] tracking-tight text-[var(--foreground)]">
              Get in Touch
            </h2>
          </div>

          {/* Email (click to copy) + CV download */}
          <div className="flex justify-center mb-5">
            <div className="flex items-center gap-2">
              <button
                onClick={copyEmail}
                title={copied ? "Copied!" : "Click to copy"}
                className="bg-[var(--secondary)] rounded-lg px-6 py-2.5 text-[13px] font-normal tracking-[0.055em] uppercase text-[var(--foreground)] hover:opacity-80 transition-opacity relative overflow-hidden cursor-pointer"
              >
                <span
                  className={`inline-block transition-all duration-300 ${
                    copied
                      ? "opacity-0 -translate-y-2"
                      : "opacity-100 translate-y-0"
                  }`}
                >
                  {EMAIL}
                </span>
                <span
                  aria-live="polite"
                  className={`absolute inset-0 flex items-center justify-center gap-1.5 transition-all duration-300 ${
                    copied
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2"
                  }`}
                >
                  {copied && (
                    <>
                      <Icon name="check" size={14} />
                      Copied
                    </>
                  )}
                </span>
              </button>
              <a
                href="/Vladyslav_Yeromenko_CV.pdf"
                download="Vladyslav_Yeromenko_CV.pdf"
                title="Download CV"
                aria-label="Download CV"
                className="h-10 px-3 bg-[var(--secondary)] rounded-lg flex items-center gap-1.5 text-[var(--foreground)] hover:opacity-80 transition-opacity"
              >
                <Icon name="download" size={16} />
                <span className="text-[13px] font-normal tracking-[0.055em] uppercase">
                  CV
                </span>
              </a>
            </div>
          </div>

          {/* Social icons */}
          <div className="flex justify-center gap-1">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                title={social.name}
                className="w-10 h-10 flex items-center justify-center rounded-full text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
              >
                <Icon name={social.icon} size={24} />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
