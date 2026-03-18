import { useSyncExternalStore, useCallback } from 'react';

const STORAGE_KEY = 'rfsd-progress';

interface ExerciseData {
  solved: boolean;
  userCode: string;
  initialCode?: string;
  attempts: number;
}

interface ProgressData {
  visitedChapters: string[];
  exercises: Record<string, ExerciseData>;
}

function getDefaultData(): ProgressData {
  return { visitedChapters: [], exercises: {} };
}

function readFromStorage(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    return JSON.parse(raw) as ProgressData;
  } catch {
    return getDefaultData();
  }
}

function writeToStorage(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Notify all subscribers
  window.dispatchEvent(new Event('rfsd-progress-change'));
}

// Snapshot for useSyncExternalStore — returns a stable reference when data hasn't changed
let cachedSnapshot: ProgressData = readFromStorage();
let cachedJson = JSON.stringify(cachedSnapshot);

function getSnapshot(): ProgressData {
  const raw = localStorage.getItem(STORAGE_KEY) || JSON.stringify(getDefaultData());
  if (raw !== cachedJson) {
    cachedJson = raw;
    cachedSnapshot = JSON.parse(raw) as ProgressData;
  }
  return cachedSnapshot;
}

function subscribe(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener('rfsd-progress-change', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('rfsd-progress-change', handler);
    window.removeEventListener('storage', handler);
  };
}

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot);

  const markVisited = useCallback((chapterId: string) => {
    const data = readFromStorage();
    if (!data.visitedChapters.includes(chapterId)) {
      data.visitedChapters.push(chapterId);
      writeToStorage(data);
    }
  }, []);

  const isVisited = useCallback((chapterId: string): boolean => {
    return progress.visitedChapters.includes(chapterId);
  }, [progress]);

  const saveExercise = useCallback((exerciseId: string, exerciseData: ExerciseData) => {
    const data = readFromStorage();
    data.exercises[exerciseId] = exerciseData;
    writeToStorage(data);
  }, []);

  const getExercise = useCallback((exerciseId: string): ExerciseData | null => {
    return progress.exercises[exerciseId] || null;
  }, [progress]);

  const solvedExercisesForChapter = useCallback((chapterId: string): number => {
    return Object.entries(progress.exercises)
      .filter(([id, data]) => id.startsWith(chapterId + '-') && data.solved)
      .length;
  }, [progress]);

  const resetProgress = useCallback(() => {
    writeToStorage(getDefaultData());
  }, []);

  return {
    markVisited,
    isVisited,
    visitedCount: progress.visitedChapters.length,
    saveExercise,
    getExercise,
    solvedExercisesForChapter,
    resetProgress,
    progress,
  };
}
