import type { CorrectComponentType } from "@brytdesigns/web-component-utils";
import { type Format } from "../utils/index.js";

import { Show } from "solid-js";

import {
  type ValidHybridPath,
  useFullPropertyPath,
  useFormattedValue,
} from "../hooks/index.js";
import html from "solid-js/html";

type CartDataProps = {
  propertyName: ValidHybridPath;
  format?: Format;
};

export const CartData: CorrectComponentType<CartDataProps> = (
  props,
  { element },
) => {
  if (!props.propertyName)
    return console.warn("No path provided for cart-data component.");
  const fullPath = useFullPropertyPath({
    element,
    path: () => props.propertyName,
  });
  const formattedValue = useFormattedValue({
    get format() {
      return props.format;
    },
    path: fullPath,
    element,
  });

  return html`
    <${Show} when=${() => formattedValue() !== null}> ${formattedValue} <//>
  `;
};
