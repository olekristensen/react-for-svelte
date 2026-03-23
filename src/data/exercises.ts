export interface ExerciseInfo {
  id: string;
  chapterId: string;
  title: string;
  type: 'fix-the-bug' | 'complete-the-code';
}

export const exercises: ExerciseInfo[] = [
  // Foundations
  { id: 'state-fix-setter', chapterId: 'state', title: 'Fix the State Setter', type: 'fix-the-bug' },
  { id: 'state-complete-array', chapterId: 'state', title: 'Immutable Array Update', type: 'complete-the-code' },
  { id: 'components-fix-key', chapterId: 'components', title: 'Fix the List Key', type: 'fix-the-bug' },
  { id: 'events-complete-handler', chapterId: 'events', title: 'Complete the Form Handler', type: 'complete-the-code' },
  { id: 'lifecycle-fix-cleanup', chapterId: 'lifecycle', title: 'Fix the Effect Cleanup', type: 'fix-the-bug' },

  // Intermediate Patterns
  { id: 'conditional-fix-falsy', chapterId: 'conditional-rendering', title: 'Fix the Falsy Render', type: 'fix-the-bug' },
  { id: 'forms-complete-controlled', chapterId: 'forms', title: 'Wire Up Controlled Input', type: 'complete-the-code' },
  { id: 'context-complete-provider', chapterId: 'context', title: 'Complete the Provider', type: 'complete-the-code' },

  // Advanced React
  { id: 'hooks-complete-custom', chapterId: 'custom-hooks', title: 'Build useLocalStorage', type: 'complete-the-code' },
  { id: 'performance-fix-memo', chapterId: 'performance', title: 'Fix the Re-render', type: 'fix-the-bug' },
  { id: 'typescript-fix-types', chapterId: 'typescript', title: 'Fix the Types', type: 'fix-the-bug' },

  // Ecosystem
  { id: 'ecosystem-state-complete-zustand', chapterId: 'ecosystem-state', title: 'Complete the Zustand Store', type: 'complete-the-code' },
  { id: 'ecosystem-state-fix-mobx-observer', chapterId: 'ecosystem-state', title: 'Fix the MobX Counter', type: 'fix-the-bug' },
  { id: 'animation-complete-transition', chapterId: 'animation-transitions', title: 'Add CSS Transition', type: 'complete-the-code' },

  // Next.js
  { id: 'nextjs-routing-fix-link', chapterId: 'nextjs-routing', title: 'Fix the Navigation', type: 'fix-the-bug' },
  { id: 'nextjs-data-complete-fetch', chapterId: 'nextjs-data', title: 'Complete Server Fetch', type: 'complete-the-code' },
];

export function exercisesForChapter(chapterId: string): ExerciseInfo[] {
  return exercises.filter(e => e.chapterId === chapterId);
}

export function totalExercisesForChapter(chapterId: string): number {
  return exercises.filter(e => e.chapterId === chapterId).length;
}
