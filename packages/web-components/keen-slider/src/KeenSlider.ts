import type { ICustomElement } from "component-register";

import _KeenSlider, {
  type KeenSliderOptions as _KeenSliderOptions,
  type KeenSliderPlugin as _KeenSliderPlugin,
  type KeenSliderInstance as _KeenSliderInstance,
  type KeenSliderHooks as _KeenSliderHooks,
} from "keen-slider";

import { constrain } from "./utils";

export type KeenSliderHooks = _KeenSliderHooks;

export type KeenSliderInstance<
  O = {},
  P = {},
  H extends _KeenSliderHooks = _KeenSliderHooks,
> = _KeenSliderInstance<O, P, H>;

type ExtendedSlidesOption = NonNullable<
  _KeenSliderInstance["options"]["slides"]
> & {
  perScroll?: number;
};

type ExtendedKeenSliderOptions = Omit<
  _KeenSliderInstance["options"],
  "slides"
> & {
  slides?: ExtendedSlidesOption;
};

export type KeenSliderOptions<
  O = {},
  P = {},
  H extends _KeenSliderHooks = _KeenSliderHooks,
> = _KeenSliderOptions<O, P, H> & {
  slides: {
    perScroll?: number;
  } & _KeenSliderOptions<O, P, H>["slides"];
};

export type KeenSliderPlugin<
  O = {},
  P = {},
  H extends _KeenSliderHooks = _KeenSliderHooks,
> = _KeenSliderPlugin<O, P, H>;

function attachMoreDetails(prevSlide: number) {
  return function (slider: KeenSliderInstance) {
    if (slider.track.details.rel != slider.animator.targetIdx) return;

    (slider as KeenSlider).direction =
      slider.track.details.rel > prevSlide ? "forward" : "backward";

    prevSlide = slider.track.details.rel;
  };
}

const attachAriaAttributes: KeenSliderPlugin = (slider) => {
  const maxIdx =
    slider?.track?.details?.maxIdx === Infinity
      ? slider.track.details.length
      : slider?.track?.details?.maxIdx || 0;
  slider.container.setAttribute("role", "listbox");
  slider.container.setAttribute(
    "aria-orientation",
    slider.options?.vertical ? "vertical" : "horizontal",
  );
  slider.container.setAttribute("aria-multiselectable", "false");
  slider.container.setAttribute("aria-label", "Slider");
  slider.container.setAttribute("tabindex", "0");
  slider.container.setAttribute("aria-live", "polite");
  slider.container.setAttribute("aria-atomic", "true");
  slider.container.setAttribute("aria-live", "polite");
  slider.container.setAttribute("aria-busy", "false");
  slider.container.setAttribute("aria-valuemin", "0");
  slider.container.setAttribute("aria-valuemax", `${maxIdx}`);
  slider.container.setAttribute(
    "aria-valuenow",
    `${slider?.track?.details?.rel || 0}`,
  );

  function getMaxRel(rel: number, perView = 1) {
    return Math.floor(rel + perView - 1);
  }

  function slideIsActive(idx: number) {
    const perView = ((slider.options?.slides as any)?.perView as number) || 1,
      rel = slider.track.details.rel,
      maxRel = getMaxRel(rel, perView);

    return rel <= idx && idx <= maxRel;
  }

  async function updateTabIndexes(slide: HTMLElement, tabindex: string) {
    const focusableElements = Array.from(
      slide.querySelectorAll(
        "input, a, button:not(:disabled), textarea, select, textarea, [tabindex]",
      ),
    );
    focusableElements.forEach((element) => {
      element.setAttribute("tabindex", tabindex);
    });
  }

  function updateAriaActiveSlide(slide: HTMLElement) {
    slide.setAttribute("aria-selected", "true");
    slide.setAttribute("aria-hidden", "false");
    slide.setAttribute("tabindex", "0");
    updateTabIndexes(slide, "0");
  }

  function updateAriaInActiveSlide(slide: HTMLElement) {
    slide.setAttribute("aria-selected", "false");
    slide.setAttribute("aria-hidden", "true");
    slide.setAttribute("tabindex", "-1");
    updateTabIndexes(slide, "-1");
  }

  function updateSlideAriaAttributes(slider: _KeenSliderInstance) {
    if (slider.options?.disabled) {
      slider.slides.forEach((slide, i) => {
        slide.setAttribute("role", "option");
        updateAriaActiveSlide(slide);
      });
      return;
    }

    slider.slides.forEach((slide, i) => {
      slide.setAttribute("role", "option");
      if (slideIsActive(i)) updateAriaActiveSlide(slide);
      else updateAriaInActiveSlide(slide);
    });
  }

  slider.on("slideChanged", updateSlideAriaAttributes);
  slider.on("created", updateSlideAriaAttributes);
  slider.on("optionsChanged", updateSlideAriaAttributes);
  slider.on("updated", updateSlideAriaAttributes);
};

export default class KeenSlider extends _KeenSlider {
  direction: "forward" | "backward" | null = null;
  constructor(
    element: ICustomElement & HTMLElement,
    config: KeenSliderOptions,
    plugins: _KeenSliderPlugin[] = [],
  ) {
    super(element, config, plugins);
    let prevSlide = 0;

    this.direction = null;
    this.on("slideChanged", attachMoreDetails(prevSlide) as any);

    attachAriaAttributes(this);

    const _next = this.next,
      _prev = this.prev;

    this.next = function () {
      if (
        typeof this.options.slides === "number" ||
        typeof this.options.slides === "function"
      )
        return _next();
      let amount: number = 1;
      if (this.options?.slides && "perScroll" in this.options.slides === true) {
        amount = (this.options?.slides?.perScroll as number) || 1;
      }
      if (!this.options.loop) {
        return this.moveToIdx(
          constrain(
            this.track.details.rel + amount,
            0,
            this.track.details.maxIdx,
          ),
        );
      }
      return this.moveToIdx(constrain(this.track.details.abs + amount), true);
    };

    this.prev = function () {
      if (
        typeof this.options.slides === "number" ||
        typeof this.options.slides === "function"
      )
        return _prev();
      let amount: number = 1;
      if (this.options?.slides && "perScroll" in this.options.slides === true) {
        amount = (this.options?.slides?.perScroll as number) || 1;
      }
      if (!this.options.loop) {
        this.moveToIdx(
          constrain(
            this.track.details.rel - amount,
            0,
            this.track.details.maxIdx,
          ),
        );
      }
      return this.moveToIdx(constrain(this.track.details.abs - amount), true);
    };
  }
}
