import { TenantRow } from "./TenantRow";
import type { TenantDto } from "@/lib/api/model/tenantDto";

interface TenantTableProps {
  tenants: TenantDto[];
  onEdit: (t: TenantDto) => void;
  onDelete: (t: TenantDto) => void;
}

export function TenantTable({ tenants, onEdit, onDelete }: TenantTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/[0.4] dark:bg-slate-950/[0.2] text-xs font-bold uppercase tracking-wider text-slate-400">
            <th className="px-6 py-4">Tenant Info</th>
            <th className="px-6 py-4">Connection Endpoint</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Timestamps</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
          {tenants.map((tenant) => (
            <TenantRow
              key={tenant.id}
              tenant={tenant}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
