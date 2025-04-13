// deno-lint-ignore-file
/**
 * Returns an array of values from the provided object for the specified keys.
 *
 * @param value - The object to pick values from
 * @param keys - The list of property names to pick
 *
 * @returns An array of values in the same order as the keys
 */
export function objectPickToArray(value: object, keys: string[]) {
  const result: any[] = [];

  for (const key of keys) {
    // @ts-ignore: Key access.
    result.push(value[key]);
  }

  return result;
}
