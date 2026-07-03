"use client";

import { useState } from "react";
import { Icon } from "./Icons";
import { PostModal } from "./PostModal";
import { Reveal } from "./Reveal";
import { helloWorldPost, type Post } from "../content/hello-world";

const posts: Post[] = [helloWorldPost];

export function Blog() {
  const [openPost, setOpenPost] = useState<Post | null>(null);

  return (
    <section id="writing" className="py-24 px-4">
      <div className="max-w-[1248px] mx-auto">
        {/* Title section */}
        <div className="mb-16">
          <div className="md:ml-[17%]">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl md:text-[45px] font-extrabold leading-[1.07] tracking-tight text-[var(--foreground)]">
                Writing
              </h2>
            </Reveal>
          </div>
          <div className="mt-8 md:mt-[80px] md:ml-[60%]">
            <Reveal>
              <p className="text-[15px] font-light leading-[1.74] tracking-wide text-[var(--muted)] max-w-[500px]">
                Notes on AI agents, .NET and building games solo — things
                I&apos;ve built, broken and understood slightly better
                afterwards.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Posts list */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-start-4 md:col-span-6 flex flex-col">
            {posts.map((post) => (
              <Reveal key={post.slug}>
                <button
                  onClick={() => setOpenPost(post)}
                  className="group w-full text-left border-t border-[var(--border)] pt-8 pb-2 cursor-pointer"
                >
                  <article className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 font-mono text-[12px] text-[var(--muted-foreground)]">
                      <time dateTime={post.date}>{post.dateLabel}</time>
                      <span aria-hidden="true">·</span>
                      <span>{post.readingTime}</span>
                    </div>
                    <h3 className="text-[26px] font-bold leading-[1.3] text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                      {post.title}
                    </h3>
                    <p className="text-[15px] font-light leading-[1.6] text-[var(--muted)]">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1.5 mt-1 text-[13px] text-[var(--foreground)]">
                      Read post
                      <Icon
                        name="arrowRight"
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </article>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {openPost && (
        <PostModal post={openPost} onClose={() => setOpenPost(null)} />
      )}
    </section>
  );
}
