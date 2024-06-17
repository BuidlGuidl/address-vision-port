import * as chains from "wagmi/chains";
import scaffoldConfig from "~~/scaffold.config";

export type TChainAttributes = {
  // color | [lightThemeColor, darkThemeColor]
  color: string | [string, string];
  // Used to fetch price by providing mainnet token address
  // for networks having native currency other than ETH
  nativeCurrencyTokenAddress?: string;
  icon?: string;
};

export const NETWORKS_EXTRA_DATA: Record<string, TChainAttributes> = {
  [chains.hardhat.id]: {
    color: "#b8af0c",
    icon: "/hardhat.png",
  },
  [chains.mainnet.id]: {
    color: "#ff8b9e",
    icon: "/mainnet.svg",
  },
  [chains.sepolia.id]: {
    color: ["#5f4bb6", "#87ff65"],
    icon: "/mainnet.svg",
  },
  [chains.goerli.id]: {
    color: "#0975F6",
    icon: "/mainnet.svg",
  },
  [chains.gnosis.id]: {
    color: "#48a9a6",
    icon: "/gnosis.svg",
  },
  [chains.polygon.id]: {
    color: "#2bbdf7",
    nativeCurrencyTokenAddress: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    icon: "/polygon.svg",
  },
  [chains.polygonMumbai.id]: {
    color: "#92D9FA",
    nativeCurrencyTokenAddress: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    icon: "/polygon.svg",
  },
  [chains.optimismGoerli.id]: {
    color: "#f01a37",
    icon: "/optimism.svg",
  },
  [chains.optimism.id]: {
    color: "#f01a37",
    icon: "/optimism.svg",
  },
  [chains.arbitrumGoerli.id]: {
    color: "#28a0f0",
    icon: "/arbitrum.svg",
  },
  [chains.arbitrum.id]: {
    color: "#28a0f0",
    icon: "/arbitrum.svg",
  },
  [chains.fantom.id]: {
    color: "#1969ff",
    icon: "/fantom.svg",
  },
  [chains.fantomTestnet.id]: {
    color: "#1969ff",
    icon: "/fantom.svg",
  },
  [chains.base.id]: {
    color: "#1450EE",
    icon: "/base.png",
  },
};

/**
 * Gives the block explorer transaction URL.
 * @param network
 * @param txnHash
 * @dev returns empty string if the network is localChain
 */
export function getBlockExplorerTxLink(chainId: number, txnHash: string) {
  const chainNames = Object.keys(chains);

  const targetChainArr = chainNames.filter(chainName => {
    const wagmiChain = chains[chainName as keyof typeof chains];
    return wagmiChain.id === chainId;
  });

  if (targetChainArr.length === 0) {
    return "";
  }

  const targetChain = targetChainArr[0] as keyof typeof chains;
  // @ts-expect-error : ignoring error since `blockExplorers` key may or may not be present on some chains
  const blockExplorerTxURL = chains[targetChain]?.blockExplorers?.default?.url;

  if (!blockExplorerTxURL) {
    return "";
  }

  return `${blockExplorerTxURL}/tx/${txnHash}`;
}

/**
 * Gives the block explorer Address URL.
 * @param network - wagmi chain object
 * @param address
 * @returns block explorer address URL and etherscan URL if block explorer URL is not present for wagmi network
 */
export function getBlockExplorerAddressLink(address: string) {
  return `https://etherscan.io/address/${address}`;
}

/**
 * @returns targetNetwork object consisting targetNetwork from scaffold.config and extra network metadata
 */

export function getTargetNetwork(): chains.Chain & Partial<TChainAttributes> {
  const configuredNetwork = scaffoldConfig.targetNetwork;

  return {
    ...configuredNetwork,
    ...NETWORKS_EXTRA_DATA[configuredNetwork.id],
  };
}
