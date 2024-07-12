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
  moralisFetcher,
} from "~~/utils/scaffold-eth";

export const NetworkCard = ({ chain }: { chain: Chain }) => {
  const [tokenBalances, setTokenBalances] = useState<any[]>([]);
  const { setBalance } = useNetworkBalancesStore();
  const currentNetworkData = NETWORKS_EXTRA_DATA[chain.id];
  const { resolvedAddress: address } = useAddressStore();
  const [isLoading, setIsLoading] = useState(true);

  const shouldFetch = address && isAddress(address);

  const { data: tokenBalancesData } = useSWR(
    shouldFetch
      ? `https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens?chain=${getChainNameForMoralis(
          chain.id,
        )}&exclude_spam=true&exclude_unverified_contracts=true&exclude_native=false`
      : null,
    moralisFetcher,
    {
      revalidateOnFocus: false, // Disable revalidation on focus
      revalidateOnReconnect: false, // Disable revalidation on reconnect
      dedupingInterval: 60000, // Cache data for 60 seconds
    },
  );

  const fetchAndSetTokens = () => {
    setTokenBalances(tokenBalancesData?.result || []);
    const balance = tokenBalancesData?.result?.reduce(
      (acc: any, token: any) => acc + (parseFloat(token.usd_value) || 0),
      0,
    );
    setBalance(chain.name, balance, chain.id);
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchAndSetTokens();
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, tokenBalancesData]);

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

  if (address && isAddress(address)) {
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
          <NftsCarousel chain={chain} address={address} />
          <h3 className="mt-4 font-bold">Tokens</h3>
          <TokensTable tokens={tokenBalances} />
        </div>
      </div>
    );
  }

  return null;
};
