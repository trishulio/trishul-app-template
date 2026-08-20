import { RefreshCw } from "lucide-react";

interface LoadingPanelProps {
  label: string;
}

export function LoadingPanel({ label }: LoadingPanelProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
      <RefreshCw className="h-8 w-8 animate-spin text-amber-500" />
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}
