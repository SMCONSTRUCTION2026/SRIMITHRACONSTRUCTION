import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "./marks";

/**
 * The interface vocabulary: one filled pill, one outlined pill, one text
 * action. Every one of them carries the same arrow and the same 4px radius
 * family, so a call to action is always recognisable at a glance.
 */

const pillBase =
  "group inline-flex w-fit items-center gap-3 rounded-full text-fine font-medium transition-colors duration-500 ease-editorial";
const pillSize = "py-[0.9375rem] pr-6 pl-7";
const arrow = "h-4 w-4 shrink-0 transition-transform duration-500 ease-editorial group-hover:translate-x-1";

export function PillLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={`${pillBase} ${pillSize} bg-deep text-ground hover:bg-ink`}>
      {children}
      <ArrowRight className={arrow} />
    </Link>
  );
}

export function OutlinePill({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={`${pillBase} ${pillSize} border border-rule-strong text-ink hover:border-ink hover:bg-deep hover:text-ground`}
    >
      {children}
      <ArrowRight className={arrow} />
    </Link>
  );
}

/** Quiet link used beside supporting copy. */
export function TextAction({
  href,
  children,
  tone = "ink",
}: {
  href: string;
  children: ReactNode;
  tone?: "ink" | "invert";
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex w-fit items-center gap-2.5 text-fine font-medium transition-colors duration-300 ${
        tone === "invert" ? "text-ground/85 hover:text-ground" : "text-ink hover:text-accent"
      }`}
    >
      {children}
      <ArrowRight className={arrow} />
    </Link>
  );
}

/** The green letterspaced mark that opens every section. */
export function SectionLabel({
  children,
  tone = "accent",
  className,
}: {
  children: ReactNode;
  tone?: "accent" | "invert";
  className?: string;
}) {
  return (
    <p
      className={`label ${tone === "invert" ? "text-ground/55" : "text-accent"} ${className ?? ""}`}
    >
      {children}
    </p>
  );
}
