export function isExposedEnum(_enum: object): boolean {
  return Object.getOwnPropertyDescriptor(_enum, "__TS_ENUM__")?.value === "EXPOSED";
}
