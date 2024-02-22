import { useEffect, useState } from "react";
import Image from "next/image";
import { useNetworkBalancesStore } from "~~/services/store/store";
import { NETWORKS_EXTRA_DATA } from "~~/utils/scaffold-eth";

export const TotalBalanceCard = () => {
  const { balances, getTotalBalance } = useNetworkBalancesStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Object.keys(balances).length > 4) {
      setIsLoading(false);
    }
  }, [balances]);

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(number);
  };

  return (
    <div className="card w-[370px] md:w-[425px] shadow-xl flex-grow bg-base-100">
      <div className="card-body">
        <div className="p-6 mb-4 border rounded-box text-center bg-secondary">
          <h2 className="text-md lg:text-xl font-normal mb-2">Total Balance (all Networks)</h2>
          <p className="text-lg font-medium m-0">{isLoading ? "Loading..." : `$${formatNumber(getTotalBalance())}`}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(balances)
            .filter(([, balance]) => balance.balance > 0)
            .map(([network, balance]) => (
              <div key={network} className="py-3 pl-2 border rounded-box text-left bg-base-100">
                <div className="flex items-center">
                  <Image
                    src={NETWORKS_EXTRA_DATA[balance.networkId]?.icon || "/unknown-network.svg"}
                    alt={`${network} icon`}
                    width={16}
                    height={16}
                  />{" "}
                  <span className="font-light text-xs ml-2">{network}</span>
                </div>
                <span className="block mt-2 text-sm">${formatNumber(balance.balance)}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
