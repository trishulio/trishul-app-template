import { BeanRow } from "./BeanRow";
import { BeanTypeRenderer } from "./BeanTypeRenderer";
import type { BeanInfo } from "../beanTypes";

interface BeanListProps {
  beans: BeanInfo[];
  selectedName: string | null;
  onSelect: (bean: BeanInfo) => void;
}

export function BeanList({ beans, selectedName, onSelect }: BeanListProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {beans.map((bean) => (
          <BeanRow
            key={bean.name}
            bean={bean}
            selected={selectedName === bean.name}
            onSelect={onSelect}
            TypeRenderer={BeanTypeRenderer}
          />
        ))}
      </div>
    </div>
  );
}
