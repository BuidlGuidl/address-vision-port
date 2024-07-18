import { useEffect } from "react";
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
  moralisFetcher,
  openseaNftFetcher,
} from "~~/utils/scaffold-eth";

export const NetworkCard = ({ chain }: { chain: Chain }) => {
  const { setBalance } = useNetworkBalancesStore();
  const { resolvedAddress: address } = useAddressStore();

  const currentNetworkData = NETWORKS_EXTRA_DATA[chain.id];

  const shouldFetch = address && isAddress(address);

  const { data: tokenBalancesData } = useSWR(
    shouldFetch
      ? `https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens?chain=${getChainNameForMoralis(
          chain.id,
        )}&exclude_spam=true&exclude_unverified_contracts=true&exclude_native=false`
      : null,
    moralisFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    },
  );

  const { data: nftData } = useSWR(
    shouldFetch
      ? `https://api.opensea.io/api/v2/chain/${getChainNameForOpensea(chain.id)}/account/${address}/nfts?limit=5`
      : null,
    openseaNftFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    },
  );

  const setTokenBalances = () => {
    if (tokenBalancesData?.result?.length > 0) {
      const balance = tokenBalancesData.result.reduce(
        (acc: any, token: any) => acc + (parseFloat(token.usd_value) || 0),
        0,
      );
      setBalance(chain.name, balance, chain.id);
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      setTokenBalances();
    }
  }, [address, tokenBalancesData]);

  if (nftData === undefined || tokenBalancesData === undefined || !shouldFetch) {
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

  return (
    <div className="card w-[370px] md:w-[425px] bg-base-100 shadow-xl flex-grow">
      <div className="card-body py-6">
        <h2 className="card-title whitespace-nowrap flex items-center gap-2">
          <Link
            href={getBlockExplorerAddressLink(address, chain)}
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
        <NftsCarousel nfts={nftData.nfts} chain={chain} address={address} />
        <h3 className="mt-4 font-bold">Tokens</h3>
        <TokensTable tokens={tokenBalancesData.result} />
      </div>
    </div>
  );
};
