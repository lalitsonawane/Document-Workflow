import type { SpecData, SetData, Story, FieldKey } from '../types';
import { FIELD_LABELS } from '../types';
import { Field } from './Field';
import { StoryRow } from './StoryRow';
import { Icon } from './Icon';

export function Requirements({ data, setData }: { data: SpecData; setData: SetData }) {
  const set = (key: keyof SpecData) => (value: string) => setData((d) => ({ ...d, [key]: value }));
  const updateStory = (id: number, key: keyof Omit<Story, 'id'>, value: string) =>
    setData((d) => ({
      ...d,
      stories: d.stories.map((s) => (s.id === id ? { ...s, [key]: value } : s)),
    }));
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
            <p>Translate the need into user-centered, testable outcomes.</p>
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
            />
          ))}
        </div>
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
      </div>
    </section>
  );
}
