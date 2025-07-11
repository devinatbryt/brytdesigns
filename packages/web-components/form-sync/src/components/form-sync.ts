import type { CorrectComponentType } from "@brytdesigns/web-component-core/utils";

import { createEffect, createMemo, on, onCleanup } from "solid-js";

import { receiveUpdate, receiveReset } from "../utils.js";

type FormSyncProps = {
  name: string;
  formId: string;
};

export const Name = `form-sync`;

export const Component: CorrectComponentType<FormSyncProps> = (
  props,
  { element },
) => {
  if (!props.name && !props.formId) return;
  const form = createMemo(() =>
    element.querySelector<HTMLFormElement>(`#${props.formId}`),
  );
  const UPDATE = createMemo(() => `form.update.${props.name}`);
  const RESET = createMemo(() => `form.reset.${props.name}`);

  const handleUpdate = (form: HTMLFormElement) => (event: Event) => {
    dispatchEvent(
      new CustomEvent(UPDATE(), {
        detail: {
          relatedTarget: form,
          changedTarget: event.target,
        },
      }),
    );
  };

  const handleReset = (form: HTMLFormElement) => (event: Event) => {
    setTimeout(() => {
      dispatchEvent(
        new CustomEvent(RESET(), {
          detail: {
            relatedForm: form,
            resetForm: event.target,
          },
        }),
      );
    });
  };

  createEffect(
    on(form, (form) => {
      if (!form || !props.name) return;
      const controller = new AbortController();
      const handleFormUpdate = handleUpdate(form);
      const handleReceiveUpdate = receiveUpdate(form);

      const handleFormReset = handleReset(form);
      const handleReceiveReset = receiveReset(form);

      element.addEventListener("input", handleFormUpdate, {
        signal: controller.signal,
      });
      element.addEventListener("change", handleFormUpdate, {
        signal: controller.signal,
      });
      element.addEventListener("reset", handleFormReset, {
        signal: controller.signal,
      });

      //@ts-ignore
      addEventListener(UPDATE(), handleReceiveUpdate, {
        signal: controller.signal,
      });
      //@ts-ignore
      addEventListener(RESET(), handleReceiveReset, {
        signal: controller.signal,
      });

      onCleanup(() => {
        controller.abort("Resetting event listeners");
      });
    }),
  );
};
