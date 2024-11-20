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
  const { name: methodName, links = [] } = method;
  const { typescriptType: returnType, requireImport } = getTypescriptType(
    method.returnType,
  );
  const generics = method.generics ? `<${method.generics.join(", ")}>` : "";
  const makeVoid = returnType === "void" ? "void " : "";
  const paramNames = method.params.map(getParamName).reverse().join(", ");
  const areParams = method.params.length > 0;
  const buildOptionalFirstArgument = !areParams ? " = {}" : "";
  const buildedParams = method.params
    .sort(sortMethodParams)
    .map((p) => buildParam(p, buildImports))
    .join("; ");
  const interfaceName = `${camelToPascal(methodName)}Params`;
  const _return = makeVoid ? `return { ...response, result: void 0 };` : `return response;`;
  const output = `async ${methodName}${generics}({${paramNames}}: ${interfaceName}${buildOptionalFirstArgument}, request: RequestBody = {}): Promise<MethodResponse<${returnType}>> {
    const argument = {
      connection: {
        module: "${moduleName}",
        method: "${methodName}",
      },
      args: { ${paramNames} },
      updates: {
        parent: this,
        keys: ${JSON.stringify(links)} as unknown as MapStructure<object>,
      },
      request
    };

    const response = await rpc<${returnType}, HttpError>(argument);

    ${_return}
}`;

  if (requireImport && !buildImports.includes(returnType)) {
    buildImports.push(returnType);
  }

  interfaces.push(`interface ${interfaceName}{${buildedParams}}`);
  return output;
}
