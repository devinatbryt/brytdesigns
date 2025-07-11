import type { CorrectComponentType } from "@brytdesigns/web-component-core/utils";
import { provideParallaxStickyLayerContext } from "../../hooks/index.js";

type StickyParallaxLayerProps = {
  start: number;
  end: number;
};

export const Name = `parallax-sticky-layer`;

export const Component: CorrectComponentType<StickyParallaxLayerProps> = (
  props,
  { element },
) => {
  if (!props.start)
    return console.warn(
      `${Name}: requires start attribute to be set!`,
      element,
    );
  if (!props.end)
    return console.warn(`${Name}: requires end attribute to be set!`, element);
  if (props.end <= props.start)
    return console.warn(
      `${Name}: the start attribute must be less than the end attribute!`,
      element,
    );
  if (props.start < 1 || props.end < 1)
    return console.warn(
      `${Name}: The start and end attributes must be greater than or equal to 1!`,
      element,
    );
  provideParallaxStickyLayerContext(props, element);
};
