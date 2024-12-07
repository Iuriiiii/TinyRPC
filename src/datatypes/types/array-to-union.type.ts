import type { Constructor } from "../../types/mod.ts";

export type ArrayToUnion<T extends Constructor[]> = T[number];
