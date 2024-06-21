import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { AddressInput } from "../scaffold-eth";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { Address, isAddress } from "viem";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";
import { QrCodeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAddressStore, useNetworkBalancesStore } from "~~/services/store/store";
import { notification } from "~~/utils/scaffold-eth";

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export const Navbar = () => {
  const [inputValue, setInputValue] = useState("");
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [inputChanged, setInputChanged] = useState(false);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const { ensName, resolvedAddress, setEnsName, setResolvedAddress } = useAddressStore();
  const { resetBalances } = useNetworkBalancesStore();

  useEffect(() => {
    if (resolvedAddress && !inputChanged) {
      const savedAddresses = localStorage.getItem("searchedAddresses");
      const addresses = savedAddresses ? JSON.parse(savedAddresses) : [];
      if (!addresses.includes(resolvedAddress)) {
        addresses.unshift(resolvedAddress);
        localStorage.setItem("searchedAddresses", JSON.stringify(addresses));
      }
    }
  }, [resolvedAddress]);

  useEffect(() => {
    if (!inputChanged) {
      if (ensName) {
        setInputValue(ensName);
      } else if (resolvedAddress) {
        setInputValue(resolvedAddress);
      }
    }
  }, [ensName, resolvedAddress]);

  useEffect(() => {
    setEnsName("");
    let trimmedAddress = inputValue.trim();
    if (trimmedAddress.startsWith("eth:")) {
      trimmedAddress = trimmedAddress.slice(4);
    } else if (trimmedAddress.startsWith("oeth:")) {
      trimmedAddress = trimmedAddress.slice(5);
    }

    if (trimmedAddress.endsWith(".eth") || trimmedAddress.endsWith(".xyz")) {
      router.push(`/${trimmedAddress}`, undefined, { shallow: true });
      setEnsName(trimmedAddress);
      async function getEnsAddress(ensName: string) {
        const resolvedEnsName = await client.getEnsAddress({ name: normalize(ensName) });
        if (!resolvedEnsName) {
          notification.error("ENS name not found");
          resetState();
          router.push("/", undefined, { shallow: true });
          return;
        }
        setResolvedAddress(resolvedEnsName as Address);
        inputRef.current?.blur();
      }
      getEnsAddress(trimmedAddress);
    } else if (isAddress(trimmedAddress)) {
      setResolvedAddress(trimmedAddress);
      async function getEnsName(address: Address) {
        const ensName = await client.getEnsName({ address });
        router.push(`/${ensName || address}`, undefined, { shallow: true });
        setEnsName(ensName || "");
        inputRef.current?.blur();
      }
      getEnsName(trimmedAddress);
    }
  }, [inputValue]);

  const resetState = () => {
    router.push("/", undefined, { shallow: true });
    setInputValue("");
    setEnsName("");
    setResolvedAddress("");
    resetBalances();
  };

  const handleLogoClick = () => {
    resetState();
  };

  const handleDecode = (result: string) => {
    setInputValue(result);
    setIsScannerVisible(false);
  };

  const clearInput = () => {
    resetState();
    inputRef.current?.focus();
  };

  const openScanner = () => {
    setIsScannerVisible(true);
  };

  const closeScanner = () => {
    setIsScannerVisible(false);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setInputChanged(true);
  };

  return (
    <div className="navbar flex-col md:flex-row justify-center">
      <div className="md:absolute left-6 mb-2">
        <h1 onClick={handleLogoClick} className="ml-2 mb-0 cursor-pointer text-2xl font-bold">
          👀 address.vision
        </h1>
      </div>
      <div className="w-11/12 md:w-1/2">
        <div className="flex-grow relative">
          <AddressInput
            placeholder="Enter an Ethereum address or ENS name to get started"
            value={inputValue}
            onChange={handleInputChange}
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
