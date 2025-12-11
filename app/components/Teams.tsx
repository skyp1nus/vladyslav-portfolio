interface Paragraph {
  text: string;
  boldText?: string;
  textAfter?: string;
}

interface Experience {
  company: string;
  companyNote: string;
  role: string;
  period: string;
  paragraphs: Paragraph[];
}

const experiences: Experience[] = [
  {
    company: "WayHeart",
    companyNote: "startup",
    role: "as a Unity Developer",
    period: "2023 - current",
    paragraphs: [
      {
        text: "I'm the sole developer on the project — responsible for everything from architecture to animations and effects. This is my first step into gamedev, where I learn by doing while ",
        boldText: "building the game of my dreams.",
      },
    ],
  },
  {
    company: "Zaporizhzhia National University",
    companyNote: "",
    role: "Bachelor's degree, Software Engineering",
    period: "2018 - 2022",
    paragraphs: [
      {
        text: "My first real experience with code, teamwork, and learning from ",
        boldText: "people with hands-on development experience.",
      },
    ],
  },
];

export function Teams() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-[1280px] mx-auto">
        {/* Title */}
        <div className="grid grid-cols-12 gap-4 mb-16">
          <div className="col-span-12 md:col-start-3 md:col-span-6">
            <h3 className="text-3xl sm:text-4xl md:text-[45px] font-extrabold leading-[1.07] tracking-tight text-[var(--foreground)]">
              <span className="block">Experience</span>
            </h3>
          </div>
        </div>

        {/* Experience list */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-start-4 md:col-span-6 flex flex-col gap-20">
            {experiences.map((exp, index) => (
              <div key={index} className="flex flex-col gap-4">
                {/* Company header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Logo placeholder */}
                    <div className="w-7 h-8 bg-[var(--foreground)] rounded flex items-center justify-center">
                      <span className="text-[var(--background)] text-[10px] font-bold">
                        {exp.company[0]}
                      </span>
                    </div>
                    <span className="text-[26px] font-black tracking-wide text-[var(--foreground)]">
                      {exp.company}
                    </span>
                    <span className="text-[15px] font-light text-[var(--muted)]">
                      {exp.companyNote}
                    </span>
                  </div>
                  <span className="text-[15px] font-light text-[var(--muted)]">
                    {exp.period}
                  </span>
                </div>

                {/* Role */}
                <p className="text-[15px] font-light text-[var(--muted-foreground)]">
                  {exp.role}
                </p>

                {/* Description */}
                <div className="flex flex-col gap-5">
                  {exp.paragraphs.map((para, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-[15px] font-light leading-[1.74] tracking-wide text-[var(--muted)]"
                    >
                      {para.text}
                      {para.boldText && (
                        <span className="font-semibold">{para.boldText}</span>
                      )}
                      {para.textAfter}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
