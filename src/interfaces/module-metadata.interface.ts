import type { Constructor } from "../types/mod.ts";
import type { MemberMetadata } from "./member-metadata.interface.ts";
import type { MethodMetadata } from "./method-metadata.interface.ts";

export interface ModuleMetadata {
  constructor: Constructor;
  name: string;
  methods: MethodMetadata[];
  members: MemberMetadata[];
  moduleName?: string;
}
