/* eslint-disable jsx-a11y/alt-text */

/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { blo } from "blo";
import { Address } from "viem";
import { createPublicClient, http } from "viem";
import { arbitrum, base, mainnet, optimism, polygon } from "viem/chains";

const clients = {
  mainnet: createPublicClient({ chain: mainnet, transport: http() }),
  arbitrum: createPublicClient({ chain: arbitrum, transport: http() }),
  base: createPublicClient({ chain: base, transport: http() }),
  optimism: createPublicClient({ chain: optimism, transport: http() }),
  polygon: createPublicClient({ chain: polygon, transport: http() }),
};

export const config = {
  runtime: "edge",
};

const isAddress = (address: string) => {
  return /^(0x)?[0-9a-f]{40}$/i.test(address);
};

async function getChainBalances(address: Address) {
  const balances = await Promise.all(
    Object.entries(clients).map(async ([chain, client]) => {
      const balance = await client.getBalance({ address: address });
      return { chain, balance };
    }),
  );
  return balances.filter(({ balance }) => balance > 0n);
}

export default async function handler(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const addyOrEns = searchParams.get("addyOrEns")?.slice(0, 100) || "blank";
  const isAddressValid = isAddress(addyOrEns as string);
  const isEnsValid = /\.(eth|xyz)$/.test(addyOrEns as string);

  if (!isAddressValid && !isEnsValid) {
    return new Response("Invalid address or ENS", { status: 400 });
  }

  const response = await fetch(`https://api.ensdata.net/${addyOrEns}`);

  const data = await response.json();
  const resolvedEnsName = data.ens;
  const resolvedAddress = data.address;
  const avatarUrl = data.avatar_small || blo(resolvedAddress || (addyOrEns as Address));

  const croppedAddresses = `${addyOrEns.slice(0, 6)}...${addyOrEns.slice(-4)}`;
  const displayName = resolvedEnsName || croppedAddresses || addyOrEns;

  const balances = await getChainBalances(resolvedAddress || addyOrEns);
  const chainLogos = balances.map(
    ({ chain }) => `https://address-vision-port-5rnzsr6v1-buidlguidldao.vercel.app/${chain}.svg`,
  );

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full bg-blue-100">
        <div tw="flex flex-grow items-center justify-center">
          <div tw="flex flex-col items-center">
            <img src={avatarUrl} width="300" height="300" tw="rounded-full mb-8" style={{ objectFit: "cover" }} />
            <div tw="text-8xl font-bold text-center mb-4">{displayName}</div>
          </div>
        </div>
        <div tw="flex items-center justify-center">
          {chainLogos.map((logo, index) => (
            <img key={index} src={logo} width="36" height="36" tw="ml-2" />
          ))}
        </div>
        <div tw="flex items-center justify-center pb-2">
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.52777 7C4.83335 7 1.02777 10.8056 1.02777 15.5V22.5C1.02777 27.1944 4.83335 31 9.52777 31C12.1363 31 14.4695 29.8246 16.0278 27.9773C17.5861 29.8246 19.9193 31 22.5278 31C27.2222 31 31.0278 27.1944 31.0278 22.5V15.5C31.0278 10.8056 27.2222 7 22.5278 7C19.9193 7 17.5861 8.17537 16.0278 10.0227C14.4695 8.17537 12.1363 7 9.52777 7Z"
              fill="#9B9B9B"
            />
            <path
              d="M9.52777 8C5.38564 8 2.02777 11.3579 2.02777 15.5V22.5C2.02777 26.6421 5.38564 30 9.52777 30C12.3062 30 14.7318 28.4891 16.0278 26.2442C17.3237 28.4891 19.7493 30 22.5278 30C26.6699 30 30.0278 26.6421 30.0278 22.5V15.5C30.0278 11.3579 26.6699 8 22.5278 8C19.7493 8 17.3237 9.51086 16.0278 11.7558C14.7318 9.51086 12.3062 8 9.52777 8Z"
              fill="white"
            />
            <path
              d="M15.0278 15.5C15.0278 14.1363 15.3917 12.8577 16.0278 11.7558C15.1755 10.2794 13.8345 9.12044 12.226 8.5H12.059C13.1528 9.15625 13.9965 11.75 13.9965 13V25.125C13.9965 26.4997 13.8403 28.2181 12.06 29.5618C13.7422 28.9585 15.1463 27.7711 16.0278 26.2442C15.3917 25.1423 15.0278 23.8637 15.0278 22.5V15.5Z"
              fill="#D3D3D3"
            />
            <path
              d="M30.0278 15.5C30.0278 12.309 28.035 9.58346 25.226 8.5H25.059C26.7153 9.59375 27.9653 11.5625 27.9653 13.0312V25C27.9653 26.3747 26.8407 28.2181 25.06 29.5618C27.9561 28.5231 30.0278 25.7535 30.0278 22.5V15.5Z"
              fill="#D3D3D3"
            />
            <path
              d="M6.59027 13C4.65727 13 3.09027 14.567 3.09027 16.5V21.5C3.09027 23.433 4.65727 25 6.59027 25C8.52327 25 10.0903 23.433 10.0903 21.5V16.5C10.0903 14.567 8.52327 13 6.59027 13Z"
              fill="#321B41"
            />
            <path
              d="M19.5278 13C17.5948 13 16.0278 14.567 16.0278 16.5V21.5C16.0278 23.433 17.5948 25 19.5278 25C21.4608 25 23.0278 23.433 23.0278 21.5V16.5C23.0278 14.567 21.4608 13 19.5278 13Z"
              fill="#321B41"
            />
            <path
              d="M8.76628 16.861C9.13773 16.5518 9.12055 15.9188 8.7279 15.4471C8.33525 14.9754 7.71583 14.8437 7.34438 15.1528C6.97294 15.462 6.99012 16.0951 7.38277 16.5668C7.77541 17.0385 8.39483 17.1702 8.76628 16.861Z"
              fill="#F4F4F4"
            />
            <path
              d="M21.7629 16.861C22.1343 16.5518 22.1171 15.9188 21.7245 15.4471C21.3318 14.9754 20.7124 14.8437 20.341 15.1528C19.9695 15.462 19.9867 16.0951 20.3793 16.5668C20.772 17.0385 21.3914 17.1702 21.7629 16.861Z"
              fill="#F4F4F4"
            />
          </svg>
          <div tw="text-2xl ml-4">address.vision</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "cache-control": "max-age=86400",
      },
    },
  );
}
