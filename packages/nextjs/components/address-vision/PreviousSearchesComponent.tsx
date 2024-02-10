import { AddressCard } from "./AddressCard";

interface PreviousSearchesProps {
  previousAddresses: string[];
  removeAddress: (address: string) => void;
}

export const PreviousSearchesComponent = ({ previousAddresses, removeAddress }: PreviousSearchesProps) => {
  const gridHeightClass = previousAddresses.length > 8 ? "md:h-[330px]" : "md:h-[220px]";

  return (
    <div className="relative flex flex-grow flex-col items-center top-10">
      <h2 className="text-3xl mb-4">Previous Searches</h2>
      <div className="relative">
        <div
          className={`pb-12 px-8 grid grid-cols-1 h-[500px] md:grid-cols-3 lg:grid-cols-4 gap-4 ${gridHeightClass} overflow-y-scroll`}
        >
          {previousAddresses.map(address => (
            <AddressCard
              key={address}
              address={address}
              isSmallCard={true}
              removeAddress={() => removeAddress(address)}
            />
          ))}
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-base-200"></div>
      </div>
    </div>
  );
};
