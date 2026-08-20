import { Link as LinkIcon } from "lucide-react";

interface BeanDependenciesProps {
  dependencies: string[];
  onNavigate: (dep: string) => void;
}

export function BeanDependencies({
  dependencies,
  onNavigate,
}: BeanDependenciesProps) {
  return (
    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
        <LinkIcon className="h-3.5 w-3.5" />
        Wiring Dependencies ({dependencies.length})
      </h4>

      {dependencies.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No dependencies wired.</p>
      ) : (
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {dependencies.map((dep) => (
            <button
              key={dep}
              type="button"
              onClick={() => onNavigate(dep)}
              className="w-full text-left font-mono text-xs text-amber-500 hover:text-amber-600 hover:underline px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/40 truncate block transition-colors"
            >
              {dep}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
