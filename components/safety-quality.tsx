import Image from "next/image";
import { CommitmentMark } from "./marks";
import { MaskReveal, Reveal, Stagger } from "./reveal";
import { SectionLabel } from "./ui";
import { commitments } from "@/lib/content";

/**
 * Safety and quality: the field photograph flush to the left edge of the
 * viewport, four principles set against a four-line headline on the right.
 */
export function SafetyQuality() {
  return (
    <section id="safety" className="bg-ground">
      <div className="grid lg:grid-cols-2">
        <MaskReveal
          parallax={0.12}
          className="relative h-[clamp(17rem,52vw,26rem)] overflow-hidden bg-deep lg:h-auto lg:min-h-[clamp(20rem,27vw,25rem)]"
        >
          <Image
            src="/images/safety-engineer.jpg"
            alt="A Srimithra Construction engineer surveying the distribution line route on site."
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-[50%_45%]"
          />
        </MaskReveal>

        <div className="pad-end flex items-center py-(--section-y) pl-[var(--page-x)] lg:pl-[clamp(2.5rem,5vw,5rem)]">
          <div className="grid w-full gap-x-(--grid-gap) gap-y-[clamp(1.75rem,2.8vw,2.25rem)] sm:grid-cols-2">
            <div>
              <Reveal>
                <SectionLabel>Safety &amp; Quality</SectionLabel>
              </Reveal>
              <Reveal
                as="h2"
                delay={80}
                className="display mt-[clamp(1rem,1.6vw,1.5rem)] text-(length:--text-section)"
              >
                Safety<span className="accent-stop">.</span>
                <br />
                Quality<span className="accent-stop">.</span>
                <br />
                Execution<span className="accent-stop">.</span>
                <br />
                Integrity<span className="accent-stop">.</span>
              </Reveal>
            </div>

            <Stagger as="ul" delay={140} className="flex flex-col gap-[clamp(1.125rem,1.8vw,1.5rem)]">
              {commitments.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <CommitmentMark
                    name={item.mark}
                    className="mt-0.5 h-[1.375rem] w-[1.375rem] shrink-0 text-accent"
                  />
                  <div>
                    <h3 className="text-(length:--text-heading) font-medium text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 max-w-[28ch] text-fine text-ink-soft">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
