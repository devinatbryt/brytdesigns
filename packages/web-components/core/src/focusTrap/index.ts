import {
  createFocusTrap as _createFocusTrap,
  type Options,
  type FocusTrap,
} from "focus-trap";
import { createMemo, type Accessor } from "solid-js";

const trapStack: Array<FocusTrap> = [];

export const createFocusTrap = (
  element: HTMLElement,
  options?: Accessor<Options>,
) =>
  createMemo(() => {
    const o = options?.() || {
      trapStack,
    };
    if (!o.trapStack) {
      o.trapStack = trapStack;
    }
    return _createFocusTrap(element, o);
  });
