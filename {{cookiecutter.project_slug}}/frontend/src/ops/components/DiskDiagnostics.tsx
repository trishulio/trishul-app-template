import { AlertTriangle, HardDrive } from "lucide-react";
import { DiskContent } from "./DiskContent";

interface DiskDiagnosticsProps {
  loading: boolean;
  available: boolean;
  usedGb: string;
  totalGb: string;
  freeGb: string;
  percentage: number;
}

export function DiskDiagnostics({
  loading,
  available,
  usedGb,
  totalGb,
  freeGb,
  percentage,
}: DiskDiagnosticsProps) {
  const body = loading ? (
    <div className="h-24 flex items-center justify-center text-sm text-slate-500">
      Loading disk details...
    </div>
  ) : !available ? (
    <div className="h-24 flex items-center justify-center text-sm text-amber-500 gap-2">
      <AlertTriangle className="h-5 w-5" />
      Disk details unavailable on this environment.
    </div>
  ) : (
    <DiskContent
      usedGb={usedGb}
      totalGb={totalGb}
      freeGb={freeGb}
      percentage={percentage}
    />
  );

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-bold flex items-center gap-2.5">
          <HardDrive className="h-5 w-5 text-amber-500" />
          Node Storage Diagnostics
        </h3>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Disk Mount
        </span>
      </div>
      {body}
    </div>
  );
}
