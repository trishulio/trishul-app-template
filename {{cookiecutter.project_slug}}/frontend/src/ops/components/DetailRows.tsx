interface DetailRowsProps {
  details: Record<string, unknown>;
}

export function DetailRows({ details }: DetailRowsProps) {
  return (
    <div className="space-y-1 bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/30">
      {Object.entries(details)
        .slice(0, 3)
        .map(([k, v]) => (
          <div key={k} className="flex justify-between text-[10px] gap-2">
            <span className="text-slate-400 truncate max-w-[80px]">{k}:</span>
            <span className="text-slate-700 dark:text-slate-300 font-mono truncate max-w-[160px]">
              {String(v)}
            </span>
          </div>
        ))}
    </div>
  );
}
