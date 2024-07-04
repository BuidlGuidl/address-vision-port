import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Address as AddressType } from "viem";
import { useEnsName } from "wagmi";
import { ArrowTopRightOnSquareIcon, CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useAddressStore } from "~~/services/store/store";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

const getSize = (name: string) => {
  if (name.includes("...")) return "3xl";
  if (name.length > 24) return "xl";
  if (name.length > 20) return "2xl";
  if (name.length > 12) return "3xl";
  return "4xl";
};

export const AddressCard = () => {
  const [ens, setEns] = useState<string | null>();
  const [ensAvatar, setEnsAvatar] = useState<string | null>();
  const [addressCopied, setAddressCopied] = useState(false);

  const { resolvedAddress: address } = useAddressStore();

  const { data: fetchedEns } = useEnsName({
    address: address as AddressType,
    chainId: 1,
  });

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

  if (!address) {
    return (
      <div className="animate-pulse bg-base-100 h-32 w-[370px] md:w-[425px] shadow-xl card flex flex-row justify-center items-center gap-3 p-4">
        <div className="h-16 w-16 rounded-full bg-slate-300"></div>
        <div className="h-3 w-2/4 rounded bg-slate-300"></div>
      </div>
    );
  }

  const blockExplorerLink = getBlockExplorerAddressLink(address);
  let displayAddress = address?.slice(0, 5) + "..." + address?.slice(-4);

  if (ens) {
    displayAddress = ens;
  }

  const size = getSize(displayAddress);
  const textSizeClass = `text-${size}`;
  const blockieSize = {
    sm: 28,
    base: 32,
    lg: 40,
    xl: 44,
    "2xl": 48,
    "3xl": 64,
    "4xl": 64,
    "5xl": 80,
  }[size];

  return (
    <div className="flex w-[370px] md:w-[425px] h-32 items-center justify-center bg-base-100 shadow-xl card">
      <div className="card-body justify-center p-0 py-8">
        <div className="card-title">
          <div className="flex items-center  gap-3">
            <BlockieAvatar address={address} ensImage={ensAvatar} size={blockieSize} />
            <span className={`${displayAddress.includes("...") && "md:text-4xl"} ${textSizeClass}`}>
              {displayAddress}
            </span>
            <div className="ml-2 flex gap-1">
              {addressCopied ? (
                <CheckCircleIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
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
                  <DocumentDuplicateIcon className="h-6 w-6 hover:text-green-500 link" aria-hidden="true" />
                </CopyToClipboard>
              )}
              <a href={blockExplorerLink} target="_blank" rel="noopener noreferrer">
                <ArrowTopRightOnSquareIcon aria-hidden="true" className="h-6 w-6 hover:text-blue-600" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
