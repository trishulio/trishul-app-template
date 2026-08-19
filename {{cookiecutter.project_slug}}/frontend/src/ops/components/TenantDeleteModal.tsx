import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TenantDeleteModalProps {
  isOpen: boolean;
  tenantName: string;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function TenantDeleteModal({
  isOpen,
  tenantName,
  onClose,
  onConfirm,
  isSubmitting,
}: TenantDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
        <div className="p-6 text-center space-y-4">
          <div className="p-3 bg-red-100 dark:bg-red-950/20 text-red-600 dark:text-red-500 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-lg">Destroy Database Tenant?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
              Are you sure you want to delete tenant{" "}
              <strong className="text-slate-900 dark:text-slate-100">
                "{tenantName}"
              </strong>
              ? This will permanently de-provision database endpoints.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                "Delete Permanently"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
