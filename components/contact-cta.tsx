import { Reveal } from "./reveal";
import { PillLink, SectionLabel } from "./ui";
import { contactSection } from "@/lib/content";

/**
 * The band that closes every page but the contact page itself. It carries the
 * same words as the contact page's opener — one source, set once in
 * `lib/content.ts` — and hands the reader on to the form.
 */
export function ContactCta() {
  return (
    <section className="bg-ground-soft py-(--section-y)">
      <div className="page-shell flex flex-col gap-[clamp(1.75rem,3vw,2.5rem)] lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Reveal>
            <SectionLabel>{contactSection.label}</SectionLabel>
          </Reveal>
          <Reveal
            as="h2"
            delay={80}
            className="display mt-[clamp(1rem,1.6vw,1.5rem)] text-(length:--text-section)"
          >
            {contactSection.heading[0]}
            <br />
            {contactSection.heading[1]}
            <span className="accent-stop">?</span>
          </Reveal>
        </div>

        <div className="flex flex-col items-start gap-6 lg:items-end lg:pb-2">
          <Reveal as="p" delay={150} className="text-body-lg text-ink-soft">
            {contactSection.lede}
          </Reveal>
          <Reveal delay={220}>
            <PillLink href="/contact">Start a Conversation</PillLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
