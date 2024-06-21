import { forwardRef } from "react";
import { blo } from "blo";
import { Address } from "viem";
import { CommonInputProps, InputBase } from "~~/components/scaffold-eth";

// ToDo:  move this function to an utility file

/**
 * Address input with ENS name resolution
 */
export const AddressInput = forwardRef<HTMLInputElement, CommonInputProps<Address | string>>(
  ({ value, name, placeholder, onChange }, ref) => {
    return (
      <InputBase
        autoFocus={true}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        ref={ref}
        suffix={
          // Don't want to use nextJS Image here (and adding remote patterns for the URL)
          // eslint-disable-next-line @next/next/no-img-element
          value && <img alt="" className="!rounded-full" src={blo(value as `0x${string}`)} width="35" height="35" />
        }
      />
    );
  },
);
AddressInput.displayName = "AddressInput";
