import Link from "next/link";
import { Logotype, MetaMark } from "./marks";
import { company, contactDetails, primaryNav } from "@/lib/content";

/**
 * The close: deep navy, the lockup and motto, and the three things a visitor
 * might still be looking for.
 */
export function SiteFooter() {
  return (
    <footer className="bg-deep text-ground">
      <div className="page-shell py-[clamp(2.25rem,3.5vw,3.125rem)]">
        <div className="grid gap-x-(--grid-gap) gap-y-[clamp(2.25rem,3.4vw,2.75rem)] sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logotype tone="invert" className="h-[clamp(2.75rem,4.6vw,4.25rem)]" />
            <p className="display mt-[clamp(1.125rem,1.8vw,1.5rem)] text-(length:--text-quote) text-ground/90">
              {company.tagline[0]}
              <br />
              {company.tagline[1]}
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <p className="label text-ground/45">Quick Links</p>
            <ul className="mt-[clamp(1.25rem,2vw,1.75rem)] flex flex-col gap-2.5">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-fine text-ground/75 transition-colors duration-300 hover:text-ground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <p className="label text-ground/45">Contact Info</p>
            <ul className="mt-[clamp(1.25rem,2vw,1.75rem)] flex flex-col gap-4 text-fine text-ground/75">
              <li className="flex gap-3.5">
                <MetaMark name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-accent-bright" />
                <address className="leading-[1.7] not-italic">
                  {contactDetails.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
              <li className="flex gap-3.5">
                <MetaMark name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-accent-bright" />
                <span className="flex flex-col gap-1">
                  {contactDetails.phones.map((phone) => (
                    <a key={phone.href} href={phone.href} className="transition-colors duration-300 hover:text-ground">
                      {phone.label}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3.5">
                <MetaMark name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-accent-bright" />
                <a
                  href={`mailto:${contactDetails.email}`}
                  className="break-all transition-colors duration-300 hover:text-ground"
                >
                  {contactDetails.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col lg:col-span-2">
            <p className="label text-ground/45">Follow Us</p>
            <a
              href={contactDetails.linkedin}
              rel="noreferrer noopener"
              target="_blank"
              aria-label={`${company.name} on LinkedIn`}
              className="mt-[clamp(1.25rem,2vw,1.75rem)] flex h-10 w-10 items-center justify-center border border-rule-invert text-ground/70 transition-colors duration-300 hover:border-ground/40 hover:text-ground"
            >
              <MetaMark name="linkedin" className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-[clamp(1.75rem,2.6vw,2.25rem)] flex flex-col gap-3 border-t border-rule-invert pt-[clamp(1.25rem,1.9vw,1.625rem)] sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-ground/40">GSTIN {contactDetails.gstin}</p>
          <p className="label text-ground/40">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
