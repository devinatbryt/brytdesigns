import { createMutation } from "@tanstack/solid-query";

import client from "../client.js";
import API from "../api.js";
import { Cart } from "../query/index.js";

export type Input = string;

export const mutation = createMutation(
  () => ({
    mutationFn: async (items: Input[]) => {
      const response = await API.update({
        updates: items.reduce(
          (updates, key) =>
            ({ ...updates, [key]: 0 }) as Record<string, number>,
          {},
        ),
      });
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
    },
    onSettled() {
      Cart.invalidate();
    },
  }),
  () => client,
);
