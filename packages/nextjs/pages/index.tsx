import React, { useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import * as chains from "wagmi/chains";
import { AddressCard, ButtonsCard, NetworkCard, QRCodeCard } from "~~/components/address-vision/";
import { AddressInput } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const [searchedAddress, setSearchedAddress] = useState("");

  return (
    <>
      <Head>
        <title>address.vision</title>
        <meta name="description" content="address vision" />
      </Head>
      <div className="navbar sticky top-0 z-20 grid min-h-0 flex-shrink-0 grid-cols-12 justify-between bg-base-100 px-0 shadow-md shadow-secondary sm:px-2 lg:static">
        <div className="col-start-4 flex flex-row items-center md:col-start-1 md:col-end-3">
          <div className="mb-4 text-4xl">👀</div>
          <h1 className="ml-2 text-2xl font-bold">address.vision</h1>
        </div>
        <div className="col-start-2 col-end-12 row-start-2 flex justify-center md:col-start-4 md:col-end-10 md:row-auto">
          <div className="flex-grow">
            <AddressInput
              placeholder="Enter an Ethereum address or ENS name to get started"
              value={searchedAddress}
              onChange={setSearchedAddress}
            />
          </div>
        </div>
        <div className="col-start-11 col-end-13">{/* Additional content, perhaps history?*/}</div>
      </div>

      {searchedAddress ? (
        <div className="flex w-full flex-grow flex-col items-center justify-center gap-4 p-4 md:mt-4">
          <div className="flex flex-wrap">
            <div className="w-full flex-wrap space-y-4 p-4 sm:w-1/2 lg:w-1/3">
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
        <div className="relative flex flex-grow flex-col items-center justify-center">
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
