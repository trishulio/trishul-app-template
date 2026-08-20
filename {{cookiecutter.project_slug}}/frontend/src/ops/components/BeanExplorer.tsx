import { BeanSearchBar } from "./BeanSearchBar";
import { BeanList } from "./BeanList";
import { BeanDetailsPanel } from "./BeanDetailsPanel";
import { BeanMetrics } from "./BeanMetrics";
import type { BeanInfo } from "../beanTypes";

interface BeanExplorerProps {
  search: string;
  setSearch: (value: string) => void;
  scopes: string[];
  scopeFilter: string;
  setScopeFilter: (value: string) => void;
  filteredBeans: BeanInfo[];
  total: number;
  selectedBean: BeanInfo | null;
  setSelectedBean: (bean: BeanInfo | null) => void;
  onSelect: (bean: BeanInfo) => void;
  onNavigateToDependency: (depName: string) => void;
}

export function BeanExplorer(p: BeanExplorerProps) {
  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col space-y-4">
        <BeanSearchBar
          search={p.search}
          setSearch={p.setSearch}
          scopes={p.scopes}
          scopeFilter={p.scopeFilter}
          setScopeFilter={p.setScopeFilter}
        />
        <BeanMetrics
          found={p.filteredBeans.length}
          total={p.total}
          scope={p.scopeFilter}
        />
        <BeanList
          beans={p.filteredBeans}
          selectedName={p.selectedBean?.name ?? null}
          onSelect={p.onSelect}
        />
      </div>
      <BeanDetailsPanel
        selectedBean={p.selectedBean}
        onClose={() => p.setSelectedBean(null)}
        onNavigateToDependency={p.onNavigateToDependency}
      />
    </div>
  );
}
