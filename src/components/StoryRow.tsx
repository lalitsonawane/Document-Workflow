import type { Story } from '../types';
import { Icon } from './Icon';

interface StoryRowProps {
  story: Story;
  index: number;
  update: (key: keyof Omit<Story, 'id'>, value: string) => void;
  remove: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

export function StoryRow({
  story,
  index,
  update,
  remove,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
}: StoryRowProps) {
  return (
    <div
      className={`story-row ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <span className="story-index" title="Drag to reorder">
        <Icon name="grip" size={14} />
      </span>
      <label>
        <span>Role</span>
        <input value={story.role} onChange={(e) => update('role', e.target.value)} />
      </label>
      <label>
        <span>Goal</span>
        <textarea value={story.goal} onChange={(e) => update('goal', e.target.value)} />
      </label>
      <label>
        <span>Benefit</span>
        <textarea value={story.benefit} onChange={(e) => update('benefit', e.target.value)} />
      </label>
      <label className="criteria">
        <span>Acceptance criteria</span>
        <textarea value={story.criteria} onChange={(e) => update('criteria', e.target.value)} />
      </label>
      <button
        className="icon-button delete"
        onClick={remove}
        aria-label={`Remove story ${index + 1}`}
      >
        <Icon name="trash" size={17} />
      </button>
    </div>
  );
}
