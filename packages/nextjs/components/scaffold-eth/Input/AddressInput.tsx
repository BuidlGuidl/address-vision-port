import { forwardRef } from "react";
import { blo } from "blo";
import { Address } from "viem";
import { CommonInputProps, InputBase } from "~~/components/scaffold-eth";
import { useAddressStore } from "~~/services/store/store";

/**
 * Address input with ENS name resolution
 */
export const AddressInput = forwardRef<HTMLInputElement, CommonInputProps<Address | string>>(
  ({ value, name, placeholder, onChange }, ref) => {
    const { resolvedAddress: address } = useAddressStore();

    return (
      <InputBase
        autoFocus={true}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        ref={ref}
        suffix={
          address && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt=""
              className="!rounded-full absolute right-0"
              src={blo(address as `0x${string}`)}
              width="35"
              height="35"
            />
          )
        }
      />
    );
  },
);
AddressInput.displayName = "AddressInput";
