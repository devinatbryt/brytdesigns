import HybridCart from "@brytdesigns/shopify-hybrid-cart";
import {
  createContext,
  consume,
  provide,
  type ICustomElement,
} from "component-register";

type WalkableNode = Parameters<typeof provide>[2];

type HybridCartContextType = () => (typeof HybridCart)["data"];

const HybridCartContext = createContext(() => () => HybridCart.data);

export const provideHybridCartContext = (
  element: WalkableNode
): HybridCartContextType => {
  return provide(HybridCartContext, {}, element);
};

export const useHybridCartContext = (context: HybridCartContextType) => {
  return context;
};

export const useHybridCart = (element: HTMLElement & ICustomElement) => {
  const context = consume(HybridCartContext, element);

  if (!context) {
    throw console.error(
      "CartContext not found! Please ensure to wrap your custom element with cart-context element."
    );
  }

  return useHybridCartContext(context);
};
