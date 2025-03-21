import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { Show, createMemo } from "solid-js";

import {
  type ValidHybridPath,
  useFullPropertyPath,
  useFormattedValue,
} from "../hooks/index.js";
import { getTemplateContent } from "../utils/index.js";
import html from "solid-js/html";
import HybridCart from "@brytdesigns/shopify-hybrid-cart";

type Status = (typeof HybridCart)["status"];

type CartLoadingStateProps = {
  ignoredStates: Array<Status>;
};

export const CartLoadingState: CorrectComponentType<CartLoadingStateProps> = (
  props,
  { element },
) => {
  const cart = HybridCart;

  const templates = {
    pending: getTemplateContent(element, "pending"),
    error: getTemplateContent(element, "error"),
    success: getTemplateContent(element, "success"),
  };

  let previousState: Status | null = null;

  const cartState = createMemo(() => {
    const state = cart?.status;
    if (!templates[state] || props.ignoredStates.includes(state))
      return previousState;
    previousState = state;
    return state;
  });

  return html`
    <${Show} when=${() => cart}>
      ${() => {
      const state = cartState();
      if (!state) return null;
      if (!templates[state]) return null;
      const children = Array.from(
        templates[state].cloneNode(true).childNodes,
      );
      return children;
    }}
    <//>
  `;
};
