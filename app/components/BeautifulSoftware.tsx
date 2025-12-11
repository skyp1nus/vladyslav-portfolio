"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

const slides = [
  { id: 1, color: "from-purple-500 to-pink-500" },
  { id: 2, color: "from-blue-500 to-cyan-500" },
  { id: 3, color: "from-green-500 to-emerald-500" },
  { id: 4, color: "from-orange-500 to-yellow-500" },
  { id: 5, color: "from-red-500 to-rose-500" },
  { id: 6, color: "from-indigo-500 to-violet-500" },
];

export function BeautifulSoftware() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="flex flex-col gap-4 py-16">
      {/* Title and description */}
      <div className="px-4 max-w-[1248px] mx-auto w-full">
        {/* Title row */}
        <div className="md:ml-[17%]">
          <h3 className="text-3xl sm:text-4xl md:text-[45px] font-extrabold leading-[1.07] tracking-tight text-[var(--foreground)] max-w-[500px]">
            <span className="block">I aim to create games</span>
            <span className="block">that stay with you</span>
          </h3>
        </div>
        {/* Description row - below and to the right */}
        <div className="mt-16 md:mt-[128px] md:ml-[60%]">
          <p className="text-[15px] font-light leading-[1.74] tracking-wide text-[var(--muted)] max-w-[500px]">
            For me, game development is more than just code and graphics. It&apos;s an opportunity to tell a story, evoke emotions, and give players a unique experience. I believe that{" "}
            <span className="font-bold">nothing is impossible</span> — it&apos;s all a matter of time and persistence.
          </p>
        </div>
      </div>

      {/* Carousel - extends beyond screen on the right */}
      <div className="w-full mt-8 overflow-hidden">
        <div
          className="embla"
          ref={emblaRef}
          style={{
            paddingLeft: "max(16px, calc((100vw - 1280px) / 2 + 16px))",
          }}
        >
          <div className="flex gap-4">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="flex-shrink-0 w-[300px] sm:w-[350px] md:w-[400px] aspect-square"
              >
                <div className="w-full h-full rounded-lg bg-[var(--secondary)] overflow-hidden">
                  <div className={`w-full h-full bg-gradient-to-br ${slide.color} flex items-center justify-center`}>
                    <span className="text-white/50 text-lg font-light">
                      Project {slide.id}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {/* Extra padding at the end for smooth scrolling */}
            <div className="flex-shrink-0 w-4" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-end gap-4 px-4 max-w-[1280px] mx-auto mt-4">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={`text-[13px] font-extralight transition-opacity ${
              canScrollPrev ? "text-[var(--foreground)] opacity-100 hover:opacity-70" : "text-[var(--muted)] opacity-50"
            }`}
          >
            Previous
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={`text-[13px] font-extralight transition-opacity ${
              canScrollNext ? "text-[var(--foreground)] opacity-100 hover:opacity-70" : "text-[var(--muted)] opacity-50"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
