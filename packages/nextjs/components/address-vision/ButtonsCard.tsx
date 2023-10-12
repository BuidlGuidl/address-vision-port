import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Address as AddressComp } from "../scaffold-eth";
import { Address, isAddress } from "viem";
import { usePublicClient } from "wagmi";

export const ButtonsCard = ({ address }: { address: Address }) => {
  const [isContractAddress, setIsContractAddress] = useState<boolean | undefined>(undefined);
  const client = usePublicClient();

  useEffect(() => {
    setIsContractAddress(undefined);
    const fetchIsContract = async () => {
      if (isAddress(address)) {
        const bytecode = await client.getBytecode({ address });
        setIsContractAddress(bytecode ? bytecode.length > 2 : false);
      }
    };

    fetchIsContract();
  }, [address]);

  if (isContractAddress) {
    return (
      <div className="card w-[370px] md:w-[425px] bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">
            See
            <AddressComp address={address} />
            on
            <Link href={`https://abi.ninja/${address}/mainnet`} className="flex underline items-center">
              <Image src="/abininja-logo.svg" width={50} height={50} alt="abi.ninja logo" />
              abi.ninja
            </Link>
          </h2>
          <div className="text-xl">This is a contract!</div>
        </div>
      </div>
    );
  }

  if (!isAddress(address)) {
    return (
      <div className="card w-[370px] md:w-[425px] bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">
            See
            <div className="flex items-center space-x-4">
              <div className="rounded-md bg-slate-300 h-6 w-6"></div>
              <div className="h-2 w-28 bg-slate-300 rounded"></div>
            </div>
            on
          </h2>
          <div className="animate-pulse">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-6 w-28 bg-slate-300 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card w-[370px] md:w-[425px] bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          See
          <AddressComp address={address} />
          on
        </h2>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-3">
          <button
            className="btn btn-primary btn-xs rounded-full"
            title="View on Blockscan"
            tabIndex={2}
            onClick={() => {
              window.open("https://blockscan.com/address/" + address, "_blank");
            }}
          >
            Blockscan
          </button>
          <button
            className="btn btn-primary btn-xs rounded-full"
            title="View on Optimistic Etherscan"
            tabIndex={3}
            onClick={() => {
              window.open("https://optimistic.etherscan.io/address/" + address, "_blank");
            }}
          >
            Op Etherscan
          </button>
          <button
            className="btn btn-primary btn-xs rounded-full"
            title="View on Etherscan"
            tabIndex={1}
            onClick={() => {
              window.open("https://https://arbiscan.io//address/" + address, "_blank");
            }}
          >
            Arbiscan
          </button>
          <button
            className="btn btn-primary btn-xs rounded-full"
            title="View on Zerion"
            tabIndex={4}
            onClick={() => {
              window.open("https://app.zerion.io/" + address + "/overview", "_blank");
            }}
          >
            Zerion
          </button>
          <button
            className="btn btn-primary btn-xs rounded-full"
            title="View on Zapper"
            tabIndex={5}
            onClick={() => {
              window.open("https://zapper.xyz/account/" + address, "_blank");
            }}
          >
            Zapper
          </button>
          <button
            className="btn btn-primary btn-xs rounded-full"
            title="View on Safe"
            tabIndex={6}
            onClick={() => {
              window.open("https://app.safe.global/transactions/queue?safe=eth:" + address, "_blank");
            }}
          >
            Safe
          </button>
        </div>
      </div>
    </div>
  );
};
