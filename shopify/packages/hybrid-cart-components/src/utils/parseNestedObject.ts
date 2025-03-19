export function parseNestedObject<T extends Record<string, any>>(
  data: T,
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in data) {
    const value = data[key];
    const parts = key.match(/(\w+|\[\d+\])/g);

    if (!parts) continue;

    let current: any = result;
    for (let i = 0; i < parts.length; i++) {
      let part: string | number | undefined = parts[i];
      let nextPart: string | number | undefined = parts[i + 1];

      if (!part) continue;

      // Convert array-like keys to numbers
      if (part.startsWith("[")) {
        part = parseInt(part.slice(1, -1), 10);
      }

      if (i === parts.length - 1) {
        current[part] = value;
      } else {
        if (
          typeof parts[i + 1] === "number" ||
          (nextPart && nextPart.startsWith("["))
        ) {
          current[part] = current[part] || [];
        } else {
          current[part] = current[part] || {};
        }
        current = current[part];
      }
    }
  }

  return result;
}
