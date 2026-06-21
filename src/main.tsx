import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import type {
  IconName,
  SpecData,
  Section,
  Story,
  AppState,
  Updater,
  ReadinessCheck,
} from './types';
import { FIELD_LABELS, type FieldKey } from './types';

type CSSPropertiesWithVars = React.CSSProperties & Record<string, string>;

const Icon = ({ name, size = 18 }: { name: IconName; size?: number }) => {
  const paths: Record<IconName, React.ReactNode> = {
    save: (
      <>
        <path d="M5 3h11l3 3v15H5z" />
        <path d="M8 3v6h8V3M8 21v-7h8v7" />
      </>
    ),
    export: (
      <>
        <path d="M12 3v12M7 8l5-5 5 5" />
        <path d="M5 13v8h14v-8" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M14 7l5 5-5 5" />
      </>
    ),
    back: (
      <>
        <path d="M19 12H5M10 7l-5 5 5 5" />
      </>
    ),
    file: (
      <>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v5h5M9 12h6M9 16h6" />
      </>
    ),
    check: <path d="M5 12l4 4L19 6" />,
    chevron: <path d="M9 7l5 5-5 5" />,
    edit: (
      <>
        <path d="M4 20h4L19 9l-4-4L4 16z" />
        <path d="M13 7l4 4" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="11" height="12" rx="1" />
        <path d="M16 8V4H5v12h3" />
      </>
    ),
    print: (
      <>
        <path d="M7 9V3h10v6M7 17v4h10v-4" />
        <rect x="4" y="9" width="16" height="8" rx="2" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
};

const initialStories: Story[] = [
  {
    id: 1,
    role: 'Accounts Payable Clerk',
    goal: 'capture vendor invoices accurately',
    benefit: 'reduce manual effort and errors',
    criteria:
      'Given a valid invoice, when it is captured, then it is validated and saved successfully.',
  },
  {
    id: 2,
    role: 'Accounts Payable Manager',
    goal: 'review and approve invoices',
    benefit: 'ensure compliance and control',
    criteria:
      'Given a captured invoice, when I review and approve it, then it is ready for posting.',
  },
  {
    id: 3,
    role: 'Finance Reporter',
    goal: 'view invoice and payment reports',
    benefit: 'monitor spend and cash flow',
    criteria:
      'Given posted invoices, when I run reports, then the data is accurate and up to date.',
  },
];

const initialData: SpecData = {
  module: 'Finance (FI)',
  project: 'S/4HANA Finance Transformation',
  title: 'Vendor Invoice Management',
  process: 'Accounts Payable',
  author: 'Jane Consultant',
  version: '1.0',
  requirement:
    'The company needs a streamlined process for managing vendor invoices in SAP S/4HANA. The solution must enable invoice capture, validation, posting, and reporting with proper controls and auditability. It should integrate with purchase orders and support automated invoice data extraction to improve efficiency and accuracy.',
  inScope:
    'Invoice capture, validation, approval, posting, exception handling, and operational reporting.',
  outScope: 'Vendor onboarding, payment execution, and legacy invoice migration.',
  assumptions:
    'Business partners and purchase orders are available in S/4HANA. Standard SAP workflow is enabled.',
  dependencies: 'SAP Business Workflow, MM purchase order integration, and role provisioning.',
  stories: initialStories,
};

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'input' | 'select';
  options?: string[];
}

function Field({ label, value, onChange, type = 'input', options = [] }: FieldProps) {
  const props = {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange(e.target.value),
    'aria-label': label,
  };
  return (
    <label className="field">
      <span>{label}</span>
      {type === 'select' ? (
        <select {...props}>
          {options.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      ) : (
        <input {...(props as React.InputHTMLAttributes<HTMLInputElement>)} />
      )}
    </label>
  );
}

interface StepperProps {
  step: number;
  setStep: (n: number) => void;
  specGenerated: boolean;
}

function Stepper({ step, setStep, specGenerated }: StepperProps) {
  const steps = ['Project setup', 'Requirements', 'Review scope', 'Functional spec'];
  return (
    <nav className="stepper" aria-label="Workflow steps">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < step || (n === 4 && specGenerated);
        const active = step === n && !done;
        return (
          <button
            key={label}
            className={`step ${active ? 'active' : ''} ${done ? 'done' : ''}`}
            onClick={() => setStep(n)}
          >
            <span className="step-number">{done ? <Icon name="check" size={14} /> : n}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

interface StoryRowProps {
  story: Story;
  index: number;
  update: (key: keyof Omit<Story, 'id'>, value: string) => void;
  remove: () => void;
}

function StoryRow({ story, index, update, remove }: StoryRowProps) {
  return (
    <div className="story-row">
      <span className="story-index">{String(index + 1).padStart(2, '0')}</span>
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

type SetData = (updater: Updater<SpecData>) => void;

function Setup({ data, setData }: { data: SpecData; setData: SetData }) {
  const set = (key: keyof SpecData) => (value: string) => setData((d) => ({ ...d, [key]: value }));
  return (
    <section className="page-content">
      <div className="page-heading">
        <p className="step-label">Step 1 of 4</p>
        <h1>Set up your SAP project</h1>
        <p>Establish the document context and ownership before defining the solution.</p>
      </div>
      <div className="section-block">
        <div className="section-title">
          <span>01</span>
          <div>
            <h2>Document identity</h2>
            <p>These details appear on the specification cover and revision history.</p>
          </div>
        </div>
        <div className="form-grid setup-grid">
          <Field
            label="SAP module"
            value={data.module}
            onChange={set('module')}
            type="select"
            options={[
              'Finance (FI)',
              'Materials Management (MM)',
              'Sales & Distribution (SD)',
              'Production Planning (PP)',
              'Warehouse Management (EWM)',
              'Human Capital Management (HCM)',
              'Custom / Cross-module',
            ]}
          />
          <Field label="Process area" value={data.process} onChange={set('process')} />
          <Field label="Project name" value={data.project} onChange={set('project')} />
          <Field label="FSD title" value={data.title} onChange={set('title')} />
          <Field label="Author" value={data.author} onChange={set('author')} />
          <Field label="Document version" value={data.version} onChange={set('version')} />
        </div>
      </div>
    </section>
  );
}

function Requirements({ data, setData }: { data: SpecData; setData: SetData }) {
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

function Review({ data, setData }: { data: SpecData; setData: SetData }) {
  const set = (key: keyof SpecData) => (value: string) => setData((d) => ({ ...d, [key]: value }));
  const items: [string, keyof SpecData][] = [
    ['In scope', 'inScope'],
    ['Out of scope', 'outScope'],
    ['Assumptions', 'assumptions'],
    ['Dependencies', 'dependencies'],
  ];
  return (
    <section className="page-content">
      <div className="page-heading">
        <p className="step-label">Step 3 of 4</p>
        <h1>Review scope and constraints</h1>
        <p>Confirm solution boundaries before generating the functional design.</p>
      </div>
      <div className="review-summary">
        <div>
          <span>Module</span>
          <strong>{data.module}</strong>
        </div>
        <div>
          <span>Process</span>
          <strong>{data.process}</strong>
        </div>
        <div>
          <span>User stories</span>
          <strong>{data.stories.length}</strong>
        </div>
      </div>
      <div className="scope-grid">
        {items.map(([label, key], i) => (
          <label className="scope-field" key={key}>
            <span className="scope-number">0{i + 1}</span>
            <h2>{label}</h2>
            <textarea value={data[key] as string} onChange={(e) => set(key)(e.target.value)} />
          </label>
        ))}
      </div>
    </section>
  );
}

function buildSections(data: SpecData): Section[] {
  const storyRows = data.stories
    .map(
      (s, i) =>
        `${i + 1}. As a ${s.role || 'user'}, I want to ${s.goal || 'complete the process'}, so that I can ${s.benefit || 'achieve the business outcome'}.\nAcceptance criteria: ${s.criteria || 'To be confirmed during design validation.'}`,
    )
    .join('\n\n');
  return [
    {
      id: 'purpose',
      number: '1.0',
      title: 'Purpose and objectives',
      content: `This Functional Specification defines the ${data.title} solution for the ${data.process} process within SAP ${data.module}. The objective is to translate the approved business requirement into a functional design that can be configured, developed, tested, and accepted.\n\nBusiness requirement\n${data.requirement}`,
    },
    {
      id: 'scope',
      number: '2.0',
      title: 'Scope',
      content: `In scope\n${data.inScope}\n\nOut of scope\n${data.outScope}`,
    },
    {
      id: 'process',
      number: '3.0',
      title: 'Proposed functional process',
      content: `The proposed solution will support the end-to-end ${data.process} process in ${data.module}. Users will initiate and process transactions using assigned business roles. The solution will validate mandatory data, apply configured business rules, route exceptions or approvals where required, post eligible transactions, and retain status and change information for auditability.\n\nThe design should favor standard SAP S/4HANA capability. Any identified gap requiring enhancement will be documented with its technical object and interface contract before build approval.`,
    },
    {
      id: 'stories',
      number: '4.0',
      title: 'User stories and acceptance criteria',
      content: storyRows,
    },
    {
      id: 'rules',
      number: '5.0',
      title: 'Functional requirements and business rules',
      content: `FR-01 — The solution shall support creation and processing of ${data.title.toLowerCase()} transactions.\nFR-02 — Mandatory fields and master-data references shall be validated before save or posting.\nFR-03 — Authorization checks shall use assigned SAP business roles.\nFR-04 — Processing errors shall display actionable messages and preserve entered data.\nFR-05 — Status, user, date, and time shall be retained for audit-relevant actions.\nFR-06 — Reporting shall expose transaction status and key process measures to authorized users.`,
    },
    {
      id: 'integration',
      number: '6.0',
      title: 'Integration and data',
      content: `Dependencies\n${data.dependencies}\n\nThe solution will use released SAP integration patterns and existing master data wherever available. Interface field mapping, frequency, error handling, ownership, and reconciliation controls must be confirmed during detailed design. No direct database updates are permitted.`,
    },
    {
      id: 'security',
      number: '7.0',
      title: 'Security, controls, and audit',
      content: `Access will follow least-privilege and segregation-of-duties principles. Display, create, change, approve, post, and report permissions must be mapped to business roles. Sensitive data must follow the project's classification and retention policies. Material process actions and configuration changes must be traceable.`,
    },
    {
      id: 'errors',
      number: '8.0',
      title: 'Exception handling',
      content: `Validation failures must identify the affected field and corrective action. Integration failures must be logged with a correlation reference and support safe reprocessing. Duplicate processing must be prevented through appropriate business keys. Unresolved exceptions will be routed to the designated process owner.`,
    },
    {
      id: 'test',
      number: '9.0',
      title: 'Test scenarios',
      content: data.stories
        .map(
          (s, i) =>
            `TS-${String(i + 1).padStart(2, '0')} — ${s.role}: ${s.goal}\nExpected result: ${s.criteria}`,
        )
        .join('\n\n'),
    },
    {
      id: 'assumptions',
      number: '10.0',
      title: 'Assumptions and open decisions',
      content: `Assumptions\n${data.assumptions}\n\nOpen decisions\n• Confirm final organization structure, business roles, and approval thresholds.\n• Confirm reporting fields and retention period.\n• Confirm whether any requirement cannot be met with standard SAP capability.`,
    },
  ];
}

interface SpecProps {
  data: SpecData;
  sections: Section[];
  setSections: (updater: Updater<Section[]>) => void;
  specGenerated: boolean;
  onExport: () => void;
}

function Spec({ data, sections, setSections, specGenerated, onExport }: SpecProps) {
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

interface ReadinessProps {
  data: SpecData;
  step: number;
  generate: () => void;
  specGenerated: boolean;
}

function Readiness({ data, step, generate, specGenerated }: ReadinessProps) {
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

interface CompletionPanelProps {
  data: SpecData;
  onExport: () => void;
  onPrint: () => void;
  onNewProject: () => void;
}

function CompletionPanel({ data, onExport, onPrint, onNewProject }: CompletionPanelProps) {
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

function exportDoc(data: SpecData, sections: Section[]): void {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
  const body = sections
    .map((s) => `<h2>${s.number} ${esc(s.title)}</h2><p>${esc(s.content)}</p>`)
    .join('');
  const html = `<html><head><meta charset="utf-8"><style>body{font-family:Arial;color:#172554;margin:48px;line-height:1.6}h1{font-size:28px}h2{font-size:18px;border-bottom:1px solid #ccd3df;padding-bottom:8px;margin-top:30px}p{font-size:11pt}</style></head><body><h1>${esc(data.title)}</h1><p><b>Project:</b> ${esc(data.project)}<br><b>Module:</b> ${esc(data.module)}<br><b>Version:</b> ${esc(data.version)}<br><b>Author:</b> ${esc(data.author)}</p>${body}</body></html>`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([html], { type: 'application/msword' }));
  a.download = `${data.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-fsd.doc`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function loadStoredState(): AppState {
  try {
    const raw = localStorage.getItem('specflow-draft');
    if (!raw) return { data: initialData, step: 1, sections: [] };
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      data: {
        ...initialData,
        ...parsed.data,
        stories: parsed.data?.stories?.length ? parsed.data.stories : initialData.stories,
      },
      step: parsed.step || 1,
      sections: parsed.sections || [],
    };
  } catch {
    return { data: initialData, step: 1, sections: [] };
  }
}

function App() {
  const [state, setState] = useState<AppState>(loadStoredState);
  const { data, step, sections } = state;
  const setData = (updater: Updater<SpecData>) =>
    setState((current) => ({
      ...current,
      data: typeof updater === 'function' ? updater(current.data) : updater,
    }));
  const setStep = (updater: Updater<number>) =>
    setState((current) => ({
      ...current,
      step: typeof updater === 'function' ? updater(current.step) : updater,
    }));
  const setSections = (updater: Updater<Section[]>) =>
    setState((current) => ({
      ...current,
      sections: typeof updater === 'function' ? updater(current.sections) : updater,
    }));
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem('specflow-draft', JSON.stringify({ data, step, sections }));
    }, 400);
    return () => clearTimeout(t);
  }, [data, step, sections]);
  const generate = () => {
    const built = buildSections(data);
    setSections(built);
    setStep(4);
  };
  const save = () => {
    localStorage.setItem('specflow-draft', JSON.stringify({ data, step, sections }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  };
  const resetProject = () => {
    if (!window.confirm('Start a new project? Your current draft will be cleared.')) return;
    localStorage.removeItem('specflow-draft');
    setState({ data: initialData, step: 1, sections: [] });
  };
  const titles = ['Project setup', 'Requirements', 'Review scope', 'Functional spec'];
  const specGenerated = sections.length > 0;
  const exportDocument = () => exportDoc(data, sections.length ? sections : buildSections(data));
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setStep(1)}>
          <span>Spec</span>Flow
        </button>
        <div className="header-context">
          <span>{specGenerated && step === 4 ? 'Complete' : titles[step - 1]}</span>
          <i></i>
          <span>{data.project || 'Untitled project'}</span>
        </div>
        <div className="top-actions">
          <button className="text-button" onClick={resetProject}>
            New project
          </button>
          <button className="text-button" onClick={save}>
            <Icon name="save" />
            {saved ? 'Saved' : 'Save draft'}
          </button>
          <button
            className="text-button"
            onClick={() => (specGenerated ? exportDocument() : generate())}
          >
            <Icon name="export" />
            Export
          </button>
        </div>
      </header>
      <div className="workspace">
        <Stepper step={step} setStep={setStep} specGenerated={specGenerated} />
        <main className={step === 4 ? 'spec-main' : ''}>
          {step === 1 && <Setup data={data} setData={setData} />}{' '}
          {step === 2 && <Requirements data={data} setData={setData} />}{' '}
          {step === 3 && <Review data={data} setData={setData} />}{' '}
          {step === 4 && (
            <Spec
              data={data}
              sections={sections.length ? sections : buildSections(data)}
              setSections={setSections}
              specGenerated={specGenerated}
              onExport={exportDocument}
            />
          )}
        </main>
        {step < 4 && (
          <Readiness data={data} step={step} generate={generate} specGenerated={specGenerated} />
        )}
        {step === 4 && specGenerated && (
          <CompletionPanel
            data={data}
            onExport={exportDocument}
            onPrint={() => window.print()}
            onNewProject={resetProject}
          />
        )}
      </div>
      {step < 4 && (
        <footer className="bottom-bar">
          <div></div>
          <button
            className="secondary-button"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
          >
            <Icon name="back" />
            Back
          </button>
          <button
            className="primary-button"
            onClick={() => (step === 3 ? generate() : setStep((s) => s + 1))}
          >
            {step === 3 ? 'Generate specification' : 'Continue'}
            <Icon name="arrow" />
          </button>
        </footer>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
