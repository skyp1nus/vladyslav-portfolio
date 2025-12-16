"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("vy.skyp1nus@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 px-4 min-h-[720px] flex flex-col justify-center">
      <div className="max-w-[1280px] mx-auto w-full">
        {/* Title */}
        <div className="flex justify-center mb-8">
          <h2 className="text-5xl sm:text-6xl md:text-[63px] font-black leading-[0.95] tracking-tight text-[var(--foreground)]">
            Get in Touch
          </h2>
        </div>

        {/* Email and copy button */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2">
            <a
              href="mailto:vy.skyp1nus@gmail.com"
              className="bg-[var(--secondary)] rounded-lg px-6 py-2.5 text-[13px] font-normal tracking-[0.055em] uppercase text-[var(--foreground)] hover:opacity-80 transition-opacity"
            >
              vy.skyp1nus@gmail.com
            </a>
            <button
              onClick={copyEmail}
              className="w-10 h-10 bg-[var(--secondary)] rounded-lg flex items-center justify-center text-[var(--foreground)] hover:opacity-80 transition-opacity relative"
              title="Copy email"
            >
              {copied ? (
                <Icon icon="mdi:check" width={14} />
              ) : (
                <Icon icon="mdi:content-copy" width={14} />
              )}
            </button>
          </div>
        </div>

        {/* Social icons */}
        <div className="flex justify-center gap-1">
          <a
            href="https://github.com/skyp1nus"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center text-[var(--foreground)] hover:opacity-70 transition-opacity"
          >
            <Icon icon="mdi:github" width={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/skyp1nus/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center text-[var(--foreground)] hover:opacity-70 transition-opacity"
          >
            <Icon icon="mdi:linkedin" width={24} />
          </a>
          <a
            href="https://t.me/skyp1nus"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center text-[var(--foreground)] hover:opacity-70 transition-opacity"
          >
            <Icon icon="mdi:telegram" width={24} />
          </a>
        </div>
      </div>
    </section>
  );
}
