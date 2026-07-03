import Image from "next/image";
import { Reveal } from "./Reveal";

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
  logo?: string;
  logoDarkInvert?: boolean;
  paragraphs: Paragraph[];
}

const experiences: Experience[] = [
  {
    company: "Wayheart",
    companyNote: "own Unity startup",
    role: "Founder & Lead Developer",
    period: "May 2023 — Present",
    logo: "/logos/wayheart.jpg",
    paragraphs: [
      {
        text: "Building an original Unity game from scratch — gameplay systems, art pipeline, backend and CI. I own the full stack: Unity client, a small ASP.NET Core backend, and ",
        boldText: "everything in between.",
      },
      {
        text: "Over the last two years I also built internal AI agents and automation pipelines to handle routine dev tasks — ",
        boldText: "cutting ops time and staying focused on what matters.",
      },
    ],
  },
  {
    company: "FlexDev",
    companyNote: "",
    role: ".NET / Angular Developer",
    period: "Jul 2020 — May 2022",
    logo: "/logos/flexdev.png",
    paragraphs: [
      {
        text: "Commercial product development in a small delivery team. Primary project: KS — a system that monitors junior developers and signals when senior help is needed. I developed the ASP.NET Core Web API backend, maintained ",
        boldText: "end-to-end .NET + Angular features,",
        textAfter: " and implemented a WPF companion app used on developer workstations.",
      },
    ],
  },
  {
    company: "FreshCode",
    companyNote: "university practice",
    role: "Intern Developer",
    period: "2021 · 3 months",
    logo: "/logos/freshcode.png",
    paragraphs: [
      {
        text: "Built a Trello-style board app with Node.js, MongoDB and Docker — learned the ",
        boldText: "full stack from scratch",
        textAfter: " under a tight deadline and received a top grade.",
      },
    ],
  },
  {
    company: "Zaporizhzhia National University",
    companyNote: "",
    role: "Bachelor's degree, Software Engineering",
    period: "Sep 2018 — Sep 2022",
    logo: "/logos/znu.png",
    logoDarkInvert: true,
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
    <section id="experience" className="py-24 px-4">
      <div className="max-w-[1280px] mx-auto">
        {/* Title */}
        <div className="grid grid-cols-12 gap-4 mb-16">
          <div className="col-span-12 md:col-start-3 md:col-span-6">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl md:text-[45px] font-extrabold leading-[1.07] tracking-tight text-[var(--foreground)]">
                <span className="block">Experience</span>
              </h2>
            </Reveal>
          </div>
        </div>

        {/* Experience list */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-start-4 md:col-span-6 flex flex-col gap-20">
            {experiences.map((exp) => (
              <Reveal key={exp.company} className="flex flex-col gap-4">
                {/* Company header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {exp.logo ? (
                      <span className="w-11 h-11 shrink-0 rounded-lg overflow-hidden flex items-center justify-center">
                        <Image
                          src={exp.logo}
                          alt={`${exp.company} logo`}
                          width={44}
                          height={44}
                          className={`w-full h-full object-contain ${
                            exp.logoDarkInvert ? "logo-dark-invert" : ""
                          }`}
                        />
                      </span>
                    ) : (
                      <span className="w-11 h-11 shrink-0 bg-[var(--foreground)] rounded-lg flex items-center justify-center">
                        <span className="text-[var(--background)] text-[14px] font-bold">
                          {exp.company[0]}
                        </span>
                      </span>
                    )}
                    <span className="text-[22px] sm:text-[24px] font-black tracking-tight leading-[1.15] text-[var(--foreground)]">
                      {exp.company}
                    </span>
                    {exp.companyNote && (
                      <span className="text-[15px] font-light text-[var(--muted)] whitespace-nowrap">
                        {exp.companyNote}
                      </span>
                    )}
                  </div>
                  <span className="text-[15px] font-light text-[var(--muted)] whitespace-nowrap sm:mt-1.5">
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
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
