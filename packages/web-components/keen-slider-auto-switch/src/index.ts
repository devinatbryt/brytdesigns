import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-utils";
import { KeenSliderAutoSwitch } from "./components/index.js";

customShadowlessElement(
  "keen-slider-auto-switch",
  {
    target: "",
    duration: 2000,
  },
  correctElementType(KeenSliderAutoSwitch),
);
