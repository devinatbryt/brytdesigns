import type { CorrectComponentType } from "@brytdesigns/web-component-core/utils";

import { createMemo, Show } from "solid-js";
import html from "solid-js/html";

import { useProduct } from "../hooks/index.js";

type Props = {};

export const Name = `product-variant-render`;

export const Component: CorrectComponentType<Props> = (_, { element }) => {
  const templates = Array.from(
    element.querySelectorAll<HTMLTemplateElement>("template[variant-id]"),
  );
  if (!templates.length)
    return console.warn(`${Name}: No variant templates found`);
  const [state] = useProduct(element);

  const fallbackChildren = Array.from(element.children);

  const activeVariantTemplate = createMemo(() => {
    const variantId = state.product?.selected_or_first_available_variant?.id;
    if (!variantId) return null;
    const template = templates.find(
      (t) => t.getAttribute("variant-id") === `${variantId}`,
    );
    return template || null;
  });

  element.replaceChildren(...[]);

  return html`
    <${Show}
      when=${() => !!activeVariantTemplate()}
      fallback=${fallbackChildren}
    >
      ${() =>
        Array.from(
          activeVariantTemplate()?.content.cloneNode(true).childNodes || [],
        )}
    <//>
  `;
};
