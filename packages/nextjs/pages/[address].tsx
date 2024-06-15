import { useEffect } from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps, NextPage } from "next";
import { createPublicClient, http, isAddress } from "viem";
import { mainnet } from "viem/chains";
import * as chains from "wagmi/chains";
import { MetaHeader } from "~~/components/MetaHeader";
import { AddressCard, ButtonsCard, Navbar, NetworkCard, QRCodeCard } from "~~/components/address-vision/";
import { TotalBalanceCard } from "~~/components/address-vision/TotalBalanceCard";
import { useAccountBalance } from "~~/hooks/scaffold-eth";
import { useAddressStore } from "~~/services/store/store";

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

const AddressPage: NextPage<Props> = ({ address }) => {
  const { resolvedAddress, setEnsName, setResolvedAddress } = useAddressStore();

  const { balance, isLoading } = useAccountBalance(chains.mainnet, resolvedAddress);

  const router = useRouter();

  useEffect(() => {
    const addyOrEns = router.query.address as string;

    if (addyOrEns.endsWith(".eth")) {
      setEnsName(addyOrEns);
    } else if (isAddress(addyOrEns)) {
      setResolvedAddress(addyOrEns);
    }
  }, [router]);

  let cardWidthClass = "lg:w-1/3";
  if (!isLoading && !balance && resolvedAddress) {
    cardWidthClass = "lg:w-1/2";
  }

  return (
    <>
      <MetaHeader address={address} />
      <Navbar />

      {resolvedAddress ? (
        <div className="flex w-full flex-grow flex-col items-center justify-center gap-4 p-4 md:mt-4">
          <div className="flex">
            <div className={`w-full flex-wrap space-y-4 md:p-4 sm:w-1/2 ${cardWidthClass}`}>
              <AddressCard address={resolvedAddress} />
              <div className="w-[370px] md:hidden lg:hidden">
                <QRCodeCard address={resolvedAddress} />
              </div>
              <ButtonsCard address={resolvedAddress} />
              <TotalBalanceCard />
              <NetworkCard address={resolvedAddress} chain={chains.arbitrum} />
              <div className="lg:hidden">
                <NetworkCard address={resolvedAddress} chain={chains.polygon} />
              </div>
              <NetworkCard address={resolvedAddress} chain={chains.base} />
              <div className="space-y-4 md:hidden lg:hidden">
                <NetworkCard address={resolvedAddress} chain={chains.mainnet} />
                <NetworkCard address={resolvedAddress} chain={chains.optimism} />
              </div>
            </div>

            <div className="w-full space-y-4 p-4 hidden sm:w-1/2 md:block lg:block lg:w-1/3">
              <QRCodeCard address={resolvedAddress} />
              <div className="lg:hidden">
                <NetworkCard address={resolvedAddress} chain={chains.mainnet} />
              </div>
              <NetworkCard address={resolvedAddress} chain={chains.optimism} />
            </div>

            <div className="w-full space-y-4 p-4 hidden sm:w-1/2 md:hidden lg:block lg:w-1/3">
              <NetworkCard address={resolvedAddress} chain={chains.mainnet} />
              <NetworkCard address={resolvedAddress} chain={chains.polygon} />
            </div>
          </div>
        </div>
      ) : (
        <div className={`flex flex-grow flex-col items-center xl:justify-start justify-center`}>
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

export default AddressPage;
