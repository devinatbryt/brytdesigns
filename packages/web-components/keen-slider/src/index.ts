import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-core/utils";
import { KeenSlider } from "./components/index.js";
import { initializeSliderClasses } from "./utils.js";

export type {
  KeenSliderInstance,
  KeenSliderOptions,
  KeenSliderPlugin,
} from "./KeenSlider.js";

export {
  useKeenSlider,
  addPlugin,
  getKeenSliderContext,
  withKeenSliderElementContext,
} from "./hooks/index.js";

customShadowlessElement(
  KeenSlider.Name,
  {
    // @ts-ignore
    config: {},
    centerSlides: false,
    refreshOnChildrenChange: false,
  },
  correctElementType(KeenSlider.Component),
  initializeSliderClasses,
);
