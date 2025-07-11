import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-core/utils";
import { KeenSliderScrollbar } from "./components/index.js";

customShadowlessElement(
  KeenSliderScrollbar.Name,
  {
    target: "",
    isHidden: true,
    isVertical: false,
  },
  correctElementType(KeenSliderScrollbar.Component),
);
