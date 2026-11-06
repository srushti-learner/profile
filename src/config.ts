import { profile, work, experience, projects } from './data/profile';

interface Project {
  name: string;
  description: string;
  skills: string[];
  dateRange: string;
  category: string;
  link?: string;
}

interface SiteConfig {
  name: string;
  title: string;
  description: string;
  accentColor: string;
  foundingRole: string;
  social: { email: string; linkedin: string; github: string; twitter?: string };
  aboutMe: string;
  personalInterests: string;
  skills: string[];
  projects: Project[];
  discovery: typeof work;
  experience: { company: string; title: string; dateRange: string; bullets: string[] }[];
  education: { school: string; degree: string; dateRange: string; achievements: string[] }[];
}

export const siteConfig: SiteConfig = {
  name: profile.name,
  title: 'Software Engineer at Microsoft',
  description: 'Srushti Borate is a software engineer at Microsoft and one of the founding engineers of Microsoft Discovery, working across its enterprise platform and local agentic AI app.',
  accentColor: 'var(--accent)',
  foundingRole: profile.discoveryRole,
  social: { email: profile.email, linkedin: profile.linkedin, github: profile.github },
  aboutMe: 'I’m Srushti, a software engineer at Microsoft and an IIT Roorkee graduate. I work on Microsoft Discovery across its enterprise platform and local agentic AI app. I’m interested in the connections: between services, between tools, and between an engineering decision and the experience it creates.',
  personalInterests: 'Outside of work, I’m a gym enthusiast and always up for a game of badminton or table tennis, or a swim. I also love travelling.',
  skills: ['C# / .NET', 'Azure', 'API authentication & authorization', 'Managed identity / RBAC', 'CI/CD', 'MCP', 'Observability', 'Cross-platform desktop', 'Python', 'OpenCV'],
  projects: projects.map((project) => ({
    name: project.title,
    description: project.description,
    skills: project.tags.split(' · '),
    dateRange: project.date,
    category: project.category,
  })),
  discovery: work,
  experience: experience.map((job) => ({
    company: job.company,
    title: job.role,
    dateRange: job.period,
    bullets: [job.description, ...job.highlights.map((highlight) => `${highlight.title}: ${highlight.description}`)],
  })),
  education: [{
    school: 'Indian Institute of Technology Roorkee',
    degree: 'B.Tech, Electrical Engineering',
    dateRange: '2020 — 2024',
    achievements: ['CGPA 8.55 / 10'],
  }],
};
