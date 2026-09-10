import type { Metadata } from "next";
import { Contact } from "@/components/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Srimithra Construction about an 11 kV distribution project. Kalugumalai, Thoothukudi, Tamil Nadu.",
};

export default function ContactPage() {
  return <Contact />;
}
