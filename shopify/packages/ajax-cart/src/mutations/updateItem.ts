import { useMutation } from "@tanstack/solid-query";

import client from "../client.js";
import API from "../api.js";
import { Cart } from "../query/index.js";
import { DEFAULT_HEADERS } from "../const.js";

export type Input = Parameters<typeof API.change>[0];

type CartItem = NonNullable<
  Awaited<ReturnType<typeof API.get>>["data"]
>["items"][number];

const createIsItemCheck = (input: Input) => (item: CartItem, index: number) => {
  if ("id" in input && input.id.includes(":") && input.id === item.key) {
    return true;
  }
  if ("id" in input && input.id === `${item.id}`) {
    return true;
  }
  if ("line" in input && input.line === index + 1) {
    return true;
  }
  return false;
};

export const mutation = useMutation(
  () => ({
    mutationFn: async (item: Input) => {
      const response = await API.change(item, { headers: DEFAULT_HEADERS });
      if (response?.error || !response.data) {
        throw response?.error;
      }
      return response.data;
    },
    async onMutate(item) {
      await Cart.cancel();
      const previousCart = Cart.get();
      const isItemCheck = createIsItemCheck(item);

      Cart.set((old) => ({
        ...old,
        items_count: old.items.reduce((total, i, index) => {
          if (isItemCheck(i, index)) {
            return (
              total +
              (typeof item.quantity !== "undefined"
                ? item.quantity
                : i.quantity)
            );
          }
          return total + i.quantity;
        }, 0),
        items: old.items.map((i, index) => {
          if (isItemCheck(i, index)) {
            return {
              ...i,
              quantity:
                typeof item.quantity !== "undefined"
                  ? item.quantity
                  : i.quantity,
              properties: {
                ...item.properties,
                ...i.properties,
              },
            };
          }
          return i;
        }),
      }));

      return { previousCart };
    },
    // onError(_, __, context) {
    //   if (context?.previousCart) Cart.set(() => context.previousCart);
    //   Cart.invalidate();
    // },
    // onSuccess(cart) {
    //   if (!cart) return Cart.invalidate();
    //   Cart.set(() => cart);
    // },
    onSettled() {
      Cart.invalidate();
    },
  }),
  () => client
);
