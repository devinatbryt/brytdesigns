import type { Path, PathValue } from "./internal";
import { createMemo, type Accessor } from "solid-js";
import {
  createContext,
  consume as _consume,
  provide as _provide,
  type ICustomElement,
} from "component-register";

import { getValueFromPath } from "./internal/index.js";
import { formatValue, type Format } from "../utils/index.js";

type WalkableNode = Parameters<typeof _provide>[2];

export type { Path, PathValue };

export const makeFullPropertyPathContext = <RootData = any>() => {
  type FullPropertyPathContextType = ReturnType<
    typeof createFullPathPropertyContext
  >;

  type Options = {
    path: Accessor<Path<RootData>>;
    element: HTMLElement & ICustomElement;
  };
  function createFullPathPropertyContext(
    options: Options
  ): Accessor<Path<RootData>> {
    return options.path;
  }

  const Context = createContext(createFullPathPropertyContext);

  function provide({
    element,
    path,
  }: {
    element: WalkableNode;
    path: Accessor<Path<RootData>>;
  }): FullPropertyPathContextType {
    return _provide(Context, { path }, element);
  }

  function useFullPropertyPathContext(context: FullPropertyPathContextType) {
    return context;
  }

  function usePath(props: {
    element: HTMLElement & ICustomElement;
    path?: Accessor<Path<RootData>>;
  }): Accessor<Path<RootData>> {
    const context = _consume(Context, props.element);
    const basePath = useFullPropertyPathContext(context);
    return createMemo(() => {
      if (typeof basePath !== "function" && typeof props.path === "function") {
        return props.path();
      } else if (
        typeof basePath === "function" &&
        typeof props.path !== "function"
      ) {
        return basePath();
      } else if (
        typeof basePath === "function" &&
        typeof props.path === "function"
      ) {
        return `${basePath()}.${props.path()}`;
      }
      return "";
    }) as Accessor<Path<RootData>>;
  }

  type PathValueOptions<P extends Path<RootData>> = {
    path: Accessor<P>;
    data: Accessor<PathValue<RootData, P>>;
  };

  function usePathValue<P extends Path<RootData>>(
    options: PathValueOptions<P>
  ): Accessor<PathValue<RootData, P>> {
    return createMemo(() => {
      const data = options.data();
      if (typeof options.path !== "function") return data;
      const path = options.path();
      if (!path) return data;
      const v = getValueFromPath(data, path as any);
      if (v === undefined || v === null) return null;
      return v;
    }) as Accessor<PathValue<RootData, P>>;
  }

  type FormmatedValueOptions<P extends Path<RootData>> = {
    path: Accessor<P>;
    format?: Format;
    element: HTMLElement & ICustomElement;
    data: Accessor<PathValue<RootData, P>>;
  };

  function useFormattedValue<P extends Path<RootData>>(
    options: FormmatedValueOptions<P>
  ): Accessor<PathValue<RootData, P>> {
    const value = usePathValue({ path: options.path, data: options.data });

    const formattedValue = createMemo(() => {
      const v = value();
      if (v === null) return null;
      if (
        typeof v === "string" ||
        typeof v === "number" ||
        typeof v === "boolean"
      ) {
        return formatValue(options.format || "", v);
      }
      console.warn(
        options.element,
        `useFormattedValue: Unsupported value type. Expected string, number, or boolean. Received: ${typeof v}.`,
        v
      );
      return null;
    });

    return formattedValue as Accessor<PathValue<RootData, P>>;
  }

  return {
    provide,
    usePath,
    usePathValue,
    useFormattedValue,
  };
};
