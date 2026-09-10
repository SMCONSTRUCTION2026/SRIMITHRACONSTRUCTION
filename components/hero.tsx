import { HeroMedia } from "./hero-media";
import { Reveal } from "./reveal";
import { PillLink } from "./ui";
import { VideoDialog } from "./video-dialog";
import { company, hero } from "@/lib/content";

/**
 * The opening: a composed four-line headline on the left of the grid, the
 * photograph running off the right edge of the viewport. The two halves meet on
 * the container's centre line.
 */
export function Hero() {
  return (
    // Exactly what the masthead leaves of the viewport: on desktop the text
    // column fills it, and below `lg` the picture takes whatever the text does
    // not, so the whole opening lands on one screen at any height.
    <section className="relative flex min-h-[calc(100svh-var(--header-h))] flex-col lg:block">
      <div className="page-shell relative">
        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col justify-center py-[clamp(1.5rem,4svh,3.25rem)] lg:min-h-[calc(100svh-var(--header-h))] lg:pr-[clamp(2rem,4vw,4rem)]">
            <Reveal as="p" className="label text-accent">
              {hero.eyebrow}
            </Reveal>

            <Reveal
              as="h1"
              delay={90}
              className="display mt-[clamp(0.75rem,2.4svh,1.875rem)] text-(length:--text-hero)"
            >
              {hero.headline.map((line, index) => (
                <span key={line} className="block">
                  {line}
                  {index === hero.headline.length - 1 ? (
                    <span className="accent-stop">.</span>
                  ) : null}
                </span>
              ))}
            </Reveal>

            <Reveal
              as="p"
              delay={180}
              className="mt-[clamp(0.75rem,2svh,1.625rem)] max-w-[42ch] text-body text-ink-soft"
            >
              {hero.lede.map((line, index) => (
                <span key={line}>
                  {line}
                  {index < hero.lede.length - 1 ? <br className="hidden sm:inline" /> : null}{" "}
                </span>
              ))}
            </Reveal>

            <Reveal
              delay={270}
              className="mt-[clamp(1.25rem,3svh,2.375rem)] flex flex-wrap items-center gap-[clamp(1.25rem,2.4vw,2.25rem)]"
            >
              <PillLink href="/projects">Explore Our Work</PillLink>
              <VideoDialog src={process.env.NEXT_PUBLIC_HERO_VIDEO_URL} />
            </Reveal>

            <Reveal delay={360} className="mt-[clamp(1.25rem,3.4svh,2.625rem)]">
              <div className="h-px w-10 bg-accent" />
              <p className="label mt-[clamp(0.625rem,1.4svh,1.125rem)] text-ink-soft">
                {company.tagline[0]}
                <br />
                {company.tagline[1]}
              </p>
            </Reveal>
          </div>

          {/* Placeholder column: the picture itself is bled to the viewport
              edge below, so it can never be clipped by the container. */}
          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </div>

      {/* One picture, placed twice over. Below the desktop breakpoint it sits
          full-bleed under the text; from `lg` it lifts out of the flow and runs
          from the container's centre line to the right edge of the viewport. */}
      <div className="relative min-h-[13rem] flex-1 lg:absolute lg:top-0 lg:right-0 lg:bottom-0 lg:w-[50vw] lg:flex-none">
        <HeroMedia />
      </div>
    </section>
  );
}
