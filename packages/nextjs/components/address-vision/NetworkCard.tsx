import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NftsCarousel } from "./NftsCarousel";
import { TokensTable } from "./TokensTable";
import { CovalentClient } from "@covalenthq/client-sdk";
import { Address, isAddress } from "viem";
import { Chain } from "wagmi";
import { useNetworkBalancesStore } from "~~/services/store/store";
import {
  NETWORKS_EXTRA_DATA,
  getBlockExplorerAddressLink,
  getChainNameForCovalent,
  getChainNameForOpensea,
  isValidEnsOrAddress,
} from "~~/utils/scaffold-eth";

const client = new CovalentClient(process.env.NEXT_PUBLIC_COVALENT_API_KEY as string);

export const NetworkCard = ({ address, chain }: { address: Address; chain: Chain }) => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [tokenBalances, setTokenBalances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { setBalance, resetBalances } = useNetworkBalancesStore();
  const currentNetworkData = NETWORKS_EXTRA_DATA[chain.id];

  const getNfts = async () => {
    const options = {
      method: "GET",
      headers: { accept: "application/json", "x-api-key": process.env.NEXT_PUBLIC_OPENSEA_API_KEY || "default-key" },
    };

    try {
      const response = await fetch(
        `https://api.opensea.io/api/v2/chain/${getChainNameForOpensea(chain.id)}/account/${address}/nfts`,
        options,
      );
      const data = await response.json();

      if (data.nfts && data.nfts.length > 0) {
        const nftData = [];
        for (let i = 0; i < Math.min(10, data.nfts.length); i++) {
          const nft = data.nfts[i];
          if (nft.image_url && nft.identifier !== "0") {
            nftData.push({
              imageUrl: nft.image_url,
              contract: nft.contract,
              identifier: nft.identifier,
            });
          }
        }
        setNfts(nftData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getTokens = async () => {
    try {
      const res = await client.BalanceService.getTokenBalancesForWalletAddress(
        getChainNameForCovalent(chain.id),
        address,
        { nft: false, noSpam: true },
      );

      if (res.data && res.data.items) {
        const filteredTokens = res.data.items.filter(token => token.quote !== 0);
        setTokenBalances(filteredTokens);

        const totalBalance = filteredTokens.reduce((acc, { quote }) => acc + quote, 0);
        setBalance(chain.name, totalBalance, chain.id);
      }
    } catch (error) {
      console.error(`Failed to fetch token balances for ${chain.name}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setNfts([]);
    setTokenBalances([]);
    if (address && isAddress(address)) {
      resetBalances();
      getNfts();
      getTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  if (loading) {
    return (
      <div className="card w-[370px] md:w-[425px] bg-base-100 shadow-xl flex-grow animate-pulse">
        <div className="card-body">
          <div className="flex items-center space-x-4">
            <div className="h-2 w-28 bg-slate-300 rounded"></div>
          </div>

          <h3 className="font-bold mt-4">NFTs</h3>
          <div className="relative flex flex-col">
            <div className="carousel-center carousel rounded-box max-w-md space-x-4 bg-secondary p-4">
              <div className="carousel-item">
                <div className="rounded-md bg-slate-300 h-32 w-32"></div>
              </div>
              <div className="carousel-item">
                <div className="rounded-md bg-slate-300 h-32 w-32"></div>
              </div>
              <div className="carousel-item">
                <div className="rounded-md bg-slate-300 h-32 w-32"></div>
              </div>
            </div>
          </div>

          <h3 className="font-bold mt-4">Tokens</h3>
          <div className="max-h-48 overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Balance</th>
                  <th>Balance in USD</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="h-2 w-28 bg-slate-300"></td>
                  <td className="h-2 w-16 bg-slate-300"></td>
                  <td className="h-2 w-20 bg-slate-300"></td>
                </tr>
                <tr>
                  <td className="h-2 w-28 bg-slate-300"></td>
                  <td className="h-2 w-16 bg-slate-300"></td>
                  <td className="h-2 w-20 bg-slate-300"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  const filteredTokens = tokenBalances.slice(0, 10).filter(t => t.quote != null && t.quote.toFixed(0) !== "0");

  if (nfts.length === 0 && filteredTokens.length === 0) return null;

  if (address && isValidEnsOrAddress(address)) {
    return (
      <div className="card w-[370px] md:w-[425px] bg-base-100 shadow-xl flex-grow">
        <div className="card-body py-6">
          <h2 className="card-title whitespace-nowrap flex items-center gap-2">
            <Link
              href={getBlockExplorerAddressLink(chain, address)}
              rel="noopener noreferrer"
              target="_blank"
              className="flex items-center gap-2"
            >
              {currentNetworkData?.icon && (
                <div className="relative w-6 h-6">
                  <Image src={currentNetworkData.icon} alt={`${chain.name} icon`} width={24} height={24} />
                </div>
              )}
              <span className="text-sm md:text-base">{chain.name}</span>
            </Link>
          </h2>
          <h3 className="font-bold">NFTs</h3>
          <NftsCarousel nfts={nfts} chain={chain} address={address} />
          <h3 className="mt-4 font-bold">Tokens</h3>
          <TokensTable tokens={filteredTokens} />
        </div>
      </div>
    );
  }

  return null;
};
