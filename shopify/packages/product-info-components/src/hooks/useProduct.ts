import {
  type ICustomElement,
  createContext,
  provide,
  consume,
} from "component-register";
import { mergeProps, splitProps, untrack } from "solid-js";
import { getContextFromProvider } from "@brytdesigns/web-component-utils";

import type { Product } from "../types";

type CreateContextOptions = {
  root: HTMLElement & ICustomElement;
  product: Product;
};

type WalkableNode = Parameters<typeof provide>[2];

type ProductContext = ReturnType<typeof initializeProductContext>;

function initializeProductContext(props: CreateContextOptions) {
  const [privateProps, publicProps] = splitProps(props, ["root"]);
  const state = mergeProps(publicProps, {});

  function updateSelectedVariant(variantId: string | number) {
    const product = untrack(() => state?.product);
    if (
      typeof product?.selected_or_first_available_variant === "undefined" ||
      typeof product === "undefined" ||
      typeof product?.variants === "undefined"
    )
      return;
    const newVariant = product.variants.find(
      (variant) => variant.id.toString() === variantId.toString(),
    );

    if (
      newVariant?.id.toString() ===
      product.selected_or_first_available_variant?.id.toString()
    )
      return;

    const newState = {
      ...product,
      selected_or_first_available_variant: newVariant,
    };

    privateProps.root.setAttribute("product", JSON.stringify(newState));

    privateProps.root.dispatchEvent(
      new CustomEvent("variant-updated", {
        detail: {
          variant: newVariant,
          product: newState,
        },
        bubbles: true,
      }),
    );
  }

  return [
    state,
    {
      variant: {
        update: updateSelectedVariant,
      },
    },
  ] as const;
}

const ProductContextState = createContext(initializeProductContext);

export const provideProductContext = (
  initialState: Omit<CreateContextOptions, "root">,
  element: WalkableNode,
): ProductContext => {
  const props = mergeProps(initialState, { root: element });
  return provide(ProductContextState, props, element);
};

export const useProductContext = (context: ProductContext) => {
  return context;
};

export const useProduct = (element: HTMLElement & ICustomElement) => {
  const context: ProductContext = consume(ProductContextState, element);

  if (!context) {
    throw console.error(
      "DrawerContext not found! Please ensure to wrap your custom element with drawer-context element.",
    );
  }

  return useProductContext(context);
};

export const getProductContext = (element: Element) => {
  const context = getContextFromProvider<ProductContext>(
    ProductContextState,
    element,
  );
  return useProductContext(context);
};
