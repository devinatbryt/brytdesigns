import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-core/utils";
import { KeenSliderAutoSwitch } from "./components/index.js";

customShadowlessElement(
  KeenSliderAutoSwitch.Name,
  {
    target: "keen-slider",
    duration: 2000,
  },
  correctElementType(KeenSliderAutoSwitch.Component),
);
