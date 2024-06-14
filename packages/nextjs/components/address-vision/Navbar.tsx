import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { Address, isAddress } from "viem";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { QrCodeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { AddressInput } from "~~/components/scaffold-eth";

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

interface NavbarProps {
  searchedAddress: Address | "";
  setSearchedAddress: React.Dispatch<React.SetStateAction<Address | "">>;
}

export const Navbar = ({ searchedAddress, setSearchedAddress }: NavbarProps) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null); // Step 1: Creating a ref

  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue(searchedAddress);
  }, [searchedAddress]);

  useEffect(() => {
    let trimmedAddress = inputValue.trim();
    if (trimmedAddress.startsWith("eth:")) {
      trimmedAddress = trimmedAddress.slice(4);
    } else if (trimmedAddress.startsWith("oeth:")) {
      trimmedAddress = trimmedAddress.slice(5);
    }
    if (isAddress(trimmedAddress)) {
      setSearchedAddress(trimmedAddress);
    }
    if (trimmedAddress.endsWith(".eth")) {
      router.push(`/${trimmedAddress}`, undefined, { shallow: true });
    } else if (isAddress(trimmedAddress)) {
      async function getEnsName(address: Address) {
        const ensName = await client.getEnsName({ address });
        router.push(`/${ensName || address}`, undefined, { shallow: true });
      }
      getEnsName(trimmedAddress);
    }
  }, [inputValue]);

  const handleLogoClick = () => {
    setSearchedAddress("");
    setInputValue("");
    router.push("/", undefined, { shallow: true });
  };

  const handleDecode = (result: string) => {
    setInputValue(result);
    setIsScannerVisible(false);
  };

  const clearInput = () => {
    setInputValue("");
    setSearchedAddress("");
    inputRef.current?.focus(); // Step 3: Focus the input when clearing it
  };

  const openScanner = () => {
    setIsScannerVisible(true);
  };

  const closeScanner = () => {
    setIsScannerVisible(false);
  };

  return (
    <div className="navbar flex-col md:flex-row justify-center">
      <div className="md:absolute left-6">
        <div onClick={handleLogoClick} className="cursor-pointer text-4xl">
          👀
        </div>
        <h1 onClick={handleLogoClick} className="ml-2 mb-0 cursor-pointer text-2xl font-bold">
          address.vision
        </h1>
      </div>
      <div className="w-11/12 md:w-1/2">
        <div className="flex-grow relative">
          <AddressInput
            placeholder="Enter an Ethereum address or ENS name to get started"
            value={inputValue}
            onChange={setInputValue}
            ref={inputRef}
          />
          {inputValue && (
            <button onClick={clearInput} className={`absolute right-20 top-1/2 transform -translate-y-1/2 py-1`}>
              <XMarkIcon className="h-6 w-6 bg-base-200 bg-opacity-60 rounded-full hover:text-red-500" />
            </button>
          )}
          <button
            onClick={openScanner}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 ${
              inputValue !== "" ? "mr-8" : ""
            }`}
          >
            <div>
              <QrCodeIcon className="h-6 w-6 bg-base-200" />
              <div className="absolute bottom-0 right-8  left-0 h-8 bg-gradient-to-r from-transparent to-base-200"></div>
            </div>
          </button>

          {isScannerVisible && (
            <dialog open className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Scan a QR Code</h3>
                <QrScanner
                  onDecode={handleDecode}
                  onError={error => console.log("QR code read error:", error?.message)} // @todo handle error better
                />
                <div className="modal-action">
                  <button className="btn" onClick={closeScanner}>
                    Close
                  </button>
                </div>
              </div>
            </dialog>
          )}
        </div>
      </div>
    </div>
  );
};
