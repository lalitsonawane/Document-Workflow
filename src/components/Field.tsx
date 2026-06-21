interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'input' | 'select';
  options?: string[];
}

export function Field({ label, value, onChange, type = 'input', options = [] }: FieldProps) {
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
