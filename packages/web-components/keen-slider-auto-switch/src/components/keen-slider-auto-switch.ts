import type { CorrectComponentType } from "@brytdesigns/web-component-core/utils";

import {
  createEffect,
  createSignal,
  on,
  onCleanup,
  batch,
  untrack,
} from "solid-js";
import { withKeenSliderElementContext } from "@brytdesigns/web-component-keen-slider";

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
    () => props.duration,
    (context, duration) => {
      const [sliderRef] = context;
      const [_, setTimeoutVal] = createSignal<number | null>(null);
      const [isHovering, setIsHovering] = createSignal(false);
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
        if (untrack(isHovering)) return;
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
          () => ({ slider: sliderRef() }),
          ({ slider }) => {
            if (!slider) return;
            const controller = new AbortController();

            function nextTimeout() {
              if (!slider) return;
              if (slider.options?.disabled) return;
              return startNextTimeout(() => {
                if (slider.slides.length <= 1) return;
                slider.next();
              }, duration);
            }

            (slider as any).pauseAutoplay = clearCurrentTimeout;
            (slider as any).startAutoplay = nextTimeout;

            slider.container.addEventListener(
              "mouseenter",
              () => {
                batch(() => {
                  setIsHovering(true);
                  clearCurrentTimeout();
                });
              },
              {
                signal: controller.signal,
              },
            );
            slider.container.addEventListener(
              "mouseleave",
              () => {
                batch(() => {
                  setIsHovering(false);
                  startNextTimeout(nextTimeout, duration);
                });
              },
              {
                signal: controller.signal,
              },
            );

            slider.on("dragStarted", clearCurrentTimeout);
            slider.on("slideChanged", clearCurrentTimeout);
            slider.on("animationEnded", nextTimeout);
            slider.on("updated", nextTimeout);
            slider.on("destroyed", clearCurrentTimeout, true);

            nextTimeout();

            return onCleanup(() => {
              controller.abort();

              slider.on("dragStarted", clearCurrentTimeout, true);
              slider.on("slideChanged", clearCurrentTimeout, true);
              slider.on("animationEnded", nextTimeout, true);
              slider.on("updated", nextTimeout, true);
              slider.on("destroyed", clearCurrentTimeout, true);
            });
          },
        ),
      );
    },
  );
};
