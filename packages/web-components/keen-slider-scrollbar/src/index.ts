import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-utils";
import { KeenSliderScrollbar } from "./components/keen-slider-scrollbar.js";

customShadowlessElement(
  "keen-slider-scrollbar",
  {
    target: "",
    isHidden: true,
    isVertical: false,
  },
  correctElementType(KeenSliderScrollbar)
);
