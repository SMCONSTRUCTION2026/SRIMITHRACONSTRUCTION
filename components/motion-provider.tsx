"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * The scroll baseline.
 *
 * Lenis smooths the wheel and drives GSAP's ticker, and GSAP drives every
 * ScrollTrigger on the page — one clock for the whole site, so a reveal can
 * never tear against the scroll that caused it.
 *
 * Under `prefers-reduced-motion` none of this starts: the page scrolls natively
 * and `lib/gsap` settles every animated element into its final state instead.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      // Long, heavy glide — cinematic rather than springy.
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      // Touch devices keep their native momentum; smoothing it fights the OS.
      syncTouch: false,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    // GSAP's ticker becomes Lenis's rAF loop, so both run on one frame.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  // A route change swaps the whole document body: every trigger measured
  // against the old page is stale, and the new page must start at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return <>{children}</>;
}
