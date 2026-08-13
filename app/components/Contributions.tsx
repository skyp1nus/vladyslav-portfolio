import { Reveal } from "./Reveal";
import { ContributionGraph } from "./ContributionGraph";

export function Contributions() {
  return (
    <section id="work" className="py-24 px-4">
      <div className="max-w-[1280px] mx-auto w-full">
        <div className="md:ml-[17%]">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-[45px] font-extrabold leading-[1.07] tracking-tight text-[var(--foreground)] max-w-[500px]">
              <span className="block">The receipts</span>
              <span className="block">for all of it</span>
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 md:mt-[128px] md:ml-[60%]">
          <Reveal>
            <p className="text-[15px] font-light leading-[1.74] tracking-wide text-[var(--muted)] max-w-[500px]">
              Everything above is a claim; this is the log. A year of commits,
              reviews and merges —{" "}
              <span className="font-bold">pulled live from GitHub</span>, not
              curated after the fact.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-16 md:mt-20">
          <ContributionGraph username="skyp1nus" />
        </Reveal>
      </div>
    </section>
  );
}
