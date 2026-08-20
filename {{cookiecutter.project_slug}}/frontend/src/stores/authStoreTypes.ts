import type { UserDto } from "@/lib/api/model";

export interface AuthState {
  user: UserDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuthStatus: () => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setUser: (user: UserDto | null) => void;
}

export type StoreSet = (partial: Partial<AuthState>) => void;
