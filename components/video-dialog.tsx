"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PlayMark } from "./marks";

/**
 * The hero's secondary action.
 *
 * The film is supplied through `NEXT_PUBLIC_HERO_VIDEO_URL`. Until one is set
 * the dialog says so plainly and points at the current project rather than
 * pretending to play something — the control still holds its place in the
 * composition, but it never misleads.
 */
export function VideoDialog({ src }: { src?: string }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      {/* <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-4 text-fine font-medium text-ink"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-rule-strong transition-colors duration-500 ease-editorial group-hover:border-ink group-hover:bg-deep group-hover:text-ground">
          <PlayMark className="h-4 w-4 translate-x-px" />
        </span>
        Watch Video
      </button> */}

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Project film"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-deep/92 p-[clamp(1.25rem,5vw,3rem)]"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-[68rem]">
            <div className="mb-4 flex justify-end">
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="label text-ground/70 transition-colors duration-300 hover:text-ground"
              >
                Close
              </button>
            </div>

            {src ? (
              <div className="aspect-video w-full bg-black">
                <video src={src} controls autoPlay playsInline className="h-full w-full" />
              </div>
            ) : (
              <div className="flex aspect-video w-full flex-col items-start justify-center border border-rule-invert px-[clamp(1.5rem,5vw,4rem)]">
                <p className="label text-ground/50">Project film</p>
                <p className="display mt-5 max-w-[18ch] text-[clamp(1.5rem,3.4vw,2.5rem)] text-ground">
                  Our project film is in production<span className="accent-stop">.</span>
                </p>
                <Link
                  href="/projects"
                  onClick={() => setOpen(false)}
                  className="mt-8 text-fine font-medium text-ground/80 underline underline-offset-4 transition-colors duration-300 hover:text-ground"
                >
                  See the current project
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
