/**
 * Returns a shallow copy of the provided object with only the properties that are
 * specified in the second argument.
 *
 * @param value - The object to pick properties from
 * @param keys - The list of property names to pick
 *
 * @returns A new object with only the specified properties
 */
export function objectPick(value: object, keys: string[]) {
  return Object.fromEntries(Object.entries(value).filter(([key]) => keys.includes(key)));
}
