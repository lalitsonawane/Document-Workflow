import { describe, it, expect, beforeEach } from 'vitest';
import { loadStoredState, saveState, clearState } from './storage';
import { initialData } from './defaults';
import type { AppState } from '../types';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial data when localStorage is empty', () => {
    const state = loadStoredState();
    expect(state.data).toEqual(initialData);
    expect(state.step).toBe(1);
    expect(state.sections).toEqual([]);
  });

  it('round-trips state through save and load', () => {
    const state: AppState = {
      data: initialData,
      step: 3,
      sections: [{ id: 'test', number: '1.0', title: 'Test', content: 'Content' }],
    };
    saveState(state);
    const loaded = loadStoredState();
    expect(loaded.step).toBe(3);
    expect(loaded.sections).toHaveLength(1);
    expect(loaded.sections[0].id).toBe('test');
  });

  it('writes schema version to localStorage', () => {
    saveState({ data: initialData, step: 1, sections: [] });
    const raw = localStorage.getItem('specflow-draft');
    const parsed = JSON.parse(raw!);
    expect(parsed.version).toBe(1);
  });

  it('clearState removes the stored draft', () => {
    saveState({ data: initialData, step: 2, sections: [] });
    clearState();
    expect(localStorage.getItem('specflow-draft')).toBeNull();
  });

  it('falls back to initial data on corrupt JSON', () => {
    localStorage.setItem('specflow-draft', '{not valid json');
    const state = loadStoredState();
    expect(state.data).toEqual(initialData);
    expect(state.step).toBe(1);
  });

  it('handles legacy data without version field', () => {
    const legacy = { data: { ...initialData, title: 'Legacy' }, step: 2, sections: [] };
    localStorage.setItem('specflow-draft', JSON.stringify(legacy));
    const state = loadStoredState();
    expect(state.data.title).toBe('Legacy');
    expect(state.step).toBe(2);
  });

  it('falls back to initial stories when stored stories are empty', () => {
    const state: AppState = {
      data: { ...initialData, stories: [] },
      step: 1,
      sections: [],
    };
    saveState(state);
    const loaded = loadStoredState();
    expect(loaded.data.stories).toEqual(initialData.stories);
  });
});
