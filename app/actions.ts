"use server";

import { Resend } from "resend";
import { company, contactDetails } from "@/lib/content";

export type EnquiryState = {
  status: "idle" | "sent" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "phone" | "details", string>>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Keeps a stray newline in a field out of the mail headers. */
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

type Enquiry = {
  name: string;
  company: string;
  email: string;
  phone: string;
  details: string;
};

/** Coimbatore time, because that is where the desk reading this sits. */
function submittedAt() {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

function render(enquiry: Enquiry) {
  const stamp = submittedAt();
  const rows: [string, string][] = [
    ["Name", enquiry.name],
    ["Company", enquiry.company || "Not provided"],
    ["Email", enquiry.email],
    ["Phone", enquiry.phone],
  ];

  const text = [
    "ENQUIRY",
    ...rows.map(([label, v]) => `${label}: ${v}`),
    "",
    "PROJECT DETAILS",
    enquiry.details,
    "",
    "\u2014",
    `Submitted via the ${company.name} website on ${stamp} IST.`,
    `Reply to this email to answer ${enquiry.email} directly.`,
  ].join("\n");

  const cell =
    "padding:12px 16px 12px 0;border-top:1px solid #dde1e8;font-size:13px;color:#626d7d;white-space:nowrap;vertical-align:top";
  const val =
    "padding:12px 0;border-top:1px solid #dde1e8;font-size:15px;color:#17233c;font-weight:600;vertical-align:top";

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /><title>New enquiry</title></head>
<body style="margin:0;padding:24px 12px;background:#f5f5f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;border-collapse:collapse;background:#ffffff;border:1px solid #dde1e8;">
    <tr><td style="padding:24px 32px;background:#13223c;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#ffffff;opacity:0.6;">${escapeHtml(
        company.name,
      )}</div>
      <div style="margin-top:6px;font-size:19px;font-weight:600;line-height:1.35;color:#ffffff;">New website enquiry</div>
    </td></tr>
    <tr><td style="padding:28px 32px 4px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#3f8a3c;">Enquiry</div>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:10px;border-collapse:collapse;">
        ${rows
          .map(
            ([label, v]) =>
              `<tr><td style="${cell}">${escapeHtml(label)}</td><td style="${val}">${escapeHtml(v)}</td></tr>`,
          )
          .join("")}
      </table>
    </td></tr>
    <tr><td style="padding:24px 32px 4px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#3f8a3c;">Project details</div>
      <div style="margin-top:10px;padding-top:14px;border-top:1px solid #dde1e8;font-size:15px;line-height:1.6;color:#17233c;white-space:pre-wrap;">${escapeHtml(
        enquiry.details,
      )}</div>
    </td></tr>
    <tr><td style="padding:24px 32px 28px;">
      <div style="padding-top:20px;border-top:1px solid #dde1e8;font-size:12px;line-height:1.7;color:#626d7d;">
        Submitted via the ${escapeHtml(company.name)} website on ${escapeHtml(stamp)} IST.<br />
        Reply to this email to answer
        <a href="mailto:${encodeURI(enquiry.email)}" style="color:#3f8a3c;font-weight:600;text-decoration:none;">${escapeHtml(
          enquiry.email,
        )}</a> directly.
      </div>
    </td></tr>
  </table>
</body></html>`;

  return { text, html };
}

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
  if (!EMAIL.test(enquiry.email))
    errors.email = "Please enter a valid email address.";
  if (enquiry.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Please enter a phone number we can reach you on.";
  }
  if (enquiry.details.length < 10) {
    errors.details =
      "A sentence or two about the project helps us respond well.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;

  const fallback = contactDetails.email;

  const to = (process.env.CONTACT_TO_EMAIL ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  if (to.length === 0) to.push(fallback);

  const from =
    process.env.CONTACT_FROM_EMAIL?.trim() || `${company.name} <${fallback}>`;

  console.info(
    `[enquiry] env: RESEND_API_KEY=${apiKey ? "set" : "MISSING"} ` +
      `CONTACT_FROM_EMAIL=${process.env.CONTACT_FROM_EMAIL ? "set" : "missing (using fallback)"} ` +
      `CONTACT_TO_EMAIL=${process.env.CONTACT_TO_EMAIL ? "set" : "missing (using fallback)"}`,
  );

  if (!apiKey) {
    console.error(
      "[enquiry] RESEND_API_KEY is not set in this runtime — nothing was sent.",
    );
    return { status: "error", message: unreachable() };
  }

  const { text, html } = render(enquiry);

  console.info(`[enquiry] calling Resend (${from} -> ${to.join(", ")})`);

  try {
    const { data, error } = await new Resend(apiKey).emails.send({
      from,
      to,
      replyTo: enquiry.email,
      subject: `New website enquiry — ${enquiry.name}`,
      text,
      html,
    });

    if (error) {
      console.error(
        `[enquiry] Resend rejected the message: ${error.name}: ${error.message}`,
      );
      return { status: "error", message: unreachable() };
    }

    console.info(
      `[enquiry] accepted by Resend as ${data?.id} (${from} -> ${to.join(", ")})`,
    );
  } catch (cause) {
    console.error("[enquiry] could not reach the Resend API", cause);
    return { status: "error", message: unreachable() };
  }

  return { status: "sent" };
}

function unreachable() {
  return `We could not send that just now. Please email ${contactDetails.email} or call ${contactDetails.phones[0].label}.`;
}
