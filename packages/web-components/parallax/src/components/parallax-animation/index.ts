import type { CorrectComponentType } from "@brytdesigns/web-component-utils";
import { onCleanup, createEffect } from "solid-js";
import {
  motionValue,
  transformValue,
  transform as mTransform,
  styleEffect,
  frame,
  type MotionValue,
} from "motion";

import { useParallaxStickyLayer } from "../../hooks/index.js";

type ParallaxContainerProps = {
  range: number[];
  y: Array<string | number> | null;
  x: Array<string | number> | null;
  scale: Array<string | number> | null;
  rotate: Array<string | number> | null;
  opacity: Array<string | number> | null;
  backgroundColor: string[] | null;
  borderRadius: Array<string | number> | null;
  top: Array<string | number> | null;
  left: Array<string | number> | null;
  right: Array<string | number> | null;
  bottom: Array<string | number> | null;
  width: Array<string | number> | null;
  height: Array<string | number> | null;
};

export const Name = `parallax-animation`;

export const PROPS = {
  y: null,
  x: null,
  scale: null,
  rotate: null,
  opacity: null,
  color: null,
  backgroundColor: null,
  borderRadius: null,
  top: null,
  left: null,
  bottom: null,
  right: null,
  width: null,
  height: null,
};

const PROP_DEFAULTS = {
  y: "0%",
  x: "0%",
  scale: 1,
  rotate: 0,
  opacity: null,
  color: null,
  backgroundColor: null,
  borderRadius: null,
  top: null,
  left: null,
  bottom: null,
  right: null,
  width: null,
  height: null,
};

const KEYS = Object.keys(PROPS);

export const Component: CorrectComponentType<ParallaxContainerProps> = (
  props,
  { element },
) => {
  const [progress, { animate }] = useParallaxStickyLayer(element);

  if (
    Object.keys(props).some(
      (key) => KEYS.includes(key) && !Array.isArray(Reflect.get(props, key)),
    )
  )
    return console.warn(
      `parallax-animate: At least one of ${KEYS.join(",")} properties is required and must be an array of values!`,
      element,
    );

  const messages = Object.entries(props).reduce((messages, [key, value]) => {
    if (!KEYS.includes(key)) return messages;
    if (value && value.length !== props.range.length) {
      return messages.concat(
        `${key} attribute must have the same length as range attribute!`,
      );
    }
    return messages;
  }, [] as string[]);

  if (messages.length)
    return console.warn(
      element,
      `\nparallax-animate: Please fix the following issues:\n${messages.join("\n")}`,
    );

  element.style.willChange = "transform";
  if (!window.getComputedStyle(element).getPropertyValue("display")) {
    element.style.display = "block";
  }

  createEffect(() => {
    // Subscribe to all changes
    Object.values(props);
    const range = props.range;

    const valueSubscribers: VoidFunction[] = [];

    const progressValue = Object.keys(PROP_DEFAULTS).reduce(
      (values, key) => {
        const fallback = Reflect.get(PROP_DEFAULTS, key);
        const valueRange = Reflect.get(props, key);
        if (valueRange?.length === range.length) {
          const transform = mTransform(range, valueRange);
          const value = motionValue(transform(progress.get()));
          const unsub = progress.on("change", (latest) => {
            value.set(transform(latest));
          });
          valueSubscribers.push(unsub);
          values[key] = value;
        } else values[key] = fallback;
        return values;
      },
      {} as Record<string, any>,
    );

    const animated = Object.keys(progressValue).reduce(
      (obj, key) => {
        const v = progressValue[key];
        Reflect.set(
          obj,
          key,
          motionValue(typeof v === "object" && v !== null ? v.get() : v),
        );
        return obj;
      },
      {} as Record<string, MotionValue>,
    );

    const transform = transformValue(
      () =>
        `translate(${animated.x?.get()}, ${animated.y?.get()}) scale(${animated.scale?.get()}) rotate(${animated.rotate?.get()}deg)`,
    );

    function animateValues() {
      const sequence = Object.keys(animated)
        .map((key) => {
          let v = progressValue[key]?.get?.();
          if (typeof v === "undefined") return null;
          return [animated[key], v, { at: "<" }];
        })
        .filter((v) => v !== null);
      //@ts-ignore
      animate(sequence);
    }

    function scheduleAnimation() {
      frame.update(animateValues);
    }

    const unsub = progress.on("change", (_) => {
      scheduleAnimation();
    });

    const styledValues = Object.keys(animated)
      .filter(
        (key) =>
          key !== "y" && key !== "x" && key !== "rotate" && key !== "scale",
      )
      .reduce((obj, key) => {
        Reflect.set(obj, key, animated[key]);
        return obj;
      }, {});

    const unstyle = styleEffect(element, {
      transform,
      ...styledValues,
    });

    return onCleanup(() => {
      unstyle();
      unsub();
      valueSubscribers.forEach((unsub) => unsub());
      Object.values(animated).forEach((value) => {
        value.destroy();
      });
      Object.values(progressValue).forEach((value) => {
        value?.destroy?.();
      });
      transform.destroy();
    });
  });
};
