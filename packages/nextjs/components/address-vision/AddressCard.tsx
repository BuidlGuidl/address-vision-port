import { Address as AddressComp, Balance } from "../scaffold-eth";
import { Address, isAddress } from "viem";
import * as chains from "wagmi/chains";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { isValidEnsOrAddress } from "~~/utils/scaffold-eth";

export const AddressCard = ({
  address,
  isSmallCard = false,
  removeAddress,
}: {
  address: Address;
  isSmallCard?: boolean;
  removeAddress?: () => void;
}) => {
  const cardSizeClass = isSmallCard
    ? "flex-shrink-0 w-[350px] md:w-[300px] max-w-[350px] h-[100px]"
    : "flex-shrink-0 w-[370px] md:w-[425px] max-w-[425px]";
  const titleSizeClass = isSmallCard ? "text-md" : "text-xl";
  const balanceSizeClass = isSmallCard ? "text-md pt-0" : "text-xl";

  if (!isAddress(address)) {
    return (
      <div className={`card ${cardSizeClass} bg-base-100 shadow-xl flex flex-col`}>
        <div className="card-body flex-grow pb-0 animate-pulse">
          <h2 className={`card-title ${titleSizeClass}`}>
            <div className="h-10 w-48 bg-slate-300 rounded"></div>
          </h2>
        </div>
        <div className={`card-actions flex items-center justify-end p-4 ${balanceSizeClass} animate-pulse`}>
          Balance: <div className="h-6 w-24 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card ${cardSizeClass} bg-base-100 shadow-xl flex flex-col p-6`}>
      <div className={`card-body p-0`}>
        <h2 className={`card-title ${titleSizeClass}`}>
          {address && (
            <>
              <div className="hidden md:block">
                <AddressComp
                  address={address}
                  size={isSmallCard ? "lg" : "4xl"}
                  isAddressCard={true}
                  isSmallCard={isSmallCard}
                />
              </div>
              <div className="block md:hidden">
                <AddressComp
                  address={address}
                  size={isSmallCard ? "lg" : "3xl"}
                  isAddressCard={true}
                  isSmallCard={isSmallCard}
                />
              </div>
            </>
          )}
        </h2>
        {isSmallCard && (
          <XMarkIcon
            className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:cursor-pointer hover:text-black"
            onClick={removeAddress}
          />
        )}
      </div>
      <div className={`card-actions flex items-center justify-end ${balanceSizeClass}`}>
        Balance:{" "}
        {address && isValidEnsOrAddress(address) ? (
          <Balance address={address} targetNetwork={chains.mainnet} className={isSmallCard ? "text-md" : "text-2xl"} />
        ) : (
          <p>search for an address</p>
        )}
      </div>
    </div>
  );
};
