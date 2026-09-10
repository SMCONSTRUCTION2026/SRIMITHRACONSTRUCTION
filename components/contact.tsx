"use client";

import { useActionState } from "react";
import { submitEnquiry, type EnquiryState } from "@/app/actions";
import { ArrowRight, MetaMark } from "./marks";
import { Reveal } from "./reveal";
import { SectionLabel } from "./ui";
import { contactDetails, contactSection, formFields } from "@/lib/content";

const initialState: EnquiryState = { status: "idle" };

const fieldClass =
  "mt-2 w-full rounded-[3px] border border-rule bg-ground px-4 py-2.5 text-fine text-ink transition-colors duration-300 outline-none placeholder:text-ink-faint focus:border-ink aria-[invalid]:border-red-700/60";

function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="text-fine text-ink-soft">
      {children}
      {required ? <span className="ml-0.5 text-accent">*</span> : null}
    </label>
  );
}

export function Contact() {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState);

  return (
    <section id="contact" className="bg-ground py-(--section-y)">
      <div className="page-shell grid gap-x-(--grid-gap) gap-y-[clamp(2.5rem,4.5vw,4rem)] lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionLabel>{contactSection.label}</SectionLabel>
          </Reveal>

          <Reveal
            as="h2"
            delay={80}
            className="display mt-[clamp(1rem,1.6vw,1.5rem)] text-(length:--text-section)"
          >
            {contactSection.heading[0]}
            <br />
            {contactSection.heading[1]}
            <span className="accent-stop">?</span>
          </Reveal>

          <Reveal as="p" delay={150} className="mt-[clamp(1rem,1.6vw,1.375rem)] text-body-lg text-ink-soft">
            {contactSection.lede}
          </Reveal>

          <Reveal delay={220} className="mt-[clamp(1.75rem,3vw,2.5rem)]">
            <ul className="flex flex-col gap-[clamp(1.125rem,1.8vw,1.5rem)]">
              <li className="flex gap-4">
                <MetaMark name="phone" className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-accent" />
                <div className="flex flex-col gap-1">
                  {contactDetails.phones.map((phone) => (
                    <a
                      key={phone.href}
                      href={phone.href}
                      className="text-fine text-ink transition-colors duration-300 hover:text-accent"
                    >
                      {phone.label}
                    </a>
                  ))}
                </div>
              </li>

              <li className="flex gap-4">
                <MetaMark name="mail" className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-accent" />
                <a
                  href={`mailto:${contactDetails.email}`}
                  className="text-fine break-all text-ink transition-colors duration-300 hover:text-accent"
                >
                  {contactDetails.email}
                </a>
              </li>

              <li className="flex gap-4">
                <MetaMark name="pin" className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-accent" />
                <address className="text-fine leading-[1.7] text-ink not-italic">
                  {contactDetails.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>

            </ul>
          </Reveal>
        </div>

        <Reveal delay={120} className="lg:col-span-7">
          <div className="border border-rule bg-ground-soft/60 p-[clamp(1.375rem,2.4vw,2.25rem)]">
            {state.status === "sent" ? (
              <div className="flex min-h-[20rem] flex-col items-start justify-center">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-accent text-accent"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.3}>
                    <path d="m7 12.5 3.4 3.4L17.5 8.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className="display mt-7 text-(length:--text-quote)">Thank you.</h3>
                <p className="mt-3 max-w-[36ch] text-fine text-ink-soft">
                  We have received your enquiry and will get back to you shortly.
                </p>
              </div>
            ) : (
              <form action={formAction} noValidate className="flex flex-col gap-[clamp(1rem,1.5vw,1.25rem)]">
                {/* Honeypot — hidden from people, tempting to bots. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute h-0 w-0 overflow-hidden opacity-0"
                />

                <div className="grid gap-[clamp(1rem,1.5vw,1.25rem)] sm:grid-cols-2">
                  {formFields.map((field) => {
                    const error = state.errors?.[field.name as keyof typeof state.errors];
                    return (
                      <p key={field.name} className="flex flex-col">
                        <FieldLabel htmlFor={field.name} required={field.required}>
                          {field.label}
                        </FieldLabel>
                        <input
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          autoComplete={field.autoComplete}
                          required={field.required}
                          aria-invalid={error ? true : undefined}
                          aria-describedby={error ? `${field.name}-error` : undefined}
                          className={fieldClass}
                        />
                        {error ? (
                          <span id={`${field.name}-error`} className="mt-2 text-fine text-red-800">
                            {error}
                          </span>
                        ) : null}
                      </p>
                    );
                  })}
                </div>

                <p className="flex flex-col">
                  <FieldLabel htmlFor="details" required>
                    Project Details
                  </FieldLabel>
                  <textarea
                    id="details"
                    name="details"
                    rows={4}
                    required
                    aria-invalid={state.errors?.details ? true : undefined}
                    aria-describedby={state.errors?.details ? "details-error" : undefined}
                    className={`${fieldClass} resize-y`}
                  />
                  {state.errors?.details ? (
                    <span id="details-error" className="mt-2 text-fine text-red-800">
                      {state.errors.details}
                    </span>
                  ) : null}
                </p>

                {state.status === "error" && state.message ? (
                  <p role="alert" className="text-fine text-red-800">
                    {state.message}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={pending}
                  className="group mt-1 inline-flex w-fit items-center gap-3 rounded-full bg-deep py-[0.9375rem] pr-6 pl-7 text-fine font-medium text-ground transition-colors duration-500 ease-editorial hover:bg-ink disabled:opacity-60"
                >
                  {pending ? "Sending…" : "Send Message"}
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-editorial group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
