import {
  useAddTenant,
  useDeleteTenants,
  useUpdateTenant,
} from "@/lib/api/client";
import { toast } from "sonner";

export function useTenantMutations(onSuccess: () => void) {
  const addMutation = useAddTenant({
    mutation: {
      onSuccess: () => {
        toast.success("Tenant provisioned");
        onSuccess();
      },
      onError: () => toast.error("Failed to provision tenant"),
    },
  });

  const updateMutation = useUpdateTenant({
    mutation: {
      onSuccess: () => {
        toast.success("Tenant updated");
        onSuccess();
      },
      onError: () => toast.error("Failed to update tenant"),
    },
  });

  const deleteMutation = useDeleteTenants({
    mutation: {
      onSuccess: () => {
        toast.success("Tenant deleted");
        onSuccess();
      },
      onError: () => toast.error("Failed to delete tenant"),
    },
  });

  return { addMutation, updateMutation, deleteMutation };
}
