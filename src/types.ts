export interface Story {
  id: number;
  role: string;
  goal: string;
  benefit: string;
  criteria: string;
}

export interface SpecData {
  module: string;
  project: string;
  title: string;
  process: string;
  author: string;
  version: string;
  requirement: string;
  inScope: string;
  outScope: string;
  assumptions: string;
  dependencies: string;
  stories: Story[];
}

export interface Section {
  id: string;
  number: string;
  title: string;
  content: string;
}

export interface AppState {
  data: SpecData;
  step: number;
  sections: Section[];
}

export type IconName =
  | 'save'
  | 'export'
  | 'plus'
  | 'trash'
  | 'arrow'
  | 'back'
  | 'file'
  | 'check'
  | 'chevron'
  | 'edit'
  | 'copy'
  | 'print';

export type FieldType = 'input' | 'select';

export type Updater<T> = T | ((prev: T) => T);

export type ReadinessCheck = [string, boolean];

export const FIELD_LABELS = {
  module: 'SAP module',
  project: 'Project name',
  title: 'FSD title',
  process: 'Process area',
  author: 'Author',
  version: 'Document version',
} as const;

export type FieldKey = keyof typeof FIELD_LABELS;
