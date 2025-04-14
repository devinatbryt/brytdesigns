import type { KeenSliderInstance } from "@brytdesigns/web-component-keen-slider";
import type { ICustomElement } from "component-register";

export const srOnly = `border-width:0 !important;clip:rect(1px, 1px, 1px, 1px) !important;-webkit-clip-path:inset(50%) !important;clip-path:inset(50%) !important;height:1px !important;margin-top:-1px !important;margin-bottom:-1px !important;margin-right:-1px !important;margin-left:-1px !important;overflow:hidden !important;padding-top:0 !important;padding-bottom:0 !important;padding-right:0 !important;padding-left:0 !important;position:absolute !important;width:1px !important;white-space:nowrap !important;`;

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
  ComponentType = (props: Props, options: Options) => {}
) {
  return (props: Props, options: Options) => {
    const { element } = options;
    element.classList.add("keen-arrows");
    addHiddenStyles(element);
    return ComponentType(props, options);
  };
}

export function getMaxSlides(slider: KeenSliderInstance) {
  const perView = (slider.options?.slides as any)?.perView || 1,
    perScroll = (slider.options?.slides as any)?.perScroll || 1,
    result = Math.ceil((slider.slides.length - perView) / perScroll) + 1;
  if (perScroll === 1 && perView > 1) return slider.slides.length;

  return result;
}
export function constrain(value: number, min = -Infinity, max = Infinity) {
  return Math.max(Math.min(value, max), min);
}
