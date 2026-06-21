import { useState } from 'react';
import type { SpecData, Section, Updater } from '../types';
import { Icon } from './Icon';

interface SpecProps {
  data: SpecData;
  sections: Section[];
  setSections: (updater: Updater<Section[]>) => void;
  specGenerated: boolean;
  onExport: () => void;
}

export function Spec({ data, sections, setSections, specGenerated, onExport }: SpecProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fullText = sections.map((s) => `${s.number} ${s.title}\n${s.content}`).join('\n\n');
  const copy = async () => {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <section className="spec-page">
      {specGenerated && (
        <div className="completion-banner">
          <Icon name="check" size={18} />
          <div>
            <strong>Workflow complete</strong>
            <span>
              All four steps finished. Your functional specification is ready to export or print.
            </span>
          </div>
        </div>
      )}
      <div className="spec-toolbar">
        <div>
          <p className="step-label">
            {specGenerated ? 'Step 4 of 4 · Complete' : 'Generated document'}
          </p>
          <h1>{data.title}</h1>
          <p>
            {data.project} · Version {data.version} · {data.author}
          </p>
        </div>
        <div className="toolbar-actions">
          <button className="secondary-button" onClick={copy}>
            <Icon name="copy" />
            {copied ? 'Copied' : 'Copy all'}
          </button>
          <button className="secondary-button" onClick={onExport}>
            <Icon name="export" />
            Export
          </button>
          <button className="secondary-button" onClick={() => window.print()}>
            <Icon name="print" />
            Print / PDF
          </button>
        </div>
      </div>
      <article className="document">
        <header className="document-cover">
          <div className="cover-mark">SF</div>
          <p>Functional specification document</p>
          <h2>{data.title}</h2>
          <div className="cover-meta">
            <div>
              <span>Project</span>
              <strong>{data.project}</strong>
            </div>
            <div>
              <span>SAP module</span>
              <strong>{data.module}</strong>
            </div>
            <div>
              <span>Process area</span>
              <strong>{data.process}</strong>
            </div>
            <div>
              <span>Version</span>
              <strong>{data.version}</strong>
            </div>
            <div>
              <span>Prepared by</span>
              <strong>{data.author}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong className={specGenerated ? 'status-complete' : ''}>
                {specGenerated ? 'Complete' : 'Draft'}
              </strong>
            </div>
          </div>
        </header>
        {sections.map((section) => (
          <section className="document-section" key={section.id}>
            <div className="document-section-heading">
              <span>{section.number}</span>
              <h2>{section.title}</h2>
              <button
                className="icon-button"
                onClick={() => setEditing(editing === section.id ? null : section.id)}
                aria-label={`Edit ${section.title}`}
              >
                <Icon name="edit" />
              </button>
            </div>
            {editing === section.id ? (
              <textarea
                className="section-editor"
                autoFocus
                value={section.content}
                onChange={(e) =>
                  setSections((xs) =>
                    xs.map((x) => (x.id === section.id ? { ...x, content: e.target.value } : x)),
                  )
                }
              />
            ) : (
              <div className="section-content">{section.content}</div>
            )}
          </section>
        ))}
      </article>
    </section>
  );
}
