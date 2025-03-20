import { type Accessor, createMemo } from "solid-js";
import { type ICustomElement } from "component-register";

import { type ValidHybridPath } from "./useFullPropertyPath.js";
import { formatValue, type Format } from "../utils/index.js";
import { useCartValue } from "./useCartValue.js";

type Options = {
  path: Accessor<ValidHybridPath>;
  format?: Format;
  element: HTMLElement & ICustomElement;
};

export function useFormattedValue(options: Options) {
  const value = useCartValue({ path: options.path, element: options.element });

  const formattedValue = createMemo(() => {
    const v = value();
    if (v === null) return null;
    if (
      typeof v === "string" ||
      typeof v === "number" ||
      typeof v === "boolean"
    ) {
      return formatValue(options.format || "", v);
    }
    console.warn(
      options.element,
      `useFormattedValue: Unsupported value type. Expected string, number, or boolean. Received: ${typeof v}.`,
      v,
    );
    return null;
  });

  return formattedValue;
}
