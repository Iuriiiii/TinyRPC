import type { PickMembers } from "../types/mod.ts";

export interface MethodExtraOptions<T> {
  readonly request: Request;
  readonly client: PickMembers<T>;
}
