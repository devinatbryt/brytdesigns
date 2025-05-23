import AjaxCart from "@brytdesigns/shopify-ajax-cart";
import {
  createContext,
  consume,
  provide,
  type ICustomElement,
} from "component-register";

type WalkableNode = Parameters<typeof provide>[2];

type AjaxCartContextType = () => (typeof AjaxCart)["data"];

const AjaxCartContext = createContext(() => () => AjaxCart.data);

export const provideAjaxCartContext = (
  element: WalkableNode,
): AjaxCartContextType => {
  return provide(AjaxCartContext, {}, element);
};

export const useAjaxCartContext = (context: AjaxCartContextType) => {
  return context;
};

export const useAjaxCart = (element: HTMLElement & ICustomElement) => {
  const context = consume(AjaxCartContext, element);

  if (!context) {
    throw console.error(
      "CartContext not found! Please ensure to wrap your custom element with cart-context element.",
    );
  }

  return useAjaxCartContext(context);
};
