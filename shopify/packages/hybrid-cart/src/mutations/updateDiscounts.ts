import { createMutation } from "@tanstack/solid-query";

import client from "../client.js";
import API from "../api.js";
import { Cart } from "../query/index.js";

export type Input = string;

export const mutation = createMutation(
  () => ({
    mutationFn: async (discounts: Input[]) => {
      const response = await API.discounts.update(discounts);

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSettled() {
      Cart.invalidate();
    },
  }),
  () => client,
);
