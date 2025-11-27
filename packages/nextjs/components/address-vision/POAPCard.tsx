import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { isAddress } from "viem";
import { useAddressStore } from "~~/services/store/store";
import { poapFetcher } from "~~/utils/scaffold-eth";

type POAPEvent = {
  id: number;
  fancy_id: string;
  name: string;
  event_url: string;
  image_url: string;
  country: string;
  city: string;
  description: string;
  year: number;
  start_date: string;
  end_date: string;
  timezone: string;
  expiry_date: string;
  supply: number;
};

type POAP = {
  event: POAPEvent;
  tokenId: string;
  owner: string;
  chain: string;
  created: string;
};

export const POAPCard = () => {
  const { resolvedAddress: address } = useAddressStore();

  const shouldFetch = address && isAddress(address);

  const { data: poapData, error: poapError } = useSWR(
    shouldFetch ? `https://api.poap.tech/actions/scan/${address}` : null,
    poapFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    },
  );

  const carouselRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  const updateButtonState = () => {
    if (carouselRef.current) {
      const element = carouselRef.current;
      setIsAtStart(element.scrollLeft === 0);
      setIsAtEnd(element.scrollLeft + element.clientWidth >= element.scrollWidth);
    }
  };

  useEffect(() => {
    updateButtonState();
  }, [poapData]);

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

  const handleImageError = (tokenId: string) => {
    setImageErrors(prevErrors => ({ ...prevErrors, [tokenId]: true }));
  };

  // Sort POAPs by created date (most recent first) and take the last 5
  const sortedPoaps = poapData
    ? [...poapData]
        .sort((a: POAP, b: POAP) => new Date(b.created).getTime() - new Date(a.created).getTime())
        .slice(0, 5)
    : [];

  const isPoapsLoading = poapData === undefined && !poapError;
  const totalPoaps = poapData?.length || 0;

  if (!shouldFetch || isPoapsLoading) {
    return (
      <div className="card w-[370px] md:w-[425px] bg-base-100 shadow-xl flex-grow animate-pulse">
        <div className="card-body">
          <div className="flex items-center space-x-4">
            <div className="h-2 w-28 bg-slate-300 rounded"></div>
          </div>

          <h3 className="font-bold mt-4">POAPs</h3>
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
        </div>
      </div>
    );
  }

  return (
    <div className="card w-[370px] md:w-[425px] bg-base-100 shadow-xl flex-grow">
      <div className="card-body py-6">
        <h2 className="card-title whitespace-nowrap flex items-center gap-2">
          <span className="text-sm md:text-base">POAPs</span>
          {totalPoaps > 0 && <span className="text-xs text-base-content/60">({totalPoaps} total)</span>}
        </h2>
        <h3 className="font-bold">Recent POAPs</h3>
        {poapError ? (
          <div className="text-sm text-error">Unable to load POAPs</div>
        ) : sortedPoaps.length === 0 ? (
          <div className="text-sm">No POAP data.</div>
        ) : (
          <>
            <div className="relative flex flex-col">
              {sortedPoaps.length > 1 && (
                <>
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
                </>
              )}
              <div
                ref={carouselRef}
                className="carousel-center carousel rounded-box max-w-md space-x-4 bg-secondary p-4 z-10"
              >
                {sortedPoaps.map((poap: POAP) => (
                  <div className="carousel-item" key={poap.tokenId}>
                    <a
                      href={`https://collectors.poap.xyz/token/${poap.tokenId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-32 w-32 items-center justify-center"
                    >
                      <div className="flex h-full w-full items-center justify-center">
                        <Image
                          src={imageErrors[poap.tokenId] ? "/base.svg" : poap.event.image_url}
                          className="rounded-box h-full w-full object-contain"
                          alt={poap.event.name}
                          width={128}
                          height={128}
                          onError={() => {
                            handleImageError(poap.tokenId);
                          }}
                        />
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
            {address && (
              <div className="self-end flex items-start gap-2 pt-2">
                <p className="text-xs m-0">See all on </p>
                <Link
                  href={`https://collectors.poap.xyz/scan/${address}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-xs text-primary hover:underline"
                >
                  POAP.xyz
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
