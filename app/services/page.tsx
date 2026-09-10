import type { Metadata } from "next";
import { ContactCta } from "@/components/contact-cta";
import { Process } from "@/components/process";
import { Services } from "@/components/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "End-to-end 11 kV electrical distribution infrastructure: distribution lines, transformers, pole and line erection, protection and earthing, testing and commissioning.",
};

export default function ServicesPage() {
  return (
    <>
      <Services action={false} />
      <Process action={false} />
      <ContactCta />
    </>
  );
}
