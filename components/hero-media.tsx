"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { hero } from "@/lib/content";

/**
 * The hero photograph: a Srimithra crew erecting an 11 kV distribution pole.
 *
 * It drifts a little slower than the page and grows a fraction as the hero
 * leaves — enough to give the opening depth, not enough to read as an effect.
 * Two plates sit on the picture: the qualities down one edge, the voltage at
 * the foot.
 */
export function HeroMedia() {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    const box = frame.current;
    if (!layer || !box || prefersReducedMotion()) return;

    // The picture drifts a little slower than the page and grows a fraction as
    // the hero leaves — enough to give the opening depth, not enough to read as
    // an effect. Scrubbed, so it is welded to the scroll position.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        layer,
        { yPercent: -4, scale: 1.08 },
        {
          yPercent: 6,
          scale: 1.14,
          ease: "none",
          scrollTrigger: {
            trigger: box,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    }, box);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={frame} className="absolute inset-0 overflow-hidden bg-deep">
      <div ref={ref} className="absolute inset-0 scale-[1.08] will-change-transform">
        <Image
          src="/images/hero-erection.jpg"
          alt="A Srimithra Construction crew erecting an 11 kV distribution pole, one lineman climbing to the cross-arms."
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 52vw"
          className="object-cover object-[42%_45%]"
        />
      </div>

      {/* Just enough tone for the white plates to hold at either end. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-deep/40 via-transparent to-deep/55"
      />

      <ul className="absolute top-[clamp(1.5rem,3vw,2.75rem)] right-[clamp(1.25rem,2.6vw,2.5rem)] flex flex-col gap-1 text-right">
        {hero.qualities.map((quality) => (
          <li key={quality} className="label text-ground/90">
            {quality}
          </li>
        ))}
      </ul>

      <div className="absolute right-[clamp(1.25rem,2.6vw,2.5rem)] bottom-[clamp(1.5rem,3vw,2.75rem)] border-l border-ground/35 pl-[clamp(0.875rem,1.4vw,1.25rem)]">
        <p className="display text-[clamp(1.375rem,1.9vw,1.75rem)] text-ground">
          {hero.plate.value}
        </p>
        <p className="label mt-1.5 text-ground/70">
          {hero.plate.caption[0]}
          <br />
          <span className="text-ground/90">{hero.plate.caption[1]}</span>
        </p>
      </div>
    </div>
  );
}
