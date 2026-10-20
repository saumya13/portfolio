// Copy and data for the /about page. Photos are placeholders: drop files into /public/about and set `src`.
export const aboutIntro = {
  label: "About",
  heading: ["Engineer by training,", "designer at heart."] as const,
  paragraphs: [
    "Hi, I'm Saumya, a product engineer. I like working across the whole stack of an idea: how it looks, how it behaves, and how it holds up once real people use it.",
    "For six years I built and shipped software at MathWorks, working on tools used by engineers and scientists. That's where I learned to care about the boring, important things: clear interfaces, reliable systems and small details that save people time.",
    "Lately I've been spending my time on design and on building my own products using AI.",
    "I like to create delightful experiences through taste, interaction and craft, even more so now that AI makes it easy to build things and everything starts to look the same.",
    "I also made a big life change and moved to Amsterdam. These days I'm busy exploring the city on my bike, going to concerts, hiking, relaxing, reading and making art, while learning design and making my own silly little design projects using Claude.",
  ],
  facts: [
    { k: "Based in", v: "Amsterdam" },
    { k: "Focus", v: "Product Engineering" },
    { k: "Currently", v: "Building products using AI" },
  ],
};

export type Photo = {
  src?: string;
  caption: string;
  tint: string;
  position?: string;
  zoom?: number;
  origin?: string;
};
// The photos in the intro carousel (files live in /public/photos). Add a caption to show a line under a photo.
const carouselPhotos = [17, 7, 8, 18];
// How each photo is framed (the default is a centred crop): `position` is the CSS object-position of the crop,
// `zoom` scales it up around `origin` (a point in the frame that stays put).
const framing: Record<number, Pick<Photo, "position" | "zoom" | "origin">> = {
  17: { position: "50% 22%" },
  7: { position: "50% 75%" },
  8: { position: "50% 90%" },
  18: { position: "50% 65%" },
};
export const photos: Photo[] = carouselPhotos.map((n) => ({
  src: `/photos/${n}.jpg`,
  caption: "",
  tint: "linear-gradient(135deg,#f6cfe3,#fdf3d0)",
  ...framing[n],
}));

export type Stint = {
  id: string;
  role: string;
  org: string;
  period: string;
  meta: string;
  // The tile beside each entry: a colour and a short mark (swap for a logo image if you like).
  colour: string;
  mark: string;
  logo?: string;
  text: string;
};
export const experience = {
  label: "Experience",
  heading: ["Where I've", "worked"] as const,
  resume: { label: "Download my resume", href: "/saumya-resume-2026.pdf" },
  // Newest first.
  stints: [
    {
      id: "pursuit",
      role: "Personal pursuit",
      org: "Exploring design, building with AI",
      period: "2026 – current",
      meta: "Career break",
      colour: "#f09bcf",
      mark: "✦",
      text: "Stepped back to learn design properly and to create my own products with AI, taking ideas from first sketch to something people can use.",
    },
    {
      id: "sr",
      role: "Senior Software Engineer",
      org: "MathWorks",
      period: "2025 – 2026",
      meta: "Full-time",
      colour: "#3b82f6",
      mark: "M",
      logo: "/logos/mathworks.svg",
      text: "Took on bigger scope and led the technical direction of projects, mentored teammates and raised the bar on quality across the team.",
    },
    {
      id: "swe",
      role: "Software Engineer",
      org: "MathWorks",
      period: "2020 – 2025",
      meta: "Full-time",
      colour: "#b8e2fb",
      mark: "M",
      logo: "/logos/mathworks.svg",
      text: "Built and shipped features used by engineers and scientists, and learned to own work end to end, from the first idea to production.",
    },
  ] as Stint[],
};

export const tools = {
  heading: ["My skills", "and the tools I build with"] as const,
  // `stack` names an icon from content/stack.ts (`allTools`); `group` puts it under "Skills" or "Tools".
  items: [
    {
      stack: "TypeScript",
      name: "TypeScript / JavaScript",
      note: "Typed, reliable code",
      group: "skills",
    },
    {
      stack: "Go",
      name: "Golang",
      note: "Fast, simple backends",
      group: "skills",
    },
    {
      stack: "Python",
      name: "Python",
      note: "Scripting, data, automation",
      group: "skills",
    },
    {
      stack: "Node.js",
      name: "NodeJS",
      note: "Servers and tooling",
      group: "skills",
    },
    {
      stack: "React",
      name: "React",
      note: "Building interfaces",
      group: "skills",
    },
    {
      stack: "Next.js",
      name: "NextJS",
      note: "Full-stack web apps",
      group: "skills",
    },
    {
      stack: "Tailwind CSS",
      name: "Tailwind",
      note: "Styling",
      group: "skills",
    },
    { stack: "Figma", name: "Figma", note: "UI design", group: "tools" },
    {
      stack: "Motion",
      name: "Motion",
      note: "Animation, interaction",
      group: "tools",
    },
    {
      stack: "Framer",
      name: "Framer",
      note: "Sites and prototypes",
      group: "tools",
    },
    {
      stack: "Claude Code",
      name: "Claude Code",
      note: "Ideation, prototyping",
      group: "tools",
    },
    {
      stack: "Docker",
      name: "Docker",
      note: "Containers, consistent environments",
      group: "tools",
    },
    { stack: "Git", name: "Git", note: "Version control", group: "tools" },
    {
      stack: "v0",
      name: "Vercel v0",
      note: "Generating UI from prompts",
      group: "tools",
    },
    {
      stack: "Lovable",
      name: "Lovable",
      note: "Prompt-to-app prototyping",
      group: "tools",
    },
    {
      stack: "MATLAB",
      name: "MATLAB",
      note: "Technical computing",
      group: "skills",
    },
    {
      stack: "PostgreSQL",
      name: "PostgreSQL",
      note: "Relational data",
      group: "skills",
    },
    {
      stack: "Supabase",
      name: "Supabase",
      note: "Auth, database, storage",
      group: "skills",
    },
  ],
};

export const toolGroups = [
  { id: "skills", label: "Skills" },
  { id: "tools", label: "Tools" },
] as const;

export const interests = {
  heading: ["What I'm into", "right now"] as const,
  items: [
    { label: "AI tools", tint: "#f6cfe3" },
    { label: "Minimal interfaces", tint: "#b8e2fb" },
    { label: "Side projects", tint: "#e8ff8b" },
    { label: "Attending conferences", tint: "#e8ff8b" },
    { label: "Long walks", tint: "#e6f7e4" },
    { label: "Music", tint: "#d9f4f7" },
    { label: "Making ART", tint: "#ffe14d" },
    { label: "Finding cats (and being judged by them)", tint: "#f9d6e6" },
    { label: "Exploring nature", tint: "#e6f7e4" },
  ],
};

export const values = {
  heading: ["The values", "behind my work"] as const,
  items: [
    {
      title: "Human-First",
      body: "As technology evolves, it's important to remember who the tools were created to support.",
    },
    {
      title: "Real-world empathy",
      body: "The world is becoming more connected than ever, and we owe it to those around us to show compassion and understanding as we learn more about one another.",
    },
    {
      title: "Failure is a part of the process.",
      body: "My best work comes from owning up to my shortcomings, and seeing where to improve.",
    },
    {
      title: "Slow is smooth, smooth is fast",
      body: "Quick iteration and fast feedback matter, but the difference between passable work and work that lasts is time and care.",
    },
  ],
};
