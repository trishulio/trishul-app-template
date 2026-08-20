import { toast } from "sonner";

export const REQUIRED_FIELDS_ERROR =
  "Tenant name and connection URL are required";

export function validateTenantFields(name: string, url: string) {
  const trimmedName = name.trim();
  const trimmedUrl = url.trim();
  if (!trimmedName || !trimmedUrl) {
    toast.error(REQUIRED_FIELDS_ERROR);
    return null;
  }
  return { name: trimmedName, url: trimmedUrl };
}
