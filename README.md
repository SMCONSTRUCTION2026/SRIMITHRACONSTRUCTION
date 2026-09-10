# Srimithra Construction

Marketing site for Srimithra Construction — 11 kV electrical distribution and
infrastructure contracting, Kalugumalai, Tamil Nadu. Next.js 16 (App Router)
with Tailwind CSS v4.

## Getting started

```bash
npm run start:dev   # dev server on http://localhost:3000
npm run build       # production build
npm run start       # serve the production build
npm run lint
```

## Routes

Each menu entry is its own page, rendered statically:

| Route | Sections |
| --- | --- |
| `/` | Hero, Services, standing band, Featured Project, contact CTA |
| `/about` | Vision, standing band |
| `/services` | Services, Process |
| `/projects` | Featured Project, Safety & Quality |
| `/safety` | Safety & Quality, Process |
| `/contact` | Contact form and details |

[`app/layout.tsx`](app/layout.tsx) carries the header, footer and motion
provider, so a page file is just the sections it composes. Navigation is
`next/link` throughout; the header marks the current route from `usePathname`.

## Design system

Tokens live in [`app/globals.css`](app/globals.css) — colour, type families, the
fluid type scale, the editorial grid (`--container-max`, `--page-x`,
`--section-y`) and the motion easing. Buttons, section labels and text actions
come from [`components/ui.tsx`](components/ui.tsx); marks and the SM lockup from
[`components/marks.tsx`](components/marks.tsx).

The logo is used as supplied. `public/images/srimithra-lockup.png` is the same
artwork with its transparent padding trimmed so it can be set to an exact
optical height on the grid; on the navy footer it is knocked out to white.

All site copy and project data is in [`lib/content.ts`](lib/content.ts).

## Motion

The opening curtain lives in
[`components/preloader.tsx`](components/preloader.tsx). It is server-rendered so
it covers the first paint, and it lifts on whichever comes first: the window
finishing its load, or a 3s ceiling — it can never strand a visitor behind a
broken asset. It runs once; route changes keep the layout mounted.

[`components/motion-provider.tsx`](components/motion-provider.tsx) starts Lenis
and hands GSAP's ticker to it, so smooth scroll and every ScrollTrigger run on
one clock. [`lib/gsap.ts`](lib/gsap.ts) registers the plugin once and holds the
shared easing, duration and trigger point.

[`components/reveal.tsx`](components/reveal.tsx) is the vocabulary:

| Primitive | Effect |
| --- | --- |
| `<Reveal>` | Heavy fade-in-up for a block of text |
| `<Stagger>` | Children arrive in sequence — a grid powering on node by node |
| `<DrawnRule>` | A hairline that draws itself left to right |
| `<MaskReveal parallax>` | A picture uncovering from its lower edge, drifting slower than the text |

Every resting state is declared in CSS against `data-anim`, so it is correct on
the first paint and there is nothing to flash; GSAP animates *out* of it. Under
`prefers-reduced-motion` the attribute is removed, no ScrollTrigger is created
and Lenis never starts. With JavaScript off, a `<noscript>` rule neutralises the
resting states outright, so nothing can be left invisible.

## Photography

Images in `public/images` are produced from the supplied Srimithra Construction
photo pack by [`scripts/prepare-images.mjs`](scripts/prepare-images.mjs):

```bash
node scripts/prepare-images.mjs                 # originals from .cache/photo-pack
PHOTO_PACK=/path/to/delivery node scripts/prepare-images.mjs   # import a new set
```

Originals live in `.cache/photo-pack` (gitignored); the script applies a light
unifying grade and writes the frames close to their native size, so each
placement crops in CSS and `next/image` can serve exactly what a viewport needs.
[`public/images/CREDITS.md`](public/images/CREDITS.md) records which source file
became which frame, and which frames in the pack are not currently placed.

## Contact form

The enquiry form posts through a Server Action in
[`app/actions.ts`](app/actions.ts) and is delivered by [Resend](https://resend.com).
Copy [`.env.example`](.env.example) to `.env.local` and fill in:

```bash
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=contact@srimithraconstruction.com
CONTACT_FROM_EMAIL="Srimithra Construction <onboarding@resend.dev>"
```

`.env.local` is gitignored — keys never belong in the repo.

Name, email, phone and project details are required; company is optional. The
notification's reply-to is set to the enquirer, so replying from the inbox
reaches them directly. A honeypot field catches bots. If the key or recipient is
missing, or Resend rejects the send, the action says so and gives the visitor
the phone number and inbox instead — it never claims a message was sent when it
was not.

**Before launch:** verify `srimithraconstruction.com` in Resend and change
`CONTACT_FROM_EMAIL` to an address on that domain. Resend's shared
`onboarding@resend.dev` sender works, but mail from a verified domain is far
less likely to be filtered as spam.

## Hero film

The hero's secondary action opens a dialog. Point `NEXT_PUBLIC_HERO_VIDEO_URL`
at the project film to play it there; with no film configured the dialog says so
and links to the current project rather than pretending to play something.
