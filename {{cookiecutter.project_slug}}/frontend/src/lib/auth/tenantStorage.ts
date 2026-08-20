import { fetchAuthSession } from "aws-amplify/auth";
import { extractGroupsFromIdToken } from "./idTokenGroups";

const TENANT_ID_KEY = "{{cookiecutter.project_slug}}-tenant-id";

export function setTenantId(tenantId: string): void {
  localStorage.setItem(TENANT_ID_KEY, tenantId);
}

export function getTenantId(): string | null {
  return localStorage.getItem(TENANT_ID_KEY);
}

export function clearTenantId(): void {
  localStorage.removeItem(TENANT_ID_KEY);
}

export async function initTenantFromSession(): Promise<void> {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    if (!idToken) return;

    const groups = extractGroupsFromIdToken(idToken);
    if (groups.length === 0) {
      console.warn("[tenant] No Cognito groups found in ID token.");
      return;
    }

    setTenantId(groups[0]);
  } catch (error) {
    console.error("[tenant] Failed to initialise tenant from session:", error);
  }
}
