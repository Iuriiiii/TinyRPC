import type { Constructor } from "../../types/mod.ts";
import type { MemberMetadata } from "./member-metadata.interface.ts";
import type { MethodMetadata } from "./method-metadata.interface.ts";

export interface ModuleMetadata {
  name: string;
  constructor: Constructor;
  methods: MethodMetadata[];
  members: MemberMetadata[];
  moduleName?: string;
  instance?: unknown;
}
