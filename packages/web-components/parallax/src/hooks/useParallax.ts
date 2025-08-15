import {
  onCleanup,
  createEffect,
  splitProps,
  mergeProps,
  batch,
  createSignal,
} from "solid-js";
import { createStore } from "solid-js/store";
import {
  getContextFromProvider,
  createWithElementContext,
} from "@brytdesigns/web-component-core/utils";
import {
  type ICustomElement,
  createContext,
  provide,
  consume,
} from "component-register";
import { scroll, motionValue } from "motion";

type CreateContextOptions = {
  root: HTMLElement & ICustomElement;
  maxPages: number;
};

type WalkableNode = Parameters<typeof provide>[2];

type ParallaxContext = ReturnType<typeof initializeParallaxContext>;

function initializeParallaxContext(props: CreateContextOptions) {
  const [_internal, _state] = splitProps(props, ["root"]);

  const scrollYProgress = motionValue(-1);
  const scrollY = motionValue(-1);
  const [info, setInfo] = createStore({
    offset: [-1, -1],
    scrollLength: -1,
  });
  const [windowHeight, setWindowHeight] = createSignal(window.outerHeight);

  window.addEventListener("resize", () => {});

  createEffect(() => {
    const pages = _state.maxPages;
    _internal.root.style.height = `${windowHeight() * pages}px`;
  });

  createEffect(() => {
    const controller = new AbortController();

    _internal.root.style.width = `100%`;
    _internal.root.style.position = "relative";
    if (!_internal.root.style.display) {
      _internal.root.style.display = "block";
    }

    const remove = scroll(
      (_, info) => {
        const { y } = info;

        scrollYProgress.set(y.progress);
        scrollY.set(y.current);
        batch(() => {
          setInfo("offset", 0, y.offset?.at(0) || 0);
          setInfo("offset", 1, y.offset?.at(1) || 0);
          setInfo("scrollLength", y.scrollLength);
        });
      },
      {
        target: _internal.root,
        axis: "y",
        offset: ["start start", "end end"],
      },
    );

    window.addEventListener(
      "resize",
      () => setWindowHeight(window.innerHeight),
      { passive: true, signal: controller.signal },
    );

    onCleanup(() => {
      controller.abort();
      if (remove) {
        remove();
      }
      scrollYProgress.destroy();
      scrollY.destroy();
    });
  });

  return mergeProps(_state, {
    scrollYProgress,
    scrollY,
    info,
    get windowHeight() {
      return windowHeight();
    },
  });
}

const ParallaxContextState = createContext(initializeParallaxContext);

export const provideParallaxContext = (
  initialState: Omit<CreateContextOptions, "root">,
  element: WalkableNode,
): ParallaxContext => {
  const props = mergeProps(initialState, { root: element });
  return provide(ParallaxContextState, props, element);
};

export const useParallaxContext = (context: ParallaxContext) => {
  return context;
};

export const useParallax = (element: HTMLElement & ICustomElement) => {
  const context: ParallaxContext = consume(ParallaxContextState, element);

  if (!context) {
    throw console.error(
      "ParallaxContext not found! Please ensure to wrap your custom element with parallax-container element.",
    );
  }

  return useParallaxContext(context);
};

export const withParallaxElementContext = createWithElementContext<
  typeof ParallaxContextState,
  ParallaxContext
>(ParallaxContextState);

export const getParallaxContext = (element: Element) => {
  const context = getContextFromProvider<ParallaxContext>(
    ParallaxContextState,
    element,
  );
  return useParallaxContext(context);
};
