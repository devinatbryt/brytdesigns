import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { createMemo } from "solid-js";

import { type Status, useListenerStatus } from "../hooks/index.js";
import { getTemplateContent } from "../utils/index.js";

export const CartDataListenerStatus: CorrectComponentType<{}> = (
  _,
  { element },
) => {
  const [status] = useListenerStatus(element);
  if (!status)
    return console.error(
      "cart-data-listener-status: no listener context provided!",
    );

  const templates = {
    default: getTemplateContent(element, "default"),
    loading: getTemplateContent(element, "loading"),
    success: getTemplateContent(element, "success"),
    error: getTemplateContent(element, "error"),
  };

  let previousState: Status | null = null;

  const currentStatus = () => {
    const s = status();
    if (!templates[s]) return previousState;
    previousState = s;
    return s;
  };

  element.replaceChildren(...[]);

  return createMemo(() => {
    const state = currentStatus();
    if (!state) return null;
    const template = templates[state];
    if (!template) return null;
    return Array.from(template.cloneNode(true).childNodes);
  });
};
