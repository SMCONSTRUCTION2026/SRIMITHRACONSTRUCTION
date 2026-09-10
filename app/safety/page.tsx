import type { Metadata } from "next";
import { ContactCta } from "@/components/contact-cta";
import { Process } from "@/components/process";
import { SafetyQuality } from "@/components/safety-quality";

export const metadata: Metadata = {
  title: "Safety & Quality",
  description:
    "Safety, quality, execution and integrity on every 11 kV distribution site Srimithra Construction works.",
};

export default function SafetyPage() {
  return (
    <>
      <SafetyQuality />
      <Process />
      <ContactCta />
    </>
  );
}
