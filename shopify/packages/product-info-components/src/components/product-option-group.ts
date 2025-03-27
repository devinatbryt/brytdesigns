import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { createEffect, on, onCleanup } from "solid-js";

import { useProductOptions } from "../hooks/index.js";

type ProductOptionGroupProps = {
  position: number;
  name: string;
  inputType: "radio" | "select";
};

export const ProductOptionGroup: CorrectComponentType<
  ProductOptionGroupProps
> = (props, { element }) => {
  const [context, methods] = useProductOptions(element);

  createEffect(
    on(
      () => ({
        selectedOption: context.selectedOptions[props.position - 1],
        position: props.position,
        name: props.name,
        inputType: props.inputType,
      }),
      ({ selectedOption, position, name, inputType }) => {
        if (inputType !== "radio" && inputType !== "select") return;

        const optionName = `${name}-${position}`;

        if (inputType === "radio") {
          const inputs = element.querySelectorAll<HTMLInputElement>(
            `input[name="${optionName}"]`,
          );
          inputs.forEach((input) => {
            const prevValue = input.checked;
            if (input.value === selectedOption) input.checked = true;
            else input.checked = false;
            if (prevValue !== input.checked) {
              input.dispatchEvent(new Event("change", { bubbles: true }));
            }
          });
          return;
        }

        const select = element.querySelector<HTMLSelectElement>(
          `select[name="${optionName}"]`,
        );
        if (!select || !selectedOption) return;
        select.value = selectedOption;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      },
    ),
  );

  createEffect(() => {
    const position = props.position;

    function handleChange(event: Event) {
      const target = event.target as HTMLInputElement;
      if (!target) return;
      const selectedOption = target.value;
      if (context.selectedOptions[position - 1] === selectedOption) return;

      element.dispatchEvent(
        new CustomEvent("option-updated", {
          detail: {
            group: props.name,
            position: position,
            selectedOption,
          },
          bubbles: true,
        }),
      );

      methods.options.updateOption(selectedOption, position - 1);
    }

    element.addEventListener("change", handleChange);

    return onCleanup(() => {
      element.removeEventListener("change", handleChange);
    });
  });
};
