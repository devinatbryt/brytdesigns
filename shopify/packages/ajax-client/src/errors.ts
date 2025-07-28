import * as Data from "effect/Data";

/**
 * @internal
 *
 */
export class CartError extends Data.TaggedError(
  "@brytdesigns/ajax-client/CartError",
)<{
  status: number;
  message: string;
  description: string;
}> {}

/**
 * @internal
 *
 */
export class InvalidAjaxMethodError extends Data.TaggedError(
  "@brytdesigns/ajax-client/InvalidAjaxMethodError",
)<{
  message: string;
}> {
  constructor() {
    super({ message: "Invalid HTTP method | Allowed: 'get' or 'post'" });
  }
}
