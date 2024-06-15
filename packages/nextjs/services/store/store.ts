import { Address } from "viem";
import create from "zustand";

/**
 * Zustand Store
 *
 * You can add global state to the app using this useGlobalState, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

type TGlobalState = {
  nativeCurrencyPrice: number;
  setNativeCurrencyPrice: (newNativeCurrencyPriceState: number) => void;
};

export const useGlobalState = create<TGlobalState>(set => ({
  nativeCurrencyPrice: 0,
  setNativeCurrencyPrice: (newValue: number): void => set(() => ({ nativeCurrencyPrice: newValue })),
}));

type NetworkBalancesState = {
  balances: Record<string, { balance: number; networkId: number }>;
  setBalance: (networkName: string, balance: number, networkId: number) => void;
  resetBalances: () => void;
  getTotalBalance: () => number;
};

export const useNetworkBalancesStore: () => NetworkBalancesState = create<NetworkBalancesState>((set, get) => ({
  balances: {},
  setBalance: (networkName: string, balance: number, networkId: number) =>
    set(state => ({
      balances: { ...state.balances, [networkName]: { balance, networkId } },
    })),
  resetBalances: () =>
    set(() => ({
      balances: {},
    })),
  getTotalBalance: () =>
    Object.values(get().balances).reduce(
      (acc: number, val: { balance: number; networkId: number }) => acc + val.balance,
      0,
    ),
}));

type AddressState = {
  ensName: string;
  resolvedAddress: Address | "";
  setEnsName: (ensName: string) => void;
  setResolvedAddress: (address: Address | "") => void;
};

export const useAddressStore = create<AddressState>(set => ({
  ensName: "",
  resolvedAddress: "",
  setEnsName: ensName => set({ ensName }),
  setResolvedAddress: address => set({ resolvedAddress: address }),
}));
