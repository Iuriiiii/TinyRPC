import type { Constructor } from "./constructor.type.ts";

export type DataType = Constructor | string | [unknown] | (() => unknown);
