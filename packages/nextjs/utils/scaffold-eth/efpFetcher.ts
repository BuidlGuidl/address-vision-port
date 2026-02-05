export interface EfpAccountResponse {
  address: string;
  ens: {
    name: string;
    avatar: string | null;
    records: {
      avatar?: string;
      "com.github"?: string;
      "com.twitter"?: string;
      contenthash?: string;
      description?: string;
      email?: string;
      header?: string;
      location?: string;
      "org.telegram"?: string;
      status?: string;
      url?: string;
    } | null;
    updated_at: string;
  };
}

export interface EfpStatsResponse {
  followers_count: number;
  following_count: number;
}

const EFP_API_BASE = "https://data.ethfollow.xyz/api/v1";

export const efpAccountFetcher = async (url: string): Promise<EfpAccountResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error("Failed to fetch EFP account data");
    throw error;
  }
  return response.json();
};

export const efpStatsFetcher = async (url: string): Promise<EfpStatsResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error("Failed to fetch EFP stats data");
    throw error;
  }
  return response.json();
};

export const getEfpAccountUrl = (address: string) => `${EFP_API_BASE}/users/${address}/account`;
export const getEfpStatsUrl = (address: string) => `${EFP_API_BASE}/users/${address}/stats`;
