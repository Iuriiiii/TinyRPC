import type { Constructor } from "../../types/mod.ts";
import type { MemberMetadata } from "./member-metadata.interface.ts";

export interface StructureMetadata {
  name: string;
  constructor: Constructor;
  members: MemberMetadata[];
  isInterface: boolean;
  metadata: Record<string, unknown>;
}
