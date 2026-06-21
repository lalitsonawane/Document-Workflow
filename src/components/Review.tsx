import type { SpecData, SetData } from '../types';

export function Review({ data, setData }: { data: SpecData; setData: SetData }) {
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
