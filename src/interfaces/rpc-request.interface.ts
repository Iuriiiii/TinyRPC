import type { Constructor } from "../types/mod.ts";
import type { RpcRequestBody } from "./rpc-request-body.interface.ts";

export interface RpcRequest extends Request {
  rpc: {
    // deno-lint-ignore ban-types
    procedure: Function;
    clazz: Constructor;
    arguments: unknown[];
    body: RpcRequestBody;
  };
}
