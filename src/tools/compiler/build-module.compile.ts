import type { MethodMetadata } from "../../interfaces/method-metadata.interface.ts";
import type { ModuleMetadata } from "../../interfaces/mod.ts";
import { buildMember } from "./build-member.compile.ts";
import { buildMethod } from "./build-method.compile.ts";

export function buildModule(module: ModuleMetadata) {
  const imports: string[] = [];
  const interfaces: string[] = [];
  const { name, methods, members } = module;
  const { moduleName = name } = module;
  const methodsMapper = () => (method: MethodMetadata) =>
    buildMethod(module, method, imports, interfaces);

  const buildedMembers = members
    .map((m) => buildMember(m, imports))
    .join("\n");
  const buildedMethods = methods.map(methodsMapper()).join("\n\n");
  const buildedInterfaces = interfaces.join("\n");
  const compiledImports = imports
    .join(", ");
  const compiledImportPath =
    `import { ${compiledImports} } from "../structures/mod.ts"`;

  const output = `
// deno-lint-ignore-file no-empty-interface require-await
import { rpc, RequestBody } from "jsr:@online/tinyrpc-sdk-core";
${compiledImportPath}
${buildedInterfaces}

export class ${moduleName} {
    ${buildedMembers}

    ${buildedMethods}
}
`.trim();

  return output;
}
