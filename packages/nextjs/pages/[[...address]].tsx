import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { Address, isAddress } from "viem";
import * as chains from "wagmi/chains";
import { MetaHeader } from "~~/components/MetaHeader";
import { AddressCard, ButtonsCard, Navbar, NetworkCard, QRCodeCard } from "~~/components/address-vision/";
import { useAccountBalance } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [searchedAddress, setSearchedAddress] = useState("");
  const [previousAddresses, setPreviousAddresses] = useState<Address[]>([]);
  const router = useRouter();

  const { balance, isLoading } = useAccountBalance(chains.mainnet, searchedAddress);

  useEffect(() => {
    const savedAddresses = localStorage.getItem("searchedAddresses");
    if (savedAddresses) {
      setPreviousAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  useEffect(() => {
    if (isAddress(searchedAddress)) {
      setPreviousAddresses(prevAddresses => {
        const filteredAddresses = prevAddresses.filter(address => address !== searchedAddress);
        const updatedAddresses = [searchedAddress, ...filteredAddresses];
        localStorage.setItem("searchedAddresses", JSON.stringify(updatedAddresses));
        return updatedAddresses;
      });
    }
  }, [searchedAddress]);

  useEffect(() => {
    if (router.query.address && Array.isArray(router.query.address)) {
      const [address] = router.query.address;
      if (address) {
        setSearchedAddress(address);
      }
    }
  }, [router.query]);

  useEffect(() => {
    setTimeout(() => {
      if (searchedAddress && isAddress(searchedAddress)) {
        router.push(`/${searchedAddress}`, undefined, { shallow: true });
      } else if (!searchedAddress) {
        router.push("/", undefined, { shallow: true });
      }
    }, 200); // @remind not the best solution
  }, [searchedAddress]);

  let cardWidthClass = "lg:w-1/3";
  if (!isLoading && !balance && isAddress(searchedAddress)) {
    cardWidthClass = "lg:w-1/2";
  }

  const removeAddress = (addressToRemove: Address) => {
    const updatedAddresses = previousAddresses.filter(address => address !== addressToRemove);
    setPreviousAddresses(updatedAddresses);
    localStorage.setItem("searchedAddresses", JSON.stringify(updatedAddresses));
  };

  const gridHeightClass = previousAddresses.length > 8 ? "md:h-[330px]" : "md:h-[220px]";

  return (
    <>
      <MetaHeader />
      <Navbar searchedAddress={searchedAddress} setSearchedAddress={setSearchedAddress} />

      {previousAddresses.length > 0 && !searchedAddress && (
        <div className="relative flex flex-grow flex-col items-center top-10">
          <h2 className="text-3xl mb-4">Previous Searches</h2>
          <div className="relative">
            <div
              className={`pb-12 px-8 grid grid-cols-1 h-[500px] md:grid-cols-3 lg:grid-cols-4 gap-4 ${gridHeightClass} overflow-y-scroll`}
            >
              {previousAddresses.map(address => (
                <AddressCard
                  key={address}
                  address={address}
                  isSmallCard={true}
                  removeAddress={() => removeAddress(address)}
                />
              ))}
            </div>
            <div className="absolute -bottom-1 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-base-200"></div>
          </div>
        </div>
      )}

      {searchedAddress ? (
        <div className="flex w-full flex-grow flex-col items-center justify-center gap-4 p-4 md:mt-4">
          <div className="flex flex-wrap">
            <div className={`w-full flex-wrap space-y-4 p-4 sm:w-1/2 ${cardWidthClass}`}>
              <AddressCard address={searchedAddress} />
              <div className="w-[370px] md:hidden lg:hidden">
                <QRCodeCard address={searchedAddress} />
              </div>
              <ButtonsCard address={searchedAddress} />

              <NetworkCard address={searchedAddress} chain={chains.arbitrum} />
              <div className="lg:hidden">
                <NetworkCard address={searchedAddress} chain={chains.polygon} />
              </div>
              <NetworkCard address={searchedAddress} chain={chains.base} />
              <div className="space-y-4 md:hidden lg:hidden">
                <NetworkCard address={searchedAddress} chain={chains.mainnet} />
                <NetworkCard address={searchedAddress} chain={chains.optimism} />
              </div>
            </div>

            <div className="w-full space-y-4 p-4 hidden sm:w-1/2 md:block lg:block lg:w-1/3">
              <QRCodeCard address={searchedAddress} />
              <div className="lg:hidden">
                <NetworkCard address={searchedAddress} chain={chains.mainnet} />
              </div>
              <NetworkCard address={searchedAddress} chain={chains.optimism} />
            </div>

            <div className="w-full space-y-4 p-4 hidden sm:w-1/2 md:hidden lg:block lg:w-1/3">
              <NetworkCard address={searchedAddress} chain={chains.mainnet} />

              <NetworkCard address={searchedAddress} chain={chains.polygon} />
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`relative flex flex-grow flex-col items-center ${
            previousAddresses.length > 0 ? "xl:justify-start" : "justify-center"
          }`}
        >
          <div className="mb-4 text-9xl">👀</div>
          <h1 className="mb-4 text-center text-4xl font-bold">Welcome to address.vision!</h1>
          <p className="mb-4 text-center text-xl">
            To get started, enter an Ethereum address or ENS name in the search bar above.
          </p>
        </div>
      )}
    </>
  );
};

export default Home;
