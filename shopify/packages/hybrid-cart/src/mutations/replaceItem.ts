import { createMutation } from "@tanstack/solid-query";

import client from "../client.js";
import API from "../api.js";
import { Cart } from "../query/index.js";

export type Input = {
  key: string;
  id: string | number;
};

export const mutation = createMutation(
  () => ({
    mutationFn: async (item: Input) => {
      const cart = Cart.get();
      const currentItem = cart.items.find((i) => i.key === item.key);
      if (!currentItem) {
        throw new Error(
          `Item with provided key of ${item.key} does not exists!`,
        );
      }

      const tempValues = {
        quantity: currentItem.quantity,
        properties: {
          ...currentItem.properties?.public,
          ...currentItem.properties?.private,
        },
        selling_plan:
          currentItem?.selling_plan_allocation?.selling_plan.id || undefined,
      } as const;

      await API.change({
        id: item.key,
        quantity: 0,
      });
      const response = await API.add({
        items: [
          {
            id: item.id,
            ...tempValues,
          },
        ],
      });
      if (response?.error || !response.data) {
        throw response?.error;
      }
      return response.data;
    },
    onSettled() {
      Cart.invalidate();
    },
  }),
  () => client,
);
