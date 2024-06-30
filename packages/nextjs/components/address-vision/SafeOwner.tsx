import { useEffect, useState } from "react";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Address, isAddress } from "viem";
import { useEnsName } from "wagmi";
import { ArrowTopRightOnSquareIcon, CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

export const SafeOwner = ({ address }: { address: Address }) => {
  const [ens, setEns] = useState<string | null>();
  const [ensAvatar, setEnsAvatar] = useState<string | null>();
  const [addressCopied, setAddressCopied] = useState(false);

  const { data: fetchedEns } = useEnsName({ address, chainId: 1 });

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

  // Skeleton UI
  if (!address) {
    return (
      <div className="flex animate-pulse space-x-4">
        <div className="h-6 w-6 rounded-md bg-slate-300"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 rounded bg-slate-300"></div>
        </div>
      </div>
    );
  }

  if (!isAddress(address)) {
    return <span className="text-error">Wrong address</span>;
  }
  const blockExplorerLink = getBlockExplorerAddressLink(address);

  let displayAddress = address?.slice(0, 5) + "..." + address?.slice(-4);

  if (ens) {
    displayAddress = ens;
  }

  return (
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
          // @ts-ignore @todo fix this
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
  );
};
