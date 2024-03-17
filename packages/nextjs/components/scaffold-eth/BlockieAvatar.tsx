/* eslint-disable @next/next/no-img-element */
import { AvatarComponent } from "@rainbow-me/rainbowkit";
import { blo } from "blo";

export const BlockieAvatar: AvatarComponent = ({ address, ensImage, size }) => (
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
