import { Loader2 } from "lucide-react";

export function TenantLoadingState() {
  return (
    <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-500">
      <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      <span className="text-sm font-medium">Fetching tenant records...</span>
    </div>
  );
}
