import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import useSWR from "swr";
import { Address, Chain } from "viem";
import { getChainNameForMoralis, getChainNameForOpensea, moralisFetcher } from "~~/utils/scaffold-eth";

export const NftsCarouselSkeleton = () => {
  const skeletonItems = Array.from({ length: 3 }, (_, index) => (
    <div className="carousel-item" key={index}>
      <div className="flex h-32 w-32 items-center justify-center">
        <div className="rounded-box h-full w-full bg-slate-300"></div>
      </div>
    </div>
  ));

  return (
    <div className="carousel-center carousel rounded-box max-w-md space-x-4 bg-secondary p-4 z-10">{skeletonItems}</div>
  );
};

interface Nft {
  token_id: string;
  token_address: string;
  media?: {
    media_collection?: {
      medium?: {
        url: string;
      };
    };
  };
  collection_logo?: string;
}

export const NftsCarousel = ({ chain, address }: { chain: Chain; address: Address }) => {
  const { data, isLoading } = useSWR(
    `https://deep-index.moralis.io/api/v2.2/${address}/nft?chain=${getChainNameForMoralis(
      chain.id,
    )}&format=decimal&limit=5&exclude_spam=true&normalizeMetadata=false&media_items=true`,
    moralisFetcher,
    {
      revalidateOnFocus: false, // Disable revalidation on focus
      revalidateOnReconnect: false, // Disable revalidation on reconnect
      dedupingInterval: 60000, // Cache data for 60 seconds
    },
  );

  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const carouselRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const updateButtonState = () => {
    if (carouselRef.current) {
      const element = carouselRef.current;
      setIsAtStart(element.scrollLeft === 0);
      setIsAtEnd(element.scrollLeft + element.clientWidth >= element.scrollWidth);
    }
  };

  useEffect(() => {
    updateButtonState();
  }, [data]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -200, behavior: "smooth" });
      setTimeout(updateButtonState, 300);
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 200, behavior: "smooth" });
      setTimeout(updateButtonState, 300);
    }
  };

  if (isLoading) {
    return <NftsCarouselSkeleton />;
  }

  const filteredNfts: Nft[] = data.result.filter(
    (nft: Nft) => nft.media?.media_collection?.medium?.url || nft.collection_logo,
  );

  if (filteredNfts.length === 0) {
    return <div>No NFT data.</div>;
  }

  return (
    <>
      <div className="relative flex flex-col">
        <button
          onClick={scrollLeft}
          className="btn btn-sm btn-circle opacity-60 absolute z-20 left-2 top-16"
          disabled={isAtStart}
        >
          ❮
        </button>
        <button
          onClick={scrollRight}
          className="btn btn-sm btn-circle opacity-60 absolute z-20 right-2 top-16"
          disabled={isAtEnd}
        >
          ❯
        </button>
        <div
          ref={carouselRef}
          className="carousel-center carousel rounded-box max-w-md space-x-4 bg-secondary p-4 z-10"
        >
          {filteredNfts.map((nft: Nft, index: number) => (
            <div className="carousel-item" key={index}>
              <a
                href={`https://opensea.io/assets/${getChainNameForOpensea(chain.id)}/${nft.token_address}/${
                  nft.token_id
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-32 w-32 items-center justify-center"
              >
                <div className="flex h-full w-full items-center justify-center">
                  {nft.media?.media_collection?.medium?.url ? (
                    <Image
                      src={nft.media.media_collection.medium.url}
                      className="rounded-box h-full w-full object-contain"
                      alt={`NFT ${index}`}
                      width={128}
                      height={128}
                    />
                  ) : nft.collection_logo ? (
                    <Image
                      src={nft.collection_logo}
                      className="rounded-box h-full w-full object-contain"
                      alt={`Collection Logo ${index}`}
                      width={128}
                      height={128}
                    />
                  ) : null}
                </div>
              </a>
            </div>
          ))}
        </div>
        <div className="self-end flex items-start gap-2 pt-2">
          <p className="text-xs m-0">See more on </p>
          <Link href={`https://opensea.io/${address}`} rel="noopener noreferrer" target="_blank" className="flex">
            <Image
              src={isDarkMode ? "/opensea-logo-light.svg" : "/opensea-logo-dark.svg"}
              alt="opensea logo"
              width={70}
              height={20}
            />
          </Link>
        </div>
      </div>
    </>
  );
};
