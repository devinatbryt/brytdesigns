import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { createMemo, Show } from "solid-js";
import html from "solid-js/html";

import { useProduct } from "../hooks/index.js";

type ProductVariantRenderProps = {};

export const ProductVariantRender: CorrectComponentType<
  ProductVariantRenderProps
> = (_, { element }) => {
  const templates = Array.from(
    element.querySelectorAll<HTMLTemplateElement>("template[variant-id]"),
  );
  if (!templates.length)
    return console.warn("product-variant-render: No variant templates found");
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
