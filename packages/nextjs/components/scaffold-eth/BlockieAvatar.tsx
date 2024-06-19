/* eslint-disable @next/next/no-img-element */
import { blo } from "blo";
import { Address } from "viem";

interface BlockieAvatarProps {
  address: Address;
  ensImage?: string | null;
  size: number;
}

export const BlockieAvatar = ({ address, ensImage, size }: BlockieAvatarProps) => (
  <div
    style={{
      height: `${size}px`,
      width: `${size}px`,
    }}
    className="overflow-hidden rounded-full bg-gray-100 flex items-center justify-center"
  >
    <img
      className="object-cover min-w-full min-h-full"
      src={ensImage || blo(address as `0x${string}`)}
      alt={`${address} avatar`}
    />
  </div>
);
