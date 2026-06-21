import type { SpecData, CSSPropertiesWithVars } from '../types';
import { calculateReadiness, getReadinessPercent } from '../lib/readiness';
import { Icon } from './Icon';

interface ReadinessProps {
  data: SpecData;
  step: number;
  generate: () => void;
  specGenerated: boolean;
}

export function Readiness({ data, step, generate, specGenerated }: ReadinessProps) {
  const checks = calculateReadiness(data, step, specGenerated);
  const percent = getReadinessPercent(checks);
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
