import { useEffect } from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps, NextPage } from "next";
import { isAddress } from "viem";
import * as chains from "wagmi/chains";
import { MetaHeader } from "~~/components/MetaHeader";
import {
  AddressCard,
  ButtonsCard,
  Navbar,
  NetworkCard,
  QRCodeCard,
  TotalBalanceCard,
} from "~~/components/address-vision/";
import { useAddressStore } from "~~/services/store/store";

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

  const router = useRouter();

  useEffect(() => {
    const addyOrEns = router.query.address as string;

    if (addyOrEns.endsWith(".eth") || addyOrEns.endsWith(".xyz")) {
      setEnsName(addyOrEns);
    } else if (isAddress(addyOrEns)) {
      setResolvedAddress(addyOrEns);
    }
  }, [router]);

  let cardWidthClass = "lg:w-1/3";
  if (resolvedAddress) {
    cardWidthClass = "lg:w-1/2";
  }

  return (
    <>
      <MetaHeader address={address} />
      <Navbar />

      <div className="flex w-full flex-grow flex-col items-center gap-4 p-4 md:mt-4">
        <div className="flex">
          <div className={`w-full flex-wrap space-y-4 md:p-4 sm:w-1/2 ${cardWidthClass}`}>
            <AddressCard />
            <div className="w-[370px] md:hidden lg:hidden">
              <QRCodeCard />
            </div>
            <ButtonsCard />
            <TotalBalanceCard />
            <NetworkCard chain={chains.arbitrum} />
            <div className="lg:hidden">
              <NetworkCard chain={chains.polygon} />
            </div>
            <NetworkCard chain={chains.base} />
            <div className="space-y-4 md:hidden lg:hidden">
              <NetworkCard chain={chains.mainnet} />
              <NetworkCard chain={chains.optimism} />
            </div>
          </div>

          <div className="w-full space-y-4 p-4 hidden sm:w-1/2 md:block lg:block lg:w-1/3">
            <QRCodeCard />
            <div className="lg:hidden">
              <NetworkCard chain={chains.mainnet} />
            </div>
            <NetworkCard chain={chains.optimism} />
          </div>

          <div className="w-full space-y-4 p-4 hidden sm:w-1/2 md:hidden lg:block lg:w-1/3">
            <NetworkCard chain={chains.mainnet} />
            <NetworkCard chain={chains.polygon} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressPage;
