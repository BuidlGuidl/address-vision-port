import { http } from "viem";
import { mainnet } from "viem/chains";
import { createConfig } from "wagmi";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

export const wagmiConfig = createConfig({
  chains: [mainnet],
  ssr: true,
  transports: {
    [mainnet.id]: http(getAlchemyHttpUrl(1)),
  },
});
