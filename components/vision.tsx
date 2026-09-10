import Image from "next/image";
import { MaskReveal, Reveal } from "./reveal";
import { OutlinePill, SectionLabel } from "./ui";
import { about } from "@/lib/content";

/**
 * About and vision: the statement on the left of the grid, a field photograph
 * and a single quiet panel closing the composition on the right.
 *
 * `action` is false on the page this section is the subject of, where the link
 * would only point back at the page the reader is already on.
 */
export function Vision({ action = true }: { action?: boolean }) {
  return (
    <section id="about" className="bg-ground-soft">
      <div className="grid items-stretch lg:grid-cols-12">
        <div className="flex items-center py-(--section-y) lg:col-span-5">
          <div className="pad-start w-full pr-[var(--page-x)] lg:pr-[clamp(2rem,3.5vw,3.5rem)]">
            <Reveal>
              <SectionLabel>About Srimithra Construction</SectionLabel>
            </Reveal>

            <Reveal
              as="h2"
              delay={80}
              className="display mt-[clamp(1rem,1.6vw,1.5rem)] text-(length:--text-section)"
            >
              {about.heading[0]}
              <br />
              {about.heading[1]}
            </Reveal>

            <Reveal delay={150} className="mt-[clamp(1.25rem,1.9vw,1.625rem)] flex flex-col gap-3.5">
              {about.body.map((paragraph) => (
                <p key={paragraph} className="max-w-[44ch] text-fine text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </Reveal>

            {action ? (
              <Reveal delay={230} className="mt-[clamp(1.625rem,2.6vw,2.125rem)]">
                <OutlinePill href="/about">Our Story</OutlinePill>
              </Reveal>
            ) : null}
          </div>
        </div>

        <MaskReveal
          parallax={0.12}
          className="relative h-[clamp(14rem,42vw,20rem)] overflow-hidden bg-deep lg:col-span-4 lg:h-auto"
        >
          <Image
            src="/images/vision-corridor.jpg"
            alt="An 11 kV distribution line running out across open country at first light."
            fill
            sizes="(max-width: 1024px) 100vw, 34vw"
            className="object-cover object-[34%_center]"
          />
        </MaskReveal>

        <Reveal
          delay={120}
          className="flex items-center bg-quote px-[clamp(1.75rem,3vw,2.75rem)] py-[clamp(2.5rem,4vw,3.5rem)] lg:col-span-3 lg:pad-end"
        >
          <p className="display text-(length:--text-quote) text-ink">
            {about.quote[0]}
            <br />
            {about.quote[1]}
            <br />
            {about.quote[2]}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
