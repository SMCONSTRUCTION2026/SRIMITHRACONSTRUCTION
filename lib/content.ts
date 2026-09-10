/**
 * Every piece of copy and project data on the site.
 *
 * Only information supplied by Srimithra Construction belongs here — no
 * invented project counts, years of experience, certifications, clients,
 * testimonials or awards. The company is young; the site earns credibility
 * through clarity of capability, not through numbers.
 */

export const company = {
  name: "Srimithra Construction",
  shortName: "SM Construction",
  discipline: "11 kV Electrical Distribution & Infrastructure Contracting",
  tagline: ["Building Today.", "Shaping Tomorrow."],
  region: "Tamil Nadu — India",
} as const;

export const contactDetails = {
  phones: [
    { label: "+91 8122971127", href: "tel:+918122971127" },
    { label: "+91 9629593453", href: "tel:+919629593453" },
  ],
  email: "contact@srimithraconstruction.com",
  /** Set out line by line so the address sets identically everywhere. */
  address: [
    "24E, ST-9, Periyakovil Vasal Street",
    "Kalugumalai, Thoothukudi",
    "Tamil Nadu — 628552",
  ],
  gstin: "33EEMPM5178H1Z3",
  linkedin: "https://www.linkedin.com/",
} as const;

/** One route per entry — each menu item is its own page. */
export const primaryNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Safety", href: "/safety" },
  { label: "Contact", href: "/contact" },
] as const;

export const hero = {
  eyebrow: "11 kV Electrical Distribution Contracting",
  /** Composed by hand — these four lines are the hero's composition. */
  headline: ["Power", "Infrastructure.", "Built for", "Tomorrow"],
  lede: [
    "Delivering reliable 11 kV distribution infrastructure",
    "through disciplined execution, quality workmanship",
    "and safety-driven project delivery.",
  ],
  /** Set vertically down the right edge of the photograph. */
  qualities: ["Safe", "Reliable", "Sustainable", "Communities"],
  plate: { value: "11 kV", caption: ["For a stronger", "Tomorrow"] },
} as const;

export const services = [
  {
    id: "distribution-lines",
    mark: "lines",
    title: ["11 kV", "Distribution Lines"],
    description:
      "Erection and execution of 11 kV distribution infrastructure.",
  },
  {
    id: "distribution-transformers",
    mark: "transformer",
    title: ["Distribution", "Transformers"],
    description:
      "Transformer structure installation and associated works.",
  },
  {
    id: "pole-line-erection",
    mark: "pole",
    title: ["Pole & Line", "Erection"],
    description:
      "Pole erection, cross-arms, conductors and associated line materials.",
  },
  {
    id: "protection-earthing",
    mark: "earthing",
    title: ["Protection &", "Earthing"],
    description:
      "Protection equipment, earthing and supporting electrical infrastructure.",
  },
  {
    id: "testing-commissioning",
    mark: "testing",
    title: ["Testing &", "Commissioning"],
    description:
      "Testing and commissioning of completed distribution works.",
  },
] as const;

/**
 * The band between Services and the project.
 *
 * These are statements of intent and current standing — one live project, a
 * safety-first posture — not performance statistics. Nothing here should ever
 * become a fabricated figure.
 */
export const standing = [
  { value: "1+", caption: "Ongoing Projects" },
  { value: "100%", caption: "Safety Focus" },
  { value: "Quality", caption: "in Every Project" },
  { value: "Stronger", caption: "Communities" },
] as const;

export const featuredProject = {
  title: ["Separation of Double", "Distribution Transformers"],
  location: "Tiruppur, Tamil Nadu",
  client: "Tamil Nadu Power Distribution Corporation Limited (TNPDCL)",
  scheme: "Revamped Distribution Sector Scheme (RDSS)",
  /** Scope as executed, drawn from the company's stated capabilities. */
  scope: [
    "Survey",
    "Pole Erection",
    "11 kV Line",
    "Transformer",
    "Protection",
    "Earthing",
    "Testing",
    "Commissioning",
  ],
  caption: ["Reliable infrastructure", "for growing communities."],
  image: "/images/project-transformer.jpg",
  alt: "A double-pole 11 kV distribution transformer structure on the project route.",
} as const;

export const processSteps = [
  { number: "01", title: ["Survey & Site", "Assessment"] },
  { number: "02", title: ["Design &", "Planning"] },
  { number: "03", title: ["Pole & Line", "Erection"] },
  { number: "04", title: ["Transformer", "Installation"] },
  { number: "05", title: ["Protection &", "Earthing"] },
  { number: "06", title: ["Testing &", "Commissioning"] },
] as const;

export const commitments = [
  {
    mark: "shield",
    title: "Safety First",
    description: "People and communities always come first.",
  },
  {
    mark: "gear",
    title: "Quality Driven",
    description: "Adhering to highest standards in every project.",
  },
  {
    mark: "clock",
    title: "On Time",
    description: "Committed to timely delivery.",
  },
  {
    mark: "layers",
    title: "Built to Last",
    description: "Infrastructure for a stronger tomorrow.",
  },
] as const;

export const about = {
  heading: ["A Strong Beginning.", "A Bigger Future."],
  body: [
    "Srimithra Construction is an electrical infrastructure contracting company focused on 11 kV distribution projects.",
    "We are committed to delivering safe, reliable and high-quality infrastructure that supports stronger communities and a brighter tomorrow.",
  ],
  quote: ["Infrastructure", "today for a brighter", "tomorrow."],
} as const;

/**
 * Shared by the contact page and the call to action that closes the home page,
 * so the same words are never typed twice.
 */
export const contactSection = {
  label: "Get in Touch",
  heading: ["Have a Project", "in Mind"],
  lede: "Let\u2019s build what\u2019s next.",
} as const;

export const formFields = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", required: true },
  {
    name: "company",
    label: "Company",
    type: "text",
    autoComplete: "organization",
    required: false,
  },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", required: true },
] as const;
