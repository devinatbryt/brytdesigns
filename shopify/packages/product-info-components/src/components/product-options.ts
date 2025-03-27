import type { CorrectComponentType } from "@brytdesigns/web-component-utils";
import { provideProductOptionsContext } from "../hooks/index.js";

type ProductOptionsProps = {
  selectedOptions: string[];
};

export const ProductOptions: CorrectComponentType<ProductOptionsProps> = (
  props,
  { element },
) => {
  if (!props.selectedOptions)
    return console.warn(
      "product-options: selected-options attribute is required",
    );
  provideProductOptionsContext(
    {
      get selectedOptions() {
        return props.selectedOptions;
      },
      element,
    },
    element,
  );
};
