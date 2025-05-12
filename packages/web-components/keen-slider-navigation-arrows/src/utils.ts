import type { KeenSliderInstance } from "@brytdesigns/web-component-keen-slider";
import type { ICustomElement } from "component-register";

export const srOnly = `border-width:0 !important;clip:rect(1px, 1px, 1px, 1px) !important;-webkit-clip-path:inset(50%) !important;clip-path:inset(50%) !important;height:1px !important;margin-top:-1px !important;margin-bottom:-1px !important;margin-right:-1px !important;margin-left:-1px !important;overflow:hidden !important;padding-top:0 !important;padding-bottom:0 !important;padding-right:0 !important;padding-left:0 !important;position:absolute !important;width:1px !important;white-space:nowrap !important;`;

export function hasMoreSlides(slider: KeenSliderInstance) {
  return slider.track.details.maxIdx > 0;
}

export function updateArrows(leftArrow: HTMLElement, rightArrow: HTMLElement) {
  return function (slider: KeenSliderInstance) {
    if (!leftArrow || !rightArrow) return;
    const isFirst = isFirstSlide(slider),
      isLast = isLastSlide(slider);

    isFirst
      ? leftArrow.classList.add("keen-arrow--disabled")
      : leftArrow.classList.remove("keen-arrow--disabled");
    isFirst
      ? leftArrow.setAttribute("disabled", "true")
      : leftArrow.removeAttribute("disabled");
    isLast
      ? rightArrow.classList.add("keen-arrow--disabled")
      : rightArrow.classList.remove("keen-arrow--disabled");
    isLast
      ? rightArrow.setAttribute("disabled", "true")
      : rightArrow.removeAttribute("disabled");
  };
}

export function isFirstSlide(slider: KeenSliderInstance) {
  return slider.track.details.rel === 0 && !slider.options?.loop;
}

export function isLastSlide(slider: KeenSliderInstance) {
  return (
    slider.track.details.rel === slider.track.details.maxIdx &&
    !slider.options?.loop
  );
}

export function addHiddenStyles(element: HTMLElement) {
  element.style.setProperty("visibility", "hidden", "important");
  element.style.setProperty("opacity", "0", "important");
}

export function addVisibleStyles(element: HTMLElement) {
  //@ts-ignore
  element.style.display = null;
  //@ts-ignore
  element.style.visibility = null;
  //@ts-ignore
  element.style.opacity = null;
}

type Options = {
  element: HTMLElement & ICustomElement;
};

export function initializeClasses<Props>(
  ComponentType = (props: Props, options: Options) => { },
) {
  return (props: Props, options: Options) => {
    const { element } = options;
    element.classList.add("keen-arrows");
    addHiddenStyles(element);
    return ComponentType(props, options);
  };
}
