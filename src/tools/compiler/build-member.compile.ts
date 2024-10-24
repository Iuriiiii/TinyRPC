import type { MemberMetadata } from "../../interfaces/mod.ts";
import { getTypescriptType } from "../../utils/mod.ts";

export function buildMember(member: MemberMetadata, buildImports: string[]) {
  const {
    dataType,
    name: memberName,
    optional,
    defaultValue,
    private: isPrivate,
    nullable,
    readonly,
  } = member;
  const { typescriptType: buildType, requireImport } = getTypescriptType(
    dataType,
  );
  const makeOptional = optional ? "?" : "";
  const makeDefaultValue = defaultValue !== undefined
    ? ` = ${defaultValue}`
    : "";
  const makePrivate = isPrivate ? "private #" : "public ";
  const makeNullable = nullable ? " | null" : "";
  const makeLateInit = defaultValue === undefined && !optional ? "!" : "";
  const makeReadonly = readonly ? "readonly " : "";

  if (requireImport && !buildImports.includes(buildType)) {
    buildImports.push(buildType);
  }

  return `${makePrivate}${makeReadonly}${memberName}${makeOptional}${makeLateInit}: ${buildType}${makeDefaultValue}${makeNullable}`;
}
