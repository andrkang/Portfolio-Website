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
  images?: Array<{
    src: string;
    alt: string;
    caption: string;
    link?: { href: string; label: string };
  }>;
  analysis?: {
    title: string;
    images: Array<{ src: string; alt: string; caption: string }>;
  };
  interactiveTool?: {
    title: string;
    description: string;
    src: string;
  };
  showcaseVideo?: {
    title: string;
    description: string;
    src: string;
  };
  video?: string;
  videoTitle?: string;
  videoDescription?: string;
};

const projectRecords: Project[] = [
  {
    slug: "beaver-dam-robot",
    index: "02",
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
    index: "01",
    title: "ADAPTIV Studio | Product Development",
    shortTitle: "ADAPTIV",
    field: "Product Design / 3D Printing",
    year: "2024—2026",
    status: "Selected client work",
    role: "Co-founder & lead designer",
    tools: "Fusion 360 / Bambu Lab / Prototyping",
    eyebrow: "Small-batch product studio",
    statement: "A design practice turning loose ideas into useful, manufacturable objects.",
    accent: "#b7c3bc",
    background: "#1b2632",
    foreground: "#f3f0e9",
    soft: "#283641",
    chapters: [
      { number: "01", title: "From brief to object", prompt: "Client needs, constraints, and early concepts." },
      { number: "02", title: "CAD and prototyping", prompt: "Model development, print tests, and refinements." },
      { number: "03", title: "Selected outcomes", prompt: "Finished products for Sclobo and Card Atelier." },
    ],
  },
  {
    slug: "bit-infinite",
    index: "04",
    title: "AI Parametric CAD Modeling Internship",
    shortTitle: "AI CAD Internship",
    field: "Parametric CAD / Internship",
    year: "2026",
    status: "Completed",
    role: "Product design intern",
    tools: "Parametric CAD / 3D Printing / UX",
    eyebrow: "AI modeling startup",
    statement: "Making parametric modeling easier to understand, teach, and use inside a growing product team.",
    accent: "#ff982f",
    background: "#f7f6f3",
    foreground: "#11100f",
    soft: "#ffead0",
    interactiveTool: {
      title: "Sparkoh Size Reference Tool",
      description: "An interactive scale reference I designed to translate millimeter dimensions into familiar physical objects.",
      src: "/tools/sparkoh-size-reference/index.html",
    },
    showcaseVideo: {
      title: "From Fixed Mesh to Adjustable Parametric Model",
      description: "For a feature displayed on the product homepage, I rebuilt the model shown in this video from a fixed mesh into a parametric model. Users can adjust its parameters to regenerate the same design at any size.",
      src: "/videos/parametric-model-remake.m4v",
    },
    chapters: [
      { number: "01", title: "Understanding the product", prompt: "Mesh versus parametric modeling and the communication gap." },
      { number: "02", title: "Improving the workflow", prompt: "CAD reconstruction, printing guides, and reference tools." },
      { number: "03", title: "Making the value visible", prompt: "Website improvements and the physical sample display." },
    ],
  },
  {
    slug: "teaching-3d-printing",
    index: "05",
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
    images: [
      {
        src: "/images/village-3d-printing-2.jpg",
        alt: "Andrew presenting product design and 3D printing concepts to students during the village workshop",
        caption: "Introducing product design and 3D printing",
      },
      {
        src: "/images/village-3d-printing-article.png",
        alt: "Bilingual article coverage describing Andrew's village 3D printing workshop and curriculum",
        caption: "Bilingual coverage of the workshop curriculum",
        link: {
          href: "https://m.ycw.com.cn/article/content/6a8cee6c61e1c3cd508b456d/work/%E8%BE%85%E5%AF%BC%E7%AB%99%E6%92%AD%E6%8A%A5.html",
          label: "Read the original article",
        },
      },
      {
        src: "/images/village-3d-printing-3.jpg",
        alt: "Andrew guiding students as they assemble small 3D-printed objects during the workshop",
        caption: "Guiding participants through hands-on assembly",
      },
      {
        src: "/images/village-3d-printing-4.jpg",
        alt: "Workshop participants holding their completed 3D-printed models in a group photo",
        caption: "Participants with their completed printed models",
      },
      {
        src: "/images/village-3d-printing-1.jpg",
        alt: "Andrew helping a group of students explore a 3D design workflow on a laptop",
        caption: "Helping students explore the design workflow",
      },
    ],
    chapters: [
      { number: "01", title: "Opening access", prompt: "Why the workshops were created and who they serve." },
      { number: "02", title: "Designing the lesson", prompt: "Teaching sequence, demonstrations, and participant work." },
      { number: "03", title: "Building continuity", prompt: "Equipment donation and the next workshop cycle." },
    ],
  },
  {
    slug: "seattle-environment-workshop",
    index: "03",
    title: "Introducing Beaver Dam Analogs and Wetland Protection at Seattle University",
    shortTitle: "Seattle U BDA Workshop",
    field: "Environmental Education / BDA Workshop",
    year: "2025",
    status: "Completed",
    role: "Presenter & workshop facilitator",
    tools: "Research / Presentation / Hands-on Learning",
    eyebrow: "Environmental education workshop",
    statement: "I designed a miniature version of my BDA robot that participants could assemble during the workshop.",
    accent: "#143d2b",
    background: "#e7f0c9",
    foreground: "#143d2b",
    soft: "#d3e2aa",
    images: [
      {
        src: "/images/seattle-workshop-presentation.jpg",
        alt: "Andrew presenting his Beaver Dam Analog research to an audience at Seattle University",
        caption: "Presenting BDA research at Seattle University",
      },
      {
        src: "/images/seattle-workshop-1.jpg",
        alt: "Seattle University workshop participants assembling a small Beaver Dam Analog demonstration robot",
        caption: "Participants building the BDA demonstration robot",
      },
      {
        src: "/images/seattle-workshop-3.jpg",
        alt: "Close-up of the sensor-equipped demonstration robot used in the Seattle University workshop",
        caption: "Sensor-equipped workshop prototype",
      },
      {
        src: "/images/seattle-workshop-guidance.jpg",
        alt: "Andrew guiding Seattle University workshop participants as they test the miniature BDA robot",
        caption: "Guiding participants through the hands-on build",
      },
    ],
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
    images: [
      {
        src: "/images/padlet-automation-workflow.png",
        alt: "Workflow showing the volunteer automation tool collecting Seattle calendar opportunities and publishing them as organized Padlet posts",
        caption: "Volunteer discovery-to-Padlet publishing workflow",
      },
    ],
    video: "https://www.youtube.com/embed/zdGP5_BhiaA",
    videoTitle: "Connecting students to service",
    videoDescription: "The volunteer video and automated Padlet workflow show how opportunities were gathered, organized, and shared.",
    chapters: [
      { number: "01", title: "Finding fragmented opportunities", prompt: "How scattered listings made volunteering harder to discover." },
      { number: "02", title: "Building the API workflow", prompt: "Collecting, formatting, and transferring opportunity data automatically." },
      { number: "03", title: "Publishing to Padlet", prompt: "Turning raw listings into an organized resource students could use." },
    ],
  },
  {
    slug: "baseball-card-investment-index",
    index: "07",
    title: "Baseball Card Investment Index",
    shortTitle: "Card Investment Index",
    field: "Data Science / Sports Analytics",
    year: "2026",
    status: "Active research platform",
    role: "Founder, researcher & developer",
    tools: "TypeScript / React / FanGraphs / MLB Data",
    eyebrow: "Prospect analytics platform",
    statement: "A decision-support platform combining scouting grades, historical outcomes, and verified card-market evidence to evaluate baseball prospects.",
    accent: "#f1bc53",
    background: "#123f3c",
    foreground: "#f7f5ef",
    soft: "#1c5752",
    chapters: [
      { number: "01", title: "Building the model", prompt: "Turning public scouting grades into comparable hitter and pitcher ratings." },
      { number: "02", title: "Testing outcomes", prompt: "Calibrating career probabilities against historical prospect cohorts." },
      { number: "03", title: "Connecting the market", prompt: "Pairing baseball projections with verified card-price evidence." },
    ],
  },
];

export const projects = [...projectRecords].sort((a, b) => Number(a.index) - Number(b.index));

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
