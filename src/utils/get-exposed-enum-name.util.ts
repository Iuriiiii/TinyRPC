export function getExposedEnumName(_enum: object): string | undefined {
  return Object.getOwnPropertyDescriptor(_enum, "__TS_ENUM__")?.value;
}
