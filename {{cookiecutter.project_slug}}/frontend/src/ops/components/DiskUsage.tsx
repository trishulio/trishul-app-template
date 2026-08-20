import { GB } from "../healthData";

interface DiskUsageProps {
  total: number;
  free: number;
}

export function DiskUsage({ total, free }: DiskUsageProps) {
  const used = total - free;
  const pct = used / total;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px]">
        <span>Usage:</span>
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {(used / GB).toFixed(1)} GB / {(total / GB).toFixed(1)} GB
        </span>
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full ${pct > 0.85 ? "bg-rose-500" : "bg-emerald-500"}`}
          style={% raw %}{{ width: `${Math.round(pct * 100)}%` }}{% endraw %}
        />
      </div>
    </div>
  );
}
