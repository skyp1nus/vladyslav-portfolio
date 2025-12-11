const posts = [
  {
    title: "Coming Soon...",
    date: "",
    excerpt:
      "I'm working on some thoughts to share. Stay tuned for articles about game development, creative process, and lessons learned along the way.",
  },
];

export function Blog() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-[1248px] mx-auto">
        {/* Title section */}
        <div className="mb-16">
          {/* Title */}
          <div className="md:ml-[17%]">
            <h3 className="text-3xl sm:text-4xl md:text-[45px] font-extrabold leading-[1.07] tracking-tight text-[var(--foreground)]">
              What have I to say
            </h3>
          </div>
          {/* Description - below and to the right */}
          <div className="mt-8 md:mt-[80px] md:ml-[60%]">
            <p className="text-[15px] font-light leading-[1.74] tracking-wide text-[var(--muted)] max-w-[500px]">
              Thoughts on game development, creative process, and the journey of building games.
            </p>
          </div>
        </div>

        {/* Posts list */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-start-4 md:col-span-6">
            {posts.map((post, index) => (
              <article
                key={index}
                className="group cursor-pointer transition-opacity hover:opacity-70"
              >
                <div className="flex flex-col gap-3">
                  <h4 className="text-[22px] font-bold leading-[1.43] text-[var(--foreground)]">
                    {post.title}
                  </h4>
                  <time className="text-[14px] font-normal text-[var(--muted)]">
                    {post.date}
                  </time>
                  <p className="text-[15px] font-light leading-[1.6] text-[var(--muted)]">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Section number */}
          <div className="col-span-12 md:col-start-10 md:col-span-1 flex md:justify-end items-start md:items-end mt-4 md:mt-0">
            <span className="font-mono text-xs text-[var(--muted-foreground)]">
              [ 1 ]
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
