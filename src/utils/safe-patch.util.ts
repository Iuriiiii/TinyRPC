import { isUndefined } from "@online/is";

/**
 * Patches target object with source object, only if a key is not already set
 * in target. If keys is provided, only those keys are patched.
 *
 * @param target - Object to patch
 * @param source - Object to patch from
 * @param keys - Optional keys to patch. If not provided, all source keys are patched.
 * @returns The patched target object
 */
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
