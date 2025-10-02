import { ChevronDown, ChevronUp } from "lucide-react";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { Input } from "./input";

export interface NumberInputProps
  extends Omit<NumericFormatProps, "value" | "onValueChange"> {
  stepper?: number;
  thousandSeparator?: string;
  placeholder?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  value?: number;
  prefix?: string;
  suffix?: string;
  onValueChange?: (value: number | undefined) => void;
  fixedDecimalScale?: boolean;
  decimalScale?: number;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      stepper = 1,
      thousandSeparator,
      placeholder,
      defaultValue,
      min = -Infinity,
      max = Infinity,
      onValueChange,
      fixedDecimalScale = false,
      decimalScale = 0,
      prefix,
      suffix,
      value: controlledValue,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState<string>(
      controlledValue !== undefined
        ? controlledValue.toString()
        : (defaultValue?.toString() ?? "")
    );

    // sync controlled value
    useEffect(() => {
      if (controlledValue !== undefined) {
        setInputValue(controlledValue.toString());
      }
    }, [controlledValue]);

    const emitValue = useCallback(
      (val?: number) => {
        if (onValueChange) onValueChange(val);
      },
      [onValueChange]
    );

    const handleIncrement = useCallback(() => {
      const current = parseFloat(inputValue) || 0;
      const next = Math.min(current + stepper, max);
      setInputValue(next.toString());
      emitValue(next);
    }, [inputValue, stepper, max, emitValue]);

    const handleDecrement = useCallback(() => {
      const current = parseFloat(inputValue) || 0;
      const next = Math.max(current - stepper, min);
      setInputValue(next.toString());
      emitValue(next);
    }, [inputValue, stepper, min, emitValue]);

    // FIX: handle empty input correctly
    const handleChange = useCallback(
      (vals: { value: string; floatValue: number | undefined }) => {
        if (vals.value === "") {
          setInputValue("");
          emitValue(undefined);
        } else {
          setInputValue(vals.value);
          emitValue(vals.floatValue ?? undefined);
        }
      },
      [emitValue]
    );

    const handleBlur = useCallback(() => {
      if (inputValue === "") {
        emitValue(undefined);
        return;
      }
      const num = parseFloat(inputValue);
      if (!isNaN(num)) {
        const clamped = Math.min(Math.max(num, min), max);
        setInputValue(clamped.toString());
        emitValue(clamped);
      } else {
        setInputValue("");
        emitValue(undefined);
      }
    }, [inputValue, min, max, emitValue]);

    return (
      <div className="flex items-center">
        <NumericFormat
          value={inputValue}
          onValueChange={handleChange} // <- used here
          thousandSeparator={thousandSeparator}
          decimalScale={decimalScale}
          fixedDecimalScale={fixedDecimalScale}
          allowNegative={min < 0}
          allowLeadingZeros
          prefix={prefix}
          suffix={suffix}
          customInput={Input}
          placeholder={placeholder}
          onBlur={handleBlur} // <- used here
          getInputRef={ref}
          {...props}
        />
        <div className="flex flex-col rounded-lg border-1">
          <button
            type="button"
            onClick={handleIncrement}
            className="px-2 py-1 transition-colors hover:bg-accent rounded-t-lg"
          >
            <ChevronUp size={16} />
          </button>
          <button
            type="button"
            onClick={handleDecrement}
            className="px-2 py-1 transition-colors hover:bg-accent rounded-b-lg"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    );
  }
);
