import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/motion-provider";
import { Preloader } from "@/components/preloader";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { company } from "@/lib/content";

/** Editorial serif for every headline — high contrast, classical, composed. */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/** Neutral grotesque for navigation, labels and running text. */
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${company.name} — ${company.discipline}`,
    template: `%s — ${company.name}`,
  },
  description:
    "Srimithra Construction executes end-to-end 11 kV electrical distribution infrastructure — lines, distribution transformers, pole and line erection, protection, earthing, testing and commissioning — in Tamil Nadu, India.",
  openGraph: {
    title: `${company.name} — ${company.discipline}`,
    description:
      "Delivering reliable 11 kV distribution infrastructure through disciplined execution, quality workmanship and safety-driven project delivery.",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${playfair.variable} ${geist.variable} antialiased`}
    >
      <body>
        {/* Without JavaScript nothing ever animates in, so the resting states
            the motion layer relies on must be neutralised outright. */}
        <noscript>
          <style>{`[data-anim],[data-anim]>*{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>

        <Preloader />

        <MotionProvider>
          <SiteHeader />
          <main id="top">{children}</main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
