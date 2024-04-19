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

const getBalance = async (address: string) => {
  const balance = await publicClient.getBalance({
    address: address,
  });
  return balance;
};

const resolveEnsToAddress = async (ens: string): Promise<string | undefined> => {
  try {
    const ensAddress = await publicClient.getEnsAddress({
      name: normalize(ens),
    });
    return ensAddress || undefined; // Change null to undefined if necessary
  } catch (error) {
    console.error("Error resolving ENS to address:", error);
    return undefined; // Ensure all error paths return undefined or a valid string
  }
};

const getEnsNameForAddress = async (address: string) => {
  const ensName = await publicClient.getEnsName({
    address: address,
  });
  return ensName;
};

export default async function handler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // ?title=<title>
    const hasTitle = searchParams.has("title");
    const title = hasTitle ? searchParams.get("title")?.slice(0, 100) : "My default title";
    let resolvedEns = title;
    let displayEns: string | null = null;
    let balance = 0n;

    if (/\.eth$/.test(title as string)) {
      resolvedEns = await resolveEnsToAddress(title as string);
    } else if (isAddress(title as string)) {
      displayEns = await getEnsNameForAddress(title as string);
    }

    balance = await getBalance((resolvedEns as string) || (title as string));

    const imageSrc = `https://metadata.ens.domains/mainnet/avatar/${displayEns || title}`;

    let displayAddress = title;
    let displayAddressSearchBar = title;

    if (!/\.eth$/.test(title as string)) {
      displayAddress = title?.slice(0, 6) + "..." + title?.slice(-5);
      displayAddressSearchBar = title?.slice(0, 15) + "..." + title?.slice(-14);
    }

    return new ImageResponse(
      (
        <div style={{ display: "flex" }} tw="w-full h-full">
          <div style={{ display: "flex" }} tw="flex-col flex-grow">
            <div style={{ display: "flex" }} tw="max-h-[125px] bg-white p-4 pt-6 items-center flex-grow ">
              <strong tw="text-5xl">👀 address.vision</strong>
              <div tw="ml-12 text-4xl bg-blue-50 p-4 px-6 rounded-full border border-slate-300 ">
                {displayEns || displayAddressSearchBar}
              </div>
            </div>
            <div tw="flex bg-blue-50 flex-grow justify-between pt-2 pl-10">
              <div tw="flex flex-col">
                <div tw="flex">
                  <div tw="bg-white text-4xl m-8 p-8 h-[400px] rounded-16 shadow-2xl flex items-center justify-between ">
                    <img
                      src={displayEns || title?.endsWith(".eth") ? imageSrc : blo(resolvedEns as `0x${string}`)}
                      width={200}
                      height={200}
                      tw="rounded-full "
                      style={{
                        objectFit: "cover",
                        height: `200px`,
                        width: `200px`,
                      }}
                    />
                    <div tw="flex flex-col ml-8">
                      <strong>{displayEns || displayAddress}</strong>
                      <span tw="mt-2">Balance: {Number(formatEther(balance)).toFixed(4)} ETH</span>
                    </div>
                  </div>
                  <div tw="bg-white text-4xl m-8 ml-0 p-8 h-[400px] rounded-16 shadow-2xl flex items-center justify-between ">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=330x330&data=${resolvedEns || title}`}
                      width={330}
                      height={330}
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
