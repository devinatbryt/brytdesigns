export type FormSyncUpdateEvent = CustomEvent<{
  relatedTarget: HTMLFormElement;
  changedTarget: HTMLInputElement;
}>;

export type FormSyncResetEvent = CustomEvent<{
  relatedForm: HTMLFormElement;
  resetForm: HTMLFormElement;
}>;

export function handleRadioOrCheckboxChange(
  form: HTMLFormElement,
  input: HTMLInputElement
) {
  const element = Array.from(form.elements).find((elem) => {
    return (
      //@ts-ignore
      elem.name === input.name && elem.value === input.value && !elem.checked
    );
  }) as HTMLInputElement;
  if (!element) return;
  element.checked = true;
  element.dispatchEvent(new Event("change", { bubbles: true }));
  element.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
}

export function handleDefaultChange(
  form: HTMLFormElement,
  input: HTMLInputElement
) {
  const element = Array.from(form.elements).find(
    //@ts-ignore
    (elem) => elem.name === input.name && elem.value !== input.value
  ) as HTMLInputElement;
  if (!element) return;
  element.value = input.value;

  element.dispatchEvent(new Event("change", { bubbles: true }));
  element.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
}

export function receiveUpdate(form: HTMLFormElement) {
  return function (event: FormSyncUpdateEvent) {
    if (event.detail.relatedTarget === form) return;
    const input = event.detail.changedTarget;

    if (input.type === "checkbox")
      return handleRadioOrCheckboxChange(form, input);
    if (input.type === "radio") return handleRadioOrCheckboxChange(form, input);

    return handleDefaultChange(form, input);
  };
}

export function receiveReset(form: HTMLFormElement) {
  return function (event: FormSyncResetEvent) {
    if (event.detail.relatedForm === form) return;
    const isReset =
      Array.from(form.elements).filter(
        // @ts-ignore
        (elem) => elem.checked && !elem.hasAttribute("checked")
      ).length === 0;

    if (isReset) return;

    if (typeof form.reset === "function") form.reset();
    // If reset button is present, trigger its click event
    // @ts-ignore
    else form.reset.click();
  };
}
