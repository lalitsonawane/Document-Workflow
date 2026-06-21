import type { SpecData, ReadinessCheck, FieldKey, CSSPropertiesWithVars } from '../types';
import { Icon } from './Icon';

interface ReadinessProps {
  data: SpecData;
  step: number;
  generate: () => void;
  specGenerated: boolean;
}

export function Readiness({ data, step, generate, specGenerated }: ReadinessProps) {
  const projectFields: FieldKey[] = ['module', 'project', 'title', 'process', 'author', 'version'];
  const checks: ReadinessCheck[] = [
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
  const complete = checks.filter((x) => x[1]).length;
  const percent = Math.round((complete / checks.length) * 100);
  return (
    <aside className="readiness">
      <div className="readiness-inner">
        <p className="aside-label">Document readiness</p>
        <div
          className="progress-ring"
          style={{ '--progress': `${percent * 3.6}deg` } as CSSPropertiesWithVars}
        >
          <div>
            <strong>{percent}%</strong>
            <span>Complete</span>
          </div>
        </div>
        <div className="checklist">
          {checks.map(([label, ok]) => (
            <div key={label} className={ok ? 'checked' : ''}>
              <span>{ok ? <Icon name="check" size={13} /> : ''}</span>
              {label}
            </div>
          ))}
        </div>
        <button
          className="primary-button generate-button"
          disabled={percent < 60}
          onClick={generate}
        >
          <Icon name="file" />
          Generate functional spec
        </button>
        <p className="aside-help">Creates an editable FSD draft from the information provided.</p>
      </div>
    </aside>
  );
}
