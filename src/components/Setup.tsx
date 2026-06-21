import type { SpecData, SetData } from '../types';
import { Field } from './Field';

export function Setup({ data, setData }: { data: SpecData; setData: SetData }) {
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
