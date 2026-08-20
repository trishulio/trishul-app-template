interface BeanMetricsProps {
  found: number;
  total: number;
  scope: string;
}

export function BeanMetrics({ found, total, scope }: BeanMetricsProps) {
  return (
    <div className="flex items-center justify-between text-xs px-2 text-slate-500 font-medium">
      <span>
        Found{" "}
        <strong className="text-slate-900 dark:text-slate-100">{found}</strong>{" "}
        beans of {total} total
      </span>
      <span>Scope Filter active: {scope}</span>
    </div>
  );
}
