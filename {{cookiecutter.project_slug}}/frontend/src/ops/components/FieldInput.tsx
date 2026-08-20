interface FieldInputProps {
  id: string;
  type?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function FieldInput({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: FieldInputProps) {
  return (
    <div className="space-y-1.5">
      <label
        id={id}
        htmlFor={id}
        className="text-xs font-bold text-slate-500 uppercase tracking-wide"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-colors"
        required={required}
      />
    </div>
  );
}
