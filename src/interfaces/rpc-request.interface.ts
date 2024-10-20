import type { RpcRequestBody } from "./rpc-request-body.interface.ts";

export interface RpcRequest extends Request {
  rpc: {
    // deno-lint-ignore ban-types
    procedure: Function;
    arguments: unknown[];
    body: RpcRequestBody;
  };
}
