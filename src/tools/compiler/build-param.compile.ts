import type { ParameterMetadata } from "../../interfaces/mod.ts";
import { getTypescriptType } from "../../utils/mod.ts";

export function getParamName(param: ParameterMetadata) {
  const { index } = param;
  const { name = `param${index}` } = param;

  return name;
}

export function buildParam(
  param: ParameterMetadata,
  buildImports: string[],
) {
  const paramName = getParamName(param);
  const { dataType } = param;
  const { typescriptType: buildType, requireImport } = getTypescriptType(
    dataType,
  );
  const sign = param.optional ? "?" : "";

  if (requireImport && !buildImports.includes(buildType)) {
    buildImports.push(buildType);
  }

  // if (!buildType) {
  //   if (!(type instanceof Serializable)) {
  //     throw new Error(`Unknown type: ${type}`);
  //   }

  //   // TODO: Do something with serializable parameter
  // }

  const output = `${paramName}${sign}: ${buildType}`.trim();

  return output;
}
