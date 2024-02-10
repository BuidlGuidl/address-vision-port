import { AddressCard } from "./AddressCard";
import { ButtonsCard } from "./ButtonsCard";
import { NetworkCard } from "./NetworkCard";
import { QRCodeCard } from "./QRCodeCard";
import * as chains from "wagmi/chains";

interface AddressDetailsProps {
  currentAddress: string;
  cardWidthClass: string;
}

export const AddressDetailsComponent = ({ currentAddress, cardWidthClass }: AddressDetailsProps) => (
  <div className="flex w-full flex-grow flex-col items-center justify-center gap-4 p-4 md:mt-4">
    <div className="flex flex-wrap">
      <div className={`w-full flex-wrap space-y-4 p-4 sm:w-1/2 ${cardWidthClass}`}>
        <AddressCard address={currentAddress} />
        <div className="w-[370px] md:hidden lg:hidden">
          <QRCodeCard address={currentAddress} />
        </div>
        <ButtonsCard address={currentAddress} />

        <NetworkCard address={currentAddress} chain={chains.arbitrum} />
        <div className="lg:hidden">
          <NetworkCard address={currentAddress} chain={chains.polygon} />
        </div>
        <NetworkCard address={currentAddress} chain={chains.base} />
        <div className="space-y-4 md:hidden lg:hidden">
          <NetworkCard address={currentAddress} chain={chains.mainnet} />
          <NetworkCard address={currentAddress} chain={chains.optimism} />
        </div>
      </div>

      <div className="w-full space-y-4 p-4 hidden sm:w-1/2 md:block lg:block lg:w-1/3">
        <QRCodeCard address={currentAddress} />
        <div className="lg:hidden">
          <NetworkCard address={currentAddress} chain={chains.mainnet} />
        </div>
        <NetworkCard address={currentAddress} chain={chains.optimism} />
      </div>

      <div className="w-full space-y-4 p-4 hidden sm:w-1/2 md:hidden lg:block lg:w-1/3">
        <NetworkCard address={currentAddress} chain={chains.mainnet} />

        <NetworkCard address={currentAddress} chain={chains.polygon} />
      </div>
    </div>
  </div>
);
