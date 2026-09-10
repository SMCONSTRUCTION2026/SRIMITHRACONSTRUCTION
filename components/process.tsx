"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "./reveal";
import { SectionLabel, TextAction } from "./ui";
import { processSteps } from "@/lib/content";

/**
 * The route from survey to commissioning.
 *
 * Desktop sets it as one conductor-thin line with a green marker per stage; the
 * line fills as the section is read, and each stage lights as the line reaches
 * it. Below the desktop breakpoint the same line turns and runs vertically.
 *
 * Progress is written straight to the DOM rather than held in state: it changes
 * on every scroll frame, and re-rendering the section that often would be waste.
 */
const LAST = processSteps.length - 1;

export function Process({ action = true }: { action?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const fills = node.querySelectorAll<HTMLElement>("[data-fill]");
    const lit = node.querySelectorAll<HTMLElement>("[data-lit]");

    const apply = (progress: number) => {
      for (const fill of fills) {
        if (fill.dataset.fill === "x") fill.style.width = `${progress * 100}%`;
        else fill.style.height = `calc(${progress * 100}% - 0.75rem)`;
      }
      for (const element of lit) {
        const index = Number(element.dataset.step);
        element.dataset.lit = String(progress >= index / LAST - 0.02);
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(1);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const { top, height } = node.getBoundingClientRect();
      // Runs from the marker row entering the lower third of the viewport to it
      // clearing the upper third — the line completes as the last stage is read.
      const span = window.innerHeight * 0.66 + height;
      const travelled = window.innerHeight * 0.82 - top;
      apply(Math.min(1, Math.max(0, travelled / span)));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const markerClass =
    "h-3 w-3 shrink-0 rounded-full border-2 border-rule-strong bg-ground-soft transition-colors duration-500 ease-editorial data-[lit=true]:border-accent data-[lit=true]:bg-accent";
  const numberClass =
    "label text-ink-faint transition-colors duration-500 ease-editorial data-[lit=true]:text-accent";

  return (
    <section id="process" className="bg-ground-soft py-(--section-y)">
      <div className="page-shell">
        <div className="grid gap-x-(--grid-gap) gap-y-[clamp(1.75rem,3vw,2.5rem)] lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <SectionLabel>Our Process</SectionLabel>
            </Reveal>
            <Reveal
              as="h2"
              delay={80}
              className="display mt-[clamp(1rem,1.6vw,1.5rem)] text-(length:--text-section)"
            >
              From Survey
              <br />
              to Commissioning<span className="accent-stop">.</span>
            </Reveal>
          </div>

          <div className="flex flex-col items-start gap-6 lg:col-span-5 lg:col-start-8 lg:pt-2">
            <Reveal as="p" delay={150} className="max-w-[44ch] text-body text-ink-soft">
              A structured approach to deliver reliable and sustainable 11 kV
              distribution infrastructure.
            </Reveal>
            {action ? (
              <Reveal delay={220}>
                <TextAction href="/services">Our Process</TextAction>
              </Reveal>
            ) : null}
          </div>
        </div>

        <div ref={ref} className="mt-[clamp(2.25rem,3.6vw,3.25rem)]">
          {/* Desktop: one horizontal line, six markers, six stages. */}
          <div className="hidden md:block">
            <div className="relative h-3">
              <div className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-rule-strong" />
              <div
                data-fill="x"
                className="absolute top-1/2 left-0 h-px w-0 -translate-y-1/2 bg-accent"
              />
              <ul className="relative grid grid-cols-6">
                {processSteps.map((stepItem, index) => (
                  <li key={stepItem.number} className="flex h-3 items-center">
                    <span data-lit="false" data-step={index} className={markerClass} />
                  </li>
                ))}
              </ul>
            </div>

            <ol className="mt-[clamp(1rem,1.6vw,1.375rem)] grid grid-cols-6 gap-x-(--grid-gap)">
              {processSteps.map((stepItem, index) => (
                <li key={stepItem.number} className="pr-4">
                  <p data-lit="false" data-step={index} className={numberClass}>
                    {stepItem.number}
                  </p>
                  <h3 className="mt-2.5 text-fine leading-[1.45] font-medium text-ink">
                    {stepItem.title[0]}
                    <br />
                    {stepItem.title[1]}
                  </h3>
                </li>
              ))}
            </ol>
          </div>

          {/* Mobile: the same line, turned through ninety degrees. */}
          <ol className="relative md:hidden">
            <div className="absolute top-1.5 bottom-1.5 left-[5px] w-px bg-rule-strong" />
            <div data-fill="y" className="absolute top-1.5 left-[5px] h-0 w-px bg-accent" />
            {processSteps.map((stepItem, index) => (
              <li key={stepItem.number} className="relative flex gap-5 pb-8 last:pb-0">
                <span data-lit="false" data-step={index} className={`mt-1.5 ${markerClass}`} />
                <div>
                  <p data-lit="false" data-step={index} className={numberClass}>
                    {stepItem.number}
                  </p>
                  <h3 className="mt-1.5 text-small font-medium text-ink">
                    {stepItem.title.join(" ")}
                  </h3>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
