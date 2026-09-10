/**
 * Drawn marks: the identity and the technical iconography.
 *
 * Every icon is a 24-unit line drawing on one stroke weight, so the services
 * row, the project metadata and the commitments read as a single engineering
 * notation rather than a set of illustrations.
 */

import Image from "next/image";

type MarkProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * The approved SM lockup, used as supplied — only its transparent padding has
 * been trimmed so it can be set to an exact optical height on the grid.
 * On the navy footer it is rendered as a solid white knock-out, which keeps the
 * artwork's shape and proportions while staying legible on a dark ground.
 */
export function Logotype({
  className,
  tone = "ink",
  priority = true,
}: MarkProps & { tone?: "ink" | "invert"; priority?: boolean }) {
  return (
    <Image
      src="/images/srimithra-lockup.png"
      alt="Srimithra Construction"
      width={1120}
      height={626}
      priority={priority}
      className={`w-auto ${tone === "invert" ? "brightness-0 invert" : ""} ${
        className ?? ""
      }`}
    />
  );
}

/* ==========================================================================
   Service marks
   ========================================================================== */

export function ServiceMark({ name, className }: MarkProps & { name: string }) {
  const common = { viewBox: "0 0 24 24", "aria-hidden": true as const, className };

  switch (name) {
    /* 11 kV distribution lines: a line structure carrying conductors away. */
    case "lines":
      return (
        <svg {...common}>
          <path d="M6 6.5v14M18 6.5v14" {...stroke} />
          <path d="M3.5 6.5h5M15.5 6.5h5M3.5 10h5M15.5 10h5" {...stroke} />
          <path d="M4.5 7.6q7.5 4.4 15 0M4.5 11.1q7.5 4.4 15 0M4.5 14.6q7.5 4.4 15 0" {...stroke} />
        </svg>
      );
    /* Distribution transformer: tank, radiator fins, three bushings. */
    case "transformer":
      return (
        <svg {...common}>
          <rect x="5.5" y="8.5" width="13" height="10" {...stroke} />
          <path d="M9 8.5V6M12 8.5V5.2M15 8.5V6" {...stroke} />
          <path d="M5.5 11.5h-2.4M5.5 15.5h-2.4M18.5 11.5h2.4M18.5 15.5h2.4" {...stroke} />
          <path d="M12 18.5v2.3" {...stroke} />
        </svg>
      );
    /* Pole with cross-arms and stay wires. */
    case "pole":
      return (
        <svg {...common}>
          <path d="M12 3v18" {...stroke} />
          <path d="M6.5 7h11M8 10.5h8" {...stroke} />
          <circle cx="8" cy="6.4" r="0.75" {...stroke} />
          <circle cx="16" cy="6.4" r="0.75" {...stroke} />
          <path d="M12 12.5 5.5 21M12 12.5 18.5 21" {...stroke} />
        </svg>
      );
    /* Protection and earthing: equipment above, earth electrode below. */
    case "earthing":
      return (
        <svg {...common}>
          <path d="M12 3v9" {...stroke} />
          <rect x="9.6" y="5.4" width="4.8" height="3.4" {...stroke} />
          <path d="M6 12h12M7.8 15h8.4M9.6 18h4.8" {...stroke} />
          <path d="M12 18v3" {...stroke} />
        </svg>
      );
    /* Testing and commissioning: an instrument dial with a probe. */
    case "testing":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.2" {...stroke} />
          <path d="m12 12 4.3-3.5" {...stroke} />
          <path d="M12 3.8v1.7M20.2 12h-1.7M12 20.2v-1.7M3.8 12h1.7" {...stroke} />
        </svg>
      );
    default:
      return null;
  }
}

/* ==========================================================================
   Commitment marks
   ========================================================================== */

