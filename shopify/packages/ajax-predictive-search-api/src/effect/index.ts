import * as AjaxClient from "@brytdesigns/shopify-ajax-client";
import { type Input as _Input, Input, Output } from "./schema";

export namespace get {
  export type Input = _Input;
}
export const get = AjaxClient.makeFactory({
  routeName: "predictive_search_url",
  inputSchema: Input,
  outputSchema: Output,
});
