export const profile = {
  name: 'Srushti Borate',
  role: 'Software engineer',
  discoveryRole: 'One of the founding engineers of Microsoft Discovery.',
  positioning: 'Building AI and cloud platforms.',
  email: 'srushtiborate100@gmail.com',
  github: 'https://github.com/srushti-learner',
  linkedin: 'https://www.linkedin.com/in/srushti-borate-b1000020a/',
};

export const work = [
  {
    number: '01',
    id: 'discovery-platform',
    category: 'ENTERPRISE PLATFORM / AZURE',
    title: 'Microsoft Discovery',
    description: 'Agentic AI for enterprise research and development.',
    context: 'An Azure-based platform that brings specialized agents, knowledge, and scientific tools into governed R&D workflows, with human expertise at the center.',
    contributions: [
      'CI/CD automation for product delivery',
      'API authentication and authorization',
      'Admin APIs for privileged operational access',
      'MCP server exposing selected product APIs',
    ],
    resumeContribution: 'CI/CD automation; API authentication and authorization; Admin APIs for privileged operational access; an MCP server exposing selected product APIs.',
    tags: ['Azure', 'C# / .NET', 'CI/CD', 'API auth', 'MCP'],
    variant: 'cloud',
    artCaption: 'ENTERPRISE R&D, ON AZURE',
    problem: 'Enterprise research workflows need to bring AI agents and scientific tools together while supporting controlled access and dependable product delivery.',
    contribution: 'I contribute to the engineering foundations of the Discovery platform, spanning delivery automation, API authentication and authorization, privileged Admin APIs, and MCP-based access to selected product APIs.',
    decisions: 'My work focuses on the practical integration points between delivery, API access, and developer tooling. Security mechanisms, privileged operations, endpoints, and internal architecture are intentionally not detailed here.',
    outcome: 'Engineering contributions across the enterprise product, as part of the wider Microsoft Discovery team. The platform’s scientific capabilities and research outcomes are product context, not claims of my individual work.',
    announcement: 'https://azure.microsoft.com/en-us/blog/transforming-rd-with-agentic-ai-introducing-microsoft-discovery/',
    source: 'https://learn.microsoft.com/en-us/azure/microsoft-discovery/concept-discovery-and-discovery-app',
  },
  {
    number: '02',
    id: 'discovery-app',
    category: 'LOCAL AGENTIC AI / DESKTOP',
    title: 'Microsoft Discovery App',
    description: 'A local starting point for agentic research.',
    context: 'A complementary desktop experience for exploring literature, hypotheses, and evidence-driven research locally, without starting with an enterprise Azure deployment. Users get started with a GitHub Copilot account.',
    contributions: [
      'Cross-platform AI desktop delivery',
      'MCP developer tooling',
      'Provider-aware telemetry',
    ],
    resumeContribution: 'Cross-platform AI desktop delivery, MCP developer tooling, and provider-aware telemetry for the local agentic AI experience.',
    tags: ['Desktop', 'Agentic AI', 'MCP tooling', 'Telemetry'],
    variant: 'tools',
    artCaption: 'AGENTIC EXPLORATION, ON DESKTOP',
    problem: 'A local agentic AI product needs to bring tools and providers together in an approachable desktop experience, complementing the enterprise platform.',
    contribution: 'My Discovery App work includes cross-platform AI desktop delivery, MCP developer tooling, and provider-aware telemetry.',
    decisions: 'I focus on desktop delivery and tooling integration, alongside telemetry that preserves useful provider context. This is a high-level account of my contribution, not an internal implementation walkthrough.',
    outcome: 'Contributions to the local Discovery App as part of the product team. Microsoft introduced the app preview at Build as a complementary way to begin agentic research.',
    announcement: 'https://azure.microsoft.com/en-us/blog/announcing-microsoft-discovery-general-availability-and-microsoft-discovery-app-preview/',
    source: 'https://learn.microsoft.com/en-us/azure/microsoft-discovery/concept-discovery-and-discovery-app',
  },
];

export const experience = [
  {
    role: 'Software Engineer',
    company: 'Microsoft',
    period: 'Jul 2024 — Present',
    description: `${profile.discoveryRole} Working across its enterprise platform and the local Microsoft Discovery App, spanning cloud engineering, API access, delivery automation, and AI developer experiences.`,
    highlights: work.map((item) => ({ title: item.title, description: item.resumeContribution })),
    type: 'Full-time',
  },
  {
    role: 'Software Engineering Intern',
    company: 'Microsoft · Azure for Operators',
    period: 'May — Jul 2023',
    description: 'Worked on isolated testing for C#/.NET components using xUnit and Moq.',
    highlights: [],
    type: 'Internship',
  },
];

export const projects = [
  {
    title: 'Multi-agent tooling',
    category: 'AI / HACKATHON',
    date: 'Sep 2026',
    description: 'Explored multi-agent developer tooling in a hackathon setting. A public-safe overview; internal implementation details and metrics are omitted.',
    tags: 'AI agents · Developer tools',
  },
  {
    title: 'Underwater robotics',
    category: 'COMPUTER VISION / ROBOTICS',
    date: '2021 — 2024',
    description: 'Worked on an ASME underwater robot with OpenCV, alongside technical leadership responsibilities.',
    tags: 'OpenCV · Technical leadership',
  },
  {
    title: 'Movie recommendation engine',
    category: 'MACHINE LEARNING / WEB',
    date: 'May 2022',
    description: 'A Microsoft Engage project combining natural language processing with a Flask and JavaScript web application.',
    tags: 'Python · NLP · Flask · JavaScript',
  },
];
