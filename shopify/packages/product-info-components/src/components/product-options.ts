import type { CorrectComponentType } from "@brytdesigns/web-component-core/utils";
import { provideProductOptionsContext } from "../hooks/index.js";

type Props = {
  selectedOptions: string[];
};

export const Name = `product-options`;

export const Component: CorrectComponentType<Props> = (props, { element }) => {
  if (!props.selectedOptions)
    return console.warn(`${Name}: selected-options attribute is required`);
  provideProductOptionsContext(props, element);
};
