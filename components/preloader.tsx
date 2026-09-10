"use client";

import { useEffect, useRef, useState } from "react";
import { Logotype } from "./marks";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { company } from "@/lib/content";

/** Never hold the page longer than this, whatever the network is doing. */
const CEILING_MS = 3000;
/** Below this the screen reads as a flicker rather than an opening. */
const FLOOR_MS = 550;

/**
 * The opening curtain.
 *
 * It is rendered on the server too, so it covers the page from the very first
 * paint rather than appearing after hydration. It leaves on whichever comes
 * first: the window finishing its load, or the ceiling above — a preloader that
 * can strand a visitor behind a broken asset is worse than none at all.
 *
 * It runs once, on the first load. Route changes keep the layout mounted, so
 * moving between pages never raises it again.
 */
export function Preloader() {
  const [gone, setGone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;

    let timer: number;
    let fired = false;

    const leave = () => {
      if (fired) return;
      fired = true;
      window.clearTimeout(timer);
      window.removeEventListener("load", onReady);

      if (prefersReducedMotion()) {
        setGone(true);
        return;
      }

      gsap
        .timeline({ onComplete: () => setGone(true) })
        .to(bar.current, { scaleX: 1, duration: 0.32, ease: "power2.inOut" })
        .to(node.querySelectorAll("[data-curtain-item]"), {
          opacity: 0,
          y: -12,
          duration: 0.42,
          ease: "power2.in",
          stagger: 0.06,
        })
        .to(node, { opacity: 0, duration: 0.5, ease: "power2.inOut" }, "-=0.2");
    };

    const onReady = () => {
      const waited = performance.now() - start;
      timer = window.setTimeout(leave, Math.max(0, FLOOR_MS - waited));
    };

    const start = performance.now();

    if (!prefersReducedMotion()) {
      // The bar advances most of the way while waiting, then completes as the
      // curtain lifts — it reports progress rather than inventing percentages.
      gsap.to(bar.current, { scaleX: 0.72, duration: 1.5, ease: "power2.out" });
    }

    if (document.readyState === "complete") onReady();
    else window.addEventListener("load", onReady);

    const ceiling = window.setTimeout(leave, CEILING_MS);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(ceiling);
      window.removeEventListener("load", onReady);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      data-preloader
      aria-hidden="true"
      className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-[clamp(1.75rem,3vw,2.5rem)] bg-deep"
    >
      <div data-curtain-item>
        <Logotype tone="invert" className="h-[clamp(3rem,6vw,4.5rem)]" priority />
      </div>

      <div
        data-curtain-item
        className="h-px w-[clamp(7rem,18vw,11rem)] overflow-hidden bg-rule-invert"
      >
        <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-accent-bright" />
      </div>

      <p data-curtain-item className="label text-ground/45">
        {company.tagline[0]}
      </p>
    </div>
  );
}
