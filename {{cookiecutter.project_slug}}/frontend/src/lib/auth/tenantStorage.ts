import { fetchAuthSession } from "aws-amplify/auth";

const TENANT_ID_KEY = "lastminet-tenant-id";

/**
 * Persist the active tenant ID in localStorage so that it survives page reloads.
 */
export function setTenantId(tenantId: string): void {
  localStorage.setItem(TENANT_ID_KEY, tenantId);
}

/**
 * Retrieve the active tenant ID from localStorage.
 * Returns null if no tenant has been set yet.
 */
/** @public */
export function getTenantId(): string | null {
  return localStorage.getItem(TENANT_ID_KEY);
}

/**
 * Clear the stored tenant ID (e.g. on logout).
 */
export function clearTenantId(): void {
  localStorage.removeItem(TENANT_ID_KEY);
}

/**
 * Inspect the current Cognito session's ID token, extract the
 * `cognito:groups` claim, and store the first group as the active
 * tenant ID.
 *
 * This is a temporary hack until a proper tenant-selection UI is built.
 * The ID token payload is a standard JWT — the middle segment is
 * base64url-encoded JSON.
 */
export async function initTenantFromSession(): Promise<void> {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      console.warn("[tenant] No ID token found in session.");
      return;
    }

    // JWT structure: header.payload.signature — all base64url encoded
    const payloadSegment = idToken.split(".")[1];
    if (!payloadSegment) {
      console.warn("[tenant] Malformed ID token — cannot parse groups.");
      return;
    }

    // base64url → base64 → JSON
    const decoded = atob(payloadSegment.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(decoded) as Record<string, unknown>;

    const groups = payload["cognito:groups"];
    if (!Array.isArray(groups) || groups.length === 0) {
      console.warn("[tenant] No Cognito groups found in ID token.");
      return;
    }

    const firstGroup = String(groups[0]);
    setTenantId(firstGroup);
    console.debug(
      `[tenant] Active tenant set from Cognito group: ${firstGroup}`,
    );
  } catch (error) {
    console.error("[tenant] Failed to initialise tenant from session:", error);
  }
}
