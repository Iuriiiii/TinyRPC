import type { MethodMetadata } from "../../interfaces/method-metadata.interface.ts";
import type { ModuleMetadata } from "../../interfaces/mod.ts";
import { buildMethod } from "./build-method.compile.ts";

export function buildModule(module: ModuleMetadata) {
  const imports: string[] = [];
  const interfaces: string[] = [];
  const { name, methods } = module;
  const { moduleName = name } = module;
  const methodsMapper = () => (method: MethodMetadata) =>
    buildMethod(module, method, imports, interfaces);
  const buildedMethods = methods.map(methodsMapper()).join("\n\n");
  const buildedInterfaces = interfaces.join("\n");
  const compiledImports = imports
    .join(", ");
  const compiledImportPath =
    `import { ${compiledImports} } from "../structures/mod.ts"`;

  const output = `
// deno-lint-ignore-file no-empty-interface require-await
import { rpc } from "../utils/mod.ts";
import { RequestBody } from "../types/mod.ts";
${compiledImportPath}
${buildedInterfaces}

export class ${moduleName} {
    ${buildedMethods}
}
`.trim();

  return output;
}
