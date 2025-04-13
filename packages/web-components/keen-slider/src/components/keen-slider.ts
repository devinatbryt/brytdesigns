import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { observable } from "solid-js";
import _KeenSlider, {
  type KeenSliderInstance,
  type KeenSliderOptions,
} from "../KeenSlider.js";

import {
  provideKeenSliderContext,
  useKeenSliderContext,
} from "../hooks/index.js";

type KeenSliderContextProps = {
  config?: KeenSliderOptions;
  centerSlides: boolean;
  refreshOnChildrenChange: boolean;
};

export const KeenSlider: CorrectComponentType<KeenSliderContextProps> = (
  props,
  { element }
) => {
  const context = provideKeenSliderContext(props, element);
  const [slider, methods] = useKeenSliderContext(context);

  const observer = observable(slider);

  Object.assign(element, {
    subscribe(callback = (slider: KeenSliderInstance) => null) {
      function listen(slider: KeenSliderInstance) {
        const cleanup = callback(slider);
        slider.on(
          "destroyed",
          typeof cleanup === "function" ? cleanup : () => null
        );
      }
      return observer.subscribe(listen).unsubscribe;
    },
  });

  Object.assign(element, { slider });
  Object.assign(element, { addPlugin: methods.addPlugin });
};
