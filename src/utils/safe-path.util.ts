import { isUndefined } from "@online/is";

export function safePath(target: object, ...sources: object[]) {
  for (const source of sources) {
    const nonUndefinedSourceKeys = Object.getOwnPropertyNames(source)
      // @ts-ignore: Key access.
      .filter((key) => !isUndefined(source[key]));

    for (const key of nonUndefinedSourceKeys) {
      // @ts-ignore: Key access.
      if (isUndefined(target[key])) {
        // @ts-ignore: Key access.
        target[key] = source[key];
      }
    }
  }

  return target;
}
