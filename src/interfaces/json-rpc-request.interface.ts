import type { Constructor } from "../types/mod.ts";
import type { RpcRequestBody } from "./rpc-request-body.interface.ts";

export interface JsonRpcRequest<T extends object = object> extends Request {
  rpc: {
    // deno-lint-ignore ban-types
    procedure: Function;
    clazz: Constructor;
    arguments: unknown[];
    client: T;
    body: RpcRequestBody<T>;
  };
}
