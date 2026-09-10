import { ContactCta } from "@/components/contact-cta";
import { Hero } from "@/components/hero";
import { ProjectFeature } from "@/components/project-feature";
import { Services } from "@/components/services";
import { StandingBand } from "@/components/standing-band";

/**
 * The landing page. It opens the story and hands each thread on to the page
 * that carries it in full — services, the project, and the enquiry.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <StandingBand />
      <ProjectFeature />
      <ContactCta />
    </>
  );
}
