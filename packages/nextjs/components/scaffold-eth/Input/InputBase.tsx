import React, { ChangeEvent, ReactNode, forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { CommonInputProps } from "~~/components/scaffold-eth";

type InputBaseProps<T> = CommonInputProps<T> & {
  error?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  autoFocus?: boolean;
};

export const InputBase = forwardRef<HTMLInputElement, InputBaseProps<any>>(
  ({ name, value, onChange, placeholder, error, disabled, prefix, suffix, autoFocus }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    useEffect(() => {
      if (autoFocus && internalRef.current) {
        internalRef.current.focus();
      }
    }, [autoFocus]);

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value as unknown as typeof value);
      },
      [onChange],
    );

    return (
      <div
        className={`flex border-2 border-base-300 bg-base-200 rounded-full text-accent ${
          error ? "border-error" : disabled ? "border-disabled bg-base-300" : ""
        }`}
      >
        {prefix}
        <input
          ref={internalRef} // Use the internal ref here
          className="input input-ghost h-[2.2rem] min-h-[2.2rem] w-full border px-4 pr-16 pb-0.5 font-medium text-gray-400 placeholder:text-accent/50 focus:bg-transparent focus:text-gray-400 focus:outline-none"
          placeholder={placeholder}
          name={name}
          value={value?.toString()}
          onChange={handleChange}
          disabled={disabled}
          autoComplete="off"
        />
        {suffix}
      </div>
    );
  },
);

InputBase.displayName = "InputBase";
