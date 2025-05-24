import type { CorrectComponentType } from "@brytdesigns/web-component-utils";
import { getTemplateContent, type Format } from "../utils/index.js";

import { createEffect, on, createMemo, mapArray } from "solid-js";

import {
  type ValidAjaxPath,
  useFullPropertyPath,
  useCartValue,
  provideFullPropertyPathContext,
} from "../hooks/index.js";

import { getTargetElement } from "../utils/index.js";

import html from "solid-js/html";

type CartDataArrayProps = {
  arrayPath: ValidAjaxPath;
  wrapInnerChild: boolean;
  target: string;
  format?: Format;
};

export const Name = "cart-data-array-injection";

export const Component: CorrectComponentType<CartDataArrayProps> = (
  props,
  { element },
) => {
  const itemTemplate = getTemplateContent(element, "item");
  if (!itemTemplate)
    return console.warn(
      `${Name}: No template found with a property of 'item'.`,
    );
  if (!props.arrayPath) return console.warn(`${Name}: No array path provided.`);
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
      console.warn(`${Name}: value is null or undefined at path ${fullPath()}`);
      return null;
    }

    if (!Array.isArray(v)) {
      console.warn(`${Name}: value is not an array at path ${fullPath()}`);
      return null;
    }

    return v;
  };

  const children = createMemo(
    mapArray(arrayValue, (item, idx) => {
      const itemNode = itemTemplate.cloneNode(true);
      const container = itemNode instanceof Element ? itemNode : null;
      if (props.wrapInnerChild && container) {
        const firstElement = container.firstElementChild;
        if (!firstElement) return null;
        const children = Array.from(firstElement.children);

        const wrapper = html`
          <cart-data-array-item item-index=${() => `${idx()}`}>
            ${() => Array.from(children)}
          </cart-data-array-item>
        `;
        firstElement.replaceChildren(
          Array.isArray(wrapper) ? wrapper.at(0)! : wrapper,
        );

        return firstElement;
      }
    }),
  );

  createEffect(
    on(
      () => {
        const rootElement = element;
        return {
          target: getTargetElement(rootElement, props.target),
          children: children(),
        };
      },
      ({ children, target }) => {
        if (!target) return;
        const filteredChildren = children.filter(
          (v) => v !== null && v !== undefined,
        );
        target.replaceChildren(...filteredChildren);
      },
    ),
  );
};
