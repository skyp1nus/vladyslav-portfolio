export function WhoAmI() {
  return (
    <section className="min-h-screen px-4 pt-16 relative">
      <div className="max-w-[1280px] mx-auto h-full">
        {/* Main content area - centered */}
        <div className="flex flex-col items-center justify-center pt-[200px] md:pt-[300px]">
          {/* Title and subtitle - centered */}
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-[var(--foreground)]">
              <span className="block font-black">.NET Developer <span className="font-light">&</span> Fullstack</span>
              <span className="block font-black">AI <span className="text-blue-500">Agent</span> Engineer</span>
            </h2>
            {/* Centered subtitle */}
            <p className="mt-8 text-lg md:text-xl font-extralight text-[var(--muted)]">
              Shipping features end-to-end — from backend to AI agents.
            </p>
          </div>
        </div>

        {/* Description - positioned bottom right */}
        <div className="grid grid-cols-12 gap-4 mt-16 md:mt-24">
          <div className="col-span-12 md:col-start-10 md:col-span-3">
            <p className="text-[11px] font-extralight leading-[1.65] tracking-wide text-[var(--muted)]">
              Fullstack generalist comfortable owning a feature end-to-end — from database schema and C# services to UI and deployment. The last two years shifted toward building AI agents and automation that save real engineering hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
