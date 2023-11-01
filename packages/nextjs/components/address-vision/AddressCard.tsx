import { Address as AddressComp, Balance } from "../scaffold-eth";
import { Address, isAddress } from "viem";
import * as chains from "wagmi/chains";
import { isValidEnsOrAddress } from "~~/utils/scaffold-eth";

export const AddressCard = ({ address }: { address: Address }) => {
  if (!isAddress(address)) {
    return (
      <div className="card w-[370px] md:w-[425px] bg-base-100 shadow-xl flex flex-col">
        <div className="card-body flex-grow pb-0 animate-pulse">
          <h2 className="card-title">
            <div className="h-10 w-48 bg-slate-300 rounded"></div>
          </h2>
        </div>
        <div className="card-actions flex items-center justify-end p-4 text-xl animate-pulse">
          Balance: <div className="h-6 w-24 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="card w-[370px] md:w-[425px] bg-base-100 shadow-xl flex flex-col">
      <div className="card-body flex-grow pb-0">
        <h2 className="card-title">
          {address && (
            <>
              <div className="hidden md:block">
                <AddressComp address={address} size="4xl" isAddressCard={true} />
              </div>
              <div className="block md:hidden">
                <AddressComp address={address} size="3xl" isAddressCard={true} />
              </div>
            </>
          )}
        </h2>
      </div>
      <div className="card-actions flex items-center justify-end p-4 text-xl">
        Balance:{" "}
        {address && isValidEnsOrAddress(address) ? (
          <Balance address={address} targetNetwork={chains.mainnet} className="text-2xl" />
        ) : (
          <p>search for an address</p>
        )}
      </div>
    </div>
  );
};
