/* eslint-disable @next/next/no-img-element */
import { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";
import { blo } from "blo";
import { Address, createPublicClient, formatEther, http, isAddress } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export const config = {
  runtime: "edge",
};

async function resolveEnsToAddress(ens: string): Promise<Address | undefined> {
  try {
    const address = await publicClient.getEnsAddress({ name: normalize(ens) });
    return address || undefined;
  } catch (error) {
    console.error("Error resolving ENS to address:", error);
    return undefined;
  }
}

async function getEnsNameForAddress(address: Address | undefined): Promise<string | undefined> {
  if (!address) return undefined;
  try {
    const ensName = await publicClient.getEnsName({ address });
    return ensName || undefined;
  } catch (error) {
    console.error("Error fetching ENS name for address:", error);
    return undefined;
  }
}

async function getBalance(address: Address | undefined): Promise<bigint> {
  if (!address) return 0n;
  try {
    const balance = await publicClient.getBalance({ address });
    return balance;
  } catch (error) {
    console.error("Error fetching balance for address:", error);
    return 0n;
  }
}

async function getEnsAvatar(ensName: string) {
  const url = `https://metadata.ens.domains/mainnet/avatar/${ensName}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch ENS avatar");
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.startsWith("image")) {
      return url;
    } else {
      const data = await response.json();
      if (data.message === "There is no avatar set under given address") {
        throw new Error("No ENS avatar");
      }
      return url;
    }
  } catch (error) {
    console.error("Error fetching ENS avatar:", error);
    return undefined;
  }
}

export default async function handler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    if (!searchParams.has("addyOrEns")) {
      return new Response("Missing 'addyOrEns' query parameter", { status: 400 });
    }
    const addyOrEns = searchParams.get("addyOrEns")?.slice(0, 100) || "blank";

    let address: string | undefined = addyOrEns;
    let ensName: string | undefined;
    let balance = 0n;
    let avatarUrl: string | undefined;

    if (/\..+$/.test(addyOrEns)) {
      address = await resolveEnsToAddress(addyOrEns);
      if (address) {
        ensName = await getEnsNameForAddress(address as Address);
        balance = await getBalance(address as Address);
        avatarUrl = await getEnsAvatar(ensName as string);
      }
    } else if (isAddress(addyOrEns)) {
      ensName = await getEnsNameForAddress(addyOrEns);
      balance = await getBalance(addyOrEns);
      avatarUrl = await getEnsAvatar(ensName || addyOrEns);
    }

    if (!avatarUrl) {
      avatarUrl = blo(address as `0x${string}`);
    }

    const formattedTitle = ensName || (address ? `${address.slice(0, 6)}...${address.slice(-5)}` : "Unknown");
    const displayAddressSearchBar = addyOrEns?.slice(0, 13) + "..." + addyOrEns?.slice(-12);

    return new ImageResponse(
      (
        <div style={{ display: "flex" }} tw="w-full h-full">
          <div style={{ display: "flex" }} tw="flex-col flex-grow">
            <div style={{ display: "flex" }} tw="max-h-[125px] font-bold bg-white p-4 pt-6 items-center flex-grow">
              <strong tw="text-6xl">👀 address.vision</strong>
              <div tw="ml-12 text-4xl bg-blue-50 p-4 px-6 rounded-full border border-slate-300 ">
                {ensName || displayAddressSearchBar}
              </div>
            </div>
            <div tw="flex bg-blue-50 flex-grow justify-between pt-6 pl-10">
              <div tw="flex flex-col">
                <div tw="flex">
                  <div tw="bg-white text-4xl m-8 p-8 h-[400px] rounded-16 shadow-2xl flex items-center justify-between ">
                    <img
                      src={avatarUrl}
                      width={200}
                      height={200}
                      tw="rounded-full"
                      style={{
                        objectFit: "cover",
                        height: `200px`,
                        width: `200px`,
                      }}
                      alt="ENS Avatar"
                    />
                    <div tw="flex flex-col ml-8">
                      <strong>{ensName || formattedTitle}</strong>
                      <span tw="mt-2">Balance: {Number(formatEther(balance)).toFixed(4)} ETH</span>
                    </div>
                  </div>
                  <div tw="bg-white text-4xl m-8 ml-0 p-8 h-[400px] rounded-16 shadow-2xl flex items-center justify-between ">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=330x330&data=${address || addyOrEns}`}
                      width={330}
                      height={330}
                      alt="QR Code"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
