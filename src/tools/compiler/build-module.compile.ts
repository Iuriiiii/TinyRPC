import type { MethodMetadata } from "../../interfaces/method-metadata.interface.ts";
import type { ModuleMetadata } from "../../interfaces/mod.ts";
import { buildMethod } from "./build-method.compile.ts";

export function buildModule(module: ModuleMetadata) {
  const imports: string[] = [];
  const { name, methods } = module;
  const { moduleName = name } = module;
  const methodsMapper = () => (method: MethodMetadata) =>
    buildMethod(module, method, imports);
  const buildedMethods = methods.map(methodsMapper()).join("\n\n");
  const compiledImports = imports
    .join(", ");
  const compiledImportPath =
    `import { ${compiledImports} } from "../structures/mod.ts"`;

  const output = `
import { rpc } from "../utils/mod.ts";
${compiledImportPath}

export class ${moduleName} {
    ${buildedMethods}
}
`.trim();

  return output;
}
