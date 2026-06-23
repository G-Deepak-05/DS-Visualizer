import type { Annotation } from '../types';

/**
 * Load saved annotations for a given visualizer.
 * Uses localStorage under the key `ds_visualizer_annotations_<visualizer>`.
 */
export const loadAnnotations = (visualizerKey: string): Annotation[] => {
  const raw = localStorage.getItem(`ds_visualizer_annotations_${visualizerKey}`);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    // Basic sanity check – should be an array of objects with at least an id
    if (Array.isArray(parsed) && parsed.every(a => typeof a.id === 'string')) {
      return parsed as Annotation[];
    }
    return [];
  } catch {
    return [];
  }
};

/**
 * Persist annotations for a given visualizer.
 */
export const saveAnnotations = (visualizerKey: string, ann: Annotation[]): void => {
  localStorage.setItem(
    `ds_visualizer_annotations_${visualizerKey}`,
    JSON.stringify(ann)
  );
};
