import {
  createContext,
  consume,
  provide,
  type ICustomElement,
} from "component-register";
import { splitProps } from "solid-js";

type WalkableNode = Parameters<typeof provide>[2];
export type Status = "default" | "loading" | "success" | "error";

type ListenerStatusContextType = ReturnType<typeof createListenerStatusContext>;

type Options = {
  element: HTMLElement & ICustomElement;
  status: Status;
};

function createListenerStatusContext(options: Options) {
  const [privateProps, publicProps] = splitProps(options, ["element"]);

  function setStatus(status: Status) {
    const currentStatus = privateProps.element.getAttribute("status");
    if (currentStatus === status) return;
    privateProps.element.setAttribute("status", status);
    return status;
  }

  return [() => publicProps.status, setStatus] as const;
}

const ListenerStatusContext = createContext(createListenerStatusContext);

export const provideListenerStatusContext = (options: {
  element: WalkableNode;
  status: Status;
}): ListenerStatusContextType => {
  return provide(ListenerStatusContext, options, options.element);
};

export const useListenerStatusContext = (
  context: ListenerStatusContextType,
) => {
  return context;
};

export const useListenerStatus = (element: HTMLElement & ICustomElement) => {
  const context = consume(ListenerStatusContext, element);

  if (!context) {
    throw console.error(
      "cart-data-listener context not found! Please ensure to wrap your custom element with cart-data-listener element.",
    );
  }

  return useListenerStatusContext(context);
};
