export type Chip = "lime" | "sky" | "pink" | "yellow";
export type Segment = {
  text: string;
  chip?: Chip;
  anchor?: boolean;
  wave?: boolean;
  // Marks the words the "complex becomes simple" scroll animation is drawn around.
  mark?: "complex" | "simple";
  // Set this (non-chip) text in Inter instead of the hero's default face.
  sans?: boolean;
  // Start a new line after this segment.
  breakAfter?: boolean;
  italic?: string;
  italicWord?: string;
  // Set the segment in the display face (Bonny).
  bonny?: boolean;
  big?: boolean;
};

// Each line is a list of segments; a segment with `chip` renders as a highlighted pill.
const heroLines: Segment[][] = [
  // `italic` lists the letters to set in the italic cut.
  // `anchor` marks where the scroll flower starts (right after the word).
  [{ text: "Hello, I'm" }, { text: "Saumya", anchor: true }],
  // `italicWord` sets one whole word of a segment in the italic cut.
  [
    { text: "A" },
    { text: "Product Engineer", chip: "lime" },
    { text: "at the intersection of" },
  ],
  [
    { text: "code", chip: "sky", bonny: true },
    { text: "and" },
    { text: "design.", chip: "yellow", bonny: true },
  ],
];

export const site = {
  name: "Saumya",
  email: "ssaumyassharma@gmail.com",
  hero: {
    lines: heroLines,
    cue: "Scroll down & explore",
  },
  nav: [
    { label: "Work", href: "/#work", cta: false },
    { label: "About", href: "/about", cta: false },
    { label: "Let's talk", href: "#contact", cta: true },
  ],
};

const introSegments: Segment[] = [
  { text: "A " },
  // `anchor` marks where the scroll route arrives from the hero.
  { text: "full-stack developer", chip: "sky", anchor: true },
  { text: " with " },
  { text: "6\u00A0years", chip: "lime" },
  {
    text: " of experience, a\u00A0keen eye for detail and a\u00A0passion for ",
  },
  { text: "design", chip: "yellow", italicWord: "design" },
  { text: ".", breakAfter: true },
  { text: "I enjoy " },
  { text: "turning complex", mark: "complex" },
  { text: " ideas into products that feel", breakAfter: true },
  { text: "clean, intuitive, and easy to use", mark: "simple" },
  { text: "." },
];

export const intro = {
  label: "What I do",
  segments: introSegments,
};

export const footer = {
  heading: "Let's talk.",
  blurb: "Let's build something exceptional together.",
};

// Replace the two placeholder profile links with your own.
export const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/saumya-sharma-058a8ba0/",
  },
  { label: "GitHub", href: "https://github.com/saumya13" },
];
