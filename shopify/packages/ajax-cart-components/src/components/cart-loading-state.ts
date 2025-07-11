import type { CorrectComponentType } from "@brytdesigns/web-component-core/utils";

import { Show, createMemo } from "solid-js";

import { getTemplateContent } from "../utils/index.js";
import html from "solid-js/html";

import AjaxCart from "@brytdesigns/shopify-ajax-cart";

type Status = (typeof AjaxCart)["status"];

type CartLoadingStateProps = {
  ignoredStates: Array<Status>;
};

export const Name = "cart-loading-state";

export const Component: CorrectComponentType<CartLoadingStateProps> = (
  props,
  { element },
) => {
  const cart = AjaxCart;

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

  element.replaceChildren(...[]);

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
