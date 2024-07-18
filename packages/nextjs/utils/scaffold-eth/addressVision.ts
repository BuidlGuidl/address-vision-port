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

export const getChainNameForMoralis = (id: number) => {
  switch (id) {
    case 1:
      return "eth";
    case 42161:
      return "arbitrum";
    case 10:
      return "optimism";
    case 8453:
      return "base";
    case 137:
      return "polygon";
    default:
      return "eth";
  }
};
