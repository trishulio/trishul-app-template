import { Database } from "lucide-react";

export function TenantEmptyState({ search }: { search: string }) {
  return (
    <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
      <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
        <Database className="h-10 w-10" />
      </div>
      <div className="space-y-1">
        <h3 className="text-md font-bold text-slate-900 dark:text-slate-100">
          No tenants found
        </h3>
        <p className="text-sm text-slate-500 max-w-sm">
          {search
            ? `No results match "${search}". Try checking the name.`
            : "Get started by provisioning your first database tenant."}
        </p>
      </div>
    </div>
  );
}
