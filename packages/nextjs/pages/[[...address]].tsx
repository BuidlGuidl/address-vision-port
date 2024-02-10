import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { isAddress } from "viem";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";
import * as chains from "wagmi/chains";
import { MetaHeader } from "~~/components/MetaHeader";
import {
  AddressDetailsComponent,
  Navbar,
  PreviousSearchesComponent,
  WelcomeMessage,
} from "~~/components/address-vision/";
import { useAccountBalance } from "~~/hooks/scaffold-eth";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const Home: NextPage = () => {
  const [currentAddress, setCurrentAddress] = useState("");
  const [displayAddress, setDisplayAddress] = useState("");
  const [previousAddresses, setPreviousAddresses] = useState<string[]>([]);
  const router = useRouter();
  const { balance, isLoading } = useAccountBalance(chains.mainnet, currentAddress);

  useEffect(() => {
    const savedAddresses = localStorage.getItem("searchedAddresses");
    if (savedAddresses) {
      setPreviousAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  useEffect(() => {
    if (currentAddress && isAddress(currentAddress)) {
      updateURLAndPreviousAddresses(displayAddress, currentAddress);
    }
  }, [currentAddress, displayAddress]);

  useEffect(() => {
    const processQueryAddress = async () => {
      const addressFromQuery = Array.isArray(router.query.address) ? router.query.address[0] : router.query.address;
      if (!addressFromQuery) return;

      setDisplayAddress(addressFromQuery);

      if (addressFromQuery.endsWith(".eth") || addressFromQuery.endsWith(".xyz")) {
        try {
          const resolvedAddress = await publicClient.getEnsAddress({ name: normalize(addressFromQuery) });
          setCurrentAddress(resolvedAddress ?? "");
        } catch (error) {
          console.error("Error resolving ENS name:", error);
          setCurrentAddress("");
        }
      } else {
        try {
          const ensName = await publicClient.getEnsName({ address: addressFromQuery });
          setDisplayAddress(ensName ?? addressFromQuery);
          setCurrentAddress(addressFromQuery);
        } catch (error) {
          console.error("Error reverse resolving Ethereum address:", error);
          setCurrentAddress(addressFromQuery);
        }
      }
    };

    processQueryAddress();
  }, [router.query]);

  const updateURLAndPreviousAddresses = (displayAddress: string, resolvedAddress: string) => {
    router.replace(`/${displayAddress}`, undefined, { shallow: true });

    if (!previousAddresses.includes(resolvedAddress)) {
      const updatedAddresses = [resolvedAddress, ...previousAddresses];
      setPreviousAddresses(updatedAddresses);
      localStorage.setItem("searchedAddresses", JSON.stringify(updatedAddresses));
    }
  };

  const removeAddressFromPrevious = (addressToRemove: string) => {
    const updatedAddresses = previousAddresses.filter(address => address !== addressToRemove);
    setPreviousAddresses(updatedAddresses);
    localStorage.setItem("searchedAddresses", JSON.stringify(updatedAddresses));
  };

  const cardWidthClass = isLoading || balance ? "lg:w-1/3" : "lg:w-1/2";

  const handleLogoClick = () => {
    setDisplayAddress("");
    setCurrentAddress("");
    router.push("/", undefined, { shallow: true });
  };

  return (
    <>
      <MetaHeader />
      <Navbar currentAddress={currentAddress} setCurrentAddress={setCurrentAddress} handleLogoClick={handleLogoClick} />

      {previousAddresses.length > 0 && !currentAddress && (
        <PreviousSearchesComponent previousAddresses={previousAddresses} removeAddress={removeAddressFromPrevious} />
      )}

      {currentAddress && <AddressDetailsComponent currentAddress={currentAddress} cardWidthClass={cardWidthClass} />}

      {!currentAddress && <WelcomeMessage previousAddresses={previousAddresses} />}
    </>
  );
};

export default Home;
