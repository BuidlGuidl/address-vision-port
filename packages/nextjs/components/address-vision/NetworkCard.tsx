import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NftsCarousel } from "./NftsCarousel";
import { TokensTable } from "./TokensTable";
import useSWR from "swr";
import { Chain, isAddress } from "viem";
import { useAddressStore, useNetworkBalancesStore } from "~~/services/store/store";
import {
  NETWORKS_EXTRA_DATA,
  getBlockExplorerAddressLink,
  getChainNameForMoralis,
  getChainNameForOpensea,
  isValidEnsOrAddress,
  nftsFetcher,
  tokenBalanceFetcher,
} from "~~/utils/scaffold-eth";

export const NetworkCard = ({ chain }: { chain: Chain }) => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [tokenBalances, setTokenBalances] = useState<any[]>([]);
  const { setBalance } = useNetworkBalancesStore();
  const currentNetworkData = NETWORKS_EXTRA_DATA[chain.id];
  const { resolvedAddress: address } = useAddressStore();
  const [isLoading, setIsLoading] = useState(true);

  const shouldFetch = address && isAddress(address);

  const { data: tokenBalancesData } = useSWR(
    `https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens?chain=${getChainNameForMoralis(
      chain.id,
    )}&exclude_spam=true&exclude_unverified_contracts=true&exclude_native=false`,
    tokenBalanceFetcher,
  );

  const { data: nftData } = useSWR(
    `https://api.opensea.io/api/v2/chain/${getChainNameForOpensea(chain.id)}/account/${address}/nfts`,
    nftsFetcher,
  );

  const fetchAndSetTokens = () => {
    setTokenBalances(tokenBalancesData?.result || []);
    const balance = tokenBalancesData?.result?.reduce(
      (acc: any, token: any) => acc + (parseFloat(token.usd_value) || 0),
      0,
    );
    setBalance(chain.name, balance, chain.id);
  };

  const fetchAndSetNfts = () => {
    if (nftData?.nfts && nftData.nfts.length > 0) {
      const nftDataFormatted = nftData.nfts
        .filter((nft: any) => nft.image_url && nft.identifier !== "0")
        .map((nft: any) => ({
          imageUrl: nft.image_url,
          contract: nft.contract,
          identifier: nft.identifier,
        }));
      setNfts(nftDataFormatted);
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchAndSetNfts();
      fetchAndSetTokens();
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  if (isLoading) {
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

  if (address && isValidEnsOrAddress(address)) {
    return (
      <div className="card w-[370px] md:w-[425px] bg-base-100 shadow-xl flex-grow">
        <div className="card-body py-6">
          <h2 className="card-title whitespace-nowrap flex items-center gap-2">
            <Link
              href={getBlockExplorerAddressLink(address)}
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
          <TokensTable tokens={tokenBalances} />
        </div>
      </div>
    );
  }

  return null;
};
