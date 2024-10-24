import type { MethodMetadata } from "../../interfaces/mod.ts";
import type { ModuleMetadata } from "../../interfaces/module-metadata.interface.ts";
import type { ParameterMetadata } from "../../interfaces/parameter-metadata.interface.ts";
import { camelToPascal, getTypescriptType } from "../../utils/mod.ts";
import { buildParam, getParamName } from "./build-param.compile.ts";

function sortMethodParams(a: ParameterMetadata, b: ParameterMetadata) {
  return a.index - b.index;
}

export function buildMethod(
  module: ModuleMetadata,
  method: MethodMetadata,
  buildImports: string[],
  interfaces: string[],
) {
  const moduleName = module.moduleName ?? module.name;
  const { name: methodName } = method;
  const { typescriptType: returnType, requireImport } = getTypescriptType(
    method.returnType,
  );
  const generics = method.generics ? `<${method.generics.join(", ")}>` : "";
  const makeVoid = returnType === "void" ? "void " : "";
  const makeAsync = makeVoid ? "async " : "";
  const paramNames = method.params.map(getParamName).reverse().join(", ");
  const areParams = method.params.length > 0;
  const buildOptionalFirstArgument = !areParams ? " = {}" : "";
  const buildedParams = method.params
    .sort(sortMethodParams)
    .map((p) => buildParam(p, buildImports))
    .join("; ");
  const interfaceName = `${camelToPascal(methodName)}Params`;
  const output = [
    `${makeAsync}${methodName}${generics}({${paramNames}}: ${interfaceName}${buildOptionalFirstArgument}, req?: RequestBody): Promise<${returnType}> { return ${makeVoid}rpc<${returnType}>("${moduleName}", "${methodName}", [${paramNames}], req); }`,
  ].join("\n");

  if (requireImport && !buildImports.includes(returnType)) {
    buildImports.push(returnType);
  }

  interfaces.push(`interface ${interfaceName}{${buildedParams}}`);
  return output;
}
