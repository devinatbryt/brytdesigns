import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import {
  type ValidHybridPath,
  useFormattedValue,
  useFullPropertyPath,
} from "../hooks/index.js";
import { type Format, getTargetElement } from "../utils/index.js";
import { createEffect, on, onCleanup } from "solid-js";

type CartDataInjectionProps = {
  propertyName: ValidHybridPath;
  format?: Format;
  target: string;
  attributeName: string;
  injectionType: "attribute" | "property" | "template";
};

const VALID_INJECTION_TYPES = ["attribute", "property", "template"];

export const CartDataInjection: CorrectComponentType<CartDataInjectionProps> = (
  props,
  { element },
) => {
  if (!props.propertyName)
    return console.warn("cart-data-injection: No path attribute provided.");
  if (!props.target)
    return console.warn("cart-data-injection: No target attribute found!");
  if (!props.attributeName)
    return console.warn(
      "cart-data-injection: No attribute-name attribute found!",
    );

  if (
    !props.injectionType ||
    (props.injectionType &&
      !VALID_INJECTION_TYPES.includes(props.injectionType))
  )
    return console.warn(
      "cart-data-injection: Invalid injection-type attribute provided.",
    );

  const mergedProps = {
    element,
    path: () => props.propertyName,
  };
  const fullPath = useFullPropertyPath(mergedProps);
  const value = useFormattedValue({
    path: fullPath,
    element,
    get format() {
      return props.format;
    },
  });

  createEffect(
    on(
      () => {
        return {
          target: getTargetElement(element, props.target),
          value: value(),
          attributeName: props.attributeName,
          injectionType: props.injectionType,
          propertyName: props.propertyName,
        };
      },
      ({ target, value, attributeName, injectionType, propertyName }) => {
        if (!target)
          return console.warn(
            `cart-data-injection: Unable to find element with selector of: ${props.target}`,
          );

        if (injectionType === "attribute" && value) {
          target.setAttribute(attributeName, value);
          return;
        }

        if (injectionType === "property" && value) {
          //@ts-ignore
          target[attributeName] = value;
          return;
        }

        if (injectionType === "template" && value) {
          if (attributeName === "style") {
            //@ts-ignore
            const styleTmpl = target[attributeName].cssText;
            setTimeout(() => {
              //@ts-ignore
              target[attributeName].cssText = styleTmpl.replace(
                //@ts-ignore
                `{${propertyName}}`,
                value,
              );
            });
            return onCleanup(() => {
              //@ts-ignore
              target[attributeName].cssText = styleTmpl;
            });
          }
          const tmpValue = target.getAttribute(attributeName);
          if (!tmpValue || !value)
            return console.warn("Unable to inject value into template");
          setTimeout(() => {
            target.setAttribute(
              attributeName,

              tmpValue.replace(`{${propertyName}}`, value),
            );
          });
          return onCleanup(() => {
            target.setAttribute(attributeName, tmpValue);
          });
        }
      },
    ),
  );
};
