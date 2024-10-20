import type { ParameterMetadata } from "../../interfaces/mod.ts";
import { getTypescriptType } from "../../utils/mod.ts";

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
};

export function getParamName(param: ParameterMetadata) {
  const { index } = param;
  const { name = `param${index}` } = param;

  return name;
}

export function buildParam(param: ParameterMetadata) {
  const paramName = getParamName(param);
  const { dataType } = param;
  const buildType: string = getTypescriptType(dataType);
  const sign = param.optional ? "?" : "";

  // if (!buildType) {
  //   if (!(type instanceof Serializable)) {
  //     throw new Error(`Unknown type: ${type}`);
  //   }

  //   // TODO: Do something with serializable parameter
  // }

  const output = `${paramName}${sign}: ${buildType}`.trim();

  return output;
}
