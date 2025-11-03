// types/index.ts
export interface Reflection {
  id: string;
  userId: string;
  text: string;
  mood: 'great' | 'good' | 'okay' | 'struggling';
  skills: string[];
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'course' | 'tool' | 'documentation' | 'book';
  skills: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  featured: boolean;
  createdAt: string;
}

export interface AISuggestion {
  id: string;
  userId: string;
  type: 'resource' | 'task' | 'tip' | 'encouragement';
  content: string;
  resourceIds?: string[];
  skillArea?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  viewed: boolean;
}
