import { useEffect, useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { Address } from "viem";
import { MetaHeader } from "~~/components/MetaHeader";
import { Navbar } from "~~/components/address-vision/";
import { SmallAddressComp } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const [previousAddresses, setPreviousAddresses] = useState<Address[]>([]);

  useEffect(() => {
    const savedAddresses = localStorage.getItem("searchedAddresses");
    if (savedAddresses) {
      setPreviousAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  const removeAddress = (addressToRemove: string) => {
    const updatedAddresses = previousAddresses.filter(address => address !== addressToRemove);
    setPreviousAddresses(updatedAddresses);
    localStorage.setItem("searchedAddresses", JSON.stringify(updatedAddresses));
  };

  return (
    <>
      <MetaHeader />
      <Navbar />
      {previousAddresses.length > 0 && (
        <div className="w-full flex flex-grow flex-col items-center md:mt-10 h-52 md:h-8">
          <h2 className="text-2xl mb-4">Previous ERROR</h2>
          <div className="w-full md:w-1/2 flex flex-wrap justify-center items-center gap-4 overflow-y-auto">
            {previousAddresses.map(address => (
              <SmallAddressComp key={address} address={address} removeAddress={() => removeAddress(address)} />
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-grow flex-col items-center justify-center">
        <div className="mb-4">
          <Image src="/eyes-emoji.svg" width={200} height={200} priority={true} alt="Eyes emoji" />
        </div>
        <h1 className="m-4 text-center text-4xl font-bold">Welcome to address.vision!</h1>
        <p className="m-4 text-center text-xl">
          To get started, enter an Ethereum address or ENS name in the search bar above.
        </p>
      </div>
    </>
  );
};

export default Home;
