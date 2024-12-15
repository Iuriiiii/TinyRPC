import type { Constructor } from "./constructor.type.ts";

export type DataType = Constructor | string | [DataType] | (() => DataType) | Record<string, unknown>;
