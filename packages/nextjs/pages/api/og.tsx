/* eslint-disable @next/next/no-img-element */
import { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";
import { blo } from "blo";
import { createPublicClient, formatEther, http, isAddress } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export const config = {
  runtime: "edge",
};

async function resolveEnsToAddress(ens: string): Promise<string | undefined> {
  try {
    const address = await publicClient.getEnsAddress({ name: normalize(ens) });
    return address || undefined;
  } catch (error) {
    console.error("Error resolving ENS to address:", error);
    return undefined;
  }
}

async function getEnsNameForAddress(address: string | undefined): Promise<string | undefined> {
  if (!address) return undefined;
  try {
    const ensName = await publicClient.getEnsName({ address });
    return ensName || undefined;
  } catch (error) {
    console.error("Error fetching ENS name for address:", error);
    return undefined;
  }
}

async function getBalance(address: string | undefined): Promise<bigint> {
  if (!address) return 0n;
  try {
    const balance = await publicClient.getBalance({ address });
    return balance;
  } catch (error) {
    console.error("Error fetching balance for address:", error);
    return 0n;
  }
}

export default async function handler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    if (!searchParams.has("title")) {
      return new Response("Missing 'title' query parameter", { status: 400 });
    }
    const title = searchParams.get("title")?.slice(0, 100) || "My default title";

    let address: string | undefined = title;
    let ensName: string | undefined;
    let balance = 0n;

    if (/\..+$/.test(title)) {
      address = await resolveEnsToAddress(title);
      if (address) {
        ensName = await getEnsNameForAddress(address);
        balance = await getBalance(address);
      }
    } else if (isAddress(title)) {
      ensName = await getEnsNameForAddress(title);
      balance = await getBalance(title);
    }

    const imageSrc = `https://metadata.ens.domains/mainnet/avatar/${ensName || title}`;

    const formattedTitle = ensName || (address ? `${address.slice(0, 6)}...${address.slice(-5)}` : "Unknown");
    const displayAddressSearchBar = title?.slice(0, 13) + "..." + title?.slice(-12);

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
                      src={ensName || title?.endsWith(".eth") ? imageSrc : blo(address as `0x${string}`)}
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
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=330x330&data=${address || title}`}
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
