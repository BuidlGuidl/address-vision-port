import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Address as AddressComp } from "../scaffold-eth";
import { useDarkMode } from "usehooks-ts";
import { Address, isAddress } from "viem";
import { usePublicClient } from "wagmi";

const GNOSIS_SAFE_BYTECODE_PATTERN = "0x608060405273ffffffffffffffffffffffffffffffffffffffff600054167fa619486e";

const SAFE_ABI = [
  {
    inputs: [],
    name: "getOwners",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getThreshold",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export const ButtonsCard = ({ address }: { address: Address }) => {
  const [isContractAddress, setIsContractAddress] = useState<boolean | undefined>(undefined);
  const [isGnosisSafe, setIsGnosisSafe] = useState<boolean | undefined>(false);
  const [safeOwners, setSafeOwners] = useState<Address[]>([]);
  const [safeThreshold, setSafeThreshold] = useState<number>(0);
  const { isDarkMode } = useDarkMode();
  const client = usePublicClient();

  useEffect(() => {
    const fetchIsContractAndGnosis = async () => {
      if (isAddress(address)) {
        const bytecode = await client.getBytecode({ address });

        setIsContractAddress(bytecode && bytecode.length > 2);

        const isGnosisSafeContract = bytecode && bytecode.startsWith(GNOSIS_SAFE_BYTECODE_PATTERN);
        setIsGnosisSafe(isGnosisSafeContract);
      }
    };

    fetchIsContractAndGnosis();
  }, [address, client]);

  useEffect(() => {
    const fetchOwners = async () => {
      const data = await client.readContract({
        address,
        abi: SAFE_ABI,
        functionName: "getOwners",
      });
      setSafeOwners(data as Address[]);
    };

    const fetchThreshold = async () => {
      const data = await client.readContract({
        address,
        abi: SAFE_ABI,
        functionName: "getThreshold",
      });
      setSafeThreshold(Number(data));
      console.log(data);
    };

    if (isAddress(address) && isGnosisSafe) {
      fetchOwners();
      fetchThreshold();
    }

    if (!isAddress(address)) {
      setIsContractAddress(false);
    }
  }, [address, isGnosisSafe]);

  if (isContractAddress && !isGnosisSafe) {
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

  if (isContractAddress && isGnosisSafe) {
    return (
      <div className="card w-[370px] md:w-[425px] bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">
            See
            <AddressComp address={address} />
            on
            <Link href={`https://app.safe.global/home?safe=eth:${address}`} className="flex underline items-center">
              <Image
                src={isDarkMode ? "/safe-logo-light.svg" : "/safe-logo-dark.svg"}
                width={80}
                height={80}
                alt="Safe logo"
              />
            </Link>
          </h2>
          <div className="font-semibold flex justify-between items-center">
            <p className="m-0">Owners:</p>
            <div className="text-right w-full">
              <p className="m-0">
                Threshold: {safeThreshold}/{safeOwners.length}
              </p>
            </div>
          </div>
          <div>
            {safeOwners.map(owner => (
              <div key={owner} className="mb-1">
                <AddressComp address={owner} />
              </div>
            ))}
          </div>
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
