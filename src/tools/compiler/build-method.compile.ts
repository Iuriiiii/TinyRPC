import type { MethodMetadata } from "../../interfaces/mod.ts";
import type { ModuleMetadata } from "../../interfaces/module-metadata.interface.ts";
import type { ParameterMetadata } from "../../interfaces/parameter-metadata.interface.ts";
import { getTypescriptType } from "../../utils/mod.ts";
import { buildParam, getParamName } from "./build-param.compile.ts";

function sortMethodParams(a: ParameterMetadata, b: ParameterMetadata) {
  return a.index - b.index;
}

export function buildMethod(module: ModuleMetadata, method: MethodMetadata) {
  const moduleName = module.moduleName ?? module.name;
  const { name: methodName } = method;
  const returnType = getTypescriptType(method.returnType);
  const generics = method.generics ? `<${method.generics.join(", ")}>` : "";
  const buildedParams = method.params
    .sort(sortMethodParams)
    .map(buildParam)
    .join(", ");
  const args = method.params.map(getParamName).join(", ");
  const output = `
  ${methodName}${generics}(${buildedParams}): Promise<${returnType}> { return rpc<${returnType}>("${moduleName}", "${methodName}", [${args}]); }
  `.trim();

  return output;
}
