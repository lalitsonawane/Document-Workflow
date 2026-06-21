import { Icon } from './Icon';

interface StepperProps {
  step: number;
  setStep: (n: number) => void;
  specGenerated: boolean;
}

export function Stepper({ step, setStep, specGenerated }: StepperProps) {
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
            aria-current={active ? 'step' : undefined}
          >
            <span className="step-number">{done ? <Icon name="check" size={14} /> : n}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
