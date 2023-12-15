import { useEffect, useState } from "react";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { isAddress } from "viem";
import { useEnsName } from "wagmi";
import { Chain } from "wagmi";
import { hardhat } from "wagmi/chains";
import * as chains from "wagmi/chains";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { getBlockExplorerAddressLink, getTargetNetwork } from "~~/utils/scaffold-eth";

type TAddressProps = {
  address?: string;
  disableAddressLink?: boolean;
  format?: "short" | "long";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  chain?: Chain;
  isAddressCard?: boolean;
};

const blockieSizeMap = {
  xs: 6,
  sm: 7,
  base: 8,
  lg: 9,
  xl: 10,
  "2xl": 12,
  "3xl": 15,
  "4xl": 20,
};

/**
 * Displays an address (or ENS) with a Blockie image and option to copy address.
 */
export const Address = ({
  address,
  disableAddressLink,
  format,
  size = "base",
  chain = chains.mainnet,
  isAddressCard,
}: TAddressProps) => {
  const [ens, setEns] = useState<string | null>();
  const [ensAvatar, setEnsAvatar] = useState<string | null>();
  const [addressCopied, setAddressCopied] = useState(false);

  const { data: fetchedEns } = useEnsName({ address, enabled: isAddress(address ?? ""), chainId: 1 });

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

  const blockExplorerAddressLink = getBlockExplorerAddressLink(chain, address);
  let displayAddress = address?.slice(0, 5) + "..." + address?.slice(-4);

  if (ens) {
    displayAddress = ens;
  } else if (format === "long") {
    displayAddress = address;
  }

  return (
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <BlockieAvatar
          address={address}
          ensImage={ensAvatar}
          size={(blockieSizeMap[size] * 24) / blockieSizeMap["base"]}
        />
      </div>
      {disableAddressLink ? (
        <span className={`ml-1.5 text-${size} font-normal`}>{displayAddress}</span>
      ) : getTargetNetwork().id === hardhat.id ? (
        <span className={`ml-1.5 text-${size} font-normal`}>
          <Link href={blockExplorerAddressLink}>{displayAddress}</Link>
        </span>
      ) : (
        <a
          className={`ml-1.5 font-normal ${isAddressCard && ens && ens.length > 20 ? "text-2xl" : `text-${size}`}`}
          target="_blank"
          href={blockExplorerAddressLink}
          rel="noopener noreferrer"
        >
          {displayAddress}
        </a>
      )}
      {addressCopied ? (
        <CheckCircleIcon
          className="ml-1 mt-3 h-4 w-4 cursor-pointer self-start font-normal text-neutral"
          aria-hidden="true"
        />
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
          <DocumentDuplicateIcon
            className="ml-1 mt-3 h-4 w-4 cursor-pointer self-start font-normal text-neutral"
            aria-hidden="true"
          />
        </CopyToClipboard>
      )}
    </div>
  );
};
