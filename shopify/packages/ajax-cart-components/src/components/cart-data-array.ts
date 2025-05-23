import type { CorrectComponentType } from "@brytdesigns/web-component-utils";
import { getTemplateContent, type Format } from "../utils/index.js";

import { Show, For, type Accessor } from "solid-js";

import {
  type ValidAjaxPath,
  useFullPropertyPath,
  useCartValue,
  provideFullPropertyPathContext,
} from "../hooks/index.js";
import html from "solid-js/html";

type CartDataArrayProps = {
  arrayPath: ValidAjaxPath;
  format?: Format;
};

export const CartDataArray: CorrectComponentType<CartDataArrayProps> = (
  props,
  { element },
) => {
  const itemTemplate = getTemplateContent(element, "item");
  if (!itemTemplate)
    return console.warn(
      "cart-data-array: No template found with a property of 'item'.",
    );
  if (!props.arrayPath)
    return console.warn("cart-data-array: No array path provided.");
  const mergedProps = {
    element,
    path: () => props.arrayPath,
  };
  const fullPath = useFullPropertyPath(mergedProps);
  provideFullPropertyPathContext({
    element,
    path: fullPath,
  });

  const value = useCartValue({
    element,
    path: fullPath,
  });

  const arrayValue = () => {
    const v = value();

    if (!v) {
      console.warn(
        `cart-data-array: value is null or undefined at path ${fullPath()}`,
      );
      return null;
    }

    if (!Array.isArray(v)) {
      console.warn(
        `cart-data-array: value is not an array at path ${fullPath()}`,
      );
      return null;
    }

    return v;
  };

  element.replaceChildren(...[]);

  return html`
    <${Show} when=${() => arrayValue() && arrayValue()!.length > 0}>
      <${For} each=${arrayValue}>
        ${(_: any, idx: Accessor<number>) => html`
          <cart-data-array-item item-index=${() => `${idx()}`}>
            ${() => Array.from(itemTemplate.cloneNode(true).childNodes)}
          </cart-data-array-item>
        `}
      <//>
    <//>
  `;
};
