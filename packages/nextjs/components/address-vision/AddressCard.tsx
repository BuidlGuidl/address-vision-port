import { Address as AddressComp } from "../scaffold-eth";
import { Address } from "viem";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useAddressStore } from "~~/services/store/store";

export const AddressCard = ({
  address,
  isSmallCard = false,
  removeAddress,
}: {
  address?: Address;
  isSmallCard?: boolean;
  removeAddress?: () => void;
}) => {
  const { resolvedAddress } = useAddressStore();

  if (isSmallCard) {
    return (
      <div className="flex justify-between items-center bg-base-300 p-0.5 pr-2 rounded-full">
        <AddressComp address={address} isSmallCard={isSmallCard} size="xl" />
        <TrashIcon className="h-5 w-5 mx-1 hover:text-red-500 link" onClick={removeAddress} />
      </div>
    );
  }

  return (
    <div className="flex w-[370px] md:w-[425px] items-center bg-base-100 shadow-xl card">
      <div className="card-body p-0 py-8 ">
        <div className="card-title">
          <AddressComp address={resolvedAddress} size="4xl" />
        </div>
      </div>
    </div>
  );
};
