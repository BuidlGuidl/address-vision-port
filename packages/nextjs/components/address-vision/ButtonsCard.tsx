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
  const [isContractAddress, setIsContractAddress] = useState<boolean>(false);
  const [isGnosisSafe, setIsGnosisSafe] = useState<boolean>(false);
  const [safeOwners, setSafeOwners] = useState<Address[]>([]);
  const [safeThreshold, setSafeThreshold] = useState<number>(0);
  const { isDarkMode } = useDarkMode();
  const client = usePublicClient();

  useEffect(() => {
    setIsContractAddress(false);
    setIsGnosisSafe(false);
    setSafeOwners([]);
    setSafeThreshold(0);
  }, [address]);

  useEffect(() => {
    const checkGnosisSafe = async () => {
      try {
        const bytecode = await client.getBytecode({ address });
        const isContract = bytecode && bytecode.length > 2;

        setIsContractAddress(isContract || false);

        if (isContract && bytecode.startsWith(GNOSIS_SAFE_BYTECODE_PATTERN)) {
          setIsGnosisSafe(true);
          const [ownersData, thresholdData] = await Promise.all([
            client.readContract({
              address,
              abi: SAFE_ABI,
              functionName: "getOwners",
            }),
            client.readContract({
              address,
              abi: SAFE_ABI,
              functionName: "getThreshold",
            }),
          ]);
          setSafeOwners(ownersData as Address[]);
          setSafeThreshold(Number(thresholdData));
        } else {
          setIsGnosisSafe(false);
        }
      } catch (error) {
        console.error("Contract read failed:", error);
      }
    };

    checkGnosisSafe();
  }, [address, client]);

  if (isContractAddress && !isGnosisSafe) {
    return (
      <div className="card w-[370px] md:w-[425px] bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="text-xl flex">
            <p>This is a contract, see it on</p>
            <Link href={`https://abi.ninja/${address}/1`} className="flex underline items-center">
              <Image src="/abininja-logo.svg" width={50} height={50} alt="abi.ninja logo" />
              abi.ninja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isContractAddress && isGnosisSafe) {
    return (
      <div className="card w-[370px] md:w-[425px] bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">
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
                <AddressComp address={owner} isSmallCard={true} />
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
