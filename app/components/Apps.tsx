import Image from "next/image";
import { Reveal } from "./Reveal";

export function Apps() {
  return (
    <section id="games" className="py-24 px-4">
      <div className="max-w-[1248px] mx-auto">
        {/* Title section */}
        <div className="mb-16">
          <div className="md:ml-[17%]">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl md:text-[45px] font-extrabold leading-[1.07] tracking-tight text-[var(--foreground)]">
                Games I&apos;m Building
              </h2>
            </Reveal>
          </div>
          <div className="mt-8 md:mt-[80px] md:ml-[60%]">
            <Reveal>
              <p className="text-[15px] font-light leading-[1.74] tracking-wide text-[var(--muted)] max-w-[500px]">
                I&apos;m passionate about creating games that tell stories.
                These are projects where I explore new ideas, push my creative
                boundaries, and bring my visions to life.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Featured game */}
        <Reveal>
          <div className="grid md:grid-cols-[1fr_minmax(320px,420px)] bg-[var(--secondary)] border border-[var(--border)] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--muted-foreground)]">
            <div className="p-8 md:p-12 flex flex-col justify-center gap-6 order-2 md:order-1">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 text-[11px] tracking-wide uppercase text-[var(--muted)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  In development
                </span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--foreground)]">
                Artman
              </h3>
              <p className="text-[15px] font-light leading-[1.74] tracking-wide text-[var(--muted)] max-w-[420px]">
                A film director simulator where you live the life of a boy who
                loved cinema since childhood. Create your own path in the movie
                industry.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Unity", "C#", "ASP.NET Core"].map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[var(--border)] px-3 py-1 text-[12px] font-mono text-[var(--muted)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            {/* Full vertical poster, no cropping */}
            <div className="relative aspect-[1362/1932] overflow-hidden order-1 md:order-2">
              <Image
                src="/posters/games/ArtmanPoster.webp"
                alt="Artman — key art poster"
                fill
                sizes="(min-width: 768px) 420px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
