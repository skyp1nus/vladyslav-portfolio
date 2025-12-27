"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState, ComponentType } from "react";
import { MemoryCards, Snake, Breakout, FlappyBird, DinoRun } from "./games";
import { GamePreviewCard } from "./games/GamePreviewCard";
import { GameModal } from "./games/GameModal";
import { GameProps } from "./games/types";

interface Game {
  id: string;
  name: string;
  description: string;
  component: ComponentType<GameProps>;
}

const games: Game[] = [
  { id: "memory", name: "Memory", description: "Find all matching pairs", component: MemoryCards },
  { id: "snake", name: "Snake", description: "Eat food, grow longer", component: Snake },
  { id: "breakout", name: "Breakout", description: "Break all the bricks", component: Breakout },
  { id: "flappy", name: "Flappy", description: "Fly through pipes", component: FlappyBird },
  { id: "dino", name: "Dino Run", description: "Jump over obstacles", component: DinoRun },
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
  const [openGameId, setOpenGameId] = useState<string | null>(null);

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

  const openGame = games.find((g) => g.id === openGameId);

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
            {games.map((game) => (
              <div
                key={game.id}
                className="flex-shrink-0 w-[300px] sm:w-[350px] md:w-[400px] aspect-square"
              >
                <GamePreviewCard
                  name={game.name}
                  description={game.description}
                  onPlay={() => setOpenGameId(game.id)}
                />
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

      {/* Game Modal */}
      {openGame && (
        <GameModal game={openGame} onClose={() => setOpenGameId(null)} />
      )}
    </section>
  );
}
