import type { SpecData, ReadinessCheck, FieldKey } from '../types';

export function calculateReadiness(
  data: SpecData,
  step: number,
  specGenerated: boolean,
): ReadinessCheck[] {
  const projectFields: FieldKey[] = ['module', 'project', 'title', 'process', 'author', 'version'];
  return [
    ['Project details completed', projectFields.every((k) => data[k].trim())],
    ['Business requirement defined', data.requirement.trim().length >= 40],
    ['At least 3 user stories', data.stories.length >= 3],
    [
      'Acceptance criteria provided',
      data.stories.length > 0 && data.stories.every((s) => s.criteria.trim()),
    ],
    ['Scope reviewed', step >= 3 && !!data.inScope.trim() && !!data.outScope.trim()],
    ['Functional spec generated', specGenerated],
  ];
}

export function getReadinessPercent(checks: ReadinessCheck[]): number {
  const complete = checks.filter((x) => x[1]).length;
  return Math.round((complete / checks.length) * 100);
}
