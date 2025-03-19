export function getTemplateContent(element: HTMLElement, state: string) {
  const tmpl = element.querySelector(
    `template[${state}]`,
  ) as HTMLTemplateElement;
  if (!tmpl) return null;
  return tmpl.content;
}
