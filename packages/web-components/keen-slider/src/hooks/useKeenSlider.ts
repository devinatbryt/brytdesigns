import {
  type ICustomElement,
  createContext,
  provide,
  consume,
} from "component-register";
import {
  createEffect,
  mergeProps,
  createSignal,
  createMemo,
  onCleanup,
  on,
  splitProps,
} from "solid-js";
import { getContextFromProvider } from "@brytdesigns/web-component-utils";
import KeenSlider, {
  type KeenSliderInstance,
  type KeenSliderOptions,
  type KeenSliderPlugin,
} from "../KeenSlider";

type CreateContextOptions = {
  root: HTMLElement & ICustomElement;
  config?: KeenSliderOptions;
  centerSlides?: boolean;
  refreshOnChildrenChange?: boolean;
};

type WalkableNode = Parameters<typeof provide>[2];

type KeenSliderContext = ReturnType<typeof initializeKeenSliderContext>;

function initializeKeenSliderContext(props: CreateContextOptions) {
  const [privateProps, publicProps] = splitProps(props, [
    "root",
    "centerSlides",
    "refreshOnChildrenChange",
  ]);

  const [plugins, setPlugins] = createSignal<KeenSliderPlugin[]>([]);
  const [forceSliderRebuild, setForceSliderRebuild] = createSignal(false);

  const mutObserver = createMemo(() => {
    if (props.refreshOnChildrenChange)
      return new MutationObserver(function (mutations) {
        mutations.forEach(function (_) {
          setForceSliderRebuild((v) => !v);
        });
      });
    return null;
  });

  const slider = createMemo(() => {
    privateProps.root.setAttribute("data-initialized", "true");
    const slider = new KeenSlider(
      privateProps.root,
      publicProps.config || ({} as any),
      plugins()
    );
    const m = mutObserver();

    if (m) {
      m.observe(slider.container, { childList: true });
      forceSliderRebuild();
    }

    onCleanup(() => {
      slider.destroy();
      if (m) m.disconnect();
    });

    return slider;
  });

  function addPlugin(plugin: KeenSliderPlugin) {
    let index = -1;

    setPlugins((plugins) => {
      index = plugins.length;
      return [...plugins, plugin];
    });

    return function () {
      setPlugins((plugins) => {
        return [...plugins.slice(0, index), ...plugins.slice(index + 1)];
      });
    };
  }

  const centeredPlugin: KeenSliderPlugin = (slider) => {
    function centerSlides(slider: KeenSliderInstance) {
      if (slider.track.details.maxIdx > 0) {
        //@ts-ignore
        slider.container.style.justifyContent = null;
        //@ts-ignore
        slider.container.style.transform = null;
      } else {
        slider.container.style.cssText = `
          justify-content: center;
          transform: translateX(-${(slider.options.slides as any)?.spacing || 16}px)
        `;
      }
    }

    slider.on("created", centerSlides);
    slider.on("optionsChanged", centerSlides);
  };

  createEffect(
    on(
      () => props.centerSlides,
      (centerSlides) => {
        if (!centerSlides) return;
        const remove = addPlugin(centeredPlugin);
        return onCleanup(remove);
      }
    )
  );

  createEffect(
    on(plugins, (plugins) => {
      if (plugins.length === 0) return;
      console.log(
        `Registered a new plugin on element.\n`,
        `Total slider plugins: ${plugins.length}`
      );
    })
  );

  return [slider, { addPlugin }] as const;
}

const KeenSliderContextState = createContext(initializeKeenSliderContext);

export const provideKeenSliderContext = (
  initialState: Omit<CreateContextOptions, "root">,
  element: WalkableNode
): KeenSliderContext => {
  const props = mergeProps(initialState, { root: element });
  return provide(KeenSliderContextState, props, element);
};

export const useKeenSliderContext = (context: KeenSliderContext) => {
  return context;
};

export const useKeenSlider = (element: HTMLElement & ICustomElement) => {
  const context: KeenSliderContext = consume(KeenSliderContextState, element);

  if (!context) {
    throw console.error(
      "KeenSliderContext not found! Please ensure to wrap your custom element with keen-slider element."
    );
  }

  return useKeenSliderContext(context);
};

export const getKeenSliderContext = (element: Element) => {
  const context = getContextFromProvider<KeenSliderContext>(
    KeenSliderContextState,
    element
  );
  return useKeenSliderContext(context);
};
