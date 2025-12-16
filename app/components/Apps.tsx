import Image from "next/image";

const apps = [
  {
    name: "Artman",
    description:
      "A film director simulator where you live the life of a boy who loved cinema since childhood. Create your own path in the movie industry.",
    poster: "/posters/games/ArtmanPoster.webp",
  },
  {
    name: "Soon",
    description:
      "Soon",
    gradient: "from-purple-400 to-indigo-500",
  },
];

export function Apps() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-[1248px] mx-auto">
        {/* Title section */}
        <div className="mb-16">
          {/* Title */}
          <div className="md:ml-[17%]">
            <h3 className="text-3xl sm:text-4xl md:text-[45px] font-extrabold leading-[1.07] tracking-tight text-[var(--foreground)]">
              Games I&apos;m Building
            </h3>
          </div>
          {/* Description - below and to the right */}
          <div className="mt-8 md:mt-[80px] md:ml-[60%]">
            <p className="text-[15px] font-light leading-[1.74] tracking-wide text-[var(--muted)] max-w-[500px]">
              I&apos;m passionate about creating games that tell stories. These are projects where I explore new ideas, push my creative boundaries, and bring my visions to life.
            </p>
          </div>
        </div>

        {/* Apps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apps.map((app, index) => (
            <div
              key={index}
              className="bg-[var(--secondary)] rounded-[10px] overflow-hidden flex flex-col group cursor-pointer hover:scale-[1.02] transition-transform duration-300"
            >
              {/* App info */}
              <div className="p-6 md:p-8 flex flex-col gap-2">
                <h4 className="text-[34px] font-normal tracking-tight text-[var(--foreground)]">
                  {app.name}
                </h4>
                <p className="text-[15px] font-light leading-[1.74] tracking-wide text-[var(--muted)]">
                  {app.description}
                </p>
              </div>

              {/* App preview */}
              <div className="overflow-hidden flex-1">
                {app.poster ? (
                  <Image
                    src={app.poster}
                    alt={`${app.name} poster`}
                    width={1362}
                    height={1932}
                    className="w-full h-auto"
                  />
                ) : (
                  <div
                    className={`w-full h-full min-h-[400px] md:min-h-[500px] bg-gradient-to-br ${app.gradient} flex items-center justify-center`}
                  >
                    <span className="text-white/50 text-lg font-light">
                      {app.name} Preview
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