export function CommitmentMark({ name, className }: MarkProps & { name: string }) {
  const common = { viewBox: "0 0 24 24", "aria-hidden": true as const, className };

  switch (name) {
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3.2 5.2 6v5.4c0 4.1 2.7 7.3 6.8 8.6 4.1-1.3 6.8-4.5 6.8-8.6V6z" {...stroke} />
          <path d="m9.2 12 2.1 2.1L15.2 10" {...stroke} />
        </svg>
      );
    case "gear":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" {...stroke} />
          <path
            d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5"
            {...stroke}
          />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.4" {...stroke} />
          <path d="M12 6.9v5.4l3.4 2" {...stroke} />
        </svg>
      );
    case "layers":
      return (
        <svg {...common}>
          <path d="m12 3.6 8.4 4.2-8.4 4.2L3.6 7.8z" {...stroke} />
          <path d="m3.6 12 8.4 4.2 8.4-4.2" {...stroke} />
          <path d="m3.6 16.2 8.4 4.2 8.4-4.2" {...stroke} />
        </svg>
      );
    default:
      return null;
  }
}

/* ==========================================================================
   Metadata and interface marks
   ========================================================================== */

export function MetaMark({ name, className }: MarkProps & { name: string }) {
  const common = { viewBox: "0 0 24 24", "aria-hidden": true as const, className };

  switch (name) {
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21c4.2-4.6 6.3-8 6.3-10.4A6.3 6.3 0 0 0 5.7 10.6C5.7 13 7.8 16.4 12 21z" {...stroke} />
          <circle cx="12" cy="10.4" r="2.3" {...stroke} />
        </svg>
      );
    case "client":
      return (
        <svg {...common}>
          <circle cx="9" cy="9.2" r="2.8" {...stroke} />
          <path d="M3.6 19.4c0-3 2.4-5.4 5.4-5.4s5.4 2.4 5.4 5.4" {...stroke} />
          <path d="M16.2 7.2a2.8 2.8 0 0 1 0 5.6M17.4 14.4c1.8.6 3 2.3 3 4.2" {...stroke} />
        </svg>
      );
    case "scheme":
      return (
        <svg {...common}>
          <path d="M6 3.6h8.4L19.2 8v12.4H6z" {...stroke} />
          <path d="M14.4 3.6V8h4.8" {...stroke} />
          <path d="M9 12.6h6M9 16.2h4.2" {...stroke} />
        </svg>
      );
    case "scope":
      return (
        <svg {...common}>
          <path d="m12 3 8 4.6v8.8L12 21l-8-4.6V7.6z" {...stroke} />
          <path d="m8.4 12 2.4 2.4 4.8-4.8" {...stroke} />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path
            d="M7.5 3.8 9.8 8 8 10a12.4 12.4 0 0 0 6 6l2-1.8 4.2 2.3v3A1.6 1.6 0 0 1 18.4 21C10.4 20.4 3.6 13.6 3 5.6a1.6 1.6 0 0 1 1.6-1.8z"
            {...stroke}
          />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5.4" width="18" height="13.2" {...stroke} />
          <path d="m3 6.6 9 6.6 9-6.6" {...stroke} />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
          <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9.75h4v11.25H3zM10 9.75h3.83v1.54h.05a4.2 4.2 0 0 1 3.78-2.08c4.04 0 4.79 2.66 4.79 6.12V21h-4v-4.9c0-1.17-.02-2.67-1.63-2.67-1.63 0-1.88 1.27-1.88 2.59V21h-3.99z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ==========================================================================
   Direction
   ========================================================================== */

export function ArrowRight({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M4.5 12h14m-5-5.2L18.8 12l-5.3 5.2" {...stroke} strokeWidth={1.4} />
    </svg>
  );
}

export function ArrowLeft({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M19.5 12h-14m5-5.2L5.2 12l5.3 5.2" {...stroke} strokeWidth={1.4} />
    </svg>
  );
}

export function PlayMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M9.6 7.6 17 12l-7.4 4.4z" fill="currentColor" />
    </svg>
  );
}
