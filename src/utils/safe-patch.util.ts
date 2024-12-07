import { isUndefined } from "@online/is";

export function safePatch(target: object, source: object, ...keys: string[]) {
  const nonUndefinedSourceKeys = Object.getOwnPropertyNames(source)
    // @ts-ignore: Key access.
    .filter((key) => !isUndefined(source[key]))
    .filter((key) => keys.length === 0 || keys.includes(key));

  for (const key of nonUndefinedSourceKeys) {
    // @ts-ignore: Key access.
    if (!isUndefined(target[key])) {
      continue;
    }

    // @ts-ignore: Key access.
    target[key] = source[key];
  }

  return target;
}
