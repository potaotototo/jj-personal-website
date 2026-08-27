export type LinkItem = {
  label: string;
  href: string;
};

export type Metric = {
  value: string;
  label: string;
};

export type DiagramNode = {
  title: string;
  meta: string;
};

export type Project = {
  id: string;
  number: string;
  category: string;
  title: string;
  introSummary: string;
  stack: string;
  lead: string;
  detail: readonly string[];
  metrics: readonly Metric[];
  diagram: {
    caption: string;
    nodes: readonly DiagramNode[];
    note: string;
  };
  footer: string;
  tone: "black" | "oxblood" | "cobalt";
  links: readonly LinkItem[];
};

export const SITE = {
  name: "Wang Jingjing",
  title: "Wang Jingjing — Selected Technical Work",
  description:
    "Selected systems, infrastructure, and software projects by Wang Jingjing.",
  location: "Singapore",
  year: "2026",
} as const;

export const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;

export const EDUCATION = {
  institution: "National University of Singapore",
  dates: "2023–2027",
  degree: "Bachelor of Computing (Honours) in Computer Science",
  secondMajor: "Second Major in Mathematics",
  specialisations:
    "Artificial Intelligence, Networking and Distributed Systems, Algorithms and Theory.",
  favouriteCourses: [
    "Stochastic Processes I & II",
    "Artificial Intelligence Principles",
    "Algorithmic Mechanism Design",
    "Internet Architecture",
  ],
} as const;

export const EXPERIENCE = {
  company: "Morgan Stanley",
  role: "Technology Summer Analyst",
  team: "Risk Infrastructure",
  location: "Singapore",
  dates: "May-Aug 2026",
  intro:
    "Tooling for an internal risk datastore used across fixed-income and commodities workflows.",
  overview:
    "Our internal database is highly optimised for our use cases for risk calculations, most users struggle to understand the query composition. The team hence provided a SQL-like representation to help users interpret the query. However, most users still struggles to understand the internal system constructs. Often times, due to the large load of queries sent in, the malformed scheduled jobs (and large adhoc queries) creates unnecessary load on the servers, which required the developers in the team to prioritise resolution over our development tasks.",
  sections: [
    {
      label: "Query Playground",
      text:
        "Built a guided workbench for constructing and executing internal queries across more than 50 tables, with individual schemas reaching 800+ columns. It supported direct edits, LLM query reviews and optimisation suggestions, natural-language generation and round-trip conversion between SQL-like diagnostic logs and the executable internal query representation.",
    },
    {
      label: "Deterministic reconstruction",
      text:
        "Implemented a deterministic parser and reconstruction layer for 10+ nested query shapes, then added schema validation and failure classification around it. The parser gave the later analysis tooling a grounded representation instead of asking an agent to infer structure from raw logs each time.",
    },
    {
      label: "Review orchestration",
      text:
        "Added an orchestration layer for generation, regeneration, optimisation review and business-logic review, with targeted retrieval of diagnostic evidence when a claim needed support. The emphasis was on keeping deterministic system knowledge at the boundary and using agents where judgement or synthesis was actually useful.",
    },
  ],
  metrics: [
    { value: "15–25 min → seconds", label: "manual reconstruction workflow" },
    { value: "500+", label: "erroneous client queries triaged" },
    { value: "50+", label: "real diagnostic logs validated" },
    { value: "~80%", label: "investigation-time reduction" },
  ],
} as const;
export const SOFTWARE_PRACTICE = {
  company: "The Software Practice",
  role: "Software Development Engineer Intern",
  location: "Singapore",
  dates: "May-Dec 2025",
  intro:
    "Product engineering across a C#/.NET backend and Vue.js frontend, with an emphasis on testing and reliable scheduled workflows.",
} as const;


