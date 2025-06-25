/**
 * Retrieves the exposed name of an enumerator, if available.
 *
 * This function is used to retrieve the exposed name of an enumerator that has been
 * exposed using the `expose()` function. If the enumerator has not been exposed,
 * the function will return `undefined`.
 *
 * @param _enum - The enumerator object.
 * @returns The exposed name of the enumerator if available, otherwise `undefined`.
 */
export function getExposedEnumName(_enum: object): string | undefined {
  return Object.getOwnPropertyDescriptor(_enum, "__TS_ENUM__")?.value;
}
