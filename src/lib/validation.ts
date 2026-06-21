import type { SpecData } from '../types';

export function canAdvanceStep(data: SpecData, step: number): boolean {
  switch (step) {
    case 1: {
      const fields: (keyof SpecData)[] = [
        'module',
        'project',
        'title',
        'process',
        'author',
        'version',
      ];
      return fields.every((k) => (data[k] as string).trim());
    }
    case 2:
      return data.requirement.trim().length >= 40 && data.stories.length >= 1;
    case 3:
      return !!data.inScope.trim() && !!data.outScope.trim();
    default:
      return true;
  }
}
