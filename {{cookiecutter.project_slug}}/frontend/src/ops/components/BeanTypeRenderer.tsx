export function BeanTypeRenderer({ type }: { type: string }) {
  if (!type) {
    return <span className="text-slate-400 italic">No class type</span>;
  }
  const parts = type.split(".");
  const className = parts.pop();
  const packagePath = parts.join(".");
  return (
    <span className="truncate block font-mono text-xs">
      <span className="text-slate-400 dark:text-slate-500">{packagePath}.</span>
      <strong className="text-slate-900 dark:text-slate-200 font-semibold">
        {className}
      </strong>
    </span>
  );
}
