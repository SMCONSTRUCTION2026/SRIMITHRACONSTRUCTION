"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight, MetaMark } from "./marks";
import { MaskReveal, Reveal } from "./reveal";
import { PillLink, SectionLabel } from "./ui";
import { featuredProject } from "@/lib/content";

/** Three frames of the one live project. */
const frames = [
  {
    src: featuredProject.image,
    alt: featuredProject.alt,
  },
  {
    src: "/images/project-detail.jpg",
    alt: "Bushings, radiators and high-voltage connections of the distribution transformer.",
  },
  {
    src: "/images/project-erection.jpg",
    alt: "The erection crew setting a transformer structure with a boom truck.",
  },
];

const metadata = [
  { mark: "pin", label: "Location", value: featuredProject.location },
  { mark: "client", label: "Client", value: featuredProject.client },
  { mark: "scheme", label: "Scheme", value: featuredProject.scheme },
  { mark: "scope", label: "Scope", value: featuredProject.scope.join("  |  ") },
] as const;

/**
 * The project set as an architectural case study: the record on the left of the
 * grid, the photography running off the right edge with its caption plate
 * seated beneath.
 *
 * `action` is false on the page this section is the subject of, where the link
 * would only point back at the page the reader is already on.
 */
export function ProjectFeature({ action = true }: { action?: boolean }) {
  const [index, setIndex] = useState(0);
  const step = (delta: number) =>
    setIndex((current) => (current + delta + frames.length) % frames.length);

  return (
    <section id="projects" className="bg-ground-panel py-(--section-y)">
      {/* The record sits on the page grid; the photography runs off the right
          edge of the viewport, as it does in the hero. */}
      <div className="grid gap-y-[clamp(2rem,3.4vw,3rem)] lg:grid-cols-[minmax(0,1fr)_50vw]">
        <div className="pad-start pr-[var(--page-x)] lg:pr-[clamp(2rem,3.6vw,3.75rem)]">
          <Reveal>
            <SectionLabel>Featured Project</SectionLabel>
          </Reveal>

          <Reveal
            as="h2"
            delay={80}
            className="display mt-[clamp(1rem,1.6vw,1.5rem)] text-(length:--text-section)"
          >
            {featuredProject.title[0]}
            <br />
            {featuredProject.title[1]}
            <span className="accent-stop">.</span>
          </Reveal>

          <Reveal delay={150} className="mt-[clamp(1.5rem,2.4vw,2rem)]">
            <div className="h-px w-10 bg-accent" />
            <dl className="mt-[clamp(1.25rem,1.9vw,1.625rem)] flex flex-col gap-[clamp(0.875rem,1.4vw,1.125rem)]">
              {metadata.map((row) => (
                <div key={row.label} className="flex gap-4">
                  <MetaMark name={row.mark} className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-accent" />
                  <div>
                    <dt className="label text-ink-faint">{row.label}</dt>
                    <dd className="mt-1.5 max-w-[34ch] text-fine leading-[1.65] text-ink">
                      {row.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </Reveal>

          {action ? (
            <Reveal delay={230} className="mt-[clamp(1.75rem,2.8vw,2.375rem)]">
              <PillLink href="/projects">View Project Details</PillLink>
            </Reveal>
          ) : null}
        </div>

        <div className="pl-[var(--page-x)] lg:pl-0">
          <MaskReveal
            parallax={0.1}
            className="relative aspect-[4/3] w-full overflow-hidden bg-deep sm:aspect-[16/9]"
          >
            {frames.map((frame, position) => (
              <Image
                key={frame.src}
                src={frame.src}
                alt={frame.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-cover transition-opacity duration-700 ease-editorial ${
                  position === index ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={position === index ? undefined : true}
              />
            ))}
          </MaskReveal>

          <Reveal
            delay={160}
            className="lg:pad-end flex w-full items-center justify-between gap-6 pt-[clamp(1rem,1.6vw,1.375rem)] pr-[var(--page-x)] lg:w-[92%] lg:bg-ground lg:py-[clamp(1rem,1.6vw,1.375rem)] lg:pl-[clamp(1.25rem,2.4vw,2.25rem)]"
          >
            <p className="display text-(length:--text-quote) text-ink">
              {featuredProject.caption[0]}
              <br />
              {featuredProject.caption[1]}
            </p>

            <div className="flex shrink-0 items-center gap-[clamp(0.875rem,1.6vw,1.5rem)]">
              <p className="text-fine text-ink-faint">
                <span className="text-ink">{String(index + 1).padStart(2, "0")}</span>
                {" / "}
                {String(frames.length).padStart(2, "0")}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous project image"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-rule-strong text-ink transition-colors duration-300 hover:border-ink"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next project image"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-deep text-ground transition-colors duration-300 hover:bg-ink"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
