import type { NextApiRequest, NextApiResponse } from "next";

interface Token {
  name: string;
  symbol: string;
  balance: string;
  decimals: number;
  usd_value: number | null;
}

interface AlchemyToken {
  network: string;
  tokenAddress: string;
  tokenBalance: string;
  tokenMetadata?: {
    name: string | null;
    symbol: string | null;
    decimals: number;
    logo?: string;
  };
  tokenPrices?: Array<{
    currency: string;
    value: string;
    lastUpdatedAt: string;
  }>;
}

interface AlchemyResponse {
  data?: {
    tokens: AlchemyToken[];
  };
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { address, network } = req.query;

  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Address is required" });
  }

  if (!network || typeof network !== "string") {
    return res.status(400).json({ error: "Network is required" });
  }

  const apiKey = process.env.ALCHEMY_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Alchemy API key is not configured" });
  }

  try {
    const response = await fetch(`https://api.g.alchemy.com/data/v1/${apiKey}/assets/tokens/by-address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        addresses: [
          {
            address,
            networks: [network],
          },
        ],
        withMetadata: true,
        withPrices: true,
        includeNativeTokens: true,
        includeErc20Tokens: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data: AlchemyResponse = await response.json();
    console.log("Alchemy response:", JSON.stringify(data, null, 2));

    if (!data.data?.tokens) {
      return res.status(200).json({ result: [] });
    }

    const isSpamToken = (name: string, symbol: string) => {
      const combined = `${name} ${symbol}`.toLowerCase();
      const spamPatterns = [
        /visit/i,
        /claim/i,
        /airdrop/i,
        /\.com/i,
        /\.xyz/i,
        /\.io/i,
        /\.cash/i,
        /\.net/i,
        /reward/i,
      ];
      return spamPatterns.some(pattern => pattern.test(combined));
    };

    const tokens: Token[] = data.data.tokens
      .filter(token => {
        const meta = token.tokenMetadata;
        if (!meta || !meta.name || !meta.symbol) return false;
        if (isSpamToken(meta.name, meta.symbol)) return false;
        // Filter out zero balance tokens
        if (BigInt(token.tokenBalance) === 0n) return false;
        return true;
      })
      .map(token => {
        const balanceHex = token.tokenBalance;
        const balanceDecimal = BigInt(balanceHex).toString();

        const usdPrice = token.tokenPrices?.find(p => p.currency === "usd");
        const usdValue = usdPrice?.value != null ? Number(usdPrice.value) : null;

        return {
          name: token.tokenMetadata!.name!,
          symbol: token.tokenMetadata!.symbol!,
          balance: balanceDecimal,
          decimals: token.tokenMetadata!.decimals,
          usd_value: usdValue,
        };
      })
      .sort((a, b) => {
        // Sort by USD value descending (tokens with value first, then by value)
        if (a.usd_value === null && b.usd_value === null) return 0;
        if (a.usd_value === null) return 1;
        if (b.usd_value === null) return -1;
        return b.usd_value - a.usd_value;
      });

    return res.status(200).json({ result: tokens });
  } catch (error) {
    console.error("Alchemy API error:", error);
    return res.status(500).json({ error: "Failed to fetch token data" });
  }
}
