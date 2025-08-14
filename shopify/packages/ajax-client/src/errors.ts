import * as Data from "effect/Data";

/**
 * Represents an error related to a cart operation.
 *
 * @extends Data.TaggedError
 * @template T - The type of the error data.
 */
export class CartError extends Data.TaggedError(
  "@brytdesigns/ajax-client/CartError"
)<{
  status: number;
  message: string;
  description: string;
}> {}

/**
 * Represents an error when an invalid HTTP method is used.
 *
 * @extends Data.TaggedError
 * @template T - The type of the error data.
 */
export class InvalidAjaxMethodError extends Data.TaggedError(
  "@brytdesigns/ajax-client/InvalidAjaxMethodError"
)<{
  message: string;
}> {
  /**
   * Constructs a new instance of InvalidAjaxMethodError with a default error message.
   */
  constructor() {
    super({ message: "Invalid HTTP method | Allowed: 'get' or 'post'" });
  }
}
