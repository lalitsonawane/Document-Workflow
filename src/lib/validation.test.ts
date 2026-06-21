import { describe, it, expect } from 'vitest';
import { canAdvanceStep } from './validation';
import { initialData } from './defaults';
import type { SpecData } from '../types';

describe('canAdvanceStep', () => {
  it('allows step 1 advance when all project fields are filled', () => {
    expect(canAdvanceStep(initialData, 1)).toBe(true);
  });

  it('blocks step 1 when a project field is empty', () => {
    const data: SpecData = { ...initialData, module: '' };
    expect(canAdvanceStep(data, 1)).toBe(false);
  });

  it('allows step 2 when requirement >= 40 chars and has stories', () => {
    expect(canAdvanceStep(initialData, 2)).toBe(true);
  });

  it('blocks step 2 when requirement is too short', () => {
    const data: SpecData = { ...initialData, requirement: 'short' };
    expect(canAdvanceStep(data, 2)).toBe(false);
  });

  it('blocks step 2 when no stories exist', () => {
    const data: SpecData = { ...initialData, stories: [] };
    expect(canAdvanceStep(data, 2)).toBe(false);
  });

  it('allows step 3 when in-scope and out-of-scope are filled', () => {
    expect(canAdvanceStep(initialData, 3)).toBe(true);
  });

  it('blocks step 3 when in-scope is empty', () => {
    const data: SpecData = { ...initialData, inScope: '' };
    expect(canAdvanceStep(data, 3)).toBe(false);
  });

  it('allows any other step by default', () => {
    expect(canAdvanceStep(initialData, 99)).toBe(true);
  });
});
