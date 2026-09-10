import type { Metadata } from "next";
import { ContactCta } from "@/components/contact-cta";
import { ProjectFeature } from "@/components/project-feature";
import { SafetyQuality } from "@/components/safety-quality";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Separation of Double Distribution Transformers — an 11 kV distribution project for TNPDCL under the Revamped Distribution Sector Scheme at Tiruppur, Tamil Nadu.",
};

export default function ProjectsPage() {
  return (
    <>
      <ProjectFeature action={false} />
      <SafetyQuality />
      <ContactCta />
    </>
  );
}
