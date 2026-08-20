import type { ReactElement } from "react";
import { ChevronRight } from "lucide-react";
import type { BeanInfo } from "../beanTypes";

export function BeanRow({
  bean,
  selected,
  onSelect,
  TypeRenderer,
}: {
  bean: BeanInfo;
  selected: boolean;
  onSelect: (bean: BeanInfo) => void;
  TypeRenderer: (props: { type: string }) => ReactElement;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(bean)}
      aria-pressed={selected}
      className={`flex w-full items-center justify-between px-6 py-4 cursor-pointer transition-all text-left ${
        selected
          ? "bg-amber-500/10 border-l-4 border-amber-500 pl-[20px]"
          : "hover:bg-slate-50/[0.3] dark:hover:bg-slate-900/[0.2] border-l-4 border-transparent"
      }`}
    >
      <div className="space-y-1.5 overflow-hidden flex-1 pr-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-slate-950 dark:text-slate-100 font-mono truncate">
            {bean.name}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex-shrink-0 border border-slate-200/20">
            {bean.scope}
          </span>
        </div>
        <TypeRenderer type={bean.type} />
      </div>
      <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
    </button>
  );
}
