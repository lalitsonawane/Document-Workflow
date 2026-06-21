import { describe, it, expect } from 'vitest';
import { buildSections } from './buildSections';
import { initialData } from './defaults';
import type { SpecData } from '../types';

describe('buildSections', () => {
  it('returns 10 sections', () => {
    const sections = buildSections(initialData);
    expect(sections).toHaveLength(10);
  });

  it('section numbers are sequential from 1.0 to 10.0', () => {
    const sections = buildSections(initialData);
    expect(sections.map((s) => s.number)).toEqual([
      '1.0',
      '2.0',
      '3.0',
      '4.0',
      '5.0',
      '6.0',
      '7.0',
      '8.0',
      '9.0',
      '10.0',
    ]);
  });

  it('every section has id, number, title, and non-empty content', () => {
    const sections = buildSections(initialData);
    for (const s of sections) {
      expect(s.id).toBeTruthy();
      expect(s.number).toBeTruthy();
      expect(s.title).toBeTruthy();
      expect(s.content.length).toBeGreaterThan(0);
    }
  });

  it('purpose section includes title and requirement', () => {
    const sections = buildSections(initialData);
    const purpose = sections.find((s) => s.id === 'purpose')!;
    expect(purpose.content).toContain(initialData.title);
    expect(purpose.content).toContain(initialData.requirement);
  });

  it('scope section includes in-scope and out-of-scope', () => {
    const sections = buildSections(initialData);
    const scope = sections.find((s) => s.id === 'scope')!;
    expect(scope.content).toContain(initialData.inScope);
    expect(scope.content).toContain(initialData.outScope);
  });

  it('stories section formats each story with role, goal, benefit, and criteria', () => {
    const sections = buildSections(initialData);
    const stories = sections.find((s) => s.id === 'stories')!;
    for (const story of initialData.stories) {
      expect(stories.content).toContain(story.role);
      expect(stories.content).toContain(story.goal);
      expect(stories.content).toContain(story.benefit);
      expect(stories.content).toContain(story.criteria);
    }
  });

  it('test scenarios section maps stories to TS-NN format', () => {
    const sections = buildSections(initialData);
    const test = sections.find((s) => s.id === 'test')!;
    expect(test.content).toContain('TS-01');
    expect(test.content).toContain('TS-02');
    expect(test.content).toContain('TS-03');
  });

  it('handles empty stories gracefully', () => {
    const data: SpecData = { ...initialData, stories: [] };
    const sections = buildSections(data);
    const stories = sections.find((s) => s.id === 'stories')!;
    expect(stories.content).toBe('');
    const test = sections.find((s) => s.id === 'test')!;
    expect(test.content).toBe('');
  });

  it('handles stories with empty fields using fallback text', () => {
    const data: SpecData = {
      ...initialData,
      stories: [{ id: 99, role: '', goal: '', benefit: '', criteria: '' }],
    };
    const sections = buildSections(data);
    const stories = sections.find((s) => s.id === 'stories')!;
    expect(stories.content).toContain('user');
    expect(stories.content).toContain('complete the process');
    expect(stories.content).toContain('achieve the business outcome');
    expect(stories.content).toContain('To be confirmed');
  });

  it('section ids are unique', () => {
    const sections = buildSections(initialData);
    const ids = sections.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
