import { Logging } from "@brytdesigns/shopify-utils/effect";

export const withNamespacedLogSpan = Logging.makeNamespacedLogSpan(
  "[@brytdesigns/shopify-ajax-cart-client]",
);

export const filterLevelOrNever = Logging.filterLevelOrNever;
