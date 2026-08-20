import { Edit2, Trash2 } from "lucide-react";

export function TenantActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={onEdit}
        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        title="Edit Tenant"
      >
        <Edit2 className="h-4.5 w-4.5" />
      </button>
      <button
        onClick={onDelete}
        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
        title="Delete Tenant"
      >
        <Trash2 className="h-4.5 w-4.5" />
      </button>
    </div>
  );
}
