import { Value } from "../classes/mod.ts";

export function Enum(value: Record<string, unknown>) {
  return new Value("enum", value);
}
