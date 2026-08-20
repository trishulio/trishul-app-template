import { Search, X } from "lucide-react";

interface BeanSearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  scopes: string[];
  scopeFilter: string;
  setScopeFilter: (value: string) => void;
}

export function BeanSearchBar({
  search,
  setSearch,
  scopes,
  scopeFilter,
  setScopeFilter,
}: BeanSearchBarProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3">
      <div className="flex-1 flex items-center gap-3 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 bg-slate-50 dark:bg-slate-950">
        <Search className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search beans by name or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-0 outline-none w-full text-sm placeholder-slate-400 text-slate-900 dark:text-slate-100"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-slate-400">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <label className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Scope:
        </span>
        <select
          value={scopeFilter}
          onChange={(e) => setScopeFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm rounded-xl px-3 py-2 outline-none text-slate-700 dark:text-slate-300 font-medium min-w-[120px]"
        >
          <option value="all">All Scopes</option>
          {scopes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
