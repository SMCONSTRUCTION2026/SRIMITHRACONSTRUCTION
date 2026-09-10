"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { DURATION, EASE, START, gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * The site's motion vocabulary.
 *
 * Every resting state — the offset a section rises from, the mask an image
 * uncovers behind — is declared in CSS against `data-anim`, so it is correct on
 * the very first paint and there is nothing to flash. GSAP then animates *out*
 * of that state when ScrollTrigger says the element has entered the frame.
 *
 * Under `prefers-reduced-motion` the attribute is simply removed: the resting
 * state stops applying, the element is at its natural position, and no
 * ScrollTrigger is ever created.
 */
type AnimKind = "reveal" | "draw" | "mask" | "stagger";

/** Milliseconds in the component API; GSAP wants seconds. */
const seconds = (ms: number) => ms / 1000;

/**
 * Hands the compositor hint back once an element has arrived. `will-change` is
 * a promise to the browser to keep a layer alive; leaving it set on every
 * animated element for the life of the page is how a site quietly eats memory.
 */
const released = (targets: Element | Element[]) => () =>
  gsap.set(targets, { willChange: "auto" });

function useAnim<T extends HTMLElement>(
  kind: AnimKind,
  build: (node: T) => gsap.core.Tween | undefined,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (prefersReducedMotion()) {
      node.removeAttribute("data-anim");
      return;
    }

    // A context keeps every tween and trigger this element made together, so
    // one revert on unmount cleans up all of it.
    const ctx = gsap.context(() => build(node), node);
    return () => ctx.revert();
    // `kind` and `build` are fixed for the life of the element.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, "data-anim": kind } as const;
}

function shiftStyle(shift?: number): CSSProperties | undefined {
  if (shift === undefined) return undefined;
  return { "--anim-shift": `${shift}px` } as CSSProperties;
}

/* ==========================================================================
   Fade-in-up — the heavy cinematic rise used by every block of text
   ========================================================================== */

type RevealProps = {
  children?: ReactNode;
  as?: ElementType;
  className?: string;
  /** Stagger within a group, in milliseconds. */
  delay?: number;
  /** Travel distance, in pixels. Defaults to the system's 28px. */
  shift?: number;
  id?: string;
};

export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  shift,
  id,
  ...rest
}: RevealProps) {
  const anim = useAnim<HTMLElement>("reveal", (node) =>
    gsap.to(node, {
      opacity: 1,
      y: 0,
      duration: DURATION,
      ease: EASE,
      delay: seconds(delay),
      onComplete: released(node),
      scrollTrigger: { trigger: node, start: START, once: true },
    }),
  );

  return (
    <Tag {...anim} id={id} className={className} style={shiftStyle(shift)} {...rest}>
      {children}
    </Tag>
  );
}

/* ==========================================================================
   Stagger — a grid powering on one node at a time
   ========================================================================== */

export function Stagger({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  /** Interval between children, in milliseconds. */
  step = 110,
  id,
}: RevealProps & { step?: number }) {
  const anim = useAnim<HTMLElement>("stagger", (node) => {
    const nodes = Array.from(node.children);
    return gsap.to(nodes, {
      opacity: 1,
      y: 0,
      duration: DURATION,
      ease: EASE,
      delay: seconds(delay),
      stagger: seconds(step),
      onComplete: released(nodes),
      scrollTrigger: { trigger: node, start: START, once: true },
    });
  });

  return (
    <Tag {...anim} id={id} className={className}>
      {children}
    </Tag>
  );
}

/* ==========================================================================
   Drawn rule — a conductor-thin line that draws itself in
   ========================================================================== */

export function DrawnRule({ className, delay = 0 }: { className?: string; delay?: number }) {
  const anim = useAnim<HTMLDivElement>("draw", (node) =>
    gsap.to(node, {
      scaleX: 1,
      duration: 1.3,
      ease: EASE,
      delay: seconds(delay),
      onComplete: released(node),
      scrollTrigger: { trigger: node, start: START, once: true },
    }),
  );

  return <div {...anim} aria-hidden="true" className={`h-px bg-rule ${className ?? ""}`} />;
}

/* ==========================================================================
   Mask reveal — a photograph uncovering from its lower edge, with optional
   parallax so the picture drifts slower than the text beside it
   ========================================================================== */

export function MaskReveal({
  children,
  className,
  delay = 0,
  /** Fraction of the frame's own height the picture drifts across. 0 disables. */
  parallax = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  parallax?: number;
}) {
  const inner = useRef<HTMLDivElement>(null);

  const anim = useAnim<HTMLDivElement>("mask", (node) => {
    gsap.to(node, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.35,
      ease: EASE,
      delay: seconds(delay),
      onComplete: released(node),
      scrollTrigger: { trigger: node, start: START, once: true },
    });

    gsap.to(node.querySelectorAll("img"), {
      scale: 1,
      duration: 1.9,
      ease: EASE,
      delay: seconds(delay),
      scrollTrigger: { trigger: node, start: START, once: true },
    });

    if (parallax && inner.current) {
      const layer = inner.current;
      gsap.fromTo(
        layer,
        { y: () => -node.offsetHeight * parallax },
        {
          y: () => node.offsetHeight * parallax,
          ease: "none",
          scrollTrigger: {
            trigger: node,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    }
    return undefined;
  });

  if (!parallax) {
    return (
      <div {...anim} className={className}>
        {children}
      </div>
    );
  }

  // The drifting layer is taller than its frame by the drift distance at each
  // end, so the picture can never pull a gap in behind itself.
  const overhang = `${parallax * 100}%`;
  return (
    <div {...anim} className={className}>
      <div
        ref={inner}
        className="absolute inset-x-0"
        style={{ top: `-${overhang}`, bottom: `-${overhang}` }}
      >
        {children}
      </div>
    </div>
  );
}
