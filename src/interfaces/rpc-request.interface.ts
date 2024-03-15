import { RpcRequestBody } from "./rpc-request-body.interface.ts";

export interface RpcRequest extends Request {
  rpc: {
    procedure: Function;
    arguments: unknown[];
    body: RpcRequestBody;
  };
}
