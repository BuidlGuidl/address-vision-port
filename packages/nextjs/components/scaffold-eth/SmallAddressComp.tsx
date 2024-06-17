import { useEffect, useState } from "react";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Address as AddressType, isAddress } from "viem";
import { Address } from "viem";
import { useEnsName } from "wagmi";
import {
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

export const SmallAddressComp = ({ address, removeAddress }: { address: Address; removeAddress?: () => void }) => {
  const [ens, setEns] = useState<string | null>();
  const [ensAvatar, setEnsAvatar] = useState<string | null>();
  const [addressCopied, setAddressCopied] = useState(false);

  const { data: fetchedEns } = useEnsName({
    address: address as AddressType,
    enabled: isAddress(address ?? ""),
    chainId: 1,
  });

  // We need to apply this pattern to avoid Hydration errors.
  useEffect(() => {
    setEns(fetchedEns);
  }, [fetchedEns]);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!fetchedEns) {
        setEnsAvatar(null);
        return;
      }

      try {
        const avatarURL = `https://metadata.ens.domains/mainnet/avatar/${fetchedEns}`;
        const response = await fetch(avatarURL);
        const contentType = response.headers.get("Content-Type");

        if (contentType && contentType.includes("application/json")) {
          const json = await response.json();
          if (json.message === "There is no avatar set under given address") {
            setEnsAvatar(null);
          }
          return;
        }

        const imageBlob = await response.blob();
        const imageURL = URL.createObjectURL(imageBlob);
        setEnsAvatar(imageURL);
      } catch (error) {
        console.error("Error fetching ENS avatar:", error);
        setEnsAvatar(null);
      }
    };

    fetchAvatar();
  }, [fetchedEns]);

  const blockExplorerLink = getBlockExplorerAddressLink(address);

  let displayAddress = address?.slice(0, 5) + "..." + address?.slice(-4);

  if (ens) {
    displayAddress = ens;
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
          <BlockieAvatar address={address} ensImage={ensAvatar} size={40} />
          <span className={`text-lg`}>{displayAddress}</span>
        </Link>
        <div className="ml-2 flex gap-1">
          {addressCopied ? (
            <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
          ) : (
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
