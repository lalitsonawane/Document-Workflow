import type { SpecData, CSSPropertiesWithVars } from '../types';
import { Icon } from './Icon';

interface CompletionPanelProps {
  data: SpecData;
  onExport: () => void;
  onPrint: () => void;
  onNewProject: () => void;
}

export function CompletionPanel({ data, onExport, onPrint, onNewProject }: CompletionPanelProps) {
  const checks = [
    'Project details completed',
    'Business requirement defined',
    'User stories captured',
    'Scope reviewed',
    'Functional spec generated',
    'Ready to export',
  ];
  return (
    <aside className="readiness completion-panel">
      <div className="readiness-inner">
        <p className="aside-label">Workflow complete</p>
        <div
          className="progress-ring progress-ring--complete"
          style={{ '--progress': '360deg' } as CSSPropertiesWithVars}
        >
          <div>
            <strong>100%</strong>
            <span>Complete</span>
          </div>
        </div>
        <div className="checklist">
          {checks.map((label) => (
            <div key={label} className="checked">
              <span>
                <Icon name="check" size={13} />
              </span>
              {label}
            </div>
          ))}
        </div>
        <p className="completion-summary">
          <strong>{data.title}</strong> is ready. Export the document or print it as a PDF.
        </p>
        <button className="primary-button generate-button" onClick={onExport}>
          <Icon name="export" />
          Export document
        </button>
        <button className="secondary-button completion-secondary" onClick={onPrint}>
          <Icon name="print" />
          Print / PDF
        </button>
        <button className="text-button completion-secondary" onClick={onNewProject}>
          Start new project
        </button>
      </div>
    </aside>
  );
}
