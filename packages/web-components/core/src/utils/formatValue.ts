export type Format =
  | "currency"
  | "number"
  | "boolean"
  | "invert_boolean"
  | string;

export function formatValue(format: Format, value: unknown) {
  switch (format) {
    case "currency":
      if (typeof value === "number") return window.Shopify.formatMoney(value);
      if (typeof value === "string")
        return window.Shopify.formatMoney(parseFloat(value));
      console.warn("formatValue: Unsupported value type for currency format.");
      return window.Shopify.formatMoney(0);
    case "number":
      return Number(value);
    case "boolean":
      return Boolean(value);
    case "invert_boolean":
      return !Boolean(value);
    default:
      return value as any;
  }
}

declare global {
  interface Window {
    Shopify: {
      formatMoney(value: number, currency?: string): string;
    };
  }
}
