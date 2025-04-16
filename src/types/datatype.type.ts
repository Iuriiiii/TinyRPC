import type { Constructor } from "./constructor.type.ts";

export type Datatype = Constructor | [Datatype] | (() => Datatype) | Record<string, unknown> | null;
