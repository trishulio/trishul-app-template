import { CheckCircle, Clock } from "lucide-react";

export function TenantStatus({ ready }: { ready?: boolean }) {
  return ready ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
      <CheckCircle className="h-3.5 w-3.5" />
      Ready
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
      <Clock className="h-3.5 w-3.5 animate-pulse" />
      Provisioning
    </span>
  );
}
