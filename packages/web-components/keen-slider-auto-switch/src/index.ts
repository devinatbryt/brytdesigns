import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-utils";
import { KeenSliderAutoSwitch } from "./components/index.js";

customShadowlessElement(
  "keen-slider-navigation-dots",
  {
    target: "",
    duration: 2000,
  },
  correctElementType(KeenSliderAutoSwitch)
);
