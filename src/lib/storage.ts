import type { AppState, StoredState, SpecData, Section } from '../types';
import { initialData } from './defaults';

const STORAGE_KEY = 'specflow-draft';
const SCHEMA_VERSION = 1;

interface LegacyStored {
  data?: Partial<SpecData>;
  step?: number;
  sections?: Section[];
}

export function loadStoredState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { data: initialData, step: 1, sections: [] };
    const parsed = JSON.parse(raw) as StoredState | LegacyStored;
    return migrate(parsed);
  } catch {
    return { data: initialData, step: 1, sections: [] };
  }
}

export function saveState(state: AppState): void {
  const stored: StoredState = {
    version: SCHEMA_VERSION,
    data: state.data,
    step: state.step,
    sections: state.sections,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

function migrate(parsed: StoredState | LegacyStored): AppState {
  if ('version' in parsed && parsed.version === SCHEMA_VERSION) {
    return {
      data: mergeData(parsed.data),
      step: parsed.step || 1,
      sections: parsed.sections || [],
    };
  }
  return {
    data: mergeData(parsed.data),
    step: parsed.step || 1,
    sections: parsed.sections || [],
  };
}

function mergeData(partial?: Partial<SpecData>): SpecData {
  return {
    ...initialData,
    ...partial,
    stories: partial?.stories?.length ? partial.stories : initialData.stories,
  };
}
