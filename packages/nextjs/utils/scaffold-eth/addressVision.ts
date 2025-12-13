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

export const getAlchemyNetwork = (id: number) => {
  switch (id) {
    case 1:
      return "eth-mainnet";
    case 42161:
      return "arb-mainnet";
    case 10:
      return "opt-mainnet";
    case 8453:
      return "base-mainnet";
    case 137:
      return "polygon-mainnet";
    default:
      return "eth-mainnet";
  }
};
