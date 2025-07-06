export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  loading?: boolean;
}

export interface TalentProfile {
  id: string;
  wallet_address: string;
  farcaster_id?: number;
  github_username?: string;
  handle?: string;
  name?: string;
  bio?: string;
  avatar_url?: string;
  score?: number;
  credentials?: TalentCredential[];
}

export interface TalentCredential {
  id: string;
  type: string;
  value: number;
  readable_value: string;
  uom: string;
  description?: string;
}