export const PROJECTS: readonly Project[] = [
  {
    id: "project-monte-carlo",
    number: "01",
    category: "Systems Behaviour",
    title: "Fault-Tolerant Parallel Monte Carlo",
    introSummary:
      "A reproducible pricing runtime designed around worker-count independence and crash recovery.",
    stack: "C++ / Philox / Heston / Andersen QE / deterministic recovery",
    lead:
      "A pricing runtime built around reproducibility and recovery semantics. Randomness, aggregation and persistence are structured so completed work remains valid when worker count or execution order changes.",
    detail: [
      "Scenario-keyed Philox streams make random-number assignment independent of thread scheduling. A deterministic aggregation tree gives the same reduction structure for 1, 2, 4 or 8 workers instead of allowing completion order to leak into the result.",
      "Each completed block is immutable and a manifest records committed work. Recovery therefore resumes from a clean boundary after an injected crash instead of replaying or partially trusting in-flight computation.",
    ],
    metrics: [
      { value: "1 / 2 / 4 / 8", label: "worker reproducibility" },
      { value: "9", label: "crash boundaries tested" },
      { value: "24.6%", label: "speedup vs baseline" },
    ],
    diagram: {
      caption: "Execution sketch",
      nodes: [
        { title: "Scenario key", meta: "model / seed / block" },
        { title: "Parallel workers", meta: "Philox streams" },
        { title: "Immutable blocks", meta: "recovery boundary" },
      ],
      note:
        "Committed blocks feed a deterministic aggregation tree, allowing the runtime to reconstruct the same completed result after reordered execution or a simulated crash.",
    },
    footer: "European / Asian options · GBM + Heston",
    tone: "black",
    links: [
      { label: "GitHub", href: "https://github.com/potaotototo/monte-carlo" },
      { label: "Design document / on request", href: "#contact" },
      { label: "Visualisation", href: "/monte-carlo-visualisation" },
    ],
  },
  {
    id: "project-tapcare",
    number: "02",
    category: "Full-stack",
    title: "TapCare",
    introSummary:
      "An NFC caregiver platform with household-scoped access and resilient public sticker routing.",
    stack: "Next.js / TypeScript / Prisma / PostgreSQL / Upstash Redis",
    lead:
      "An NFC-triggered support system for caregiver workflows. PostgreSQL owns durable household, assignment and sticker state; Redis is limited to short-lived coordination such as rate limits and duplicate-event suppression.",
    detail: [
      "The public sticker path is designed to remain usable when coordination state is unavailable. Permissions and durable history stay in PostgreSQL, while Redis can be discarded and rebuilt without becoming a second source of truth.",
      "Atomic Redis SET NX EX deduplication removes the check-then-act race from concurrent NFC event ingestion. In a 5,000-request benchmark at 100-way concurrency, the path suppressed all 4,000 intentionally duplicated PostgreSQL writes.",
    ],
    metrics: [
      { value: "5,000", label: "request benchmark" },
      { value: "100-way", label: "concurrency" },
      { value: "4,000", label: "duplicate DB writes suppressed" },
    ],
    diagram: {
      caption: "Public sticker path",
      nodes: [
        { title: "NFC tap", meta: "canonical HTTPS URL" },
        { title: "Validated routing", meta: "household + sticker policy" },
        { title: "Destination", meta: "redirect or rendered page" },
      ],
      note:
        "Redis handles short-lived coordination. Durable identity, permissions and interaction history remain in PostgreSQL so operational state has one authoritative home.",
    },
    footer: "Household-scoped access · public NFC routing",
    tone: "oxblood",
    links: [
      { label: "GitHub", href: "https://github.com/TapCare-Team/TapCare" },
      { label: "TapCare website", href: "https://tap-care-79vi.vercel.app/" },
      { label: "CCSGP Fellowship Award Project", href: "https://www.ccsgp.comp.nus.edu.sg/" },
    ],
  },
  {
    id: "project-weather",
    number: "03",
    category: "Machine Learning",
    title: "Weathering with Phew",
    introSummary:
      "A weather-warning pipeline with anomaly scoring kept separate from ingestion and serving.",
    stack: "Python / FastAPI / SQLite / Streamlit / IsolationForest",
    lead:
      "A Singapore weather-warning pipeline that collects station readings, computes neighbourhood gaps and anomaly features, then serves alerts through a small API and dashboard.",
    detail: [
      "Collection, feature generation, scoring and presentation are separate boundaries. The scoring interface can change without forcing a rewrite of the ingestion path or the API that serves current alerts.",
      "The current scorer uses IsolationForest with a simple cold-start fallback. That keeps the data path operational before enough history exists for the model to behave usefully and makes alternative scoring approaches straightforward to benchmark later.",
    ],
    metrics: [
      { value: "NEA", label: "live station source" },
      { value: "5", label: "weather metric families" },
      { value: "1", label: "swappable scoring boundary" },
    ],
    diagram: {
      caption: "Data path",
      nodes: [
        { title: "Station readings", meta: "collection + pagination" },
        { title: "Feature engine", meta: "gaps + anomaly score" },
        { title: "Alerts API", meta: "FastAPI + dashboard" },
      ],
      note:
        "The anomaly model sits behind a small scoring interface, keeping ingestion and serving stable while experimentation changes the scoring implementation.",
    },
    footer: "Singapore real-time weather · anomaly pipeline",
    tone: "cobalt",
    links: [
      { label: "GitHub", href: "https://github.com/potaotototo/Weathering-with-Phew" },
      { label: "Live demo / add link", href: "#contact" },
      { label: "Documentation / add link", href: "#contact" },
    ],
  },
] as const;

export const ABOUT = {
  heading: "About me",
  body:
    "Hey I'm Jingjing, glad to see you here. I study Computer Science and Mathematics at National University of Singapore (NUS). I am drawn to intellectually stimulating challenges, and I enjoy bringing value to people through my work. Outside of school, I volunteer, play badminton and do a few boxing classes.",
} as const;

export const CONTACT = {
  heading: "Elsewhere",
  note:
    "For project details, technical discussion or just any question you have, let's get in touch.",
  email: "jingjingwang2004@outlook.com",
  links: [
    { label: "GitHub", href: "https://github.com/potaotototo" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/wang-jingjing-sg/" },
  ],
} as const;

export type IntroNodeId =
  | "education"
  | "experience"
  | "practice"
  | "project-0"
  | "project-1"
  | "project-2";

export type IntroNodeContent = {
  id: IntroNodeId;
  label: string;
  title: string;
  body?: string;
  href: string;
  projectIndex?: number;
};

export const INTRO_NODES: readonly IntroNodeContent[] = [
  {
    id: "education",
    label: "01 / Education",
    title: EDUCATION.institution,
    body: `${EDUCATION.dates}\n${EDUCATION.degree}\n${EDUCATION.secondMajor}`,
    href: "#education",
  },
  {
    id: "experience",
    label: "02 / Experience",
    title: EXPERIENCE.company,
    body: `${EXPERIENCE.role} · ${EXPERIENCE.team}\n${EXPERIENCE.location} · ${EXPERIENCE.dates}`,
    href: "#experience",
  },
  {
    id: "practice",
    label: "03 / Experience",
    title: SOFTWARE_PRACTICE.company,
    body: `${SOFTWARE_PRACTICE.role}\n${SOFTWARE_PRACTICE.location} · ${SOFTWARE_PRACTICE.dates}`,
    href: "#experience",
  },
  ...PROJECTS.map((project, index) => ({
    id: `project-${index}` as IntroNodeId,
    label: `0${index + 4} / Project`,
    title: project.title,
    body: project.introSummary,
    href: `#${project.id}`,
    projectIndex: index,
  })),
] as const;
