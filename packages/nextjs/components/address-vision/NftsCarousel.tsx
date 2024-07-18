import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Address, Chain } from "viem";
import { getChainNameForOpensea } from "~~/utils/scaffold-eth";

type Nft = {
  imageUrl: string;
  contract: Address;
  identifier: number;
};

export const NftsCarousel = ({ nfts, chain, address }: { nfts: Nft[]; chain: Chain; address: Address }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const carouselRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  const updateButtonState = () => {
    if (carouselRef.current) {
      const element = carouselRef.current;
      setIsAtStart(element.scrollLeft === 0);
      setIsAtEnd(element.scrollLeft + element.clientWidth >= element.scrollWidth);
    }
  };

  useEffect(() => {
    updateButtonState();
  }, [nfts]);

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

  const handleImageError = (index: number) => {
    setImageErrors(prevErrors => ({ ...prevErrors, [index]: true }));
  };

  const nftDataFormatted = nfts
    .filter((nft: any) => nft.image_url && nft.identifier !== "0")
    .map((nft: any, index: number) => ({
      imageUrl: nft.display_image_url || nft.image_url,
      contract: nft.contract,
      identifier: nft.identifier,
      index,
    }));

  if (nftDataFormatted.length === 0) {
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
          {nftDataFormatted.map(nft => (
            <div className="carousel-item" key={nft.index}>
              <a
                href={`https://opensea.io/assets/${getChainNameForOpensea(chain.id)}/${nft.contract}/${nft.identifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-32 w-32 items-center justify-center"
              >
                <div className="flex h-full w-full items-center justify-center">
                  <Image
                    src={imageErrors[nft.index] ? "/base.svg" : nft.imageUrl}
                    className="rounded-box h-full w-full object-contain"
                    alt={`NFT ${nft.index}`}
                    width={128}
                    height={128}
                    onError={() => {
                      handleImageError(nft.index);
                    }}
                  />
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
