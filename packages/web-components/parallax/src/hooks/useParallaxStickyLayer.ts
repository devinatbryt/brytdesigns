import { onCleanup, createEffect, splitProps, mergeProps } from "solid-js";
import {
  type ICustomElement,
  createContext,
  provide,
  consume,
} from "component-register";
import {
  motionValue,
  transformValue,
  transform as mTransform,
  frame,
  animate,
  type AnimationPlaybackControlsWithThen,
} from "motion";
import { awaitAllAnimations } from "@brytdesigns/web-component-core/animation";
import { abortablePromise } from "@brytdesigns/web-component-core/promise";
import {
  getContextFromProvider,
  createWithElementContext,
} from "@brytdesigns/web-component-core/utils";

import { useParallax } from "./useParallax";
import { normalizeTuple, isInRange } from "../utils";

type CreateContextOptions = {
  root: HTMLElement & ICustomElement;
  start: number;
  end: number;
};

type WalkableNode = Parameters<typeof provide>[2];

type ParallaxStickyLayerContext = ReturnType<
  typeof initializeParallaxStickyLayerContext
>;

function initializeParallaxStickyLayerContext(props: CreateContextOptions) {
  const [_internal, _state] = splitProps(props, ["root", "start", "end"]);
  const parallax = useParallax(_internal.root);

  const progress = motionValue(-1);
  const inRange = motionValue(false);
  const belowRange = motionValue(false);
  const aboveRange = motionValue(false);

  const position = transformValue(() =>
    inRange.get() ? "sticky" : "absolute",
  );
  const transform = transformValue(() => {
    const isInRange = inRange.get();
    const isBelowRange = belowRange.get();
    const isAboveRange = aboveRange.get();
    if (isInRange) return "none";
    if (isBelowRange) return `translate(0px, ${(_internal.start - 1) * 100}vh)`;
    if (isAboveRange) return `translate(0px, ${(_internal.end - 1) * 100}vh)`;
  });
  const animations = motionValue<AnimationPlaybackControlsWithThen[]>([]);

  const styles = transformValue(() => ({
    position: position.get(),
    transform: transform.get(),
  }));

  _internal.root.style.top = "0px";
  _internal.root.style.right = "0px";
  _internal.root.style.bottom = "0px";
  _internal.root.style.left = "0px";
  _internal.root.style.height = `100dvh`;
  _internal.root.style.overflowX = "hidden";
  _internal.root.style.maxWidth = "100%";
  if (window.getComputedStyle(_internal.root).display === "inline") {
    _internal.root.style.display = "block";
  }

  createEffect(() => {
    const range = [_internal.start, _internal.end];
    const maxPages = parallax.maxPages;
    const normalizedRange = normalizeTuple(range as any, maxPages);
    const [normStart, normEnd] = normalizedRange;
    const transformer = mTransform(normalizedRange as any, [0, 1]);

    const unsubscribe = parallax.scrollYProgress.on("change", (value) => {
      inRange.set(isInRange({ range: normalizedRange as any, value }));
      belowRange.set(value <= normStart);
      aboveRange.set(value >= normEnd);
      progress.set(transformer(value));
    });

    return onCleanup(() => {
      unsubscribe();
    });
  });

  function updateStyles() {
    const s = styles.get();
    _internal.root.style.position = s.position;
    _internal.root.style.transform = s.transform;
  }

  function renderStyles() {
    frame.render(updateStyles);
  }

  function waitForAnimations() {
    const a = animations.get();
    const controller = new AbortController();
    abortablePromise(awaitAllAnimations(a), controller.signal).then(() => {
      animations.set([]);
      renderStyles();
    });
  }

  const unsubStyles = styles.on("change", (_) => {
    if (progress.get() === 1 || progress.get() === 0)
      return waitForAnimations();
    animations.set([]);
    renderStyles();
  });

  function _animate(...args: Parameters<typeof animate>) {
    const animation = animate(...args);
    animations.set([...animations.get(), animation]);
    return animation;
  }

  onCleanup(() => {
    unsubStyles();
  });

  return [progress, { animate: _animate }] as const;
}

const ParallaxStickyLayerContextState = createContext(
  initializeParallaxStickyLayerContext,
);

export const provideParallaxStickyLayerContext = (
  initialState: Omit<CreateContextOptions, "root">,
  element: WalkableNode,
): ParallaxStickyLayerContext => {
  const props = mergeProps(initialState, { root: element });
  return provide(ParallaxStickyLayerContextState, props, element);
};

export const useParallaxStickyLayerContext = (
  context: ParallaxStickyLayerContext,
) => {
  return context;
};

export const useParallaxStickyLayer = (
  element: HTMLElement & ICustomElement,
) => {
  const context: ParallaxStickyLayerContext = consume(
    ParallaxStickyLayerContextState,
    element,
  );

  if (!context) {
    throw console.error(
      "ParallaxContext not found! Please ensure to wrap your custom element with parallax-container element.",
    );
  }

  return useParallaxStickyLayerContext(context);
};

export const withParallaxStickyLayerContext = createWithElementContext<
  typeof ParallaxStickyLayerContextState,
  ParallaxStickyLayerContext
>(ParallaxStickyLayerContextState);

export const getParallaxStickyLayerContext = (element: Element) => {
  const context = getContextFromProvider<ParallaxStickyLayerContext>(
    ParallaxStickyLayerContextState,
    element,
  );
  return useParallaxStickyLayerContext(context);
};
