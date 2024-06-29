import { http } from "viem";
import { mainnet } from "viem/chains";
import { createConfig } from "wagmi";

export const wagmiConfig = createConfig({
  chains: [mainnet],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
  },
});
