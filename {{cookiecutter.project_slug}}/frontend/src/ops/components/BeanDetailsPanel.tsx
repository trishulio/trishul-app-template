import { Cpu, X } from "lucide-react";
import type { BeanInfo } from "../beanTypes";
import { BeanDetailsEmpty } from "./BeanDetailsEmpty";
import { BeanIdentity } from "./BeanIdentity";
import { BeanDependencies } from "./BeanDependencies";

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
  if (!selectedBean) return <BeanDetailsEmpty />;

  return (
    <div className="w-full lg:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm overflow-y-auto space-y-6 flex-shrink-0">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-amber-500" />
          <h3 className="font-bold text-sm">Bean Diagnostics</h3>
        </div>
        <button type="button" onClick={onClose} className="p-1 rounded-lg">
          <X className="h-5 w-5 text-slate-400" />
        </button>
      </div>

      <div className="space-y-5">
        <div className="space-y-1 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Identifier
          </h4>
          <p className="font-mono text-xs font-bold break-all select-all">
            {selectedBean.name}
          </p>
        </div>

        <BeanIdentity bean={selectedBean} />

        <BeanDependencies
          dependencies={selectedBean.dependencies}
          onNavigate={onNavigateToDependency}
        />
      </div>
    </div>
  );
}
