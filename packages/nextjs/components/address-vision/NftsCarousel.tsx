import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Chain } from "wagmi";
import { getChainNameForOpensea } from "~~/utils/scaffold-eth";

export const NftsCarousel = ({ nfts, chain }: { nfts: any[]; chain: Chain }) => {
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);

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
  return (
    <>
      {nfts.length > 0 ? (
        <div className="relative flex flex-col">
          <div className="absolute flex justify-between transform -translate-y-1/2 left-3 right-3 top-1/2 z-20">
            <button onClick={scrollLeft} className="btn btn-sm btn-circle opacity-60" disabled={isAtStart}>
              ❮
            </button>
            <button onClick={scrollRight} className="btn btn-sm btn-circle opacity-60" disabled={isAtEnd}>
              ❯
            </button>
          </div>
          <div
            ref={carouselRef}
            className="carousel-center carousel rounded-box max-w-md space-x-4 bg-secondary p-4 z-10"
          >
            {nfts.map((nft, index) => (
              <div className="carousel-item" key={index}>
                <a
                  href={`https://opensea.io/assets/${getChainNameForOpensea(chain.id)}/${nft.contract}/${
                    nft.identifier
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-32 w-32 items-center justify-center"
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <Image
                      src={nft.imageUrl}
                      className="rounded-box h-full w-full object-contain"
                      alt={`NFT ${index}`}
                      width={128}
                      height={128}
                    />
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No NFTs found.</p>
      )}
    </>
  );
};
