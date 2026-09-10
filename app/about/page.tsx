import type { Metadata } from "next";
import { ContactCta } from "@/components/contact-cta";
import { StandingBand } from "@/components/standing-band";
import { Vision } from "@/components/vision";

export const metadata: Metadata = {
  title: "About",
  description:
    "Srimithra Construction is an electrical infrastructure contracting company focused on 11 kV distribution projects in Tamil Nadu.",
};

export default function AboutPage() {
  return (
    <>
      <Vision action={false} />
      <StandingBand />
      <ContactCta />
    </>
  );
}
