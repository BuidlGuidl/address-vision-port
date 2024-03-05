import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { Address, isAddress } from "viem";
import { QrCodeIcon } from "@heroicons/react/24/outline";
import { AddressInput } from "~~/components/scaffold-eth";

interface NavbarProps {
  searchedAddress: Address;
  setSearchedAddress: React.Dispatch<React.SetStateAction<string>>;
}

export const Navbar = ({ searchedAddress, setSearchedAddress }: NavbarProps) => {
  const router = useRouter();

  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue(searchedAddress);
  }, [searchedAddress]);

  useEffect(() => {
    let trimmedAddress = inputValue;
    if (trimmedAddress.startsWith("eth:")) {
      trimmedAddress = trimmedAddress.slice(4);
    } else if (trimmedAddress.startsWith("oeth:")) {
      trimmedAddress = trimmedAddress.slice(5);
    }

    if (isAddress(trimmedAddress)) {
      setSearchedAddress(trimmedAddress);
    }
    if (inputValue.endsWith(".eth")) {
      router.push(`/${inputValue}`, undefined, { shallow: true });
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

  const openScanner = () => {
    setIsScannerVisible(true);
  };

  const closeScanner = () => {
    setIsScannerVisible(false);
  };

  return (
    <div className="navbar sticky top-0 z-20 grid min-h-0 flex-shrink-0 grid-cols-12 justify-between bg-base-100 px-0 shadow-md shadow-secondary sm:px-2 lg:static">
      <div className="col-start-4 flex flex-row items-center md:col-start-1 md:col-end-3">
        <div onClick={handleLogoClick} className="mb-4 cursor-pointer text-4xl">
          👀
        </div>
        <h1 onClick={handleLogoClick} className="ml-2 cursor-pointer text-2xl font-bold">
          address.vision
        </h1>
      </div>
      <div className="col-start-2 col-end-12 row-start-2 flex justify-center md:col-start-4 md:col-end-10 md:row-auto">
        <div className="flex-grow relative">
          <AddressInput
            placeholder="Enter an Ethereum address or ENS name to get started"
            value={inputValue}
            onChange={setInputValue}
          />
          <button
            onClick={openScanner}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 ${
              searchedAddress !== "" ? "mr-8" : ""
            }`}
          >
            <QrCodeIcon className="h-6 w-6" />
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
      <div className="col-start-11 col-end-13">{/* Additional content, perhaps history? */}</div>
    </div>
  );
};
