import { useEffect, useState } from "react";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Address as AddressType } from "viem";
import { Address } from "viem";
import { useEnsName } from "wagmi";
import {
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Avatar } from "~~/components/scaffold-eth";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

export const SmallAddressComp = ({ address, removeAddress }: { address: Address; removeAddress?: () => void }) => {
  const [ens, setEns] = useState<string | null>(null);
  const [addressCopied, setAddressCopied] = useState(false);

  const { data: fetchedEns, isLoading } = useEnsName({
    address: address as AddressType,
    chainId: 1,
  });

  // We need to apply this pattern to avoid Hydration errors.
  useEffect(() => {
    setEns(fetchedEns ?? null);
  }, [fetchedEns]);

  const blockExplorerLink = getBlockExplorerAddressLink(address);

  let displayAddress = address?.slice(0, 5) + "..." + address?.slice(-4);

  if (ens) {
    displayAddress = ens;
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 animate-pulse bg-base-300 h-10 w-60 rounded-full">
        <div className="h-9 w-9 rounded-full bg-slate-300 ml-0.5"></div>
        <div className="h-3 w-20 rounded bg-slate-300"></div>
        <div className="flex gap-2 ml-1">
          <div className="h-5 w-5 rounded bg-slate-300"></div>
          <div className="h-5 w-5 rounded bg-slate-300"></div>
          <div className="h-5 w-5 rounded bg-slate-300"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center bg-base-300 p-0.5 pr-2 rounded-full">
      <div className="flex items-center">
        <Link
          className={"flex items-center gap-2"}
          target={"_self"}
          href={ens ? `/${ens}` : `/${address}`}
          rel="noopener noreferrer"
        >
          <Avatar ensName={ens} address={address} size={40} />
          <span className={`text-lg`}>{displayAddress}</span>
        </Link>
        <div className="ml-2 flex gap-1">
          {addressCopied ? (
            <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
          ) : (
            // @ts-ignore
            <CopyToClipboard
              text={address}
              onCopy={() => {
                setAddressCopied(true);
                setTimeout(() => {
                  setAddressCopied(false);
                }, 800);
              }}
            >
              <DocumentDuplicateIcon className="h-5 w-5 hover:text-green-500 link" aria-hidden="true" />
            </CopyToClipboard>
          )}
          <a href={blockExplorerLink} target="_blank" rel="noopener noreferrer">
            <ArrowTopRightOnSquareIcon aria-hidden="true" className="h-5 w-5 hover:text-blue-600" />
          </a>
        </div>
      </div>
      <TrashIcon className="h-5 w-5 mx-1 hover:text-red-500 link" onClick={removeAddress} />
    </div>
  );
};
