import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { createEffect, createUniqueId, on, onCleanup } from "solid-js";
import debounce from "lodash.debounce";

import {
  type Status,
  provideListenerStatusContext,
  useCartValue,
  useFullPropertyPath,
} from "../hooks/index.js";
import AjaxCart from "@brytdesigns/shopify-ajax-cart";
import { parseNestedObject } from "../utils/index.js";

type CartDataListenerProps = {
  status: Status;
  on: string;
  method: string;
  debounceDelay: number;
  resetForm: boolean;
  resetStatusDelay: number;
  preventDefault: boolean;
};

export const CartDataListener: CorrectComponentType<CartDataListenerProps> = (
  props,
  { element },
) => {
  const [_, setStatus] = provideListenerStatusContext({
    element,
    get status() {
      return props.status;
    },
  });

  const path = useFullPropertyPath({
    element,
  });
  const data = useCartValue({
    element,
    path,
  });

  let currentEventId: string | null = null;

  createEffect(
    on(
      () => ({
        method: props.method,
        on: props.on,
        preventDefault: props.preventDefault,
        data: data() as any,
        debounceDelay: props.debounceDelay,
        resetForm: props.resetForm,
        resetStatusDelay: props.resetStatusDelay,
      }),
      ({
        method,
        on,
        preventDefault,
        data,
        debounceDelay,
        resetForm,
        resetStatusDelay,
      }) => {
        if (!method)
          return console.error(
            "cart-item-listener: method property is required!",
          );
        if (!on)
          return console.error("cart-item-listener: on property is required!");

        let resetStatusId: number | null = null,
          tempEventId: string | null = null;

        function onEvent(e: Event) {
          const cart = AjaxCart;

          (currentEventId = createUniqueId()), (tempEventId = currentEventId);

          if (preventDefault) e.preventDefault();

          async function handleStatus<T>(promise: Promise<T>) {
            setStatus("loading");
            return promise
              .then((data) => {
                setStatus("success");
                return data;
              })
              .catch((error) => {
                setStatus("error");
                return error;
              })
              .finally(() => {
                if (resetStatusDelay > 0) {
                  //@ts-ignore
                  resetStatusId = setTimeout(() => {
                    setStatus("default");
                    resetStatusId = null;
                  }, resetStatusDelay);
                } else {
                  setStatus("default");
                }
              });
          }

          if (on === "submit") {
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const formObj = parseNestedObject(
              //@ts-ignore
              Object.fromEntries(formData.entries()),
            );

            function reset() {
              if (resetForm) form.reset();
            }

            if (method === "replaceItem") {
              return handleStatus(
                cart.replaceItem({
                  key: formObj.key,
                  id: formObj.id,
                }),
              ).finally(reset);
            }

            if (method === "updateItem") {
              return handleStatus(
                cart.updateItem({
                  id: formObj.id,
                  quantity: formObj?.quantity || undefined,
                  properties: formObj?.properties || {},
                  selling_plan: formObj?.selling_plan || undefined,
                }),
              ).finally(reset);
            }

            if (method === "removeItem") {
              return handleStatus(cart.removeItem(formObj.key)).finally(reset);
            }

            if (method === "addDiscount") {
              return handleStatus(cart.addDiscount(formObj.code)).finally(
                reset,
              );
            }

            if (method === "removeDiscount") {
              return handleStatus(cart.removeDiscount(formObj.code)).finally(
                reset,
              );
            }

            if (method === "updateNote") {
              return handleStatus(cart.updateNote(formObj.note)).finally(reset);
            }

            return;
          }

          const input = e.target as HTMLInputElement;

          if (method === "removeItem") {
            return handleStatus(cart.removeItem(data.key));
          }

          if (method === "updateQuantity") {
            return handleStatus(
              cart.updateItem({
                id: data.key,
                quantity: input.valueAsNumber,
              }),
            );
          }

          if (method === "updateItemVariant") {
            return handleStatus(
              cart.replaceItem({
                key: data.key,
                id: input.value,
              }),
            );
          }

          if (method === "updateNote") {
            return handleStatus(cart.updateNote(input.value));
          }
        }
        const handleEvent = debounce(onEvent, debounceDelay),
          controller = new AbortController();

        element.addEventListener(
          on,
          (e) => {
            if (preventDefault) e.preventDefault();
            handleEvent(e);
          },
          { signal: controller.signal },
        );

        return onCleanup(() => {
          controller.abort();
          if (resetStatusId && currentEventId !== tempEventId)
            clearTimeout(resetStatusId);
        });
      },
    ),
  );
};
