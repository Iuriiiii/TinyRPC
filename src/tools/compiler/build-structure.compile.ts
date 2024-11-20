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
      return `import { ${i} } from "${compiledImportPath}";`;
    })
    .join("\n");
  const memberNames = members.map((m) => m.name);
  const membersObject = memberNames.map((memberName) => `${memberName}: this.${memberName}`).join(",\n");

  const output = `
import { Serializable, SerializableClass, SerializedClass } from "@online/tinyrpc-sdk-core";
${compiledImports}

@Serializable()
export class ${name} extends SerializableClass {
${compiledMembers}

  public override serialize(): SerializedClass<typeof ${name}> {
    return {
      arguments: [],
      members: {${membersObject}}
    }
  }
}
`.trim();

  return output;
}
