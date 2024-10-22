import type { MethodMetadata } from "../../interfaces/mod.ts";
import type { ModuleMetadata } from "../../interfaces/module-metadata.interface.ts";
import type { ParameterMetadata } from "../../interfaces/parameter-metadata.interface.ts";
import { getTypescriptType } from "../../utils/mod.ts";
import { buildParam, getParamName } from "./build-param.compile.ts";

function sortMethodParams(a: ParameterMetadata, b: ParameterMetadata) {
  return a.index - b.index;
}

export function buildMethod(
  module: ModuleMetadata,
  method: MethodMetadata,
  buildImports: string[],
) {
  const moduleName = module.moduleName ?? module.name;
  const { name: methodName } = method;
  const { typescriptType: returnType, requireImport } = getTypescriptType(
    method.returnType,
  );
  const generics = method.generics ? `<${method.generics.join(", ")}>` : "";
  const makeVoid = returnType === "void" ? "void " : "";
  const makeAsync = makeVoid ? "async  " : "";
  const disbleRequrieAwaitLint = makeAsync
    ? "// deno-lint-ignore require-await"
    : "";
  const buildedParams = method.params
    .sort(sortMethodParams)
    .map((p) => buildParam(p, buildImports))
    .join(", ");
  const args = method.params.map(getParamName).join(", ");
  const output = `
${disbleRequrieAwaitLint}
${makeAsync}${methodName}${generics}(${buildedParams}): Promise<${returnType}> { return ${makeVoid}rpc<${returnType}>("${moduleName}", "${methodName}", [${args}]); }
  `.trim();

  if (requireImport) {
    buildImports.push(returnType);
  }

  return output;
}
