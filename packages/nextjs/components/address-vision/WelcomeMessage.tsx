import { Address } from "viem";

export const WelcomeMessage = ({ previousAddresses }: { previousAddresses: Address[] }) => (
  <div
    className={`relative flex flex-grow flex-col items-center ${
      previousAddresses.length > 0 ? "xl:justify-start" : "justify-center"
    }`}
  >
    <div className="mb-4 text-9xl">👀</div>
    <h1 className="mb-4 text-center text-4xl font-bold">Welcome to address.vision!</h1>
    <p className="mb-4 text-center text-xl">
      To get started, enter an Ethereum address or ENS name in the search bar above.
    </p>
  </div>
);
