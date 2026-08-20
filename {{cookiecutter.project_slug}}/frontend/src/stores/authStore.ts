import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthState } from "./authStoreTypes";
import { sessionStorageAdapter } from "@/lib/auth/sessionStorage";
import { checkAuthStatus, logout } from "./authActions";

const NAME = "{{ cookiecutter.project_slug }}-auth";

const storage =
  typeof window !== "undefined"
    ? createJSONStorage(() => sessionStorageAdapter)
    : undefined;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      checkAuthStatus: () => checkAuthStatus(set),
      logout: () => logout(set),
      setLoading: (loading) => set({ isLoading: loading }),
      setUser: (user) => set({ user }),
    }),
    {
      name: NAME,
      storage,
    },
  ),
);
