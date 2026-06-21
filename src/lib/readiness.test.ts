import { describe, it, expect } from 'vitest';
import { calculateReadiness, getReadinessPercent } from './readiness';
import { initialData } from './defaults';
import type { SpecData } from '../types';

describe('readiness', () => {
  it('returns 6 checks', () => {
    const checks = calculateReadiness(initialData, 1, false);
    expect(checks).toHaveLength(6);
  });

  it('full data at step 3 passes most checks except specGenerated', () => {
    const checks = calculateReadiness(initialData, 3, false);
    const [labels, values] = checks.reduce(
      ([l, v], [label, ok]) => [
        [...l, label],
        [...v, ok],
      ],
      [[] as string[], [] as boolean[]],
    );
    expect(values.filter(Boolean).length).toBe(5);
    expect(values[5]).toBe(false);
    expect(labels[5]).toBe('Functional spec generated');
  });

  it('all checks pass when specGenerated is true at step 4', () => {
    const checks = calculateReadiness(initialData, 4, true);
    expect(checks.every(([, ok]) => ok)).toBe(true);
  });

  it('empty data fails project details check', () => {
    const empty: SpecData = {
      module: '',
      project: '',
      title: '',
      process: '',
      author: '',
      version: '',
      requirement: '',
      inScope: '',
      outScope: '',
      assumptions: '',
      dependencies: '',
      stories: [],
    };
    const checks = calculateReadiness(empty, 1, false);
    expect(checks[0][1]).toBe(false);
  });

  it('percent is 0 when nothing is complete', () => {
    const empty: SpecData = {
      module: '',
      project: '',
      title: '',
      process: '',
      author: '',
      version: '',
      requirement: '',
      inScope: '',
      outScope: '',
      assumptions: '',
      dependencies: '',
      stories: [],
    };
    const checks = calculateReadiness(empty, 1, false);
    expect(getReadinessPercent(checks)).toBe(0);
  });

  it('percent is 100 when all checks pass', () => {
    const checks = calculateReadiness(initialData, 4, true);
    expect(getReadinessPercent(checks)).toBe(100);
  });

  it('requirement shorter than 40 chars fails the check', () => {
    const data: SpecData = { ...initialData, requirement: 'short' };
    const checks = calculateReadiness(data, 2, false);
    expect(checks[1][1]).toBe(false);
  });

  it('fewer than 3 stories fails the check', () => {
    const data: SpecData = {
      ...initialData,
      stories: [{ id: 1, role: 'r', goal: 'g', benefit: 'b', criteria: 'c' }],
    };
    const checks = calculateReadiness(data, 2, false);
    expect(checks[2][1]).toBe(false);
  });
});
