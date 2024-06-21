import { configureChains } from "wagmi";
import * as chains from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import scaffoldConfig from "~~/scaffold.config";

// We always want to have mainnet enabled (ENS resolution, ETH price, etc). But only once.
// const enabledChains = configuredNetwork.id === 1 ? [configuredNetwork] : [configuredNetwork, chains.mainnet];

/**
 * Chains for the app
 */
export const appChains = configureChains(
  [
    chains.mainnet,
    chains.optimism,
    chains.arbitrum,
    chains.base,
    chains.gnosis,
    chains.goerli,
    chains.polygon,
    chains.sepolia,
    chains.zkSync,
  ],
  [
    alchemyProvider({
      apiKey: scaffoldConfig.alchemyApiKey,
    }),
    publicProvider(),
  ],
  {
    // We might not need this checkout https://github.com/scaffold-eth/scaffold-eth-2/pull/45#discussion_r1024496359, will test and remove this before merging
    stallTimeout: 3_000,
    pollingInterval: scaffoldConfig.pollingInterval,
  },
);
