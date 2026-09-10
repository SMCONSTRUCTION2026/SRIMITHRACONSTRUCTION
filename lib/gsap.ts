import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * One GSAP instance for the whole site.
 *
 * Registering the plugin here (rather than in each component) keeps it to a
 * single call, and `prefersReducedMotion` gives every animation one place to ask
 * whether it should run at all.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The site's motion vocabulary — heavy, settled, never springy. */
export const EASE = "power3.out";
export const DURATION = 1.1;

/**
 * Where a reveal begins. Elements already on screen at first paint are animated
 * immediately; everything else waits until it is properly into the frame.
 */
export const START = "top 88%";

export { gsap, ScrollTrigger };
