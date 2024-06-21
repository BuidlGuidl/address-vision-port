import { useEffect, useState } from "react";
import Image from "next/image";
import { useNetworkBalancesStore } from "~~/services/store/store";
import { NETWORKS_EXTRA_DATA } from "~~/utils/scaffold-eth";

export const TotalBalanceCard = () => {
  const { balances, getTotalBalance } = useNetworkBalancesStore();
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    setIsDataLoading(Object.keys(balances).length <= 4);
  }, [balances]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(
      amount,
    );
  };

  const renderNetworkBalance = ([network, { balance, networkId }]: [
    string,
    { balance: number; networkId: number },
  ]) => (
    <div
      key={network}
      className="py-3 border rounded-box text-left bg-base-100 flex flex-col justify-center items-center"
    >
      <div className="flex items-center justify-center">
        <Image
          src={NETWORKS_EXTRA_DATA[networkId]?.icon || "/unknown-network.svg"}
          alt={`${network} icon`}
          width={16}
          height={16}
        />
        <span className="font-light text-xs ml-2">{network}</span>
      </div>
      <span className="block mt-2 text-sm text-center">{formatCurrency(balance)}</span>
    </div>
  );

  return (
    <div className="w-[370px] md:w-[425px] shadow-xl flex-grow bg-base-100 p-8 card">
      <div className="mb-6 flex justify-center items-baseline">
        <h2 className="text-md lg:text-xl font-normal mb-2">Total Balance:</h2>
        <p className="text-lg font-medium m-0 ml-2">
          {isDataLoading ? "Loading..." : formatCurrency(getTotalBalance())}
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {isDataLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="skeleton py-3 bg-slate-300 animate-pulse h-16 rounded-box"></div>
            ))
          : Object.entries(balances)
              .filter(([, { balance }]) => balance > 0)
              .sort(([, a], [, b]) => b.balance - a.balance)
              .map(renderNetworkBalance)}
      </div>
    </div>
  );
};
