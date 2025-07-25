import type { CorrectComponentType } from "@brytdesigns/web-component-core/utils";

import { createEffect, createMemo, observable } from "solid-js";

import { provideProductContext } from "../hooks/index.js";

import type { Product } from "../types.js";

type Props = {
  product?: Product;
  isProductPage?: boolean;
};

export const Name = `product-info`;

export const Component: CorrectComponentType<Props> = (props, { element }) => {
  if (!props.product)
    return console.warn(`${Name}: product attribute is required`);
  if (!props.product.variants)
    return console.warn(`${Name}: product attribute needs variants array`);
  if (!props.product.selected_or_first_available_variant)
    return console.warn(
      `${Name}: product attribute needs selected or first available variant object`,
    );
  provideProductContext(props as any, element);

  const url = createMemo(() => {
    const url = new URL(window.location.href);
    if (props.product && props.product.selected_or_first_available_variant) {
      url.searchParams.set(
        "variant",
        props.product.selected_or_first_available_variant.id.toString(),
      );
    }
    return url;
  });

  function subscribe(cb: (product: Product | undefined) => void) {
    return observable(() => props.product).subscribe(cb).unsubscribe;
  }

  Object.assign(element, {
    subscribe,
  });

  createEffect(() => {
    if (!props.isProductPage) return;
    window.history.replaceState(null, "", url());
  });
};
