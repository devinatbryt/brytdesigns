import { useMutation } from "@tanstack/solid-query";

import client from "../client.js";
import API from "../api.js";
import { Cart } from "../query/index.js";
import { DEFAULT_HEADERS } from "../const.js";

export type Input = string;

export const mutation = useMutation(
  () => ({
    mutationFn: async (items: Input[]) => {
      const response = await API.update(
        {
          updates: items.reduce(
            (updates, key) =>
              ({ ...updates, [key]: 0 }) as Record<string, number>,
            {},
          ),
        },
        { headers: DEFAULT_HEADERS },
      );
      if (response?.error || !response.data) {
        throw response?.error;
      }
      return response.data;
    },
    async onMutate(items) {
      await Cart.cancel();
      const previousCart = Cart.get();

      Cart.set((old) => ({
        ...old,
        items_count: old.items
          .filter((item) => items.includes(item.key))
          .reduce((total, item) => total + item.quantity, 0),
        items: old.items.filter((item) => !items.includes(item.key)),
      }));

      return { previousCart };
    },
    onError(_, __, context) {
      if (context?.previousCart) Cart.set(() => context.previousCart);
      Cart.invalidate();
    },
    onSuccess(cart) {
      if (!cart) return Cart.invalidate();
      Cart.set(() => cart);
    },
  }),
  () => client,
);
