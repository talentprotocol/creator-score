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

// Farcaster Mini App specific types
export interface FarcasterMiniAppStatus {
  isAdded: boolean;
  notificationsEnabled: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface FarcasterMiniAppActions {
  addMiniApp: () => Promise<boolean>;
  requestNotificationPermission: () => Promise<boolean>;
  getStatus: () => Promise<FarcasterMiniAppStatus>;
}

export interface FarcasterContextData {
  user: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
    bio?: string;
    followerCount?: number;
    followingCount?: number;
    addresses: Array<{
      address: string;
      type: string;
    }>;
  } | null;
  location: {
    type: string;
    context: Record<string, unknown>;
  } | null;
  miniApp: FarcasterMiniAppStatus;
}
