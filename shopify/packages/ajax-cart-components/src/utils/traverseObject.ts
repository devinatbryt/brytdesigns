type TraverseCallback = (key: string, value: any, path: string[]) => void;

export function traverseObject(
  obj: any,
  callback?: TraverseCallback,
  path: string[] = [],
) {
  if (typeof obj !== "object" || obj === null) return;

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      traverseObject(item, callback, [...path, index.toString()]);
    });
  } else {
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      const currentPath = [...path, key];
      if (callback) callback(key, value, currentPath);
      traverseObject(value, callback, currentPath);
    }
  }
}
