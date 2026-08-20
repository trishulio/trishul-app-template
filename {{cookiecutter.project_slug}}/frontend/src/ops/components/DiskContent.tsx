interface DiskContentProps {
  usedGb: string;
  totalGb: string;
  freeGb: string;
  percentage: number;
}

export function DiskContent({
  usedGb,
  totalGb,
  freeGb,
  percentage,
}: DiskContentProps) {
  const barColor =
    percentage > 85
      ? "bg-rose-500"
      : percentage > 60
        ? "bg-amber-500"
        : "bg-emerald-500";

  return (
    <div className="h-24 space-y-4">
      <div className="flex justify-between items-baseline text-sm">
        <span className="font-semibold text-slate-600 dark:text-slate-300">
          Disk Space Used
        </span>
        <span className="text-slate-500">
          <strong className="text-slate-900 dark:text-slate-100">
            {usedGb} GB
          </strong>{" "}
          / {totalGb} GB ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-500 font-medium">
        <span>Free Space: {freeGb} GB</span>
        <span>Threshold limit: 10.0 MB</span>
      </div>
    </div>
  );
}
