"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logotype } from "./marks";
import { PillLink } from "./ui";
import { company, contactDetails, primaryNav } from "@/lib/content";

/**
 * The masthead: lockup left, navigation centred, one call to action right.
 * It is sticky and sits on the page ground rather than over the photography, so
 * the hero's left column and the navigation share the same white field.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // A hairline appears only once the page has moved, so the masthead sits on
  // an unbroken white field at rest.
  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A route change under an open overlay must close it. Adjusted during render
  // rather than in an effect, so the panel is never painted over the new page.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  // While the overlay is open it owns the page: the body cannot scroll, Escape
  // closes it, and focus is kept inside the panel.
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const toggle = toggleRef.current;
    body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();

    return () => {
      body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      toggle?.focus();
    };
  }, [open]);

  /** Home matches only itself; every other entry also owns its sub-paths. */
  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-ground/95 backdrop-blur-sm transition-[border-color] duration-500 ${
        lifted ? "border-b border-rule" : "border-b border-transparent"
      }`}
    >
        <div className="page-shell flex h-(--header-h) items-center justify-between gap-6">
          <Link href="/" aria-label={`${company.name}, home`} className="shrink-0">
            <Logotype className="h-[clamp(2.375rem,4.4vw,4rem)]" />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-[clamp(1.5rem,2.4vw,2.375rem)]">
              {primaryNav.map((item) => {
                const current = isCurrent(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      className={`group relative block py-2 text-fine transition-colors duration-300 hover:text-ink ${
                        current ? "text-ink" : "text-ink/85"
                      }`}
                    >
                      {item.label}
                      {/* The current page carries the mark at rest; the rest draw
                          it on hover, so the bar shows exactly one green rule. */}
                      <span
                        aria-hidden="true"
                        className={`absolute -bottom-0.5 left-0 h-0.5 w-full origin-left bg-accent transition-transform duration-500 ease-editorial ${
                          current ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <PillLink href="/contact">Get a Quote</PillLink>
            </div>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="group -mr-1 flex h-10 w-10 items-center justify-end lg:hidden"
            >
              <span className="sr-only">Open menu</span>
              <span aria-hidden="true" className="flex w-6 flex-col items-end gap-[5px]">
                <span className="h-px w-6 bg-ink transition-all duration-500 ease-editorial group-hover:w-4" />
                <span className="h-px w-6 bg-ink" />
                <span className="h-px w-6 bg-ink transition-all duration-500 ease-editorial group-hover:w-4" />
              </span>
            </button>
          </div>
        </div>

      </header>

      {/* Full-screen menu, a sibling of the bar rather than a child: the bar's
          backdrop-filter would otherwise become this panel's containing block
          and clip it to the height of the bar. Kept mounted so the transition
          runs both ways. */}
      <div
        id="site-menu"
        ref={panelRef}
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-0 z-50 bg-deep text-ground transition-opacity duration-500 ease-editorial lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="page-shell flex h-full flex-col">
          <div className="flex h-(--header-h) shrink-0 items-center justify-between">
            <Logotype tone="invert" className="h-[clamp(2.375rem,4.4vw,4rem)]" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="group -mr-1 flex h-10 w-10 items-center justify-end"
            >
              <span className="sr-only">Close menu</span>
              <span aria-hidden="true" className="relative block h-6 w-6">
                <span className="absolute top-1/2 left-0 h-px w-6 rotate-45 bg-ground transition-transform duration-500 ease-editorial group-hover:rotate-[135deg]" />
                <span className="absolute top-1/2 left-0 h-px w-6 -rotate-45 bg-ground transition-transform duration-500 ease-editorial group-hover:rotate-45" />
              </span>
            </button>
          </div>

          <nav
            aria-label="Menu"
            className="flex flex-1 flex-col justify-center overflow-y-auto py-8"
          >
            <ul className="flex flex-col gap-[clamp(0.375rem,1.6vw,1rem)]">
              {primaryNav.map((item, index) => {
                const current = isCurrent(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={`display group flex w-fit items-baseline gap-4 text-[clamp(2.125rem,9vw,3.25rem)] transition-[opacity,transform] duration-700 ease-editorial hover:text-ground ${
                        current ? "text-ground" : "text-ground/70"
                      }`}
                      style={{
                        opacity: open ? 1 : 0,
                        transform: open ? "none" : "translateY(14px)",
                        transitionDelay: open ? `${110 + index * 55}ms` : "0ms",
                      }}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 shrink-0 translate-y-[-0.35em] rounded-full bg-accent-bright transition-opacity duration-300 group-hover:opacity-100 ${
                          current ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="shrink-0 border-t border-rule-invert py-[clamp(1.5rem,5vw,2.25rem)]">
            <p className="label text-ground/45">Get in touch</p>
            <ul className="mt-4 flex flex-col gap-2 text-small text-ground/85">
              {contactDetails.phones.map((phone) => (
                <li key={phone.href}>
                  <a href={phone.href}>{phone.label}</a>
                </li>
              ))}
              <li>
                <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
