export type AuthProvider = "privy" | "farcaster";

export type AuthContext = "browser" | "farcaster_miniapp";

export interface User {
  id: string;
  walletAddress?: string;
  fid?: number;
  fname?: string;
  authProvider: AuthProvider;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  provider: AuthProvider | null;
  context: AuthContext;
  loading: boolean;
  error: string | null;
}
