export function WhoAmI() {
  return (
    <section className="min-h-screen px-4 pt-16 relative">
      <div className="max-w-[1280px] mx-auto h-full">
        {/* Main content area - centered */}
        <div className="flex flex-col items-center justify-center pt-[200px] md:pt-[300px]">
          {/* Title and subtitle - centered */}
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-[var(--foreground)]">
              <span className="block font-black">GameDev Developer <span className="font-light">&</span></span>
              <span className="block font-black">Digital <span className="text-blue-500">Storyteller</span></span>
            </h2>
            {/* Centered subtitle */}
            <p className="mt-8 text-lg md:text-xl font-extralight text-[var(--muted)]">
              Turning ideas into games
            </p>
          </div>
        </div>

        {/* Description - positioned bottom right */}
        <div className="grid grid-cols-12 gap-4 mt-16 md:mt-24">
          <div className="col-span-12 md:col-start-10 md:col-span-3">
            <p className="text-[11px] font-extralight leading-[1.65] tracking-wide text-[var(--muted)]">
              Nothing is impossible — it's all a matter of time. Every day I learn something new while creating games I want to see in the world.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
