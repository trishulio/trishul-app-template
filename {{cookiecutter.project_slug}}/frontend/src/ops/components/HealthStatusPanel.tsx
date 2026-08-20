import { CheckCircle, AlertOctagon } from "lucide-react";
import { getStatusColor } from "../healthData";

export function HealthStatusPanel({ status }: { status: string }) {
  const up = status === "UP";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
      <div className="relative flex-shrink-0">
        <div
          className={`h-16 w-16 rounded-full flex items-center justify-center ${
            up
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-rose-500/10 text-rose-500"
          }`}
        >
          {up ? (
            <CheckCircle className="h-9 w-9" />
          ) : (
            <AlertOctagon className="h-9 w-9" />
          )}
        </div>
        {up && (
          <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
        )}
      </div>
      <div className="flex-1 text-center sm:text-left space-y-1">
        <span
          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(status)}`}
        >
          System {status}
        </span>
        <h2 className="text-xl font-bold tracking-tight">
          {up
            ? "All systems operational"
            : "One or more components are reporting warnings"}
        </h2>
        <p className="text-xs text-slate-400">
          Liveness probes verified. Host system reports full availability on
          standard ports.
        </p>
      </div>
    </div>
  );
}
