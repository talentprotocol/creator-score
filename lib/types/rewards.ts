export interface Sponsor {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
}

export interface SponsorsResponse {
  sponsors: Sponsor[];
}

export interface SponsorsResult {
  sponsors: Sponsor[];
  error: string | null;
}

export interface Grant {
  id: number;
  start_date: string;
  end_date: string;
  rewards_pool: string;
  token_ticker: string;
  rewarded_builders: number;
  total_builders: number;
  avg_builder_score: number;
  track_type: "intermediate" | "final";
  tracked: true;
  sponsor: {
    id: number;
    name: string;
    slug: string;
    description: string;
    logo_url: string;
    color: string;
    website_url: string;
  };
}

export interface GrantsResult {
  grants: Grant[];
  error: string | null;
}

export interface GrantsResponse {
  grants: Grant[];
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
  };
}
