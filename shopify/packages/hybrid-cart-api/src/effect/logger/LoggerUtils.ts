import * as Logging from "@repo/shopify-utils/effect";

export const withNamespacedLogSpan = Logging.makeNamespacedLogSpan(
  "[@brytdesigns/shopify-hybrid-cart-client]"
);

export const filterLevelOrNever = Logging.filterLevelOrNever;
