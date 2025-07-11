import {
  type ICustomElement,
  createContext,
  provide,
  consume,
} from "component-register";
import { createEffect, mergeProps, splitProps, untrack } from "solid-js";
import {
  getContextFromProvider,
  createWithElementContext,
} from "@brytdesigns/web-component-core/utils";

import { useProduct } from "./useProduct.js";

type CreateContextOptions = {
  root: HTMLElement & ICustomElement;
  selectedOptions: string[];
};

type WalkableNode = Parameters<typeof provide>[2];

type ProductOptionsContext = ReturnType<typeof initializeProductOptionsContext>;

function initializeProductOptionsContext(props: CreateContextOptions) {
  const [privateProps, publicProps] = splitProps(props, ["root"]);
  const [context, methods] = useProduct(privateProps.root);

  function updateSelectedOptions(options: string[]) {
    privateProps.root.setAttribute("selected-options", JSON.stringify(options));
  }

  function updateSelectedOption(option: string, index: number) {
    const current = untrack(() => publicProps.selectedOptions);
    const options = [...current];
    options[index] = option;
    return updateSelectedOptions(options);
  }

  createEffect(() => {
    const variant = context.product.variants.find((variant) => {
      return publicProps.selectedOptions.every((option) =>
        variant.options.includes(option),
      );
    });
    if (!variant) return;
    if (variant.id === context.product.selected_or_first_available_variant.id)
      return;
    methods.variant.update(variant.id);
  });

  return [
    publicProps,
    {
      options: {
        update: updateSelectedOptions,
        updateOption: updateSelectedOption,
      },
    },
  ] as const;
}

const ProductOptionsContextState = createContext(
  initializeProductOptionsContext,
);

export const provideProductOptionsContext = (
  initialState: Omit<CreateContextOptions, "root">,
  element: WalkableNode,
): ProductOptionsContext => {
  const props = mergeProps(initialState, { root: element });
  return provide(ProductOptionsContextState, props, element);
};

export const useProductOptionsContext = (context: ProductOptionsContext) => {
  return context;
};

export const useProductOptions = (element: HTMLElement & ICustomElement) => {
  const context: ProductOptionsContext = consume(
    ProductOptionsContextState,
    element,
  );

  if (!context) {
    throw console.error(
      "ProductOptionsContext not found! Please ensure to wrap your custom element with product-options element.",
    );
  }

  return useProductOptionsContext(context);
};

export const getProductOptionsContext = (element: Element) => {
  const context = getContextFromProvider<ProductOptionsContext>(
    ProductOptionsContextState,
    element,
  );
  return useProductOptionsContext(context);
};

export const withProductOptionsElementContext = createWithElementContext<
  typeof ProductOptionsContextState,
  ProductOptionsContext
>(ProductOptionsContextState);
