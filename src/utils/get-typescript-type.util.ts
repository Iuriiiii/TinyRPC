import type { Constructor } from "../types/mod.ts";
import { getClassByName } from "./get-class-by-name.util.ts";
import { getClassName } from "./get-class-name.util.ts";

const TypesToTSTypes = {
  // @ts-ignore: Allow custom key
  [String]: "string",
  // @ts-ignore: Allow custom key
  [Number]: "number",
  // @ts-ignore: Allow custom key
  [Boolean]: "boolean",
  // @ts-ignore: Allow custom key
  [Date]: "Date",
  // @ts-ignore: Allow custom key
  [Array]: "Array<any>",
  // @ts-ignore: Allow custom key
  [Object]: "any",
  // @ts-ignore: Allow custom key
  [undefined]: "undefined",
  // @ts-ignore: Allow custom key
  [null]: "null",
  // @ts-ignore: Allow custom key
  [Symbol]: "symbol",
  // @ts-ignore: Allow custom key
  [BigInt]: "bigint",
  // @ts-ignore: Allow custom key
  [Set]: "Set<unknown>",
  // @ts-ignore: Allow custom key
  "string": "string",
  // @ts-ignore: Allow custom key
  "number": "number",
  // @ts-ignore: Allow custom key
  "boolean": "boolean",
  // @ts-ignore: Allow custom key
  "Date": "Date",
  // @ts-ignore: Allow custom key
  "Array": "Array<any>",
  // @ts-ignore: Allow custom key
  "any": "any",
  // @ts-ignore: Allow custom key
  "symbol": "symbol",
  "Symbol": "symbol",
  // @ts-ignore: Allow custom key
  "bigint": "bigint",
  "BigInt": "bigint",
  // @ts-ignore: Allow custom key
  "Set": "Set<unknown>",
};

export function getTypescriptType(value?: Constructor | string | null) {
  // @ts-ignore: Just translate type constructor to ts type
  const tsType: string | undefined = TypesToTSTypes[value];

  if (!tsType) {
    if (typeof value === "string") {
      return value;
    }

    return "void";
  }

  return tsType;
}
