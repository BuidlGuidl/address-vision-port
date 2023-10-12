import { isAddress } from "viem";

export const getChainNameForOpensea = (id: number) => {
  switch (id) {
    case 1:
      return "ethereum";
    case 42161:
      return "arbitrum";
    case 10:
      return "optimism";
    case 8453:
      return "base";
    case 137:
      return "matic";
    default:
      return "ethereum";
  }
};

export const getChainNameForCovalent = (id: number) => {
  switch (id) {
    case 1:
      return "eth-mainnet";
    case 42161:
      return "arbitrum-mainnet";
    case 10:
      return "optimism-mainnet";
    case 8453:
      return "base-mainnet";
    case 137:
      return "matic-mainnet";
    default:
      return "eth-mainnet";
  }
};

export const isValidEnsOrAddress = (name: string) => isAddress(name) || /^[a-z0-9-]+\.eth$/.test(name);
