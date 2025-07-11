import type { CorrectComponentType } from "@brytdesigns/web-component-core/utils";
import {
  onCleanup,
  createEffect,
  createMemo,
  splitProps,
  mergeProps,
} from "solid-js";
import { createStore } from "solid-js/store";
import {
  motionValue,
  transformValue,
  transform as mTransform,
  styleEffect,
  frame,
  type MotionValue,
} from "motion";

import { useParallaxStickyLayer } from "../../hooks/index.js";
import { getActiveBreakpoints, getLastTruthyIndex } from "../../utils.js";

type AnimatableArray = Array<string | number> | null;

type Props = {
  breakpoints: string[];
  range: number[] | number[][];
  y: AnimatableArray | AnimatableArray[];
  x: AnimatableArray | AnimatableArray[];
  scale: AnimatableArray | AnimatableArray[];
  rotate: AnimatableArray | AnimatableArray[];
  opacity: AnimatableArray | AnimatableArray[];
  backgroundColor: AnimatableArray | AnimatableArray[];
  borderRadius: AnimatableArray | AnimatableArray[];
};

type ActiveProps = {
  range: number[];
  y: AnimatableArray;
  x: AnimatableArray;
  scale: AnimatableArray;
  rotate: AnimatableArray;
  opacity: AnimatableArray;
  backgroundColor: AnimatableArray;
  borderRadius: AnimatableArray;
};

function keysFromObject<T extends object>(object: T): (keyof T)[] {
  return Object.keys(object) as (keyof T)[];
}

export const Name = `parallax-animation`;

export const PROPS = {
  breakpoints: [""],
  range: [0, 1],
  y: null,
  x: null,
  scale: null,
  rotate: null,
  opacity: null,
  color: null,
  backgroundColor: null,
  borderRadius: null,
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
};

const KEYS = Object.keys(PROPS);

const isNestedAnimatableArray = (
  values: AnimatableArray | AnimatableArray[],
): values is AnimatableArray[] => {
  return (
    Array.isArray(values) && (Array.isArray(values[0]) || values[0] === null)
  );
};

const isAnimatableArray = (
  values: AnimatableArray | AnimatableArray[],
): values is AnimatableArray => {
  return Array.isArray(values) && !Array.isArray(values[0]);
};

const flattenAnimatableArray = (
  value: AnimatableArray | AnimatableArray[],
  index: number = 0,
) => {
  if (isNestedAnimatableArray(value)) {
    return value[index]!;
  }
  return value;
};

export const Component: CorrectComponentType<Props> = (props, { element }) => {
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

  const [progress, { animate }] = useParallaxStickyLayer(element);

  const [activeBreakpoints, setActiveBreakpoints] = createStore<boolean[]>(
    getActiveBreakpoints(props.breakpoints),
  );
  const activeBreakpointIndex = createMemo(() =>
    getLastTruthyIndex(activeBreakpoints),
  );

  const [_, importantProps] = splitProps(props, ["breakpoints"]);
  const animateableProps = mergeProps(importantProps, {});

  const activeProps = createMemo<ActiveProps>(() => {
    const index = activeBreakpointIndex();

    if (index === -1) {
      const { breakpoints, ...active } = PROPS;
      return active;
    }

    const keys = keysFromObject(animateableProps);

    const active = keys.reduce((active, key) => {
      const value = animateableProps[key];
      if (isNestedAnimatableArray(value)) {
        const flattenedValue = flattenAnimatableArray(value, index);
        return {
          ...active,
          [key]: flattenedValue,
        };
      }
      return {
        ...active,
        [key]: value,
      };
    }, {} as ActiveProps);

    return active;
  });

  createEffect(() => {
    const breakpoints = props.breakpoints;
    const controller = new AbortController();

    for (let i = 0; i < breakpoints.length; i++) {
      const query = breakpoints[i];
      if (!query) continue;
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener(
        "change",
        (e) => setActiveBreakpoints(i, e.matches),
        { signal: controller.signal },
      );
    }

    return onCleanup(() => {
      controller.abort();
    });
  });

  element.style.willChange = "transform";
  if (
    window.getComputedStyle(element).getPropertyValue("display") === "inline"
  ) {
    element.style.display = "block";
  }

  createEffect(() => {
    const active = activeProps();
    const { range, ...props } = active;
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
