import { Logging } from "@brytdesigns/shopify-utils/effect";

/**
 * Creates a function that adds a namespaced prefix to log messages.
 *
 * @param namespace - The prefix to be added to log messages.
 * @returns A function that takes a log message and returns the message with the namespace prefix.
 *
 * @example
 * ```typescript
 * const namespacedLog = withNamespacedLogSpan("[MyApp]");
 * console.log(namespacedLog("Hello, world!")); // Output: "[MyApp] Hello, world!"
 * ```
 */
export const withNamespacedLogSpan = Logging.makeNamespacedLogSpan(
  "[@brytdesigns/shopify-ajax-client]"
);

/**
 * Filters log messages based on a specified log level.
 *
 * @param level - The log level to filter messages by.
 * @returns A function that takes a log message and returns the message if its level is greater than or equal to the specified level.
 *
 * @example
 * ```typescript
 * const filteredLog = filterLevelOrNever(LogLevel.INFO);
 * console.log(filteredLog(LogLevel.DEBUG, "This message will be filtered")); // Output: (nothing)
 * console.log(filteredLog(LogLevel.INFO, "This message will be logged")); // Output: "This message will be logged"
 * ```
 */
export const filterLevelOrNever = Logging.filterLevelOrNever;
