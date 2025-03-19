import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { Show, createMemo, For, type Accessor } from "solid-js";
import html from "solid-js/html";

import { useFullPropertyPath, useCartValue } from "../hooks/index.js";
import { getValueFromPath, formatValue, type Format } from "../utils/index.js";

type CartDataConditionsProps = {};

type ConditionValue = {
  type: "primitive" | "property";
  name?: string;
  value?: string | number | boolean | null;
  property_name?: string;
};

type Condition = {
  type:
    | "typeof"
    | "includes_property"
    | "equals"
    | "not_equals"
    | "lt"
    | "lte"
    | "gt"
    | "gte";
  format?: Format;
  invert?: boolean;
  valueA: ConditionValue;
  valueB: ConditionValue;
};

function getValue<T>(data: T, value: ConditionValue): any {
  if (typeof value === "undefined" || !data) return undefined;

  if (value.type === "primitive") {
    return value.value;
  }

  if (value.type === "property" && value.name) {
    //@ts-ignore
    return getValueFromPath<T>(data, value.name);
  }

  return null;
}

function invertResult(result: boolean, invert = false) {
  if (invert) return !result;
  return result;
}

function validateConditions<T>(conditions: Condition[], data: T) {
  if (!data) return false;
  const result = conditions.every((condition) => {
    let valueA = getValue(data, condition.valueA),
      valueB = getValue(data, condition.valueB),
      result = false;

    if (typeof valueA === "undefined" && typeof valueB === "undefined")
      return false;

    if (condition.type === "typeof") {
      result = typeof valueA === valueB;
    }

    if (condition.type === "includes_property") {
      result = valueA.some(
        (v: any) => v[condition.valueA?.property_name || ""] === valueB,
      );
    }

    if (condition.type === "equals") {
      result =
        formatValue(condition.format || "", valueA) ===
        formatValue(condition.format || "", valueB);
    }

    if (condition.type === "not_equals") {
      result =
        formatValue(condition.format || "", valueA) !==
        formatValue(condition.format || "", valueB);
    }

    if (condition.type === "lt") {
      result =
        formatValue(condition.format || "", valueA) <
        formatValue(condition.format || "", valueB);
    }

    if (condition.type === "lte") {
      result =
        formatValue(condition.format || "", valueA) <=
        formatValue(condition.format || "", valueB);
    }

    if (condition.type === "gt") {
      result =
        formatValue(condition.format || "", valueA) >
        formatValue(condition.format || "", valueB);
    }

    if (condition.type === "gte") {
      result =
        formatValue(condition.format || "", valueA) >=
        formatValue(condition.format || "", valueB);
    }

    return invertResult(result, condition.invert);
  });

  return result;
}

export const CartDataConditions: CorrectComponentType<
  CartDataConditionsProps
> = (_, { element }) => {
  const conditionTemplates = Array.from(element.children).filter(
    (child) => child.tagName === "TEMPLATE" && child.hasAttribute("conditions"),
  );
  if (!conditionTemplates.length)
    return console.error(
      "cart-data-conditions: no templates found with any conditions attribute!",
    );

  const allConditions = createMemo(() =>
    conditionTemplates.map((tmpl) => {
      const conditions = tmpl.getAttribute("conditions");
      if (!conditions)
        console.warn("cart-data-conditions: conditions attribute is required!");

      try {
        return JSON.parse(conditions!);
      } catch (e) {
        return [];
      }
    }),
  );

  const fullPath = useFullPropertyPath({ element });
  const data = useCartValue({
    path: fullPath,
    element,
  });

  return html`
    <${For} each=${() => conditionTemplates}>
      ${(tmpl: HTMLTemplateElement, idx: Accessor<number>) => {
        const conditions = allConditions()[idx()];
        return html`
          <${Show} when=${() => validateConditions(conditions, data())}>
            ${() => Array.from(tmpl.content.cloneNode(true).childNodes)}
          <//>
        `;
      }}
    <//>
  `;
};
