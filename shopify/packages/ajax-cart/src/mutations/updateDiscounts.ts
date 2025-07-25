import { useMutation } from "@tanstack/solid-query";

import client from "../client.js";
import API from "../api.js";
import { Cart } from "../query/index.js";
import { DEFAULT_HEADERS } from "../const.js";

export type Input = string;

export const mutation = useMutation(
  () => ({
    mutationFn: async (discounts: Input[]) => {
      const response = await API.update(
        {
          discount: discounts,
        },
        { headers: DEFAULT_HEADERS },
      );

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onError() {
      Cart.invalidate();
    },
    onSuccess(cart) {
      if (!cart) return Cart.invalidate();
      Cart.set(() => cart);
    },
  }),
  () => client,
);
