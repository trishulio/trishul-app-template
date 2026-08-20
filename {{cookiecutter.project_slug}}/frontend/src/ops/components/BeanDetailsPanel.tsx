import {
  Cpu,
  X,
  Tag,
  Layers,
  FileCode,
  BookOpen,
  Link as LinkIcon,
} from "lucide-react";

interface ActuatorBean {
  aliases: string[];
  scope: string;
  type: string;
  resource: string | null;
  dependencies: string[];
}

interface BeanInfo extends ActuatorBean {
  name: string;
  context: string;
}

interface BeanDetailsPanelProps {
  selectedBean: BeanInfo | null;
  onClose: () => void;
  onNavigateToDependency: (depName: string) => void;
}

export function BeanDetailsPanel({
  selectedBean,
  onClose,
  onNavigateToDependency,
}: BeanDetailsPanelProps) {
  if (!selectedBean) {
    return (
      <div className="hidden lg:flex w-96 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl items-center justify-center p-6 text-center flex-shrink-0 text-slate-400 bg-white dark:bg-slate-900/40">
        <div className="space-y-2">
          <Cpu className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700" />
          <h4 className="text-sm font-semibold">No bean selected</h4>
          <p className="text-xs max-w-[200px] mx-auto text-slate-500">
            Select a bean from the explorer list to examine its full wiring
            graph and resource metrics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm overflow-y-auto space-y-6 flex-shrink-0 flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-amber-500" />
          <h3 className="font-bold text-sm">Bean Diagnostics</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-5 flex-1 min-h-0">
        <div className="space-y-1 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800/40">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Identifier
          </h4>
          <p className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 break-all select-all">
            {selectedBean.name}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Tag className="h-4.5 w-4.5 text-slate-400 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Lifecycle Scope
              </span>
              <span className="text-sm font-medium">{selectedBean.scope}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Layers className="h-4.5 w-4.5 text-slate-400 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Application Context
              </span>
              <span className="text-sm font-medium font-mono text-slate-600 dark:text-slate-300">
                {selectedBean.context}
              </span>
            </div>
          </div>

          {selectedBean.resource && (
            <div className="flex items-start gap-3">
              <FileCode className="h-4.5 w-4.5 text-slate-400 mt-0.5" />
              <div className="space-y-0.5 overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Resource Location
                </span>
                <span className="text-xs font-mono break-all text-slate-600 dark:text-slate-400">
                  {selectedBean.resource}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <BookOpen className="h-4.5 w-4.5 text-slate-400 mt-0.5" />
            <div className="space-y-0.5 overflow-hidden">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Full Class Signature
              </span>
              <span className="text-xs font-mono break-all text-slate-600 dark:text-slate-300 select-all block">
                {selectedBean.type}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <LinkIcon className="h-3.5 w-3.5" />
            Wiring Dependencies ({selectedBean.dependencies.length})
          </h4>

          {selectedBean.dependencies.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              No dependencies wired.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {selectedBean.dependencies.map((dep) => (
                <button
                  key={dep}
                  type="button"
                  onClick={() => onNavigateToDependency(dep)}
                  className="w-full text-left font-mono text-xs text-amber-500 hover:text-amber-600 hover:underline px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/40 truncate block transition-colors"
                >
                  {dep}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
