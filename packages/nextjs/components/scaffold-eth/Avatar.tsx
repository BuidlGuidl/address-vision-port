import { useEffect, useState } from "react";
import Image from "next/image";
import { blo } from "blo";
import { Address } from "viem";

interface BlockieAvatarProps {
  ensName: string | null;
  address: Address;
  size: number;
}

const fetchEnsAvatar = async (ensName: string) => {
  const metadataUrl = `https://metadata.ens.domains/mainnet/avatar/${ensName}`;

  try {
    const response = await fetch(metadataUrl);
    if (response.ok) {
      return metadataUrl;
    }
    throw new Error("Failed to fetch from metadata.ens.domains API");
  } catch (error) {
    console.error("Error fetching from metadata.ens.domains API:", error);
    return null;
  }
};

export const Avatar = ({ ensName, address, size }: BlockieAvatarProps) => {
  const [ensAvatarUrl, setEnsAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!ensName) {
        return;
      }
      const avatarUrl = await fetchEnsAvatar(ensName);
      setEnsAvatarUrl(avatarUrl);
    };

    fetchAvatar();
  }, [ensName]);

  return (
    <div className={`overflow-hidden rounded-full w-[${size}px] h-[${size}px]`}>
      <Image
        src={ensAvatarUrl || blo(address)}
        alt={`Ens avatar`}
        width={size}
        height={size}
        className="rounded-full object-cover min-h-full min-w-full"
      />
    </div>
  );
};
