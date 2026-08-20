import { Search, Loader2 } from "lucide-react";

interface TenantSearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  isFetching: boolean;
}

export function TenantSearchBar({
  search,
  setSearch,
  isFetching,
}: TenantSearchBarProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
      <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
      <input
        type="text"
        placeholder="Filter tenants by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-transparent border-0 outline-none w-full text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400"
      />
      {isFetching && (
        <Loader2 className="h-4 w-4 animate-spin text-amber-500 flex-shrink-0" />
      )}
    </div>
  );
}
