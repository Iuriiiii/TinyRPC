import type { IHandlerOptions } from "@online/serve";
import type { PickMembers } from "../types/mod.ts";

export interface MethodExtraOptions<T> extends Pick<IHandlerOptions, "upgradeToWebSocket"> {
  readonly request: Request;
  readonly client: PickMembers<T>;
}
