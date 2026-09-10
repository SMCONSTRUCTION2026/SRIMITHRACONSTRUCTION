import { ArrowRight, ServiceMark } from "./marks";
import { Reveal, Stagger } from "./reveal";
import { SectionLabel, TextAction } from "./ui";
import { services } from "@/lib/content";

/**
 * Five capabilities set as columns of one table, divided by hairlines. No
 * cards, no fills, no radius — the rules do the work.
 *
 * `action` is false on the page this section is the subject of, where the link
 * would only point back at the page the reader is already on.
 */
export function Services({ action = true }: { action?: boolean }) {
  return (
    <section id="services" className="bg-ground-soft py-(--section-y)">
      <div className="page-shell">
        <div className="grid gap-x-(--grid-gap) gap-y-[clamp(1.75rem,3vw,2.5rem)] lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <SectionLabel>Our Services</SectionLabel>
            </Reveal>
            <Reveal
              as="h2"
              delay={80}
              className="display mt-[clamp(1rem,1.6vw,1.5rem)] text-(length:--text-section)"
            >
              Complete 11 kV
              <br />
              Distribution Solutions<span className="accent-stop">.</span>
            </Reveal>
          </div>

          <div className="flex flex-col items-start gap-6 lg:col-span-5 lg:col-start-8 lg:pt-2">
            <Reveal as="p" delay={150} className="max-w-[46ch] text-body text-ink-soft">
              We execute end-to-end 11 kV electrical distribution infrastructure
              with a focus on safety, quality and timely delivery.
            </Reveal>
            {action ? (
              <Reveal delay={220}>
                <TextAction href="/services">View All Services</TextAction>
              </Reveal>
            ) : null}
          </div>
        </div>

        {/* Five columns divided by hairlines on desktop. Below that the table
            turns into a single ruled list — two columns would leave the fifth
            service orphaned in a row of its own. */}
        <Stagger
          as="ul"
          className="mt-[clamp(2.25rem,3.6vw,3.25rem)] grid border-t border-rule lg:grid-cols-5"
        >
          {services.map((service, index) => (
            <li
              key={service.id}
              className="group flex flex-col border-b border-rule py-[clamp(1.5rem,2.2vw,1.875rem)] last:border-b-0 lg:border-b-0 lg:px-[clamp(1rem,1.8vw,1.75rem)] lg:first:pl-0 lg:last:pr-0 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-rule"
            >
              <ServiceMark
                name={service.mark}
                className="h-7 w-7 text-ink transition-colors duration-500 ease-editorial group-hover:text-accent"
              />

              <p className="label mt-[clamp(1.125rem,1.8vw,1.5rem)] text-accent">
                {String(index + 1).padStart(2, "0")}
              </p>

              <h3 className="mt-3 text-(length:--text-heading) leading-[1.35] font-medium text-ink">
                {service.title[0]}
                <br />
                {service.title[1]}
              </h3>

              <p className="mt-3 max-w-[46ch] text-fine text-ink-soft lg:max-w-[26ch]">
                {service.description}
              </p>

              <span
                aria-hidden="true"
                className="mt-[clamp(1.125rem,1.8vw,1.5rem)] text-ink-faint transition-colors duration-500 ease-editorial group-hover:text-accent"
              >
                <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-editorial group-hover:translate-x-1" />
              </span>
            </li>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
