import Image from "next/image";
import { Reveal, Stagger } from "./reveal";
import { SectionLabel } from "./ui";
import { standing } from "@/lib/content";

/**
 * The dark band between the capabilities and the project: where the company
 * stands today, stated in words rather than invented figures.
 */
export function StandingBand() {
  return (
    <section className="relative overflow-hidden bg-deep">
      <Image
        src="/images/band-landscape.jpg"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover object-[center_44%]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-deep/66" />

      <div className="page-shell relative py-[clamp(3rem,5.6vw,5rem)]">
        <div className="grid gap-x-(--grid-gap) gap-y-[clamp(2rem,3.5vw,3rem)] lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionLabel tone="invert">SM in Numbers</SectionLabel>
            </Reveal>
            <Reveal
              as="p"
              delay={80}
              className="display mt-[clamp(0.875rem,1.4vw,1.25rem)] text-(length:--text-band) text-ground"
            >
              Driven by
              <br />
              Progress<span className="text-accent-bright">.</span>
            </Reveal>
          </div>

          <Stagger
            as="dl"
            delay={140}
            className="grid grid-cols-2 gap-x-(--grid-gap) gap-y-[clamp(1.5rem,2.6vw,2rem)] lg:col-span-8 lg:grid-cols-4"
          >
            {standing.map((item) => (
              <div key={item.caption}>
                <dt className="display text-(length:--text-stat) text-ground">{item.value}</dt>
                <dd className="mt-2 text-fine text-ground/65">{item.caption}</dd>
              </div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
