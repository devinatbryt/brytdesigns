import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import {
  createEffect,
  createSignal,
  createMemo,
  on,
  onCleanup,
  batch,
} from "solid-js";
import {
  addPlugin,
  type KeenSliderInstance,
} from "@brytdesigns/web-component-keen-slider";

type Props = {
  target: string;
  duration: number;
};

export const Name = "keen-slider-auto-switch";

export const Component: CorrectComponentType<Props> = (props, { element }) => {
  if (!props.target)
    return console.warn(
      `${Name}: Needs a proper target in order to properly extend a keen slider.`,
    );

  const target = createMemo(() => {
    let targetEl: HTMLElement | null = element;
    if (props.target) targetEl = document.querySelector(props.target);
    if (!targetEl)
      return console.warn(
        `${Name}: Could not find the target element. Make sure it exists and is a keen-slider element.`,
      );
    if (targetEl.tagName !== "KEEN-SLIDER")
      targetEl = targetEl.querySelector("keen-slider");
    if (!targetEl)
      return console.warn(
        `${Name}: Could not find the target element. Make sure it exists and is a keen-slider element.`,
      );
    return targetEl;
  });

  const [sliderRef, setSliderRef] = createSignal<KeenSliderInstance | null>(
    null,
  );
  const [_, setTimeoutVal] = createSignal<number | null>(null);
  const [isPaused, setIsPaused] = createSignal(false);

  function clearCurrentTimeout() {
    batch(() => {
      setIsPaused(true);
      setTimeoutVal((val) => {
        if (val) clearTimeout(val);
        return null;
      });
    });
  }

  function startNextTimeout(cb: any, duration: number) {
    batch(() => {
      setIsPaused(false);
      setTimeoutVal((val) => {
        if (val) clearTimeout(val);
        return setTimeout(cb, duration) as any as number;
      });
    });
  }

  createEffect(
    on(
      () => ({ isPaused: isPaused(), slider: sliderRef() }),
      ({ isPaused, slider }) => {
        if (!slider) return;
        slider.container.dispatchEvent(
          new CustomEvent("autoswitch:update", {
            bubbles: true,
            detail: { isPaused },
          }),
        );
      },
    ),
  );

  createEffect(
    on(
      () => ({ slider: sliderRef(), duration: props.duration }),
      ({ slider, duration }) => {
        if (!slider) return;

        function nextTimeout() {
          if (!slider) return;
          if (slider.options?.disabled) return;
          return startNextTimeout(() => {
            if (slider.slides.length <= 1) return;
            slider.next();
          }, duration);
        }

        function handleMouseEnter() {
          clearCurrentTimeout();
        }

        function handleMouseLeave() {
          nextTimeout();
        }

        (slider as any).pauseAutoplay = clearCurrentTimeout;
        (slider as any).startAutoplay = nextTimeout;

        slider.container.addEventListener("mouseenter", clearCurrentTimeout);
        slider.container.addEventListener("mouseleave", nextTimeout);

        slider.on("dragStarted", clearCurrentTimeout);
        slider.on("slideChanged", clearCurrentTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);

        nextTimeout();

        return onCleanup(() => {
          slider.container.removeEventListener("mouseenter", handleMouseEnter);
          slider.container.removeEventListener("mouseleave", handleMouseLeave);

          slider.on("dragStarted", clearCurrentTimeout, true);
          slider.on("slideChanged", clearCurrentTimeout, true);
          slider.on("animationEnded", nextTimeout, true);
          slider.on("updated", nextTimeout, true);
        });
      },
    ),
  );

  createEffect(() => {
    const t = target();

    if (!t) return;

    const plugin = (slider: KeenSliderInstance | null) => {
      setSliderRef(slider);
    };

    const controller = new AbortController();

    addPlugin({
      target: t,
      plugin,
      controller,
    });

    return onCleanup(() => {
      controller.abort();
    });
  });
};
