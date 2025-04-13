import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-utils";
import { KeenSlider } from "./components/keen-slider.js";
import { initializeSliderClasses } from "./utils.js";

export type {
  KeenSliderInstance,
  KeenSliderOptions,
  KeenSliderPlugin,
} from "./KeenSlider.js";

export { useKeenSlider, getKeenSliderContext } from "./hooks/index.js";

customShadowlessElement(
  "keen-slider",
  {
    // @ts-ignore
    config: {},
    centerSlides: false,
    refreshOnChildrenChange: false,
  },
  correctElementType(KeenSlider),
  initializeSliderClasses
);
