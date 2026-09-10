"use server";

import { Resend } from "resend";
import { contactDetails, contactSection } from "@/lib/content";

export type EnquiryState = {
  status: "idle" | "sent" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "phone" | "details", string>>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Keeps a stray newline in a field out of the mail headers. */
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

type Enquiry = {
  name: string;
  company: string;
  email: string;
  phone: string;
  details: string;
};

function render(enquiry: Enquiry) {
  const rows: [string, string][] = [
    ["Name", enquiry.name],
    ["Company", enquiry.company || "—"],
    ["Email", enquiry.email],
    ["Phone", enquiry.phone],
  ];

  const text = [
    `New enquiry from the ${contactDetails.email} website`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Project details:",
    enquiry.details,
  ].join("\n");

  const html = `
<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#17233c;line-height:1.6">
  <p style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#3f8a3c;margin:0 0 16px">
    New Website Enquiry
  </p>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 24px">
    ${rows
      .map(
        ([label, value]) => `<tr>
      <td style="padding:6px 24px 6px 0;color:#626d7d;font-size:13px;vertical-align:top">${label}</td>
      <td style="padding:6px 0;font-size:14px">${escapeHtml(value)}</td>
    </tr>`,
      )
      .join("")}
  </table>
  <p style="font-size:13px;color:#626d7d;margin:0 0 6px">Project details</p>
  <p style="font-size:14px;white-space:pre-wrap;margin:0;padding-top:14px;border-top:1px solid rgba(23,35,60,.12)">${escapeHtml(
    enquiry.details,
  )}</p>
</div>`.trim();

  return { text, html };
}

/**
 * Handles a project enquiry.
 *
 * Delivery is Resend. `RESEND_API_KEY` and `CONTACT_TO_EMAIL` must be set;
 * without them the action refuses to claim the message was sent and points the
 * visitor at the phone number and inbox instead — a form that silently drops
 * enquiries is worse than no form.
 */
export async function submitEnquiry(
  _previous: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const value = (key: string) => String(formData.get(key) ?? "").trim();

  const enquiry: Enquiry = {
    name: oneLine(value("name")),
    company: oneLine(value("company")),
    email: oneLine(value("email")),
    phone: oneLine(value("phone")),
    details: value("details"),
  };

  // Honeypot: a real visitor never fills this in.
  if (value("website")) return { status: "sent" };

  const errors: EnquiryState["errors"] = {};
  if (enquiry.name.length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL.test(enquiry.email)) errors.email = "Please enter a valid email address.";
  if (enquiry.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Please enter a phone number we can reach you on.";
  }
  if (enquiry.details.length < 10) {
    errors.details = "A sentence or two about the project helps us respond well.";
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please check the highlighted fields.", errors };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!apiKey || !to) {
    console.warn("[enquiry] RESEND_API_KEY or CONTACT_TO_EMAIL is not set — nothing was sent.");
    return { status: "error", message: unreachable() };
  }

  const { text, html } = render(enquiry);

  try {
    const { data, error } = await new Resend(apiKey).emails.send({
      from,
      to: [to],
      // Replying to the notification reaches the enquirer, not the sender.
      replyTo: enquiry.email,
      subject: `${contactSection.label}: ${enquiry.name}${
        enquiry.company ? ` — ${enquiry.company}` : ""
      }`,
      text,
      html,
    });

    if (error) throw new Error(`${error.name}: ${error.message}`);

    // The id is the handle for this message in the Resend dashboard. Without it
    // in the log there is no way to tell an enquiry that was never sent from one
    // that was sent and then filtered by the receiving server.
    console.info(`[enquiry] accepted by Resend as ${data?.id} (${from} -> ${to})`);
  } catch (cause) {
    console.error("[enquiry] delivery failed", cause);
    return { status: "error", message: unreachable() };
  }

  return { status: "sent" };
}

/** One wording for every failure — the visitor only needs the way through. */
function unreachable() {
  return `We could not send that just now. Please email ${contactDetails.email} or call ${contactDetails.phones[0].label}.`;
}
