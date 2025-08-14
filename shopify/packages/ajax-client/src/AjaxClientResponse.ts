import * as Data from "effect/Data";

/**
 * Represents a response from an AJAX client.
 *
 * @template TData - The type of data expected in the response.
 */
interface IAjaxClientResponse<TData = any> {
  /**
   * The data received from the server.
   */
  data?: TData;

  /**
   * An error object if the request failed.
   */
  error?: {
    /**
     * The HTTP status code of the error response.
     */
    status: number;

    /**
     * A brief description of the error.
     */
    message: string;

    /**
     * A more detailed description of the error.
     */
    description?: string;
  };
}

/**
 * A class representing an AJAX client response.
 *
 * @template TData - The type of data expected in the response.
 */
export class AjaxClientResponse<TData = any> extends Data.Class<
  IAjaxClientResponse<TData>
> {}

/**
 * Creates an instance of AjaxClientResponse.
 *
 * @template TData - The type of data expected in the response.
 * @param data - The data to initialize the response with.
 * @returns An instance of AjaxClientResponse.
 */
export const make = <TData = undefined>(
  data: Parameters<ReturnType<typeof Data.case<AjaxClientResponse<TData>>>>[0]
) => Data.case<AjaxClientResponse<TData>>()(data);
