import { create } from "zustand";
import { persist } from "zustand/middleware";
import { signInWithRedirect, signOut, getCurrentUser } from "aws-amplify/auth";
import type { UserDto } from "@/lib/api/model";
import { initTenantFromSession, clearTenantId } from "@/lib/tenantStorage";

interface AuthState {
  // State
  user: UserDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  checkAuthStatus: () => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setUser: (user: UserDto | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      checkAuthStatus: async () => {
        try {
          // First, verify Amplify auth is set up
          await getCurrentUser();
          // Auth is valid, component will fetch UserDTO via useGetCurrentUser hook
          set({
            isAuthenticated: true,
          });
          // Derive and persist the tenant ID from the user's Cognito groups.
          // Temporary hack until the tenant-selection UI is implemented.
          await initTenantFromSession();
        } catch {
          console.debug("No authentication found, redirecting to IDP...");
          // User not authenticated - redirect to Cognito
          set({
            user: null,
            isAuthenticated: false,
          });

          // Automatically redirect to Cognito login
          await signInWithRedirect();
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          await signOut();
          clearTenantId();
          set({
            user: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error("Logout failed:", error);
          // Clear state anyway
          clearTenantId();
          set({
            user: null,
            isAuthenticated: false,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setUser: (user: UserDto | null) => {
        set({ user });
      },
    }),
    {
      name: "{{cookiecutter.project_slug}}-auth",
      storage:
        typeof window !== "undefined"
          ? {
            getItem: (key) => {
              const item = sessionStorage.getItem(key);
              return item ? JSON.parse(item) : null;
            },
            setItem: (key, value) => {
              sessionStorage.setItem(key, JSON.stringify(value));
            },
            removeItem: (key) => sessionStorage.removeItem(key),
          }
          : undefined,
    },
  ),
);
