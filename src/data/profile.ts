export const profile = {
  name: 'Srushti Borate',
  role: 'Software engineer',
  positioning: 'Building AI and cloud platforms.',
  email: 'srushtiborate100@gmail.com',
  github: 'https://github.com/srushti-learner',
  linkedin: 'https://www.linkedin.com/in/srushti-borate-b1000020a/',
};

export const work = [
  {
    number: '01',
    category: 'CLOUD PLATFORMS',
    title: 'The systems behind the experience.',
    description: 'Cloud services, APIs, and the foundations that help software work reliably.',
    tags: ['C# / .NET', 'Azure', 'Identity'],
    variant: 'cloud',
    problem: 'Cloud applications need more than a working API: access, diagnostics, and delivery all need to fit together.',
    contribution: 'At Microsoft, I work on C#/.NET Azure cloud services and APIs, with managed identity, role-based access, observability, and CI/CD.',
    decisions: 'My focus is on secure access patterns, clear service boundaries, and diagnostics that make behavior understandable.',
    outcome: 'Contributions span cloud-service implementation and the supporting engineering foundations. This overview intentionally leaves out internal architecture and operational details.',
  },
  {
    number: '02',
    category: 'AI & DEVELOPER EXPERIENCE',
    title: 'Making complex tools feel connected.',
    description: 'Developer tooling and cross-platform delivery at the intersection of AI and software.',
    tags: ['MCP tooling', 'Desktop', 'Telemetry'],
    variant: 'tools',
    problem: 'AI developer experiences bring together different tools and providers, while still needing a coherent cross-platform experience.',
    contribution: 'My Microsoft work includes MCP developer tooling, cross-platform AI desktop delivery, and provider-aware telemetry.',
    decisions: 'I focus on the integration surfaces and on preserving useful context when instrumenting different providers.',
    outcome: 'Hands-on contributions to AI tooling and desktop delivery. Product-specific implementations and internal measurements are not shared here.',
  },
  {
    number: '03',
    category: 'RECOMMENDATION SYSTEMS',
    title: 'A better next movie, with a little NLP.',
    description: 'A movie recommendation engine connecting Python, natural language processing, and the web.',
    tags: ['Python', 'NLP', 'Flask'],
    variant: 'movies',
    problem: 'A large movie catalogue can make choosing what to watch feel like work. Recommendations provide another way to explore it.',
    contribution: 'Built a movie recommendation engine during Microsoft Engage in May 2022 using Python, NLP, Flask, and JavaScript.',
    decisions: 'Combined a Python/NLP recommendation layer with a Flask web application and a JavaScript interface.',
    outcome: 'A project bringing recommendation logic and a web experience together, with practical experience across the application stack.',
  },
];

export const experience = [
  {
    role: 'Software Engineer',
    company: 'Microsoft',
    period: 'Jul 2024 — Present',
    description: 'Building across cloud services and AI developer platforms. Working with C#/.NET, Azure, APIs, identity, observability, and cross-platform desktop delivery.',
    type: 'Full-time',
  },
  {
    role: 'Software Engineering Intern',
    company: 'Microsoft · Azure for Operators',
    period: 'May — Jul 2023',
    description: 'Worked on isolated testing for C#/.NET components using xUnit and Moq.',
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
