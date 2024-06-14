import { createConfig } from "wagmi";
import { appChains } from "~~/services/web3/wagmiConnectors";

export const wagmiConfig = createConfig({
  autoConnect: false,
  publicClient: appChains.publicClient,
});
