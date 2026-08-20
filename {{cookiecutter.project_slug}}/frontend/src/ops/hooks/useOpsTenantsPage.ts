import { useTenantList } from "./useTenantList";
import { useTenantMutations } from "./useTenantMutations";
import { useTenantForm } from "./useTenantForm";

export function useOpsTenantsPage() {
  const list = useTenantList();
  const { addMutation, updateMutation, deleteMutation } = useTenantMutations(
    () => void list.refetch(),
  );

  const form = useTenantForm({
    onAdd: (name, url) => addMutation.mutate({ data: [{ name, url }] }),
    onEdit: (id, name, url) =>
      updateMutation.mutate({ data: [{ id, name, url }] }),
    onDelete: (id) => deleteMutation.mutate({ params: { ids: [id] } }),
  });

  return { ...list, ...form, addMutation, updateMutation, deleteMutation };
}
