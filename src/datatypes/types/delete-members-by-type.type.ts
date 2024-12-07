import type { KeysByType } from "./keys-by-type.type.ts";

export type DeleteMembersByType<T, K> = Exclude<T, KeysByType<T, K>>;
