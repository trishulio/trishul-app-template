import { signOut, getCurrentUser } from "aws-amplify/auth";

import { initTenantFromSession, clearTenantId } from "@/lib/auth/tenantStorage";
import type { StoreSet } from "./authStoreTypes";

export async function checkAuthStatus(set: StoreSet) {
  try {
    await getCurrentUser();
    set({ isAuthenticated: true });
    await initTenantFromSession();
  } catch {
    set({ user: null, isAuthenticated: false });
  }
}

export async function logout(set: StoreSet) {
  try {
    set({ isLoading: true });
    await signOut();
    set({ user: null, isAuthenticated: false });
  } catch (error) {
    console.error("Logout failed:", error);
    set({ user: null, isAuthenticated: false });
  } finally {
    clearTenantId();
    set({ isLoading: false });
  }
}
