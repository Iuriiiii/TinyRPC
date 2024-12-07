import type { Constructor } from "../../types/mod.ts";
import type { ArrayToUnion } from "./array-to-union.type.ts";
import type { UnionToIntersection } from "./union-to-intersection.type.ts";

export type ArrayToIntersection<T extends Constructor[]> = UnionToIntersection<ArrayToUnion<T>>;
