import { Flame, Copy, Check } from "lucide-react";

interface RawPayloadProps {
  payload: object;
  copied: boolean;
  onCopy: () => void;
}

export function RawPayload({ payload, copied, onCopy }: RawPayloadProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 bg-slate-50/[0.4] dark:bg-slate-950/[0.2] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="h-4.5 w-4.5 text-amber-500" />
          <h3 className="font-bold text-sm">Raw Actuator Payload</h3>
        </div>
        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 transition-colors bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          Copy JSON
        </button>
      </div>
      <pre className="p-6 text-[11px] font-mono leading-relaxed overflow-x-auto text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950 max-h-[350px]">
        {JSON.stringify(payload, null, 2)}
      </pre>
    </div>
  );
}
