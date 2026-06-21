import { useState } from 'react';
import type { SpecData, SetData, Story, FieldKey } from '../types';
import { FIELD_LABELS } from '../types';
import { initialStories } from '../lib/defaults';
import { Field } from './Field';
import { StoryRow } from './StoryRow';
import { Icon } from './Icon';

export function Requirements({ data, setData }: { data: SpecData; setData: SetData }) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const set = (key: keyof SpecData) => (value: string) => setData((d) => ({ ...d, [key]: value }));
  const updateStory = (id: number, key: keyof Omit<Story, 'id'>, value: string) =>
    setData((d) => ({
      ...d,
      stories: d.stories.map((s) => (s.id === id ? { ...s, [key]: value } : s)),
    }));
  const reorderStories = (from: number, to: number) => {
    setData((d) => {
      const stories = [...d.stories];
      const [moved] = stories.splice(from, 1);
      stories.splice(to, 0, moved);
      return { ...d, stories };
    });
  };
  const restoreDefaults = () => {
    setData((d) => ({ ...d, stories: initialStories }));
  };
  const fieldEntries = Object.entries(FIELD_LABELS) as [FieldKey, string][];

  return (
    <section className="page-content requirements-page">
      <div className="page-heading">
        <p className="step-label">Step 2 of 4</p>
        <h1>Define the business need</h1>
        <p>
          Capture the requirement and user stories that will shape the functional specification.
        </p>
      </div>
      <div className="compact-details">
        {fieldEntries.map(([k, label]) => (
          <Field key={k} label={label} value={data[k]} onChange={set(k)} />
        ))}
      </div>
      <div className="section-block">
        <div className="section-title">
          <span>01</span>
          <div>
            <h2>Business requirement</h2>
            <p>Describe the current problem, expected outcome, and business value.</p>
          </div>
        </div>
        <label className="field">
          <span>Requirement</span>
          <textarea
            className="large-textarea"
            value={data.requirement}
            onChange={(e) => set('requirement')(e.target.value)}
          />
        </label>
      </div>
      <div className="section-block">
        <div className="section-title stories-title">
          <span>02</span>
          <div>
            <h2>User stories</h2>
            <p>Translate the need into user-centered, testable outcomes. Drag to reorder.</p>
          </div>
          <span className="story-count">{data.stories.length} stories</span>
        </div>
        <div className="stories-list">
          {data.stories.map((story, i) => (
            <StoryRow
              key={story.id}
              story={story}
              index={i}
              update={(k, v) => updateStory(story.id, k, v)}
              remove={() =>
                setData((d) => ({ ...d, stories: d.stories.filter((s) => s.id !== story.id) }))
              }
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={() => {
                if (dragIndex !== null && dragIndex !== i) {
                  reorderStories(dragIndex, i);
                }
                setDragIndex(null);
              }}
              onDragEnd={() => {
                setDragIndex(null);
              }}
              isDragging={dragIndex === i}
            />
          ))}
        </div>
        <div className="story-actions">
          <button
            className="secondary-button add-story"
            onClick={() =>
              setData((d) => ({
                ...d,
                stories: [
                  ...d.stories,
                  { id: Date.now(), role: '', goal: '', benefit: '', criteria: '' },
                ],
              }))
            }
          >
            <Icon name="plus" /> Add user story
          </button>
          <button className="text-button restore-stories" onClick={restoreDefaults}>
            Restore default stories
          </button>
        </div>
      </div>
    </section>
  );
}
