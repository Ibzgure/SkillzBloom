// lib/resources-data.ts
// Fallback local Resource type to avoid unresolved '@/types' path; replace with a proper import if you have a project-level types file.
type Resource = {
  id: string;
  title: string;
  description?: string;
  url?: string;
  type?: string;
  skills?: string[];
  difficulty?: string;
  tags?: string[];
  featured?: boolean;
  createdAt?: string;
};

const now = () => new Date().toISOString();

export const HANDPICKED_RESOURCES: Omit<Resource, 'id'>[] = [
  {
    title: "MDN JavaScript Guide",
    description: "Official JS guide from basics to advanced.",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    type: "documentation",
    skills: ["Frontend", "JavaScript"],
    difficulty: "beginner",
    tags: ["javascript","fundamentals"],
    featured: true,
    createdAt: now(),
  },
  {
    title: "React Official Tutorial",
    description: "Learn React step by step.",
    url: "https://react.dev/learn",
    type: "course",
    skills: ["Frontend","React"],
    difficulty: "beginner",
    tags: ["react","components"],
    featured: true,
    createdAt: now(),
  },
  {
    title: "TypeScript Handbook",
    description: "Official TypeScript docs.",
    url: "https://www.typescriptlang.org/docs/handbook/intro.html",
    type: "documentation",
    skills: ["Frontend","TypeScript"],
    difficulty: "intermediate",
    tags: ["ts","types"],
    featured: true,
    createdAt: now(),
  }
].map((r, i) => ({ ...r, id: `res_${i+1}` }));
