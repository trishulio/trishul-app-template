import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalShell } from "./ModalShell";

interface TenantDeleteModalProps {
  isOpen: boolean;
  tenantName: string;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function TenantDeleteModal(props: TenantDeleteModalProps) {
  return (
    <ModalShell
      open={props.isOpen}
      title="Destroy Database Tenant?"
      onClose={props.onClose}
    >
      <div className="p-6 text-center space-y-4">
        <div className="p-3 bg-red-100 dark:bg-red-950/20 text-red-600 dark:text-red-500 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
          Are you sure you want to delete tenant{" "}
          <strong className="text-slate-900 dark:text-slate-100">
            "{props.tenantName}"
          </strong>
          ? This will permanently de-provision database endpoints.
        </p>
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={props.onClose}
            className="flex-1 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={props.isSubmitting}
            onClick={props.onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
          >
            {props.isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              "Delete Permanently"
            )}
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}
