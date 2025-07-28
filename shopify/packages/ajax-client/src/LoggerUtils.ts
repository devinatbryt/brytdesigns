import { Logging } from "@brytdesigns/shopify-utils/effect";

export const withNamespacedLogSpan = Logging.makeNamespacedLogSpan(
  "[@brytdesigns/shopify-ajax-client]",
);

export const filterLevelOrNever = Logging.filterLevelOrNever;
