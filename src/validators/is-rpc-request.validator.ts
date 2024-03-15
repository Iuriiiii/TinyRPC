import { RpcRequestBody } from "../mod.ts";

export function isRpcRequest(content: unknown): content is RpcRequestBody {
  return (
    content instanceof Object &&
    "m" in content &&
    "fn" in content &&
    "args" in content
  );
}
