import type { CorrectComponentType } from "@brytdesigns/web-component-core/utils";

import { withKeenSliderElementContext } from "@brytdesigns/web-component-keen-slider";
import { onCleanup } from "solid-js";

type Props = {
  target: string;
  duration: number;
  totalSlides: number;
};

export const Name = "keen-slider-autoplay";

export const Component: CorrectComponentType<Props> = (props, { element }) => {
  if (!props.target)
    return console.warn(
      `${Name}: Needs a proper target in order to properly extend a keen slider.`,
    );

  withKeenSliderElementContext(
    () => {
      const selector = props.target;
      return () => {
        let targetEl: Element | null = element;
        if (props.target) targetEl = document.querySelector(selector);
        if (targetEl?.tagName !== "KEEN-SLIDER")
          targetEl = targetEl!.querySelector("keen-slider");
        return targetEl!;
      };
    },
    () => ({
      duration: props.duration,
      totalSlides: props.totalSlides,
    }),
    ([_, { addPlugin }], { duration, totalSlides }) => {
      const animation = { duration, easing: (t: number) => t };
      const removePlugin = addPlugin((s) => {
        s.update({ ...s.options, drag: false, loop: true });
        s.on("created", () => {
          s.moveToIdx(totalSlides, true, animation);
        });
        s.on("updated", () => {
          s.moveToIdx(s.track.details.abs + totalSlides, true, animation);
        });
        s.on("slideChanged", () => {
          s.moveToIdx(s.track.details.abs + totalSlides, true, animation);
        });
        s.on("animationEnded", () => {
          s.moveToIdx(s.track.details.abs + totalSlides, true, animation);
        });
      });
      onCleanup(removePlugin);
    },
  );
};
