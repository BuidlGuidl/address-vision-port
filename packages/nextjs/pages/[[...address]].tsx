import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps, NextPage } from "next";
import { Address, createPublicClient, http, isAddress } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";
import * as chains from "wagmi/chains";
import { MetaHeader } from "~~/components/MetaHeader";
import { AddressCard, ButtonsCard, Navbar, NetworkCard, QRCodeCard } from "~~/components/address-vision/";
import { TotalBalanceCard } from "~~/components/address-vision/TotalBalanceCard";
import { useAccountBalance } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

type Props = {
  address: string;
};

export const getServerSideProps: GetServerSideProps = async context => {
  const address = context.params?.address || null;
  const formattedAddress = Array.isArray(address) ? address.join("/") : address;

  return {
    props: {
      address: formattedAddress,
    },
  };
};

const Home: NextPage<Props> = ({ address }) => {
  const [searchedAddress, setSearchedAddress] = useState<Address | "">("");
  const [searchedEns, setSearchedEns] = useState("");
  const [previousAddresses, setPreviousAddresses] = useState<Address[]>([]);

  const { balance, isLoading } = useAccountBalance(chains.mainnet, searchedAddress);

  const router = useRouter();

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
      if (!searchedEns) {
        router.push(`/${searchedAddress}`, undefined, { shallow: true });
      }
    }
  }, [searchedAddress, setPreviousAddresses, router, searchedEns]);

  useEffect(() => {
    const { address } = router.query;
    if (address) {
      const formattedAddress = Array.isArray(address) ? address[0] : address;
      if (isAddress(formattedAddress)) {
        setSearchedAddress(formattedAddress);
      } else if (/\.eth$/.test(formattedAddress)) {
        setSearchedEns(formattedAddress);
        const intendedPath = `/${formattedAddress}`;
        if (router.asPath !== intendedPath) {
          router.push(intendedPath, undefined, { shallow: true });
        }
        const resolveEns = async () => {
          try {
            const ensAddress = await publicClient.getEnsAddress({
              name: normalize(formattedAddress),
            });
            if (ensAddress && isAddress(ensAddress)) {
              setSearchedAddress(ensAddress);
            } else {
              notification.error("ENS name not found or does not resolve to a valid address.", {
                position: "bottom-center",
              });
              setSearchedAddress("");
              setSearchedEns("");
            }
          } catch (error) {
            console.error("Error resolving ENS:", error);
            notification.error("Failed to resolve ENS name. Please try again.", {
              position: "bottom-center",
            });
            setSearchedAddress("");
            setSearchedEns("");
          }
        };
        resolveEns();
      }
    }
  }, [router.query.address, router.asPath, router]);

  let cardWidthClass = "lg:w-1/3";
  if (!isLoading && !balance && isAddress(searchedAddress)) {
    cardWidthClass = "lg:w-1/2";
  }

  const removeAddress = (addressToRemove: Address) => {
    const updatedAddresses = previousAddresses.filter(address => address !== addressToRemove);
    setPreviousAddresses(updatedAddresses);
    localStorage.setItem("searchedAddresses", JSON.stringify(updatedAddresses));
  };

  return (
    <>
      <MetaHeader address={address} />
      <Navbar searchedAddress={searchedAddress} setSearchedAddress={setSearchedAddress} />

      {previousAddresses.length > 0 && !searchedAddress && (
        <div className="w-full flex flex-grow flex-col items-center md:mt-10 h-52 md:h-8">
          <h2 className="text-2xl mb-4">Previous Searches</h2>
          <div className="w-full md:w-1/2 flex flex-wrap justify-center items-center gap-4 overflow-y-auto">
            {previousAddresses.map(address => (
              <AddressCard
                key={address}
                address={address}
                isSmallCard={true}
                removeAddress={() => removeAddress(address)}
              />
            ))}
          </div>
        </div>
      )}

      {searchedAddress ? (
        <div className="flex w-full flex-grow flex-col items-center justify-center gap-4 p-4 md:mt-4">
          <div className="flex">
            <div className={`w-full flex-wrap space-y-4 md:p-4 sm:w-1/2 ${cardWidthClass}`}>
              <AddressCard address={searchedAddress} />

              <div className="w-[370px] md:hidden lg:hidden">
                <QRCodeCard address={searchedAddress} />
              </div>
              <ButtonsCard address={searchedAddress} />
              <TotalBalanceCard />
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
          className={`flex flex-grow flex-col items-center ${
            previousAddresses.length > 0 ? "xl:justify-start" : "justify-center"
          }`}
        >
          <div className="mb-4 text-9xl">👀</div>
          <h1 className="m-4 text-center text-4xl font-bold">Welcome to address.vision!</h1>
          <p className="m-4 text-center text-xl">
            To get started, enter an Ethereum address or ENS name in the search bar above.
          </p>
        </div>
      )}
    </>
  );
};

export default Home;
