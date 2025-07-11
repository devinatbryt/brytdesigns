import type { CorrectComponentType } from "@brytdesigns/web-component-core/utils";
import { type Format } from "../utils/index.js";

import { Show } from "solid-js";

import {
  type ValidAjaxPath,
  useFullPropertyPath,
  useFormattedValue,
} from "../hooks/index.js";
import html from "solid-js/html";

type CartDataProps = {
  propertyName: ValidAjaxPath;
  format?: Format;
};

export const Name = "cart-data";

export const Component: CorrectComponentType<CartDataProps> = (
  props,
  { element },
) => {
  if (!props.propertyName)
    return console.warn(`${Name}: No property-name attribute provided.`);
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
