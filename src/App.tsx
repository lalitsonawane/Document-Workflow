import { useEffect, useMemo, useState } from 'react';
import type { AppState, Updater, SpecData, Section } from './types';
import { initialData } from './lib/defaults';
import { buildSections } from './lib/buildSections';
import { exportDoc } from './lib/exportDoc';
import { loadStoredState, saveState, clearState } from './lib/storage';
import { canAdvanceStep } from './lib/validation';
import { calculateReadiness, getReadinessPercent } from './lib/readiness';
import { Icon } from './components/Icon';
import { Stepper } from './components/Stepper';
import { Setup } from './components/Setup';
import { Requirements } from './components/Requirements';
import { Review } from './components/Review';
import { Spec } from './components/Spec';
import { Readiness } from './components/Readiness';
import { CompletionPanel } from './components/CompletionPanel';

export function App() {
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
    const t = setTimeout(() => saveState({ data, step, sections }), 400);
    return () => clearTimeout(t);
  }, [data, step, sections]);
  const generate = () => {
    const built = buildSections(data);
    setSections(built);
    setStep(4);
  };
  const save = () => {
    saveState({ data, step, sections });
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  };
  const resetProject = () => {
    if (!window.confirm('Start a new project? Your current draft will be cleared.')) return;
    clearState();
    setState({ data: initialData, step: 1, sections: [] });
  };
  const titles = ['Project setup', 'Requirements', 'Review scope', 'Functional spec'];
  const specGenerated = sections.length > 0;
  const activeSections = useMemo(
    () => (sections.length ? sections : buildSections(data)),
    [sections, data],
  );
  const canAdvance = canAdvanceStep(data, step);
  const compactPercent = getReadinessPercent(calculateReadiness(data, step, specGenerated));
  const exportDocument = () => exportDoc(data, activeSections);
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
          <button className="text-button" disabled={!specGenerated} onClick={exportDocument}>
            <Icon name="export" />
            Export
          </button>
        </div>
      </header>
      {step < 4 && (
        <div className="readiness-compact">
          <span>{compactPercent}%</span>
          <div className="readiness-compact-bar">
            <div className="readiness-compact-fill" style={{ width: `${compactPercent}%` }} />
          </div>
        </div>
      )}
      <div className="workspace">
        <Stepper step={step} setStep={setStep} specGenerated={specGenerated} />
        <main className={step === 4 ? 'spec-main' : ''}>
          {step === 1 && <Setup data={data} setData={setData} />}{' '}
          {step === 2 && <Requirements data={data} setData={setData} />}{' '}
          {step === 3 && <Review data={data} setData={setData} />}{' '}
          {step === 4 && (
            <Spec
              data={data}
              sections={activeSections}
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
            disabled={!canAdvance}
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
