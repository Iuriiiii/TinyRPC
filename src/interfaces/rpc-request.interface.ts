import type { Constructor } from "../types/mod.ts";

export interface RpcRequest<T extends object = object> extends Request {
  rpc: {
    // deno-lint-ignore ban-types
    procedure: Function;
    clazz: Constructor;
    /**
     * The arguments received from the client.
     * In object format.
     */
    arguments: Record<string, unknown>;
    /**
     * Array of arguments, ready for .call or .apply.
     */
    pushableArguments: unknown[];
    client: T;
  };
}
