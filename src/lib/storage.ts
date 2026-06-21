import type { AppState } from '../types';
import { initialData } from './defaults';

export function loadStoredState(): AppState {
  try {
    const raw = localStorage.getItem('specflow-draft');
    if (!raw) return { data: initialData, step: 1, sections: [] };
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      data: {
        ...initialData,
        ...parsed.data,
        stories: parsed.data?.stories?.length ? parsed.data.stories : initialData.stories,
      },
      step: parsed.step || 1,
      sections: parsed.sections || [],
    };
  } catch {
    return { data: initialData, step: 1, sections: [] };
  }
}
