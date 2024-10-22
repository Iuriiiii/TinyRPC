import type { StructureMetadata } from "../../interfaces/mod.ts";
import { buildMember } from "./build-member.compile.ts";
import { toFilename } from "../../utils/mod.ts";

export function buildStructure(structure: StructureMetadata) {
  const imports: string[] = [];
  const { name, members } = structure;
  const compiledMembers = members
    .map((m) => buildMember(m, imports))
    .join("\n");
  const compiledImports = imports
    .map((i) => {
      const compiledImportPath = `./${toFilename(i, "structure")}`;
      return `import { ${i} } "${compiledImportPath}";`;
    })
    .join("\n");

  const output = `
    ${compiledImports}
export class ${name} {\n${compiledMembers}\n}
`.trim();

  return output;
}
