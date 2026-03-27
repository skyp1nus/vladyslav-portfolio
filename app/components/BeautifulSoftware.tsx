"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

const galleryItems = [
  { id: "1", title: "Sunset", gradient: "from-orange-400 via-pink-500 to-purple-600" },
  { id: "2", title: "Ocean", gradient: "from-cyan-400 via-blue-500 to-indigo-600" },
  { id: "3", title: "Forest", gradient: "from-green-400 via-emerald-500 to-teal-600" },
  { id: "4", title: "Aurora", gradient: "from-violet-400 via-fuchsia-500 to-pink-500" },
  { id: "5", title: "Dawn", gradient: "from-amber-300 via-rose-400 to-pink-500" },
  { id: "6", title: "Midnight", gradient: "from-slate-600 via-blue-700 to-indigo-900" },
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

    const updateScrollState = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    requestAnimationFrame(updateScrollState);

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="flex flex-col gap-4 py-16">
      {/* Title and description */}
      <div className="px-4 max-w-[1248px] mx-auto w-full">
        {/* Title row */}
        <div className="md:ml-[17%]">
          <h3 className="text-3xl sm:text-4xl md:text-[45px] font-extrabold leading-[1.07] tracking-tight text-[var(--foreground)] max-w-[500px]">
            <span className="block">A gallery of work</span>
            <span className="block">worth remembering</span>
          </h3>
        </div>
        {/* Description row - below and to the right */}
        <div className="mt-16 md:mt-[128px] md:ml-[60%]">
          <p className="text-[15px] font-light leading-[1.74] tracking-wide text-[var(--muted)] max-w-[500px]">
            Every project tells a story. I believe that{" "}
            <span className="font-bold">craft and intention</span> turn good work into something that stays with people long after they&apos;ve moved on.
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
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-[300px] sm:w-[350px] md:w-[400px] aspect-square"
              >
                <div
                  className={`w-full h-full rounded-2xl bg-gradient-to-br ${item.gradient} flex items-end p-6 shadow-lg`}
                >
                  <span className="text-white text-xl font-semibold drop-shadow-md">
                    {item.title}
                  </span>
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
