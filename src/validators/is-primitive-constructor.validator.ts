export function isPrimitiveConstructor(dataType: unknown) {
  // @ts-ignore: ignore types.
  return [String, Number, Boolean, Date, Uint8Array, null, Object].includes(dataType);
}
