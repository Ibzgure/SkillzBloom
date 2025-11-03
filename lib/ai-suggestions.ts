// lib/ai-suggestions.ts
import type { Reflection, Resource, AISuggestion } from '../types';

export function generateAISuggestions(
  reflections: Reflection[],
  resources: Resource[],
  userSkills: string[]
): AISuggestion[] {
  const out: AISuggestion[] = [];
  const now = () => new Date().toISOString();
  const recent = reflections[0];

  if (!recent) {
    out.push({
      id: 'sug_welcome',
      userId: 'demo',
      type: 'encouragement',
      content: 'Welcome to SkillzBloom! Add your first reflection to unlock personalized tips.',
      priority: 'high',
      createdAt: now(),
      viewed: false,
    });
    return out;
  }

  // If struggling, give beginner links for mentioned skills
  if (recent.mood === 'struggling') {
    const matches = resources.filter(r =>
      r.difficulty === 'beginner' &&
      r.skills.some(s => recent.skills.includes(s))
    ).slice(0, 2);

    out.push({
      id: 'sug_encourage',
      userId: 'demo',
      type: 'encouragement',
      content: "It's okay to struggle—focus on foundations, you've got this!",
      priority: 'high',
      createdAt: now(),
      viewed: false
    });

    if (matches.length) {
      out.push({
        id: 'sug_beginner',
        userId: 'demo',
        type: 'resource',
        content: 'Try these beginner-friendly resources next:',
        resourceIds: matches.map(m => m.id),
        skillArea: recent.skills[0],
        priority: 'high',
        createdAt: now(),
        viewed: false
      });
    }
  } else {
    // progressing — suggest next-level items
    const matches = resources.filter(r =>
      (r.difficulty === 'intermediate' || r.difficulty === 'advanced') &&
      r.skills.some(s => recent.skills.includes(s))
    ).slice(0, 2);

    if (matches.length) {
      out.push({
        id: 'sug_levelup',
        userId: 'demo',
        type: 'resource',
        content: 'Great momentum! Level up with these:',
        resourceIds: matches.map(m => m.id),
        skillArea: recent.skills[0],
        priority: 'medium',
        createdAt: now(),
        viewed: false
      });
    }
  }

  // Always add one task
  out.push({
    id: 'sug_task',
    userId: 'demo',
    type: 'task',
    content: `Build a tiny project using ${recent.skills[0]} and write a short reflection.`,
    skillArea: recent.skills[0],
    priority: 'medium',
    createdAt: now(),
    viewed: false
  });

  // Remind neglected skills
  const recentSkills = reflections.slice(0, 5).flatMap(r => r.skills);
  const neglected = userSkills.filter(s => !recentSkills.includes(s));
  if (neglected[0]) {
    const recs = resources.filter(r => r.skills.includes(neglected[0])).slice(0,2);
    if (recs.length) {
      out.push({
        id: 'sug_neglected',
        userId: 'demo',
        type: 'resource',
        content: `Haven't touched ${neglected[0]} lately—consider these:`,
        resourceIds: recs.map(r => r.id),
        skillArea: neglected[0],
        priority: 'low',
        createdAt: now(),
        viewed: false
      });
    }
  }

  return out;
}
