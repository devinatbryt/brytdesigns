import type { ICustomElement } from "component-register";

export function constrain(value: number, min = -Infinity, max = Infinity) {
  return Math.min(Math.max(value, min), max);
}

type Options = {
  element: HTMLElement & ICustomElement;
};

export function initializeSliderClasses<Props>(
  ComponentType = (props: Props, options: Options) => {}
) {
  return (props: Props, options: Options) => {
    const { element } = options;
    element.classList.add("keen-slider");
    Array.from(element.children).forEach((child) =>
      child.classList.add("keen-slider__slide")
    );
    return ComponentType(props, options);
  };
}
