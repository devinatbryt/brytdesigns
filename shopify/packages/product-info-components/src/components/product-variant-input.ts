import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { createEffect, onCleanup } from "solid-js";

import { useProduct, useProductOptions } from "../hooks/index.js";

type ProductVariantInputProps = {
  target: string | null;
  preventDefault?: boolean;
};

export const ProductVariantInput: CorrectComponentType<
  ProductVariantInputProps
> = (props, { element }) => {
  const [productContext, productContextMethods] = useProduct(element);
  const [_, optionsMethods] = useProductOptions(element);

  createEffect(() => {
    let target = null;
    if (props.target) target = element.querySelector(props.target);
    if (!target) target = element;

    const preventDefault = props.preventDefault;

    function handleChange(event: Event) {
      if (preventDefault) event.preventDefault();
      const target = event.target as HTMLInputElement;
      if (!target) return;
      const value = target.value;
      if (
        value ===
        productContext?.product?.selected_or_first_available_variant?.id
      )
        return;
      const variant = productContext?.product?.variants.find(
        (variant) => variant.id.toString() === value.toString(),
      );
      if (!variant) return;
      if (optionsMethods) optionsMethods.options.update(variant.options);
      else productContextMethods.variant.update(variant.id);
    }

    target.addEventListener("change", handleChange);

    return onCleanup(() => {
      target.removeEventListener("change", handleChange);
    });
  });

  createEffect(() => {
    let target = null;
    if (props.target)
      target = element.querySelector<HTMLInputElement>(props.target);
    if (!target)
      target = element.querySelector<HTMLInputElement>("input[name='id']");
    if (!target)
      return console.warn("product-variant-input: target input not found");

    const variantId =
      productContext?.product?.selected_or_first_available_variant?.id;
    if (!variantId) return;
    if (target.value === variantId.toString()) return;
    target.value = variantId.toString();
    target.dispatchEvent(new Event("change", { bubbles: true }));
  });
};
