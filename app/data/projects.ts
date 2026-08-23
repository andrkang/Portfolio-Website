export type Project = {
  slug: string;
  index: string;
  title: string;
  shortTitle: string;
  field: string;
  year: string;
  status: string;
  role: string;
  tools: string;
  eyebrow: string;
  statement: string;
  accent: string;
  background: string;
  foreground: string;
  soft: string;
  chapters: Array<{ number: string; title: string; prompt: string }>;
  video?: string;
};

export const projects: Project[] = [
  {
    slug: "beaver-dam-robot",
    index: "01",
    title: "Robotic Beaver Dam Analog",
    shortTitle: "BDA Robot",
    field: "Robotics / Environmental Research",
    year: "2025—2026",
    status: "Research in progress",
    role: "Engineer & researcher",
    tools: "Fusion 360 / FLOW-3D / Sensors",
    eyebrow: "Wetland restoration system",
    statement: "A robotic construction and sensing system designed to make wetland restoration more measurable.",
    accent: "#b7f397",
    background: "#153b2b",
    foreground: "#f3f5e8",
    soft: "#26523e",
    chapters: [
      { number: "01", title: "The wetland problem", prompt: "Context, field observations, and the restoration challenge." },
      { number: "02", title: "The robotic system", prompt: "Mechanical architecture, sensing, and construction workflow." },
      { number: "03", title: "Testing the design", prompt: "Physical channels, FLOW-3D simulations, and iteration." },
    ],
  },
  {
    slug: "adaptiv-studio",
    index: "02",
    title: "ADAPTIV Studio",
    shortTitle: "ADAPTIV",
    field: "Product Design / 3D Printing",
    year: "2024—2026",
    status: "Selected client work",
    role: "Co-founder & lead designer",
    tools: "Fusion 360 / Bambu Lab / Prototyping",
    eyebrow: "Small-batch product studio",
    statement: "A design practice turning loose ideas into useful, manufacturable objects.",
    accent: "#ff5c35",
    background: "#2349dd",
    foreground: "#f7f2e9",
    soft: "#1738bb",
    chapters: [
      { number: "01", title: "From brief to object", prompt: "Client needs, constraints, and early concepts." },
      { number: "02", title: "CAD and prototyping", prompt: "Model development, print tests, and refinements." },
      { number: "03", title: "Selected outcomes", prompt: "Finished products for Sclobo and Card Atelier." },
    ],
  },
  {
    slug: "teaching-3d-printing",
    index: "03",
    title: "Teaching 3D Printing",
    shortTitle: "3D Workshops",
    field: "Education / Community Technology",
    year: "2026",
    status: "Ongoing workshops",
    role: "Workshop designer & instructor",
    tools: "Curriculum / Demonstrations / Fabrication",
    eyebrow: "Technology access initiative",
    statement: "A practical introduction to 3D modeling and printing for communities beginning their own programs.",
    accent: "#ff3b67",
    background: "#ffd84a",
    foreground: "#18120c",
    soft: "#f3c82d",
    chapters: [
      { number: "01", title: "Opening access", prompt: "Why the workshops were created and who they serve." },
      { number: "02", title: "Designing the lesson", prompt: "Teaching sequence, demonstrations, and participant work." },
      { number: "03", title: "Building continuity", prompt: "Equipment donation and the next workshop cycle." },
    ],
  },
  {
    slug: "bit-infinite",
    index: "04",
    title: "Bit Infinite Internship",
    shortTitle: "Bit Infinite",
    field: "Parametric CAD / Internship",
    year: "2026",
    status: "Completed",
    role: "Product design intern",
    tools: "Parametric CAD / 3D Printing / UX",
    eyebrow: "AI modeling startup",
    statement: "Making parametric modeling easier to understand, teach, and use inside a growing product team.",
    accent: "#c8ff3d",
    background: "#33217a",
    foreground: "#f5f0ff",
    soft: "#49349a",
    chapters: [
      { number: "01", title: "Understanding the product", prompt: "Mesh versus parametric modeling and the communication gap." },
      { number: "02", title: "Improving the workflow", prompt: "CAD reconstruction, printing guides, and reference tools." },
      { number: "03", title: "Making the value visible", prompt: "Website improvements and the physical sample display." },
    ],
  },
  {
    slug: "service-in-practice",
    index: "05",
    title: "Service in Practice",
    shortTitle: "Service",
    field: "Green Club / Seattle University",
    year: "2025—2026",
    status: "Programs completed",
    role: "Organizer, developer & presenter",
    tools: "Python / Workshop Design / Environmental Service",
    eyebrow: "Community systems",
    statement: "Connecting people to environmental service through software, workshops, and hands-on learning.",
    accent: "#143d2b",
    background: "#e7f0c9",
    foreground: "#143d2b",
    soft: "#d3e2aa",
    video: "https://www.youtube.com/embed/zdGP5_BhiaA",
    chapters: [
      { number: "01", title: "Finding the gap", prompt: "Green Club leadership and barriers to volunteering." },
      { number: "02", title: "Building the connection", prompt: "The volunteer-opportunity web app and community video." },
      { number: "03", title: "Teaching the system", prompt: "The Seattle University BDA presentation and build activity." },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
