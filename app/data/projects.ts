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
  images?: Array<{ src: string; alt: string; caption: string }>;
  analysis?: {
    title: string;
    images: Array<{ src: string; alt: string; caption: string }>;
  };
  video?: string;
  videoTitle?: string;
  videoDescription?: string;
};

export const projects: Project[] = [
  {
    slug: "beaver-dam-robot",
    index: "01",
    title: "Robotic Assistance for Data-Driven Beaver Dam Analog Construction",
    shortTitle: "BDA Robotics",
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
    images: [
      {
        src: "/images/bda-robot.jpg",
        alt: "Completed blue tracked Beaver Dam Analog construction robot with robotic arms and sensing equipment",
        caption: "Completed BDA construction robot",
      },
      {
        src: "/images/bda-controller-display.jpg",
        alt: "Game controller mounted below a screen displaying live robot sensor data",
        caption: "Controller and real-time data display",
      },
      {
        src: "/images/bda-building.jpg",
        alt: "Andrew Kang assembling the robotic arm and internal electronics",
        caption: "Building and wiring the robot",
      },
      {
        src: "/images/bda-simulation-experiment.png",
        alt: "Annotated BDA flume experiment showing the water level sensor, data acquisition system, test dam, and physical BDA configurations",
        caption: "BDA flume simulation experiment",
      },
    ],
    analysis: {
      title: "FLOW-3D Hydro Simulation",
      images: [
        {
          src: "/images/flow3d-hydro-simulation.png",
          alt: "FLOW-3D velocity magnitude simulation of water moving through a Beaver Dam Analog",
          caption: "Velocity magnitude through the simulated BDA",
        },
        {
          src: "/images/porosity-water-level-graph.png",
          alt: "Graph showing the effect of BDA porosity on water-level difference at three flow velocities",
          caption: "Porosity and water-level difference",
        },
        {
          src: "/images/experiment-loss-rate-graph.png",
          alt: "Graph comparing loss rate across six experiment codes",
          caption: "Experimental loss-rate comparison",
        },
      ],
    },
    chapters: [
      { number: "01", title: "The wetland problem", prompt: "Context, field observations, and the restoration challenge." },
      { number: "02", title: "The robotic system", prompt: "Mechanical architecture, sensing, and construction workflow." },
      { number: "03", title: "Testing the design", prompt: "Physical channels, FLOW-3D simulations, and iteration." },
    ],
  },
  {
    slug: "adaptiv-studio",
    index: "02",
    title: "ADAPTIV Studio | Product Development",
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
    slug: "bit-infinite",
    index: "03",
    title: "AI Parametric CAD Modeling Internship",
    shortTitle: "AI CAD Internship",
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
    slug: "teaching-3d-printing",
    index: "04",
    title: "Bringing 3D Printing into Villages",
    shortTitle: "3D Printing Access",
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
    slug: "seattle-environment-workshop",
    index: "05",
    title: "Environmental Protection Workshop at Seattle University",
    shortTitle: "Seattle U Workshop",
    field: "Environmental Education / BDA Workshop",
    year: "2025",
    status: "Completed",
    role: "Presenter & workshop facilitator",
    tools: "Research / Presentation / Hands-on Learning",
    eyebrow: "Environmental education workshop",
    statement: "A hands-on workshop connecting wetland restoration, Beaver Dam Analogs, and environmental protection.",
    accent: "#143d2b",
    background: "#e7f0c9",
    foreground: "#143d2b",
    soft: "#d3e2aa",
    chapters: [
      { number: "01", title: "Framing the challenge", prompt: "Introducing wetland degradation and the role of restoration systems." },
      { number: "02", title: "Presenting the research", prompt: "Explaining Beaver Dam Analogs and the data behind the project." },
      { number: "03", title: "Building together", prompt: "The Seattle University hands-on BDA construction activity." },
    ],
  },
  {
    slug: "volunteer-padlet-automation",
    index: "06",
    title: "API-Based Volunteer Opportunity-to-Padlet Automation",
    shortTitle: "Volunteer Automation",
    field: "Software / Community Service",
    year: "2025—2026",
    status: "Deployed",
    role: "Developer & community organizer",
    tools: "Python / APIs / Padlet",
    eyebrow: "Service opportunity automation",
    statement: "An API-based workflow that turns scattered volunteer listings into organized, accessible Padlet posts.",
    accent: "#8de8ff",
    background: "#12283b",
    foreground: "#eefaff",
    soft: "#1d3b51",
    video: "https://www.youtube.com/embed/zdGP5_BhiaA",
    videoTitle: "Connecting students to service",
    videoDescription: "The volunteer video and automated Padlet workflow show how opportunities were gathered, organized, and shared.",
    chapters: [
      { number: "01", title: "Finding fragmented opportunities", prompt: "How scattered listings made volunteering harder to discover." },
      { number: "02", title: "Building the API workflow", prompt: "Collecting, formatting, and transferring opportunity data automatically." },
      { number: "03", title: "Publishing to Padlet", prompt: "Turning raw listings into an organized resource students could use." },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
